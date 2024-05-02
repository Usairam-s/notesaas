"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, CreditCard, Settings, DoorClosedIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

export const NavItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
];

function UserNav({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image: string;
}) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {" "}
          <Avatar>
            <AvatarImage src={image || "https://github.com/shadcn.png"} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px] mr-6">
          <DropdownMenuLabel>{name}</DropdownMenuLabel>
          <DropdownMenuItem className="text-gray-500">{email}</DropdownMenuItem>
          <DropdownMenuSeparator />
          {NavItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex justify-between items-center"
            >
              <Link href={item.href}>{item.name}</Link>
              <item.icon />
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <LogoutLink>
            <DropdownMenuItem className="flex items-center justify-between">
              Logout
              <DoorClosedIcon className="h-5 w-5 text-red-400 inline-block" />
            </DropdownMenuItem>
          </LogoutLink>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserNav;
