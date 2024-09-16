import DashboardNav from "@/components/DashboardNav";
import prisma from "@/db/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

interface GetDataProps {
  id: string;
  email: string;
  first_name: string | undefined | null;
  last_name: string | undefined | null;
}

async function getData({ id, email, first_name, last_name }: GetDataProps) {
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
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: first_name ?? "" + last_name ?? "",
      },
    });
  }

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email: email,
    });
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
}

export default async function Dashboardlayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const user = await getUser();

  if (!(await isAuthenticated())) {
    return redirect("/");
  }

  await getData({
    id: user.id as string,
    email: user.email as string,
    first_name: user.given_name ?? "",
    last_name: user.family_name ?? "",
  });

  return (
    <div className="mt-10 w-full flex flex-row gap-20 md:px-10 px-4">
      <div className="md:w-1/4 hidden md:inline ">
        <DashboardNav />
      </div>

      <div className="md:w-3/4 w-full">{children}</div>
    </div>
  );
}
