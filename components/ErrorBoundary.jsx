// // components/ErrorBoundary.jsx
// "use client";

// import * as Sentry from "@sentry/nextjs";
// import { useEffect } from "react";

// export default function ErrorBoundary({ error, reset }) {
//   useEffect(() => {
//     Sentry.captureException(error, {
//       tags: { component: "ErrorBoundary" },
//       extra: { errorInfo: error },
//     });
//   }, [error]);

//   return (
//     <div className="p-6 bg-red-50 text-red-700 rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
//       <p className="mb-4">{error?.message}</p>
//       <button
//         onClick={reset}
//         className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//       >
//         Try again
//       </button>
//     </div>
//   );
// }

// components/ErrorBoundary.jsx
// components/ErrorBoundary.jsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Log to Sentry
    Sentry.captureException(error, {
      tags: { component: "ErrorBoundary" },
      extra: { errorInfo: error },
    });
  }, [error]);

  return (
    <div className="p-6 bg-red-50 text-red-700 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-4">{error?.message || "An unknown error occurred."}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}