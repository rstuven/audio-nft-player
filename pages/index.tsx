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

const KNOWN_OWNERS = [
  "0xF7B18e107eb36797f4cE36dE756630B9C30969ad", // "freqncy.eth",
  "0x41d22Fc30AA15eee064139089aa80F688F245315", // "marymaguire.eth",
  "0x82cE5258Aa5925Bb5c9DA07fA7996e73687a440e", // "cleareyes.eth",
  "0x7e8608f5893A6a57602A014aB190f7af8069D1E1", // Suave
  "0xd5FfcabF2bA93b4C30698b0398dfbf1af3163A61",
  "0xf47f5A7F2917800149f638E9f0eD3745D16481C6",
  "0x7e9F74eCfa5054b8672DB762A2cB977379f33628",
];

const networks = [Network.ETH_MAINNET, Network.MATIC_MAINNET].map(
  (network) =>
    new Alchemy({
      network,
    })
);

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

const getContractMetadata = memoize(
  (network: Alchemy, contractAddress: string) => {
    return network.nft.getContractMetadata(contractAddress);
  }
);

function normalizeUrl(url: any) {
  if (typeof url != "string") return url;
  return url
    .replace(/^ar:\//, "https://arweave.net")
    .replace(/^ipfs:\//, "https://ipfs.io/ipfs");
}

async function* getAudioLists(owner: string) {
  for (const network of networks) {
    let pageKey;
    do {
      const result: OwnedNftsResponse = await network.nft.getNftsForOwner(
        owner,
        {
          pageKey,
        }
      );
      const audioList: ReactJkMusicPlayerAudioListProps[] = [];
      for (const nft of result.ownedNfts) {
        const musicSrc = normalizeUrl(
          nft.rawMetadata?.audio_url ?? nft.rawMetadata?.audio
        );
        if (typeof musicSrc == "string" && musicSrc != "") {
          const singer =
            nft.rawMetadata?.artist ??
            nft.rawMetadata?.artist_name ??
            (await getContractMetadata(network, nft.contract.address)).name;
          const name = (nft.rawMetadata?.name ?? "").replace(
            " by " + singer,
            ""
          );
          const result: ReactJkMusicPlayerAudioListProps = {
            name,
            singer,
            musicSrc,
            cover: normalizeUrl(nft.rawMetadata?.image),
          };
          audioList.push(result);
        }
      }
      yield audioList;
      pageKey = result.pageKey;
    } while (pageKey);
  }
}

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
      setAudioLists([]);
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

  const clear = useCallback(() => {
    setOwnerRef(undefined);
    setLoading(undefined);
    setAudioLists([]);
  }, [setOwnerRef]);

  const onWalletToggleClick = useCallback(() => {
    if (wallet || owner) {
      if (wallet) disconnect(wallet);
      clear();
    } else {
      connect();
    }
  }, [clear, connect, disconnect, owner, wallet]);

  useEffect(() => {
    if (wallet) {
      setOwnerRef(wallet.accounts[0].ens?.name ?? wallet.accounts[0].address);
    } else {
      clear();
    }
  }, [clear, setOwnerRef, wallet]);

  return (
    <>
      <Head>
        <title>Audio NFT Player</title>
        <meta name="description" content="Audio NFT Player" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!owner && (
        <h1 style={{ paddingTop: 250, width: "100%", textAlign: "center" }}>
          Audio NFT Player
        </h1>
      )}

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
            {wallet || owner
              ? "listen to another wallet"
              : "listen to your wallet"}
          </button>

          {!(wallet || owner) && (
            <>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "smaller",
                  paddingTop: 10,
                }}
              >
                listen to selected wallets:
              </div>
              {KNOWN_OWNERS.map((owner) => (
                <button
                  key={owner}
                  onClick={() => setOwnerRef(owner)}
                  style={{ width: "100%" }}
                >
                  {owner}
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {owner && audioLists.length == 0 && (
        <h2 style={{ paddingTop: 250, width: "100%", textAlign: "center" }}>
          {loading
            ? "Loading..."
            : loading === false
            ? "No audio NFT found."
            : ""}
        </h2>
      )}

      {owner && audioLists.length > 0 && (
        <ReactJkMusicPlayer
          audioLists={audioLists}
          mode="full"
          playMode="orderLoop"
          autoPlay={false}
          glassBg
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
