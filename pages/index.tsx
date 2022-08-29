import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import uniqueBy from "lodash.uniqby";
import memoize from "promise-memoize";
// import styles from '../styles/Home.module.css'
import { ReactJkMusicPlayerAudioListProps } from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import { Alchemy, Network, OwnedNftsResponse } from "alchemy-sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  init as initializeOnboard,
  useConnectWallet,
} from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";

const ReactJkMusicPlayer = dynamic(() => import("react-jinke-music-player"), {
  ssr: false,
});

const KNOWN_OWNERS = ["freqncy.eth", "marymaguire.eth", "cleareyes.eth"];

const alchemy = new Alchemy({
  network: Network.ETH_MAINNET,
});

const walletInitializer = injectedModule();

initializeOnboard({
  wallets: [walletInitializer],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: `https://mainnet.infura.io/v3/`,
    },
  ],
});

const getContractMetadata = memoize((contractAddress: string) => {
  return alchemy.nft.getContractMetadata(contractAddress);
});

const getAudioLists = async function* (owner: string) {
  let pageKey;
  do {
    const result: OwnedNftsResponse = await alchemy.nft.getNftsForOwner(owner, {
      pageKey,
    });
    const audioList: ReactJkMusicPlayerAudioListProps[] = [];
    for (const nft of result.ownedNfts) {
      if (!nft.rawMetadata?.audio_url) continue;
      const contract = await getContractMetadata(nft.contract.address);
      const result: ReactJkMusicPlayerAudioListProps = {
        name: nft.rawMetadata?.name,
        musicSrc: nft.rawMetadata?.audio_url,
        cover: nft.rawMetadata?.image,
        singer: contract.name,
      };
      audioList.push(result);
    }
    yield audioList;
    pageKey = result.pageKey;
  } while (pageKey);
};

export async function getStaticProps() {
  return {
    props: {},
  };
}

const Home: NextPage = () => {
  const [audioLists, setAudioLists] = useState<
    ReactJkMusicPlayerAudioListProps[]
  >([]);
  const [owner, setOwner] = useState<string>();
  const ownerRef = useRef<string>();
  const [loading, setLoading] = useState<boolean>();

  const setOwnerRef = useCallback((newOwner: string | undefined) => {
    setOwner(newOwner);
    ownerRef.current = newOwner;
  }, []);

  useEffect(() => {
    if (!owner) return;

    async function loadAudioNfts(owner: string) {
      setLoading(true);
      for await (const newAudioLists of getAudioLists(owner)) {
        if (!ownerRef.current) {
          break;
        }
        setAudioLists((oldAudioLists) =>
          uniqueBy(
            [...oldAudioLists, ...newAudioLists],
            (item) => item.musicSrc
          )
        );
      }
      setLoading(false);
    }

    loadAudioNfts(owner).catch(console.error);
  }, [owner]);

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const onWalletToggleClick = useCallback(() => {
    if (wallet || owner) {
      if (wallet) disconnect(wallet);
      setOwnerRef(undefined);
      setLoading(undefined);
      setAudioLists([]);
    } else {
      connect();
    }
  }, [connect, disconnect, owner, setOwnerRef, wallet]);

  useEffect(() => {
    if (wallet) {
      const newOwner =
        wallet.accounts[0].ens?.name ?? wallet.accounts[0].address;
      setOwnerRef(newOwner);
    }
  }, [setOwnerRef, wallet]);

  return (
    <>
      <Head>
        <title>Audio NFT Player</title>
        <meta name="description" content="Audio NFT Player" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!connecting && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            float: "right",
            zIndex: 9999,
            width: "100%",
          }}
        >
          <button onClick={onWalletToggleClick} style={{ width: "100%" }}>
            {wallet || owner ? "disconnect" : "you"}
          </button>

          {!(wallet || owner) &&
            KNOWN_OWNERS.map((owner) => (
              <button
                key={owner}
                onClick={() => setOwnerRef(owner)}
                style={{ width: "100%" }}
              >
                {owner}
              </button>
            ))}
        </div>
      )}

      {owner && audioLists.length == 0 && (
        <div style={{ paddingTop: 250, width: "100%" }}>
          <h2 style={{ textAlign: "center" }}>
            {loading
              ? "Loading..."
              : loading === false
              ? "No audio NFT found."
              : ""}
          </h2>
        </div>
      )}

      {owner && audioLists.length > 0 && (
        <ReactJkMusicPlayer
          audioLists={audioLists}
          theme="dark"
          mode="full"
          bounds="body"
          autoPlay={false}
          glassBg
          preload
          showPlay
          showPlayMode
          showDownload={false}
          showReload={false}
          showThemeSwitch={false}
          toggleMode={false}
          mobileMediaQuery="(min-width: 0px)"
        />
      )}
    </>
  );
};

export default Home;
