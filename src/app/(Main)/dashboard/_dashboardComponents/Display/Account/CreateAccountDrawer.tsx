"use client";
import { ReactNode, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import AccountForm from "../../Create/AccountForm";
import { X } from "lucide-react";
const CreateAccountDrawer = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="flex flex-col items-center justify-center">
        <DrawerHeader>
          <DrawerTitle className="mx-auto">Create a new account</DrawerTitle>
          <DrawerDescription>
            Field marked With <sup className="text-red-500">*</sup> are
            mandatory
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex w-full items-center justify-center px-6 lg:px-0">
          <AccountForm setIsOpen={setIsOpen} />
        </div>
        <DrawerClose
          className="absolute right-4 top-4"
          onClick={() => setIsOpen(false)}
        >
          <X className="size-4" />
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
