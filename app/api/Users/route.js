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


import User from "@/app/(models)/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const userData = body.formData;

    // Confirm data exists
    if (!userData?.email || !userData?.password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400, headers: { "Cache-Control": "no-store" } } // No caching for invalid requests
      );
    }

    try {
      const duplicate = await User.findOne({ email: userData.email })
        .lean()
        .exec();

      if (duplicate) {
        return NextResponse.json(
          { message: "Email already exists" },
          { status: 409, headers: { "Cache-Control": "no-store" } } // No caching for duplicate emails
        );
      }
    } catch (err) {
      console.error("Error checking for duplicate:", err);
      return NextResponse.json(
        { message: "Error checking for duplicate email" },
        { status: 500, headers: { "Cache-Control": "no-store" } } // No caching for errors
      );
    }

    try {
      const hashPassword = await bcrypt.hash(userData.password, 10);
      const userToCreate = {
        name: userData.name,
        email: userData.email,
        password: hashPassword,
      };

      const user = await User.create(userToCreate);
      console.log("Created user:", user);

      // Return success response with caching headers
      return NextResponse.json(
        { message: "User created successfully" },
        {
          status: 201,
          headers: {
            "Cache-Control":
              "public, s-maxage=3600, stale-while-revalidate=1800", // Cache for 1 hour
          },
        }
      );
    } catch (err) {
      console.error("Error creating user:", err);
      return NextResponse.json(
        { message: "Error creating user", error: err.message },
        { status: 500, headers: { "Cache-Control": "no-store" } } // No caching for errors
      );
    }
  } catch (error) {
    console.error("Main error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500, headers: { "Cache-Control": "no-store" } } // No caching for errors
    );
  }
}