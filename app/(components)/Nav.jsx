


import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import NavClient from "./NavClient";


  

const Nav = async () => {
  const session = await getServerSession(options);

  return (


    <NavClient session={session} />
  );
};

export default Nav;

