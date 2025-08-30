import NavBar from "@/components/nav-bar";
import { Button } from "@/shared/ui/button";
import { Plus, BookOpen, Upload } from "lucide-react";
import Pagination from "@/components/pagination";
import { useState } from "react";
import {
  useCreateTerminologyMutation,
  useGetAllTerminologiesQuery,
  useImportTerminologiesFromCsvMutation,
  useDeleteTerminologyByIdMutation,
} from "@/lib/api/terminology-api/query";
import type { TerminologyCreateDTO, TerminologyDTO } from "@/types/dto";
import TerminologiesTable from "./terminologies-table";
import { Input } from "@/shared/ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createTerminologySchema } from "./schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { DropBox } from "@/components/drop-box";
import { toast } from "sonner";

const TerminologyPage = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const { data: terminologies = [], isLoading } = useGetAllTerminologiesQuery();

  const { mutateAsync: createTerminology } = useCreateTerminologyMutation();
  const { mutateAsync: importTerminologiesFromCsv } = useImportTerminologiesFromCsvMutation();
  const { mutateAsync: deleteTerminologyById } = useDeleteTerminologyByIdMutation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Calculate paginated data
  const totalPages = Math.ceil(terminologies.length / rowsPerPage);
  const paginatedData = terminologies.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const form = useForm<TerminologyCreateDTO>({
    resolver: yupResolver(createTerminologySchema),
    defaultValues: {
      key: "",
      value: "",
    },
  });

  const handleCreateTerminology = async (data: TerminologyCreateDTO) => {
    await createTerminology(data);
    form.reset();
  };

  const handleDeleteTerminology = async (terminology: TerminologyDTO) => {
    await deleteTerminologyById(terminology.id);
  };

  const handleCsvUpload = (files: FileList) => {
    const file = files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      toast.error("Please upload a valid CSV file.");
    }
  };

  const handleBulkUpload = async () => {
    if (csvFile) {
      await importTerminologiesFromCsv(csvFile);
      setCsvFile(null);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-bold">Terminologies</h1>
                <p className="text-lg opacity-90">
                  Manage terminology key-value pairs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Form */}
        <div className="container mx-auto px-4 py-6 border-b">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Terminology
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateTerminology)}
                className="flex gap-4 items-end"
              >
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add</Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Bulk Upload Section */}
        <div className="container mx-auto px-4 py-6 border-b">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Bulk Upload CSV
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              CSV file should contain "key" and "value" columns.
            </p>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <DropBox
                  onFileUpload={handleCsvUpload}
                  acceptedFileTypes=".csv"
                  multiple={false}
                  maxFileSize={5}
                />
              </div>
              <Button onClick={handleBulkUpload} disabled={!csvFile}>
                {csvFile ? `Upload ${csvFile.name}` : "Select CSV File"}
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">
            All Terminologies ({terminologies.length})
          </h2>
          <TerminologiesTable
            terminologies={paginatedData}
            onDeleteTerminology={handleDeleteTerminology}
            isLoading={isLoading}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default TerminologyPage;