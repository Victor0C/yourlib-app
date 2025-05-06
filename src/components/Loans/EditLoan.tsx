import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { updateLoan, statusLoan, Loan } from "@/services/Loans";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMyToastPromise } from "../MyToasts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface EditLoanProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refresh: () => void;
  loan: Loan | null;
}

const EditLoan = (props: EditLoanProps) => {
  const toastPromise = useMyToastPromise();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const bookConditions = [
    { label: "NOVO", value: "NEW" },
    { label: "BOM ESTADO", value: "GOOD" },
    { label: "DESGASTADO", value: "WORN" },
  ];
  const statusLoanMap = [
    { label: 'EMPRESTADO', value: 'BORROWED' },
    { label: 'DEVOLVIDO', value: 'RETURNED' },
    { label: 'ATRASADO', value: 'OVERDUE' }
  ];

  const FormSchema = z.object({
    status: z.string({
      required_error: "Selecione o status do empréstimo",
    }),
    returnDate: z.string({
      required_error: "Informe a data de devolução",
    }),
    bookConditionAfter: z.string({
      required_error: "Informe o estado do livro após o empréstimo",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: "RETURNED",
      returnDate: new Date().toISOString().split("T")[0],
      bookConditionAfter: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    if (!props.loan) return;

    const loanData = {
      status: data.status,
      returnDate: new Date(data.returnDate).toISOString(),
      bookConditionAfter: data.bookConditionAfter,
    };

    toastPromise(
      updateLoan(props.loan._id, loanData),
      () => {
        props.refresh();
        setIsLoading(false);
        return "Empréstimo atualizado com sucesso";
      },
      (error) => {
        setIsLoading(false);
        return error instanceof Error ? error.message : "Erro ao atualizar";
      }
    );
  }

  function close() {
    form.reset();
    props.onOpenChange(false);
  }

  return (
    <Sheet open={props.open}>
      <SheetContent
        className="bg-[#1F2328] border-none"
        withoutCloseButton={true}
      >
        <SheetHeader>
          <SheetTitle className="text-[#BD8D4C]">Atualizar empréstimo</SheetTitle>
          <SheetDescription className="text-[#BD8D4C]">
            Registre a devolução do livro
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4 px-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#BD8D4C]">Status</FormLabel>
                    <FormControl>
                      <select
                        className="text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C] rounded-md p-2 w-full"
                        {...field}
                      >
                        {statusLoanMap.map((status, index) => (
                          <option key={index} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#BD8D4C]">
                      Data de Devolução
                    </FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C] rounded-md p-2 w-full border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookConditionAfter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#BD8D4C]">
                      Estado do Livro (após)
                    </FormLabel>
                    <FormControl>
                      <select
                        className="text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C] rounded-md p-2 w-full"
                        {...field}
                      >
                        <option value="">Selecione o estado</option>
                        {bookConditions.map((condition) => (
                          <option key={condition.value} value={condition.value}>
                            {condition.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <Button
                type="submit"
                className="bg-[#BD8D4C] text-[#1F2328] hover:bg-[#9E744A]"
                disabled={isLoading}
              >
                Salvar
              </Button>
              <Button
                type="button"
                onClick={close}
                className="bg-red-600 text-[#1F2328] hover:bg-red-700"
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditLoan;