/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*', // Forward requests to Flask backend
        },
      ];
    },
  };
  
  export default nextConfig;
  