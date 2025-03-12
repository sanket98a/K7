import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTableService } from "@/hooks/use-table";
import { tabularDropDownFetchService } from "@/lib/auth";
import { useTranslations } from "next-intl";

interface TabularDropDownProps {
  setSelectedFile: (file: string) => void;
}

export const TabularDropDown = ({ setSelectedFile }: TabularDropDownProps) => {
  const { data} = useTableService({
    fetchService: tabularDropDownFetchService,
    queryKey: "TabularDropDown",
  });
  const t = useTranslations("chat.input")

  return (
    <Select onValueChange={setSelectedFile}>
      <SelectTrigger className="w-fit rounded-full bg-white focus:outline-blue-500 border-blue-400 ">
      <SelectValue placeholder={t("chooseFile")} />
      </SelectTrigger>
      <SelectContent>
        {data?.map((item: string, index: number) => (
              <SelectItem key={index} value={item}>
                {item}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  );
};
