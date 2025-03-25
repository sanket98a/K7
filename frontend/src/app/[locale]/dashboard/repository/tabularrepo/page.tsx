'use client'
import CreateEditDocumentModal from "@/components/Repository/CreateEditDocument"
import DocumentTable from "@/components/Repository/document-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { deleteTabularService, tabularFetchService } from "@/lib/auth"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowUpFromLine,  RefreshCw,  Search } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"


export default function TabularDocumentRepo() {
  const t = useTranslations("repositories.tabular")
  const TabularPageHeaders = t.raw("tableHeaders")
  const locale = useLocale()
  const isArabic = locale === 'ar'
  return (
    <div className="container mx-auto max-w-4xl md:max-w-6xl py-10" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex justify-between  gap-2 items-center mb-6">
        <h1 className={`text-3xl font-bold text-blue-500 ${isArabic ? 'text-5xl font-notoNaskhArabic' : 'font-poppins'}`} dir={isArabic ? 'rtl' : 'ltr'}>
          {t("title")}
        </h1>
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-500 text-muted-foreground" />
          <Input 
            placeholder={t("search")} 
            className={`pl-8 border-blue-600 border-2 ${isArabic ? 'text-[120%] font-notoNaskhArabic' : 'font-poppins'}`}
            dir={isArabic ? 'rtl' : 'ltr'}
          />
        </div>
      </div>
     
        <CreateEditDocumentModal isTabular={true}>
          <Button className={`bg-blue-500 hover:bg-blue-400 text-white hover:text-white transition-all ease-in mb-4 ${isArabic ? 'text-[120%] font-notoNaskhArabic' : 'font-poppins'}`}>
            <ArrowUpFromLine className="h-4 w-4" />{t("upload")}
          </Button>
        </CreateEditDocumentModal>
  
     
      <div className="p-2 bg-white mt-4  border-blue-500 border-l-2 rounded-md ">
        <DocumentTable tableHeaders={TabularPageHeaders} fetchFunction={tabularFetchService} deleteFunction={deleteTabularService} queryKey="TabularDocuments"/>
      </div>
 
    </div>
  )
}

