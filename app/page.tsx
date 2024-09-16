import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();

  if (await isAuthenticated()) {
    return redirect("/dashboard");
  }
  return (
    <section className="flex justify-center items-center h-[90vh]">
      <div className="relative w-full px-5 py-12 lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-y-8">
          <span className=" font-medium border-b text-primary shadow-2xl rounded-full px-6 py-1 items-center">
            Make you notes easily
          </span>
          <h2 className="md:text-7xl sm:text-5xl text-4xl font-semibold uppercase">
            Create your Daily Notes
          </h2>

          <RegisterLink>
            <Button>Get Started</Button>
          </RegisterLink>
        </div>
      </div>
    </section>
  );
}
