import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StripePortal } from "@/app/components/SubmitButton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StripeSubscriptionCreationButton } from "@/app/components/SubmitButton";
import { getStripeSession } from "@/app/lib/stripe";
import { stripe } from "@/app/lib/stripe";
import { redirect } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { SubmitButton } from "@/app/components/SubmitButton";
import { revalidatePath } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });

  return data;
}

async function getData2(userId: string) {
  const data = prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  return data;
}

export default async function DashboardSetting() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);
  const data2 = await getData2(user?.id as string);

  async function postData(formData: FormData) {
    "use server";
    const name = formData.get("name") as string | undefined;
    const colorScheme = formData.get("color") as string | undefined;
    const data = await prisma.user.update({
      where: {
        id: user?.id as string,
      },
      data: {
        name: name ?? undefined,
        colorScheme: colorScheme ?? undefined,
      },
    });

    revalidatePath("/", "layout");
  }

  async function createSubscription() {
    "use server";
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!dbUser?.stripeCustomerId) {
      throw new Error("Enable to get customer id");
    }

    const subscriptionUrl = await getStripeSession({
      customerId: dbUser?.stripeCustomerId,
      domainUrl: "http://localhost:3000",
      priceId: process.env.STRIPE_PRICE_ID as string,
    });

    return redirect(subscriptionUrl);
  }

  async function createCustomerPortal() {
    "use server";
    const session = await stripe.billingPortal.sessions.create({
      customer: data2?.user.stripeCustomerId as string,
      return_url:
        process.env.NODE_ENV === "production"
          ? (process.env.PRODUCTION_URL as string)
          : "http://localhost:3000/dashboard",
    });

    return redirect(session.url);
  }

  if (data2?.status === "active") {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl md:text-4xl">Settings</h2>
          <p className="text-sm text-muted-foreground">Your profile settings</p>
        </div>

        <form action={postData} className="lg:w-[820px] w-full mt-3 ">
          <Card className="w-full">
            <CardHeader className="w-full">
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Your personal information. Please don&apos;t forget to save.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  defaultValue={data?.name || ""}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  disabled
                  name="email"
                  id="email"
                  placeholder="example@gmail.com"
                  defaultValue={data?.email || ""}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Personalize Theme</Label>

                <Select name="color" defaultValue={data?.colorScheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color</SelectLabel>
                      <SelectItem value="theme-green">Green</SelectItem>
                      <SelectItem value="theme-blue">Blue</SelectItem>
                      <SelectItem value="theme-violet">Violet</SelectItem>
                      <SelectItem value="theme-yellow">Yellow</SelectItem>
                      <SelectItem value="theme-orange">Orange</SelectItem>
                      <SelectItem value="theme-red">Red</SelectItem>
                      <SelectItem value="theme-rose">Rose</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <SubmitButton />
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl md:text-4xl">Settings</h2>
        <p className="text-sm text-muted-foreground">Your profile settings</p>
      </div>

      <form action={postData} className="lg:w-[820px] w-full mt-3 ">
        <Card className="w-full">
          <CardHeader className="w-full">
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Your personal information. Please don&apos;t forget to save.
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input
                name="name"
                id="name"
                placeholder="John Doe"
                defaultValue={data?.name || ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <Input
                disabled
                name="email"
                id="email"
                placeholder="example@gmail.com"
                defaultValue={data?.email || ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Personalize Theme</Label>

              <Select disabled name="color" defaultValue={data?.colorScheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Color</SelectLabel>
                    <SelectItem value="theme-green">Green</SelectItem>
                    <SelectItem value="theme-blue">Blue</SelectItem>
                    <SelectItem value="theme-violet">Violet</SelectItem>
                    <SelectItem value="theme-yellow">Yellow</SelectItem>
                    <SelectItem value="theme-orange">Orange</SelectItem>
                    <SelectItem value="theme-red">Red</SelectItem>
                    <SelectItem value="theme-rose">Rose</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <SubmitButton />
          </CardContent>
        </Card>
      </form>

      <form className="mx-auto mt-4 mb-4" action={createSubscription}>
        <StripeSubscriptionCreationButton />
      </form>
    </div>
  );
}
