import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs";
import { DropBox } from "@/components/drop-box";
import type { FeatureCreateDTO } from "@/types/dto";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { createFeatureSchema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Textarea } from "@/shared/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface CreateFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FeatureCreateDTO) => Promise<void>;
  onBulkSubmit?: (file: File) => void;
}

const CreateFeatureDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onBulkSubmit,
}: CreateFeatureDialogProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const form = useForm<FeatureCreateDTO>({
    resolver: yupResolver(createFeatureSchema),
  });

  const handleSubmitAndReset = async (data: FeatureCreateDTO) => {
    await onSubmit(data);
    form.reset();
  };

  const handleCsvUpload = (files: FileList) => {
    const file = files[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      toast.error("Please upload a valid CSV file.");
    }
  };

  const handleBulkSubmit = () => {
    if (csvFile && onBulkSubmit) {
      // Pass the file directly to the endpoint
      onBulkSubmit(csvFile);
      setCsvFile(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[95%] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Create New Feature</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Feature</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload (CSV)</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <Form {...form}>
              <form
           
                onSubmit={form.handleSubmit(handleSubmitAndReset)}
           
                className="space-y-8"
          
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Feature Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Feature Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="bulk">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Upload CSV File</h3>
                <p className="text-sm text-gray-600 mb-4">
                  CSV file should contain "title" and "description" columns.
                </p>
                <DropBox
                  onFileUpload={handleCsvUpload}
                  acceptedFileTypes=".csv"
                  multiple={false}
                  maxFileSize={5}
                />
              </div>

              <div className="flex justify-center">
                <Button onClick={handleBulkSubmit} disabled={!csvFile}>
                  {csvFile ? `Upload CSV File` : "Upload CSV File"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFeatureDialog;
