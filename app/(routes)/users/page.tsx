"use client"

import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react";

const Users = () => {
    const session = useSession();
  return (
      <div className="">
        {session?.data?.user?.image}
        <button onClick={() => signOut()}>Logout</button>
    </div>
  )
}

export default Users