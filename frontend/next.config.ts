import type { NextConfig } from "next";
const withTM = require('next-transpile-modules')(['gsap']);

const nextConfig: NextConfig = {
  // your config options here
};

export default withTM(nextConfig);
