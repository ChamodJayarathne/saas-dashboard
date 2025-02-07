import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/analytics");
  }
  return (
    <div>
      <h2 className="text-black">Settings loading</h2>
    </div>
  );
};

export default page;
