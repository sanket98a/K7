import { AlertCircle } from "lucide-react"; // Importing an error icon

export const AuthErrorMessage = ({ messages }: { messages: string[] }) => {
  if (!messages || messages.length === 0) return null;

  return (
    <div className=" mt-2">
      <div className="flex items-center gap-2">
        <div className=" w-full">
          {messages.map((msg, index) => (
              <p key={index} className="text-sm mb-1 w-full flex gap-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-500" />
              {msg}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
