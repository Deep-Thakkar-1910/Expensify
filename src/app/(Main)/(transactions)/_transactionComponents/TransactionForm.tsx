"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/CalendarComponent";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  transactionSchema,
  TransactionSchemaType,
} from "@/lib/validations/transactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ReceiptScanner } from "./ReceiptScanner";
import { toast } from "sonner";
import { CreateTransaction, UpdateTransaction } from "@/actions/Transaction";
import { useRouter } from "next/navigation";

interface TransactionFormProps {
  accounts: Record<string, any>[];
  defaultCategories: Record<string, any>[];
  editMode?: boolean;
  initialData?: Record<string, any>;
  transactionId?: string;
}

const TransactionForm = ({
  accounts,
  defaultCategories,
  editMode,
  initialData,
  transactionId,
}: TransactionFormProps) => {
  // state for filtering categories based on the type of transaction
  const [filteredCategories, setFilteredCategories] = useState<
    Record<string, string>[]
  >([]);

  const router = useRouter();

  const defaultValues: Partial<TransactionSchemaType> = useMemo(() => {
    if (editMode && initialData) {
      return {
        ...initialData,
        amount: initialData.amount.toString(),
        date: new Date(initialData.date).toISOString(),
      };
    }
    return {
      amount: "",
      type: "EXPENSE",
      description: "",
      category: "",
      userAccountId: accounts.find((acc) => acc.isDefault)?.id,
      isRecurring: false,
      recurringInterval: "DAILY",
      date: new Date().toISOString(),
    };
  }, [editMode, initialData]);

  // date state for the transaction date
  const [date, setDate] = useState<Date>(new Date());
  const form = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    mode: "all",
    defaultValues,
  });

  const { control, handleSubmit, watch, setValue } = form;

  const memoizedCategories = useMemo(() => {
    return defaultCategories;
  }, [defaultCategories]);

  const type = watch("type");

  // Filter categories based on the type of transaction
  useEffect(() => {
    if (type === "INCOME") {
      setFilteredCategories(
        memoizedCategories.filter((cat) => {
          if (cat.type === "INCOME") {
            return cat.name;
          } else {
            return false;
          }
        }),
      );
    } else {
      setFilteredCategories(
        memoizedCategories.filter((cat) => {
          if (cat.type === "EXPENSE") {
            return cat.name;
          } else {
            return false;
          }
        }),
      );
    }
  }, [type, memoizedCategories]);

  // show the reccuring field if isRecurring is true
  const isRecurring = watch("isRecurring");

  const onSubmit: SubmitHandler<TransactionSchemaType> = async (data) => {
    try {
      // creating the transaction based on received data or updating based on edit mode
      if (editMode) {
        await UpdateTransaction(transactionId as string, data);
      } else {
        await CreateTransaction(data);
      }
      form.reset();
      if (editMode) {
        toast.success("Transaction updated successfully");
      } else {
        toast.success("Transaction created successfully");
      }
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  const handleScanComplete = (scannedData: Record<string, any>) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date).toISOString());
      setDate(new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("type", "EXPENSE");
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 flex w-full max-w-lg flex-col space-y-4 rounded-lg border px-6 py-4"
      >
        {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}
        <div className="flex items-center justify-between gap-2">
          <FormField
            control={control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="flex w-fit flex-col gap-2">
          <FormLabel>Transaction Date</FormLabel>
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd-MMM-yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  selected={date}
                  onSelect={(currentDate: Date | undefined) => {
                    if (currentDate) {
                      setDate(currentDate);
                      form.setValue("date", currentDate.toISOString());
                    }
                  }}
                  fromDate={new Date("2024-01-01")}
                  toDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormField
          control={control}
          name="userAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Recurring Transaction</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(value) => {
                    form.setValue("isRecurring", value);
                    if (!value) {
                      form.setValue("recurringInterval", undefined);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isRecurring && (
          <FormField
            control={control}
            name="recurringInterval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interval</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Interval" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DAILY">Daily</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {editMode ? (
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="size-5 animate-spin" /> Updating Transaction
              </div>
            ) : (
              "Update Transaction"
            )}
          </Button>
        ) : (
          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="size-5 animate-spin" /> Creating Transaction
              </div>
            ) : (
              "Create Transaction"
            )}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default TransactionForm;
