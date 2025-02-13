// import { getServerSession } from "next-auth";
// import { options } from "../api/auth/[...nextauth]/options";
// import { redirect } from "next/navigation";

// const page = async () => {
//   const session = await getServerSession(options);

//   if (!session) {
//     redirect("/api/auth/signin?callbackUrl=/analytics");
//   }
//   return (
//     <div>
//       <h2 className="text-black">Settings loading</h2>
//     </div>
//   );
// };

// export default page;

import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import User from "@/app/(models)/User";
import Link from "next/link";

const SettingsPage = async () => {
  const session = await getServerSession(options);

  // Redirect if not authenticated or not an admin
  if (!session || session.user.role !== "admin") {
    redirect("/api/auth/signin?callbackUrl=/settings");
  }

  // Fetch all users for user management
  const users = await User.find().select("-password").lean().exec();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-black mb-6">Admin Settings</h1>

      {/* User Management Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">
          User Management
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.role || "user"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-6 text-center text-gray-500">No users found</div>
          )}
        </div>
      </div>

      {/* Role Management Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">
          Role Management
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">Assign or revoke roles for users.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Manage Roles
          </button>
        </div>
      </div>

      {/* Application Settings Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">
          Application Settings
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select className="mt-1 block w-full p-2 border border-gray-300 rounded-lg">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Notifications
            </label>
            <input type="checkbox" className="mt-1" /> Enable Email
            Notifications
          </div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Save Settings
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">Analytics</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">View app usage statistics.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Link href="/analytics">View Analytics</Link>
          </button>
        </div>
      </div>

      {/* Logs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">System Logs</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">View system or activity logs.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            View Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
