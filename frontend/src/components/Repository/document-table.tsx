'use client'
import { useTableService } from "@/hooks/use-table";

import { Table, TableHeader, TableBody, TableRow, TableHead } from "../ui/table";
import DocumentRow from "./DocumentRow";
import { Skeleton } from "../ui/skeleton";
import { Document } from "@/types";
import { useLocale } from "next-intl";
interface DocumentTableProps {
  fetchFunction: (email: string, token: number) => Promise<any>; 
  deleteFunction: (id: string, token: number) => Promise<any>;  
  queryKey: string;  
  tableHeaders: string[];
}

const DocumentTable = ({fetchFunction,deleteFunction,queryKey,tableHeaders}:DocumentTableProps) => {
  const { data, isLoading, deleteMutation } = useTableService({
    fetchService: fetchFunction,
    deleteService: deleteFunction,
    queryKey: queryKey,
  });
  const locale = useLocale();

  if (isLoading) {
    return Array.from({ length: 3 }).map((_, index) => (
      <Skeleton key={index} className="h-12 w-full mb-2" />
    ));
  }

  return (
    <Table >
      <TableHeader>
        <TableRow  className="text-xs md:text-base">
          {tableHeaders.map((header,index) => (
            <TableHead className={`${locale === "ar" ? "text-right text-[130%]" : "text-left"}`} key={index}>{header}</TableHead>
          ))}
       
        </TableRow>
      </TableHeader>
      <TableBody className="text-xs md:text-base">
        {data?.map((doc: Document) => (
          <DocumentRow
            key={doc.id}
            id={doc.id}
            status={doc.status} 
            name={doc.file_name}
            type={doc.category_id || doc.table_name}
            uploadDate={doc.uploaded_at}
            onDelete={() => deleteMutation.mutate(doc.id)}
          />
        ))}
      </TableBody>
    </Table>
  );
};
export default DocumentTable;
