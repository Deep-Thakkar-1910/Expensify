import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DahboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }
  return (
    <>
      <section className="flex size-full h-[100dvh] items-center justify-center bg-slate-50 text-black">
        Hello You are logged in as {session?.user?.name}
      </section>
    </>
  );
};

export default DahboardPage;
