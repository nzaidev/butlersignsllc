import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Never ship readable source to browsers. (This is the default; it's pinned
  // here so it can't be switched on by accident.)
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // CMS image uploads (resized in the browser first, capped at 4 MB on the server).
      bodySizeLimit: "4.5mb",
    },
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zdzxammcjnnhnksdkvln.supabase.co",
        pathname: "/storage/v1/render/image/public/**",
      },
    ],
  },
};

export default nextConfig;
