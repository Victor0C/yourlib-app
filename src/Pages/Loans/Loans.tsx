import { useMyToastPromise } from "@/components/MyToasts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { Eye, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllLoansWithBookNames, Loan, LoanWithBookName, statusLoan } from "@/services/Loans";
import { conditionBookMap } from "@/services/Books";
import CreateEditLoan from "@/components/Loans/CreateEditLoan";
import EditLoan from "@/components/Loans/EditLoan";

const Loans = () => {
  const [loan, setLoan] = useState<LoanWithBookName[]>([]);
  const [requestLoans, setrequestLoans] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [openCreateUpdate, setOpenCreateUpdate] = useState<boolean>(false);
  const [targetLoan, setTargetLoan] = useState<Loan | null>(null);
  const [editLoan, setOpenEditLoan] = useState<boolean>(false);

  const toastPromise = useMyToastPromise();
  const isMobile = useIsMobile();

  function refresh() {
    setrequestLoans(!requestLoans);
  }

  useEffect(() => {
    setIsLoading(true);
    toastPromise(
      getAllLoansWithBookNames(),
      (data) => {
        setLoan(data);
        setIsLoading(false);
        return "Registros coletados";
      },
      (error) => {
        setIsLoading(false);
        if (error instanceof Error) {
          return error.message;
        }
        return "Erro desconhecido";
      }
    );
  }, [requestLoans, search]);

  const createUpdate = (loan: Loan | null = null) => {
    setTargetLoan(loan);
    setOpenCreateUpdate(true);
  };

  const handleReturnAction = (loan: Loan) => {
    setTargetLoan(loan);
    setOpenEditLoan(true);
  };

  return (
    <Card className="w-full h-auto card bg-[#1F2328] border-[#BD8D4C] border-2 py-2 px-2 ">
      <CreateEditLoan
        open={openCreateUpdate}
        onOpenChange={setOpenCreateUpdate}
        refresh={refresh}
        loan={targetLoan}
      />
      <EditLoan
        open={editLoan}
        onOpenChange={setOpenEditLoan}
        refresh={refresh}
        loan={targetLoan}
      />
      <div className="flex w-full items-center space-x-2">
        <form
          className="flex w-full items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(e.currentTarget.search.value);
          }}
        >
          <Input
            name="search"
            className="text-[#d8d6d2] bg-[#282C34] border-[#BD8D4C]
        focus:border-[#BD8D4C] focus:ring-[#BD8D4C]"
            type="text"
            placeholder="Pesquise um livro"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-[#BD8D4C] text-[#1F2328] hover:bg-[#A77B3B] 
      font-bold transition-colors disabled:opacity-50 ml-2"
            disabled={isLoading}
          >
            <Search />
          </Button>
        </form>
        <Button
          type="button"
          className="bg-[#BD8D4C] text-[#1F2328] hover:bg-[#A77B3B] 
      font-bold transition-colors disabled:opacity-50"
          disabled={isLoading}
          onClick={() => createUpdate()}
        >
          <Plus />
        </Button>
      </div>
      {loan.length === 0 ? (
        <p className="text-[#f1e2e2] text-center my-4">
          Nenhum livro encontrado
        </p>
      ) : (
        <Table>
          <TableCaption className="text-[#f1e2e2] text-sm">
            Você tem {loan.length} empréstimo(s) ativo(s)
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[#f1e2e2]">Livro</TableHead>
              <TableHead className="text-[#f1e2e2]">Mutário</TableHead>
              {!isMobile && (
                <>
                  <TableHead className="text-[#f1e2e2] text-center">
                    Email
                  </TableHead>
                  <TableHead className="text-[#f1e2e2] text-center">
                    Data de Devolução
                  </TableHead>
                  <TableHead className="text-[#f1e2e2] text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-[#f1e2e2] text-center">
                    Condição
                  </TableHead>
                </>
              )}
              <TableHead className="text-[#f1e2e2] text-center">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[#f1e2e2]">
            {loan.map((loan: Loan) => (
              <TableRow key={loan._id} className="hover:bg-transparent">
                <TableCell className="font-medium">{loan.bookName}</TableCell>
                <TableCell>{loan.borrowerName}</TableCell>

                {!isMobile && (
                  <>
                    <TableCell className="text-center">
                      {loan.borrowerEmail}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      {statusLoan[loan.status as keyof typeof statusLoan] ??
                        loan.status}
                    </TableCell>
                    <TableCell className="text-center">
                      {conditionBookMap[
                        loan.bookConditionBefore as keyof typeof conditionBookMap
                      ] ?? loan.bookConditionBefore}
                    </TableCell>
                  </>
                )}

                <TableCell className="text-center">
                  <div className="flex justify-center items-center space-x-3">
                    <Eye
                      size={20}
                      className={`${
                        isLoading
                          ? "opacity-50"
                          : "cursor-pointer hover:text-[#BD8D4C] transition-colors"
                      }`}
                      onClick={() => handleReturnAction(loan)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default Loans;
