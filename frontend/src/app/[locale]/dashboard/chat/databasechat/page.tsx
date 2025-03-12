import { useTranslations } from "next-intl"


const DatabaseChat = () => {
  const t = useTranslations('development')
  
  return (
    <section className="h-full w-full mx-auto mt-20">
      Database Chat
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-poppins text-blue-500 font-semibold">
          {t('title')}
        </h1>
        <p className="text-blue-400 mt-2">
          {t('message')}
        </p>
      </div>
    </section>
  )
  }
  
  export default DatabaseChat