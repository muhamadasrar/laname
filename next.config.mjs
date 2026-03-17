/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cf.shopee.co.id",
            },
            {
                protocol: "https",
                hostname: "down-id.img.susercontent.com",
            },
            {
                protocol: "https",
                hostname: "**.susercontent.com",
            },
            {
                protocol: "https",
                hostname: "**.shopee.co.id",
            },
        ],
        unoptimized: true,
    },
};

export default nextConfig;
