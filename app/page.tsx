import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  if (await isAuthenticated()) {
    return redirect("/dashboard");
  }
  return (
    <section className="flex items-center h-[80vh] bg-background justify-center">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="flex flex-col items-center justify-center  drop-shadow-lg">
          <span className="w-auto px-6 py-3   rounded-full bg-secondary">
            <span className="text-sm  font-medium text-primary">
              Sort your notes easily
            </span>
          </span>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
            Create Notes with ease
          </h1>
          <p className="max-w-xl mx-auto text-center mt-8 text-base lg:text-xl text-slate-500">
            Evernote is a versatile note-taking app that lets you capture ideas,
            organize to-do lists, and save web articles all in one place
          </p>
        </div>
        <div className="flex justify-center max-w-xm mx-auto mt-10">
          <RegisterLink>
            <Button size={"lg"} className="drop-shadow-xl ">
              Sign up for free ⇢
            </Button>
          </RegisterLink>
        </div>
      </div>
    </section>
  );
}
