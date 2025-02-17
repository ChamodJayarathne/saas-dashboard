// import User from "@/app/(models)/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const userData = body.formData;

//     //confirmdata exists
//     if (!userData?.email || !userData?.password) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     try {
//       const duplicate = await User.findOne({ email: userData.email })
//         .lean()
//         .exec();

//       if (duplicate) {
//         return NextResponse.json(
//           { message: "Email already exists" },
//           { status: 409 }
//         );
//       }
//     } catch (err) {
//       console.error("Error checking for duplicate:", err);
//       return NextResponse.json(
//         { message: "Error checking for duplicate email" },
//         { status: 500 }
//       );
//     }

//     try {
//       const hashPassword = await bcrypt.hash(userData.password, 10);
//       const userToCreate = {
//         name: userData.name,
//         email: userData.email,
//         password: hashPassword,
//       };

//       const user = await User.create(userToCreate);
//       console.log("Created user:", user);

//       return NextResponse.json(
//         { message: "User created successfully" },
//         { status: 201 }
//       );
//     } catch (err) {
//       console.error("Error creating user:", err);
//       return NextResponse.json(
//         { message: "Error creating user", error: err.message },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Main error:", error);
//     return NextResponse.json(
//       { message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

// import User from "@/app/(models)/User";
// import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const userData = body.formData;

//     // Confirm data exists
//     if (!userData?.email || !userData?.password) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400, headers: { "Cache-Control": "no-store" } } // No caching for invalid requests
//       );
//     }

//     try {
//       const duplicate = await User.findOne({ email: userData.email })
//         .lean()
//         .exec();

//       if (duplicate) {
//         return NextResponse.json(
//           { message: "Email already exists" },
//           { status: 409, headers: { "Cache-Control": "no-store" } } // No caching for duplicate emails
//         );
//       }
//     } catch (err) {
//       console.error("Error checking for duplicate:", err);
//       return NextResponse.json(
//         { message: "Error checking for duplicate email" },
//         { status: 500, headers: { "Cache-Control": "no-store" } } // No caching for errors
//       );
//     }

//     try {
//       const hashPassword = await bcrypt.hash(userData.password, 10);
//       const userToCreate = {
//         name: userData.name,
//         email: userData.email,
//         password: hashPassword,
//       };

//       const user = await User.create(userToCreate);
//       console.log("Created user:", user);

//       // Return success response with caching headers
//       return NextResponse.json(
//         { message: "User created successfully" },
//         {
//           status: 201,
//           headers: {
//             "Cache-Control":
//               "public, s-maxage=3600, stale-while-revalidate=1800", // Cache for 1 hour
//           },
//         }
//       );
//     } catch (err) {
//       console.error("Error creating user:", err);
//       return NextResponse.json(
//         { message: "Error creating user", error: err.message },
//         { status: 500, headers: { "Cache-Control": "no-store" } } // No caching for errors
//       );
//     }
//   } catch (error) {
//     console.error("Main error:", error);
//     return NextResponse.json(
//       { message: "Server error", error: error.message },
//       { status: 500, headers: { "Cache-Control": "no-store" } } // No caching for errors
//     );
//   }
// }

import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as Sentry from "@sentry/nextjs";

export async function POST(req) {
  const transaction = Sentry.startTransaction({
    op: "userRegistration",
    name: "User Registration",
  });

  try {
    const body = await req.json();
    const userData = body.formData;

    // Input validation
    if (!userData?.email || !userData?.password) {
      Sentry.captureMessage("Missing fields in user registration");
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Check for duplicate user
    const duplicate = await User.findOne({ email: userData.email })
      .lean()
      .exec();
    if (duplicate) {
      Sentry.captureMessage("Duplicate user registration attempt");
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Hash password and create user
    const hashPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: hashPassword,
    });

    Sentry.addBreadcrumb({
      category: "user",
      message: `User ${user.email} created`,
      level: Sentry.Severity.Info,
    });

    // Enhanced notification
    const notificationData = {
      title: "New User Registration",
      message: `New user registered: ${userData.name} (${userData.email})`,
      type: "user",
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === "production") {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationData),
      });
    } else {
      const res = await fetch("http://localhost:3000/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationData),
      });
    }

    return NextResponse.json(
      { message: "User created successfully" },
      {
        status: 201,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: "POST /api/Users" },
      extra: { userData: body?.formData },
    });
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    transaction.finish();
  }
}
