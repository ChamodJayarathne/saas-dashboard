/** @type {import('next').NextConfig} */
const nextConfig = {
    // webpack: (config) => {
    //     config.externals.push({
    //       'utf-8-validate': 'commonjs utf-8-validate',
    //      'bufferutil': 'commonjs bufferutil',
    //     });
    //     return config;
    //   },
    images: {
      domains: [
        'avatars.githubusercontent.com', // For GitHub avatars
        'lh3.googleusercontent.com'     // For Google avatars
      ],
    },
};

export default nextConfig;
