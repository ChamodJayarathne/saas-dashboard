// import { getServerSession } from "next-auth";
// import { options } from "../api/auth/[...nextauth]/options";
// import { redirect } from "next/navigation";

// const page = async() => {
//   const session = await getServerSession(options);

//   if (!session) {
//     redirect("/api/auth/signin?callbackUrl=/analytics");
//   }
//   return (
//     <div>
//       <h2 className='text-black'>Users loading</h2>
//     </div>
//   )
// }

// export default page

import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import User from "@/app/(models)/User";

const UsersPage = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/users");
  }

  // Fetch all users from database
  const users = await User.find().select("-password").lean().exec();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-black mb-6">
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
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id.toString()} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.role || "user"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
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
  );
};

export default UsersPage;
