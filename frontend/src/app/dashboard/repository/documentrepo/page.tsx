import CreateEditDocumentModal from "@/components/Repository/CreateEditDocument"
import DocumentRow from "@/components/Repository/DocumentRow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpFromLine, PlusCircle, Search } from "lucide-react"


export default function DocumentManagement() {
  return (
    <div className="container mx-auto max-w-4xl md:max-w-6xl py-10">
      <div className="flex justify-between  gap-2 items-center mb-6">
      <h1 className="text-3xl font-bold  text-blue-500">All Documents</h1>
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-600 text-muted-foreground" />
          <Input placeholder="Search documents" className="pl-8 border-blue-500 border-2" />
        </div>
      </div>
        <CreateEditDocumentModal>
          <Button className="bg-blue-600 hover:bg-blue-400 text-white hover:text-white transition-all ease-in mb-4">
          <ArrowUpFromLine className="h-4 w-4" />Upload Document
          </Button>
        </CreateEditDocumentModal>
      <div className="p-2 bg-white mt-4  border-blue-500 border-l-2 rounded-md ">
      <Table className="">
        <TableHeader className="">
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <DocumentRow  name="Project Proposal" type="PDF" uploadDate="2023-06-15" />
          <DocumentRow name="Meeting Minutes" type="DOCX" uploadDate="2023-06-14" />
          <DocumentRow name="Financial Report" type="XLSX" uploadDate="2023-06-13" />
        </TableBody>
      </Table>
      </div>
    </div>
  )
}

