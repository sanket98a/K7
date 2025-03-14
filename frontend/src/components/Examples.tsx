import { Button } from "./ui/button"
import { useTranslations } from "next-intl"

const Examples = () => {
  const t = useTranslations('examples')
  
  const examples = [
    {
      "exampleText": t('document'),
      "prompt": t('documentPrompt')
    },
    {
      "exampleText": t('linkedin'),
      "prompt": t('linkedinPrompt')
    },
    {
      "exampleText": t('project'),
      "prompt": t('projectPrompt')
    },
    {
      "exampleText": t('brainstorm'),
      "prompt": t('brainstormPrompt')
    },
    {
      "exampleText": t('notes'),
      "prompt": t('notesPrompt')
    },
    {
      "exampleText": t('rewrite'),
      "prompt": t('rewritePrompt')
    }
  ]
  
  return (
    <div className="flex flex-wrap gap-2 justify-center w-full md:max-w-3xl mt-6 mx-auto">
      <div className="suggestions flex flex-wrap gap-2 justify-center">
        {examples.map((query, index) => (
          <Button
            key={index}
            className="rounded-full bg-white/20 text-slate-700 hover:bg-gray-900/50 transition-colors text-xs md:text-base px-2 md:px-4 backdrop-blur-sm border border-blue-500"
          >
            <span>{query.exampleText}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default Examples