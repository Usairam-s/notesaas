import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import UserNav from "./UserNav";

async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();
  return (
    <nav className="border-b bg-background h-[12vh] flex  items-center">
      <div className="container sm:px-20 px-4  flex items-center justify-between">
        <Link href={"/"}>
          <h2 className="font-bold text-4xl">
            Note<span className="text-primary">SaaS</span>
          </h2>
        </Link>
        <div className="flex items-center gap-x-5">
          <ModeToggle />
          <div className=" flex items-center gap-x-5">
            {(await isAuthenticated()) ? (
              <>
                <UserNav
                  name={user?.given_name as string}
                  email={user?.email as string}
                  image={user?.picture as string}
                />
              </>
            ) : (
              <>
                {" "}
                <LoginLink>
                  <Button>Sign In</Button>
                </LoginLink>
                <RegisterLink>
                  <Button variant={"outline"}>Sign Up</Button>
                </RegisterLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
