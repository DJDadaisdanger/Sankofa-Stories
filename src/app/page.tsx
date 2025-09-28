import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneratorClient } from "@/components/GeneratorClient"
import { BookOpen, Sparkles } from "lucide-react"

export default function GeneratePage() {
  return (
    <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
          Outback Creations
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Weave tales and verses inspired by the heart of Australia. Choose your theme, and let our AI storyteller bring the Outback to life.
        </p>
      </div>
      
      <Tabs defaultValue="story" className="w-full max-w-3xl">
        <TabsList className="grid w-full grid-cols-2 bg-card border">
          <TabsTrigger value="story">
            <BookOpen className="mr-2 h-4 w-4" />
            Story
          </TabsTrigger>
          <TabsTrigger value="poem">
            <Sparkles className="mr-2 h-4 w-4" />
            Poem
          </TabsTrigger>
        </TabsList>
        <TabsContent value="story" className="mt-6">
          <GeneratorClient type="story" />
        </TabsContent>
        <TabsContent value="poem" className="mt-6">
          <GeneratorClient type="poem" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
