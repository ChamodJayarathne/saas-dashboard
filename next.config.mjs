
// import { withSentryConfig } from '@sentry/nextjs';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Your normal Next.js config
//   images: {
//     domains: [
//       'avatars.githubusercontent.com',
//       'lh3.googleusercontent.com'
//       // {
//       //   protocol: 'https',
//       //   hostname: 'avatars.githubusercontent.com',
//       // },
//       // {
//       //   protocol: 'lultdehttps',
//       //   hostname: 'lh3.googleusercontent.com',
//       // },
//     ],
//   },
// };

// const sentryBuildOptions = {
//   // Sentry-specific build options
//   hideSourceMaps: true,
//   autoInstrumentServerFunctions: true,
// };

// const sentryPluginOptions = {
//   // Additional Sentry plugin options
//   widenClientFileUpload: true,
//   transpileClientSDK: true,
//   tunnelRoute: '/monitoring',
//   hideSourceMaps: true,
//   disableLogger: true,
// };

// export default withSentryConfig(
//   nextConfig,
//   sentryBuildOptions,  // <-- Moved Sentry config here
//   sentryPluginOptions
// );
// const { withSentryConfig } = require('@sentry/nextjs');
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

const sentryBuildOptions = {
  hideSourceMaps: true,
  autoInstrumentServerFunctions: true,
};

export default withSentryConfig(
  nextConfig,
  sentryBuildOptions,
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
  }
);

