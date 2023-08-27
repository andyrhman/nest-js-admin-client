/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['tailwindui.com', 'via.placeholder.com'], // Add more domains if needed
    },
    publicRuntimeConfig: {
        googleClientId: process.env.GOOGLE_CLIENT_ID,
    },
};

module.exports = nextConfig