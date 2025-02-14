// // This file configures the initialization of Sentry on the server.
// // The config you add here will be used whenever the server handles a request.
// // https://docs.sentry.io/platforms/javascript/guides/nextjs/

// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   dsn: "https://3b5f080e94a7a3bded7ab34178ec6b0f@o4508815625682944.ingest.us.sentry.io/4508815635578880",

//   // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
//   tracesSampleRate: 1,

//   // Setting this option to true will print useful information to the console while you're setting up Sentry.
//   debug: false,
// });




// sentry.server.config.js
// import * as Sentry from '@sentry/nextjs';

// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   environment: process.env.NODE_ENV,
//   release: process.env.SENTRY_RELEASE,
//   integrations: [
//     new Sentry.Integrations.Http({ tracing: true }),
//     new Sentry.Integrations.Mongo(),
//     new Sentry.Integrations.Express(),
//   ],
//   tracesSampleRate: 0.2,
// });


import * as Sentry from '@sentry/nextjs';
import { httpIntegration } from '@sentry/node'; // HTTP integration
import { mongoIntegration } from '@sentry/node'; // MongoDB integration
import { expressIntegration } from '@sentry/node'; // Express integration

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE,
  integrations: [
    httpIntegration({ tracing: true }), // HTTP integration
    mongoIntegration(), // MongoDB integration
    expressIntegration(), // Express integration
  ],
  tracesSampleRate: 0.2,
});