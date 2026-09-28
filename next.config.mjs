/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Serve AVIF (smallest) then WebP, falling back per the browser's Accept
    // header. Local /uploads/*.webp images are resized on-demand to the size
    // actually displayed (via the `sizes` prop on next/image).
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
