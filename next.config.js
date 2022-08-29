const REPO_NAME = "audio-nft-player";
const CUSTOM_DOMAIN = false;

const isProduction = process.env.NODE_ENV === "production";
const useRepoName = isProduction && !CUSTOM_DOMAIN;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  basePath: useRepoName ? `/${REPO_NAME}` : undefined,
  assetPrefix: useRepoName ? `/${REPO_NAME}/` : undefined,
};

module.exports = nextConfig;
