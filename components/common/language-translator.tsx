"use client"

import { useState } from "react"
import { Globe, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

type Language = {
  code: string
  name: string
  nativeName: string
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
]

export default function LanguageTranslator() {
  const { toast } = useToast()
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])
  const [isTranslating, setIsTranslating] = useState(false)

  const translatePage = async (targetLanguage: Language) => {
    if (targetLanguage.code === currentLanguage.code) return

    setIsTranslating(true)
    try {
      // Get all visible text elements on the page
      const textElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, button, a, label")

      // For each text element, translate its content
      for (const element of Array.from(textElements)) {
        const text = element.textContent?.trim()
        if (text && text.length > 1 && !/^\d+$/.test(text)) {
          try {
            const { text: translatedText } = await generateText({
              model: groq("llama3-8b-8192"),
              prompt: `Translate the following text from ${currentLanguage.name} to ${targetLanguage.name}. Only return the translated text, nothing else: "${text}"`,
            })

            if (translatedText && element.textContent) {
              element.textContent = translatedText
            }
          } catch (error) {
            console.error("Translation error:", error)
          }
        }
      }

      setCurrentLanguage(targetLanguage)
      toast({
        title: "Language changed",
        description: `The page has been translated to ${targetLanguage.name}`,
      })
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation failed",
        description: "There was an error translating the page. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  // Function to directly translate to Hindi
  const translateToHindi = () => {
    const hindiLanguage = languages.find((lang) => lang.code === "hi")
    if (hindiLanguage) {
      translatePage(hindiLanguage)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Direct Hindi translation button */}
      <Button
        variant="outline"
        onClick={translateToHindi}
        disabled={isTranslating || currentLanguage.code === "hi"}
        className="text-sm"
      >
        हिन्दी
      </Button>

      {/* Language dropdown for other languages */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Globe className="h-[1.2rem] w-[1.2rem]" />
            {isTranslating && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => translatePage(language)}
              className="flex items-center justify-between"
              disabled={isTranslating || currentLanguage.code === language.code}
            >
              <span>
                {language.name} <span className="text-xs text-muted-foreground">({language.nativeName})</span>
              </span>
              {currentLanguage.code === language.code && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
