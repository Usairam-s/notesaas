"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { DoorClosed, Home, IdCard, Settings } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

const DashLink = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Settings", href: "/dashboard/setting", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: IdCard },
];

export default function UserNav({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          className="w-fit bg-transparent hover:bg-transparent outline-none"
          variant={"ghost"}
        >
          <Avatar>
            <AvatarImage src={image} alt="" />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60 mr-6">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuItem className="text-gray-500">{email}</DropdownMenuItem>
        <DropdownMenuSeparator />
        {DashLink.map((item, index) => (
          <Link
            className="flex flex-row items-center justify-between w-full p-2"
            key={index}
            href={item.href}
          >
            <DropdownMenuItem className="w-full flex items-center justify-between cursor-pointer">
              {item.name} <item.icon size={20} />
            </DropdownMenuItem>
          </Link>
        ))}

        <DropdownMenuSeparator />

        <LogoutLink>
          <Button className="w-full">Logout</Button>
        </LogoutLink>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
