"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { accountFormSchema } from "@/lib/validations/accountFormSchema";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccountAction } from "@/actions/Dashboard";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface AccountFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const AccountForm = ({ setIsOpen }: AccountFormProps) => {
  type formSchemaType = z.infer<typeof accountFormSchema>;
  const form = useForm<formSchemaType>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      balance: "",
      isDefault: false,
      type: "SAVINGS",
    },
    mode: "all",
  });

  const { control, formState, handleSubmit } = form;

  // onSubmit handler that will use the server action for creating an account
  const onSubmit: SubmitHandler<formSchemaType> = async (data) => {
    try {
      const createdAccount = await createAccountAction(data);
      if (createdAccount?.success) {
        toast.success("Success!", {
          description: "Your account has been created.",
        });
        setIsOpen(false);
      } else {
        toast.error("Oops!", {
          description: createdAccount?.error,
        });
      }
    } catch (err) {
      if (err instanceof Error)
        toast.error("Oops!", {
          description: err.message,
        });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 flex w-full max-w-lg flex-col space-y-4 rounded-lg border px-6 py-4"
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Account Name <sup className="text-red-500">*</sup>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Account Name"
                  className="placeholder:text-muted-foreground"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Account Type <sup className="text-red-500">*</sup>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Savings" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="INVESTMENT">Investment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Initial Balance <sup className="text-red-500">*</sup>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={0.01}
                  placeholder="0.0"
                  className="placeholder:text-muted-foreground"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Set As Default</FormLabel>
                <FormDescription>
                  This account will be selected by default for transactions.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={() => setIsOpen(false)}
            disabled={formState.isSubmitting}
            variant={"outline"}
            size={"lg"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex space-x-2"
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting && (
              <Loader className="size-4 animate-spin" />
            )}
            {formState.isSubmitting ? "Creating" : "Create Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountForm;
