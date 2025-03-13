import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import {  MoreHorizontal, Trash } from "lucide-react"
import { useTranslations } from "next-intl"


interface DocumentRowProps {
  name?: string
  type?: string
  uploadDate?: string,
  status?: 1 | 0,
  onDelete?: () => void
  id?: string
}

export default function DocumentRow({ name, type, uploadDate,onDelete,id,status }: DocumentRowProps) {
  const t = useTranslations("repositories.document")
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{type}</TableCell>
      
      { status !== undefined && (
  <TableCell>
    {status === 1 ? (
      <span className="bg-green-500 text-white px-2 py-1 rounded-full">{t("completed")}</span>
    ) : (
      <span className="bg-red-500 text-white px-2 py-1 rounded-full">{t("inProgress")}</span>
    )}
  </TableCell>
)}
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
              <Button onClick={onDelete} variant="ghost" className="w-full justify-start text-red-500">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

