
// import { Activity, Users, DollarSign, ArrowUp } from "lucide-react";

// import { getServerSession } from "next-auth";
// import { options } from "./api/auth/[...nextauth]/options";
// import { redirect } from "next/navigation";

// async function fetchProducts() {
//   try {
//     const response = await fetch("https://dummyjson.com/products", {
//       next: { revalidate: 3600 },
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
//       next: { revalidate: 3600 }, 
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
//       current: number,
//       trend: number,
//     };
//   }
// }

// const DashboardPage = async () => {

//   // const session = await getServerSession(options);
  
//   // if (!session) {
//   //   redirect("/api/auth/signin?callbackUrl=/analytics");
//   // }

//   const [productsData, userData] = await Promise.all([
//     fetchProducts(),
//     fetchUsers(),
//   ]);

//   const products = productsData.products;

//   const users = userData.current;


//   const totalRevenue = products.reduce(
//     (sum, product) => sum + product.price * product.stock,
//     0
//   );

//   const stats = [
//     {
//       title: "Total Revenue",
//       value: `$${totalRevenue}`,
//       change: "+20.1%",
//       icon: DollarSign,
//     },
//     {
//       title: "Active Users",
//       value: users,
//       change: "+15.3%",
//       icon: Users,
//     },
//     {
//       title: "Active Sessions",
//       value: "1,892",
//       change: "+12.4%",
//       icon: Activity,
//     },
//   ];

//   return (
//     <div className="space-y-6 py-6">
//       <h2 className="text-2xl font-semibold text-black">Dashboard Overview</h2>

//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {stats.map((stat, index) => (
//           <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">{stat.title}</p>
//                 <p className="text-2xl font-semibold mt-1 text-black/60">
//                   {stat.value}
//                 </p>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <stat.icon className="w-6 h-6 text-gray-700" />
//               </div>
//             </div>
//             <div className="flex items-center mt-4 text-sm text-green-600">
//               <ArrowUp className="w-4 h-4 mr-1" />
//               <span>{stat.change} from last month</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <div className="p-6 bg-white rounded-lg shadow-sm">
//           <h3 className="text-lg font-semibold mb-4 text-black/60">
//             Recent Activity
//           </h3>
//           <div className="space-y-4">
//             <p className="text-gray-600">Loading activity...</p>
//           </div>
//         </div>

//         <div className="p-6 bg-white rounded-lg shadow-sm">
//           <h3 className="text-lg font-semibold mb-4 text-black/60">
//             Quick Actions
//           </h3>
//           <div className="space-y-4">
//             <button className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
//               Create New Project
//             </button>
//             <button className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
//               View Reports
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


import { Activity, Users, DollarSign, ArrowUp } from "lucide-react";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
// import Loading from '@/components/Loading';

//

async function fetchProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products", {
      next: { revalidate: 3600 }, // ISR: Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Expected JSON, but received: ${text}`);
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
      next: { revalidate: 3600 }, // ISR: Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error(`Expected JSON, but received: ${text}`);
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

const DashboardPage = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const [productsData, userData] = await Promise.all([
    fetchProducts(),
    fetchUsers(),
  ]);

  // if (!productsData || !userData) {
  //   return <Loading />;
  // }

  const products = productsData.products;
  const users = userData.current;

  const totalRevenue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+20.1%",
      icon: DollarSign,
    },
    {
      title: "Active Users",
      value: users.toLocaleString(),
      change: "+15.3%",
      icon: Users,
    },
    {
      title: "Active Sessions",
      value: "1,892",
      change: "+12.4%",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6 py-6">
      <h2 className="text-2xl font-semibold text-black">Dashboard Overview</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1 text-black/60">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <stat.icon className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              <span>{stat.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-black/60">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <p className="text-gray-600">Loading activity...</p>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-black/60">
            Quick Actions
          </h3>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Create New Project
            </button>
            <button className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
