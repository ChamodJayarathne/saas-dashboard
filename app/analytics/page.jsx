// import React from "react";
// import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

// async function fethProduct() {
//   const response = await fetch("https://api.example.com/products");
//   console.log(response)
//   return await response.json();
// }

// const page = async () => {
// //   const products = await fethProducts();
//   return (
//     <div>
//       <h2 className="text-black">Products</h2>
//       {/* <ul>
//         {products.map((product) => (
//           <li key={product.id}>{product.name}</li>
//         ))}
//       </ul> */}
//       <AnalyticsDashboard products={await fethProduct()} />
//     </div>
//   );
// };

// export default page;
// import React, { Suspense } from "react";
// import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

// async function fetchProducts() {
//   try {
//     const response = await fetch("https://dummyjson.com/products", {
//       next: { revalidate: 3600 }, // Cache for 1 hour
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return { products: [] };
//   }
// }

// const Page = async () => {
//   const data = await fetchProducts();

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold text-black mb-4">Products Analytics</h2>
//       <Suspense fallback={<div>Loading analytics...</div>}>
//         <AnalyticsDashboard data={data} />
//       </Suspense>
//     </div>
//   );
// };

// export default Page;
// import React, { Suspense } from "react";
// import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

// async function fetchProducts() {
//   try {
//     const response = await fetch("https://dummyjson.com/products", {
//       next: { revalidate: 3600 }, // Cache for 1 hour
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return { products: [] };
//   }
// }

// async function fetchUsers() {
//   try {
//     const response = await fetch("https://dummyjson.com/users", {
//       next: { revalidate: 3600 }, // Cache for 1 hour
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
    
//     // Transform the data
//     const transformedData = {
//       chartData: data.users.slice(0, 24).map((user, index) => ({
//         time: `${index}h`,
//         users: user.id,
//       })),
//       current: data.users.length,
//       trend: Math.floor(Math.random() * 40) - 20,
//     };

//     return transformedData;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return {
//       chartData: [],
//       current: 0,
//       trend: 0,
//     };
//   }
// }

// const Page = async () => {
//   const [productsData, userData] = await Promise.all([
//     fetchProducts(),
//     fetchUsers()
//   ]);

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold text-black mb-4">Products Analytics</h2>
//       <Suspense fallback={<div>Loading analytics...</div>}>
//         <AnalyticsDashboard data={productsData} userData={userData} />
//       </Suspense>
//     </div>
//   );
// };

// export default Page;

import React, { Suspense } from "react";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [] };
  }
}

async function fetchUsers() {
  try {
    const response = await fetch("https://dummyjson.com/users", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data
    const transformedData = {
      chartData: data.users.slice(0, 24).map((user, index) => ({
        time: `${index}h`,
        users: user.id,
      })),
      current: data.users.length,
      trend: Math.floor(Math.random() * 40) - 20,
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      chartData: [],
      current: 0,
      trend: 0,
    };
  }
}

const Page = async () => {
  const [productsData, userData] = await Promise.all([
    fetchProducts(),
    fetchUsers()
  ]);

  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/analytics");
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-black mb-4">Products Analytics</h2>
      <Suspense fallback={<div>Loading analytics...</div>}>
      {/* <p>{session?.user?.role}</p> */}
        <AnalyticsDashboard data={productsData} userData={userData} />
      </Suspense>
    </div>
  );
};

export default Page;

