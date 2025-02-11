import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DahboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="bg-black size-full h-[100dvh] text-white flex items-center justify-center">
      Hello You are logged in as {session?.user?.name}
    </div>
  );
};

export default DahboardPage;
