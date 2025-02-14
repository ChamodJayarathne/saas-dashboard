// import { NextResponse } from 'next/server';
// import { withAuth } from 'next-auth/middleware';

// export default withAuth(
//   function middleware(req) {
//     const { pathname } = req.nextUrl;
//     const { token } = req.nextauth;

//     // Logging for debugging (optional)
//     console.log('Path:', pathname);
//     console.log('User Role:', token?.role);

//     // Role-based access control
//     if (pathname.startsWith('/CreateUser') && token?.role !== 'admin') {
//       return NextResponse.rewrite(new URL('/Denied', req.url));
//     }

//     // Cache static pages and API routes
//     const response = NextResponse.next();

//     // Cache static pages
//     const staticPaths = ['/', '/analytics', '/billing', '/dashboard'];
//     if (staticPaths.includes(pathname)) {
//       response.headers.set(
//         'Cache-Control',
//         'public, s-maxage=3600, stale-while-revalidate=1800, max-age=600'
//       );
//     }

//     // Cache API responses
//     if (pathname.startsWith('/api/products') || pathname.startsWith('/api/users')) {
//       response.headers.set(
//         'Cache-Control',
//         'public, s-maxage=3600, stale-while-revalidate=1800'
//       );
//     }

//     return response;
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token, // Ensure user is authenticated
//     },
//   }
// );

// // Middleware matcher configuration
// export const config = {
//   matcher: [
//     '/CreateUser', // Existing protected route
//     '/', // Cache static pages
//     '/analytics',
//     '/billing',
//     '/dashboard',
//     '/api/products/:path*', // Cache API routes
//     '/api/users/:path*',
//   ],
// };

// middleware.js
import { wrapMiddlewareWithSentry} from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default wrapMiddlewareWithSentry(
  withAuth(
    function middleware(req) {
      const { pathname } = req.nextUrl;
      const { token } = req.nextauth;

      // Logging for debugging (optional)
      console.log("Path:", pathname);
      console.log("User Role:", token?.role);

      // Role-based access control
      if (pathname.startsWith("/CreateUser") && token?.role !== "admin") {
        return NextResponse.rewrite(new URL("/Denied", req.url));
      }

      // Cache static pages and API routes
      const response = NextResponse.next();

      // Cache static pages
      const staticPaths = ["/", "/analytics", "/billing", "/dashboard"];
      if (staticPaths.includes(pathname)) {
        response.headers.set(
          "Cache-Control",
          "public, s-maxage=3600, stale-while-revalidate=1800, max-age=600"
        );
      }

      // Cache API responses
      if (
        pathname.startsWith("/api/products") ||
        pathname.startsWith("/api/users")
      ) {
        response.headers.set(
          "Cache-Control",
          "public, s-maxage=3600, stale-while-revalidate=1800"
        );
      }

      return response;
    },
    {
      callbacks: {
        authorized: ({ token }) => !!token,
      },
    }
  )
);

export const config = {
  matcher: [
    "/CreateUser", // Existing protected route
    "/", // Cache static pages
    "/analytics",
    "/billing",
    "/dashboard",
    "/api/products/:path*", // Cache API routes
    "/api/users/:path*",
  ],
};
