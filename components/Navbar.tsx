import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import UserNav from "./UserNav";

export async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <header className="border-b bg-background h-[10vh] flex items-center md:px-10 px-4  ">
      <nav className="container flex items-center justify-between">
        <Link href={"/"} className="text-2xl font-bold">
          Note<span className="text-primary">SAAS</span>{" "}
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {(await isAuthenticated()) ? (
            <UserNav
              name={user?.given_name as string}
              email={user?.email as string}
              image={user?.picture as string}
            />
          ) : (
            <>
              {" "}
              <LoginLink>
                <Button>Sign in</Button>
              </LoginLink>
              <RegisterLink>
                <Button variant={"secondary"}>Sign up</Button>
              </RegisterLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
