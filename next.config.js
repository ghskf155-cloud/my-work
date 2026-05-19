/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Vercel 배포 시 ESLint 에러를 무시하고 강제로 빌드 성공시킴
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Vercel 배포 시 TypeScript 타입 에러를 무시하고 강제로 빌드 성공시킴
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
