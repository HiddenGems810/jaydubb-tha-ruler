import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/ADMIN",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/ADMIN/:path*",
        destination: "/admin/:path*",
        permanent: true,
      },
      {
        source: "/Admin",
        destination: "/admin",
        permanent: true,
      },
      {
        source: "/Admin/:path*",
        destination: "/admin/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/site.webmanifest",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
