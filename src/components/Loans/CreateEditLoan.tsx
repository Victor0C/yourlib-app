import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { createLoan, Loan, updateLoan } from "@/services/Loans";
import { Book, getGenres as getAllBooks } from "@/services/Books";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import { Textarea } from "../ui/textarea";

interface CreateEditLoanProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refresh: () => void;
  loan: Loan | null;
  isReturnAction?: boolean;
}

const CreateEditLoan = (props: CreateEditLoanProps) => {
  const toastPromise = useMyToastPromise();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  useEffect(() => {
    getAllBooks().then((response) => {
      const availableBooks = response.filter(
        (book) => book.status === "AVAILABLE"
      );
      setAllBooks(availableBooks);
    });
  }, []);

  const bookConditions = [
    { label: "NOVO", value: "NEW" },
    { label: "BOM ESTADO", value: "GOOD" },
    { label: "DESGASTADO", value: "WORN" },
  ];

  const FormSchema = z.object({
    book: z.string({
      required_error: "Selecione um livro para emprestar",
    }),
    borrowerName: z.string({
      required_error: "Informe o nome do mutuário",
    }),
    borrowerEmail: z.string().email("Informe um email válido"),
    dueDate: z.string({
      required_error: "Informe a data de devolução",
    }),
    bookConditionBefore: z.string({
      required_error: "Informe o estado do livro antes do empréstimo",
    }),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: getDefaultValues(),
  });

  function getDefaultValues() {
    if (props.loan) {
      return {
        book: props.loan.book,
        borrowerName: props.loan.borrowerName,
        borrowerEmail: props.loan.borrowerEmail,
        dueDate: props.loan.dueDate.split("T")[0],
        status: props.loan.status,
        bookConditionBefore: props.loan.bookConditionBefore,
        notes: props.loan.notes || "",
      };
    }
    return {
      book: "",
      borrowerName: "",
      borrowerEmail: "",
      dueDate: "",
      status: "",
      bookConditionBefore: "",
      notes: "",
    };
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    if (props.isReturnAction && props.loan) {
      // Ação simplificada para devolução (envia apenas o ID)
      toastPromise(
        updateLoan(props.loan._id, { status: "RETURNED" }),
        () => {
          props.refresh();
          setIsLoading(false);
          return "Livro devolvido com sucesso";
        },
        (error) => {
          setIsLoading(false);
          return error instanceof Error ? error.message : "Erro ao devolver";
        }
      );
    } else {
      const loanData = {
        ...data,
        loanDate: new Date().toISOString(),
      };

      toastPromise<Loan | createLoan>(
        props.loan ? updateLoan(props.loan._id, loanData) : createLoan(loanData),
        () => {
          props.refresh();
          setIsLoading(false);
          return `Empréstimo ${
            props.loan ? "atualizado" : "criado"
          } com sucesso`;
        },
        (error) => {
          setIsLoading(false);
          return error instanceof Error ? error.message : "Erro desconhecido";
        }
      );
    }
  }

  function close() {
    form.reset(getDefaultValues());
    props.onOpenChange(false);
  }

  return (
    <Sheet open={props.open}>
      <SheetContent
        className="bg-[#1F2328] border-none"
        withoutCloseButton={true}
      >
        <SheetHeader>
          <SheetTitle className="text-[#BD8D4C]">
            {props.loan ? "Editar empréstimo" : "Criar novo empréstimo"}
          </SheetTitle>
          <SheetDescription className="text-[#BD8D4C]">
            {props.loan
              ? "Atualize os detalhes do empréstimo"
              : "Registre um novo empréstimo de livro"}
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4 px-4">
              <FormField
                control={form.control}
                name="book"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#BD8D4C]">
                      Livro para Emprestar
                    </FormLabel>
                    <FormControl>
                      <select
                        className="text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C] rounded-md p-2 w-full"
                        {...field}
                      >
                        <option value="">Selecione o livro</option>
                        {allBooks.map((book) => (
                          <option key={book._id} value={book._id}>
                            {book.title}
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
                name="borrowerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#BD8D4C]">
                      Nome do Mutuário
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C]"
                        placeholder="Nome da pessoa que está pegando o livro"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="borrowerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#BD8D4C]">
                      Email do Mutuário
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className="text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C]"
                        placeholder="Email da pessoa que está pegando o livro"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#BD8D4C]">
                      Data de Devolução
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bookConditionBefore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#BD8D4C]">
                      Estado do Livro (antes)
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

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#BD8D4C]">
                      Observações
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="text-[#BD8D4C] bg-[#1F2328] border-[#BD8D4C]"
                        placeholder="Alguma observação sobre o empréstimo"
                        {...field}
                      />
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

export default CreateEditLoan;
