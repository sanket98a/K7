import { Button } from "./ui/button"

const examples = [
    {
      "exampleText": "📄 Summarize my document",
      "prompt": "Can you generate a concise summary of my uploaded document?"
    },
    {
      "exampleText": "📝 Create a LinkedIn post",
      "prompt": "Help me create a LinkedIn post based on my recent uploaded content."
    },
    {
      "exampleText": "📅 Weekly project update",
      "prompt": "Summarize the key progress points from my documents uploaded this week."
    },
    {
      "exampleText": "💡 Brainstorm content ideas",
      "prompt": "Can you suggest blog post ideas based on my recent documents?"
    },
    {
      "exampleText": "🗂️ Organize my notes",
      "prompt": "Can you categorize and structure my notes from the uploaded documents?"
    },
    {
      "exampleText": "🖊️ Rewrite professionally",
      "prompt": "Can you refine and rewrite this document to sound more professional?"
    }
  ]
  
const Examples = () => {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-3xl   mt-6  mx-auto ">
    <div className="suggestions flex flex-wrap gap-2 justify-center ">
      {examples.map((query, index) => (
        <Button
          key={index}
        
          className=" rounded-full bg-white/20 text-slate-700 hover:bg-gray-900/50 transition-colors text-sm backdrop-blur-sm border border-blue-500"
        >
          <span>{query.exampleText}</span>
          {/* <ArrowUpRight className="text-cyan-400"/> */}
        </Button>
      ))}
    </div></div>
  )
}

export default Examples