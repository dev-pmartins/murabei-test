/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_BACKEND_API: process.env.NEXT_PUBLIC_BACKEND_API,
    }
};

export default nextConfig;
