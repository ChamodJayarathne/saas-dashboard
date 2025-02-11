import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname);
    console.log(req.nextauth.token.role);

    if (
      req.nextUrl.pathname.startsWith("/CreateUser") &&
      req.nextauth.token.role != "admin"
    ) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }
    if (req.nextUrl.pathname.startsWith("/api/notifications")) {
      if (!req.nextauth.token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  },
  {
    callbacks: {
      authrized: ({ token }) => !token,
    },
  }
);

export const config = { matcher: ["/CreateUser", "/api/notifications/:path*"] };

// import { getSession } from "next-auth/react";

// export async function authMiddleware(req, res, next) {
//   const session = await getSession({ req });

//   if (!session) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   req.user = session.user;
//   return next();
// }
