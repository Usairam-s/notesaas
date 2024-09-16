"use client";
import { Home, IdCard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DashLink = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Settings", href: "/dashboard/setting", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: IdCard },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav>
      <div className="flex flex-col gap-4">
        {DashLink.map((item, index) => (
          <Link
            className={`flex items-center gap-4 p-4 hover:bg-accent rounded-lg ${
              pathname == item.href ? "bg-primary/20" : "bg-transparent"
            }`}
            key={index}
            href={item.href}
          >
            <item.icon className="text-primary" />
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
