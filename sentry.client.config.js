// // This file configures the initialization of Sentry on the client.
// // The config you add here will be used whenever a users loads a page in their browser.
// // https://docs.sentry.io/platforms/javascript/guides/nextjs/

// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   dsn: "https://3b5f080e94a7a3bded7ab34178ec6b0f@o4508815625682944.ingest.us.sentry.io/4508815635578880",

//   // Add optional integrations for additional features
//   integrations: [
//     Sentry.replayIntegration(),
//   ],

//   // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
//   tracesSampleRate: 1,

//   // Define how likely Replay events are sampled.
//   // This sets the sample rate to be 10%. You may want this to be 100% while
//   // in development and sample at a lower rate in production
//   replaysSessionSampleRate: 0.1,

//   // Define how likely Replay events are sampled when an error occurs.
//   replaysOnErrorSampleRate: 1.0,

//   // Setting this option to true will print useful information to the console while you're setting up Sentry.
//   debug: false,
// });

// sentry.client.config.js
// import * as Sentry from '@sentry/nextjs';

// Sentry.init({
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
//   environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
//   release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
//   integrations: [
//     new Sentry.BrowserTracing(),
//     new Sentry.Replay(),
//   ],
//   tracesSampleRate: 0.2,
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
// });

// import * as Sentry from "@sentry/nextjs";
// import { BrowserTracing } from "@sentry/browser";
// // import { Replay } from "@sentry/replay";

// // Sentry.init({
// //   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
// //   environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
// //   release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
// //   integrations: [
// //     new BrowserTracing(),
// //     new Replay(),
// //   ],
// //   tracesSampleRate: 0.2,
// //   replaysSessionSampleRate: 0.1,
// //   replaysOnErrorSampleRate: 1.0,
// // });
// Sentry.init({
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
//   environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
//   release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
//   integrations: [new BrowserTracing()],
//   tracesSampleRate: 0.2,
//   profilesSampleRate: 0.1,
// });

// import * as Sentry from '@sentry/nextjs';
// import { browserTracingIntegration } from '@sentry/browser';

// Sentry.init({
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
//   environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
//   release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
//   integrations: [browserTracingIntegration()],
//   tracesSampleRate: 0.2,
//   profilesSampleRate: 0.1,
// });

import * as Sentry from "@sentry/nextjs";
import { browserTracingIntegration } from "@sentry/browser";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 0.2,
  profilesSampleRate: 0.1,
});
