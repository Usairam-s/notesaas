import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import SubmitButtons from "@/components/SubmitButtons";
import prisma from "@/db/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { requireUser } from "@/app/utils/requireUser";

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

async function IfPremium(userId: string) {
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
    },
  });

  return data;
}

export default async function page() {
  const user = await requireUser();
  const data = await getData(user?.id as string);
  const premium = await IfPremium(user?.id as string);
  const isActive = premium?.status == "active";

  async function postData(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name ?? undefined,
        colorScheme: color ?? undefined,
      },
    });

    revalidatePath("/");
  }

  return (
    <section className="w-full border rounded-lg p-6">
      <h2 className="md:text-4xl sm:text-3xl text-2xl font-semibold">
        General Setting
      </h2>
      <p className="text-muted-foreground my-2">
        Please don't forget to save after changes!!
      </p>
      <form action={postData} className="mt-6 flex flex-col gap-8">
        <div>
          <Label>Name</Label>
          <Input
            placeholder=""
            name="name"
            id="name"
            defaultValue={data?.name as string}
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            placeholder=""
            name="email"
            id="email"
            defaultValue={data?.email as string}
            disabled
          />
        </div>
        <div className=" w-full">
          <Label>
            Theme{" "}
            <span
              className={`text-muted-foreground ${
                isActive ? "hidden" : "inline"
              }`}
            >
              (Only premium users can personalize the theme)
              <Link
                className="underline text-sm ml-2 text-blue-500"
                href={"/dashboard/billing"}
              >
                Upgrade Now
              </Link>
            </span>{" "}
          </Label>

          <Select
            disabled={!isActive}
            defaultValue={data?.colorScheme}
            name="color"
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Color"
                defaultValue={data?.colorScheme}
              />
            </SelectTrigger>
            <SelectContent className="w-full">
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

        <div>
          <SubmitButtons />
        </div>
      </form>
    </section>
  );
}
