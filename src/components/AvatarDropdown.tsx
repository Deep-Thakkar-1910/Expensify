"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const AvatarDropdown = () => {
  const router = useRouter();
  const session = authClient.useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={session?.data?.user?.image ?? undefined}
            alt="avatar"
          />
          <AvatarFallback>
            {session?.data?.user?.name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/");
                  toast.success("Success!", {
                    description: "Signed Out Successfuly",
                  });
                },
                onError: () => {
                  toast.error("Oops!", {
                    description: "Something Went Wrong",
                  });
                },
              },
            })
          }
          className="cursor-pointer"
        >
          Signout
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdown;
