'use client'
import CreateEditDocumentModal from "@/components/Repository/CreateEditDocument"
import DocumentTable from "@/components/Repository/document-table"
import DocumentRow from "@/components/Repository/DocumentRow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteDocumentService, documentFetchService } from "@/lib/auth"
import { ArrowUpFromLine, PlusCircle, Search } from "lucide-react"


export default function DocumentManagement() {
  const DocumentPageHeaders = ["Document Name", "Type","Status", "Upload Date", "Actions"]
  return (
    <div className="container mx-auto max-w-4xl md:max-w-6xl py-10">
      <div className="flex justify-between  gap-2 items-center mb-6">
      <h1 className="text-3xl font-bold  text-blue-500">All Documents</h1>
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-500 text-muted-foreground" />
          <Input placeholder="Search documents" className="pl-8 border-blue-600 border-2" />
        </div>
      </div>
        <CreateEditDocumentModal>
          <Button className="bg-blue-500 hover:bg-blue-400 text-white hover:text-white transition-all ease-in mb-4">
          <ArrowUpFromLine className="h-4 w-4" />Upload Document
          </Button>
        </CreateEditDocumentModal>
      <div className="p-2 bg-white mt-4  border-blue-500 border-l-2 rounded-md ">
      <DocumentTable tableHeaders={DocumentPageHeaders} fetchFunction={documentFetchService} queryKey="chatDocuments" deleteFunction={deleteDocumentService}/>
      </div>
 
    </div>
  )
}

