import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Share, Trash } from "lucide-react"


import CreateEditDocumentModal from "./CreateEditDocument"
import ShareDocumentModal from "./ShareDocument"

interface DocumentRowProps {
  name: string
  type: string
  uploadDate: string
}

export default function DocumentRow({ name, type, uploadDate }: DocumentRowProps) {
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>{uploadDate}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem>
              <Button variant="ghost" className="w-full justify-start">
                <Edit className="mr-2 h-4 w-4" /> View
              </Button>
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem>
              <CreateEditDocumentModal isEditing={true} documentName={name}>
                <Button variant="ghost" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </CreateEditDocumentModal>
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem>
              <ShareDocumentModal documentName={name}>
                <Button variant="ghost" className="w-full justify-start">
                  <Share className="mr-2 h-4 w-4" /> Share
                </Button>
              </ShareDocumentModal>
            </DropdownMenuItem> */}
            <DropdownMenuItem>
              <Button variant="ghost" className="w-full justify-start text-red-500">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

