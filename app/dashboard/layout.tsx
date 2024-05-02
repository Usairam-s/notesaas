import React, { ReactNode } from "react";
import DashboardNav from "../components/DashboardNav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../lib/db";
import { stripe } from "../lib/stripe";

//check use rif exit

async function getData({
  id,
  email,
  firstName,
  lastName,
  profileImage,
}: {
  id: string;
  email: string;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  profileImage: string | undefined | null;
}) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`;
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name,
      },
    });
  }

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email: email,
    });
    await prisma.user.update({
      where: { id: id },
      data: { stripeCustomerId: data.id },
    });
  }
}

async function DashboardLayout({ children }: { children: ReactNode }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }

  await getData({
    email: user.email as string,
    firstName: user.given_name as string,
    lastName: user.family_name as string,
    id: user.id as string,
    profileImage: user.picture as string,
  });
  return (
    <div className="px-12 space-y-6 mt-12">
      <div className="container w-full   flex gap-32 mg:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] gap-14 flex-col   sm:flex ">
          <DashboardNav />
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
