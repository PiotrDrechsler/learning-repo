/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pliki z treścią ćwiczeń (README.md, rozwiązania) czytamy przez fs w czasie budowania.
  outputFileTracingIncludes: {
    "/exercises/[slug]": ["./exercises/**/*"],
  },
};

export default nextConfig;
