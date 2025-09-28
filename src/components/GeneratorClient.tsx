
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2 } from 'lucide-react';

import { generateOutbackStory, GenerateOutbackStoryOutput } from '@/ai/flows/generate-outback-story';
import { generateOutbackPoem, GenerateOutbackPoemOutput } from '@/ai/flows/generate-outback-poem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ResultCard } from '@/components/ResultCard';
import { useToast } from '@/hooks/use-toast';

interface GeneratorClientProps {
  type: 'story' | 'poem';
}

const outbackThemes = [
  "A drover's life",
  'Sunset over Uluru',
  'The legend of the Bunyip',
  'A journey through the bush',
  'Finding a hidden billabong',
];

const FormSchema = z.object({
  theme: z.string().min(1, 'Please select or enter a theme.'),
  customTheme: z.string().optional(),
  customPrompt: z.string().optional(),
  useSlang: z.boolean(),
}).refine(data => data.theme !== 'custom' || (data.customTheme && data.customTheme.length > 0), {
  message: 'Please enter a custom theme.',
  path: ['customTheme'],
});

export function GeneratorClient({ type }: GeneratorClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateOutbackStoryOutput | GenerateOutbackPoemOutput | null>(null);
  const [resultTheme, setResultTheme] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      theme: '',
      customTheme: '',
      customPrompt: '',
      useSlang: true,
    },
  });

  const themeValue = form.watch('theme');

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);

    const finalTheme = data.theme === 'custom' ? data.customTheme! : data.theme;
    setResultTheme(finalTheme);
    
    try {
      const generationFunction = type === 'story' ? generateOutbackStory : generateOutbackPoem;
      const response = await generationFunction({
        theme: finalTheme,
        customPrompt: data.customPrompt,
        useSlang: data.useSlang,
      });
      setResult(response);
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: `Failed to generate your ${type}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a new {type}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an Outback theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {outbackThemes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom...</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {themeValue === 'custom' && (
                <FormField
                  control={form.control}
                  name="customTheme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Theme</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., A kangaroo boxing match" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="customPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Prompt (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Further guide the ${type} generation... e.g., "Make it a humorous ${type}."`}
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      Add any specific details or instructions for the AI.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="useSlang"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Use Aussie Slang</FormLabel>
                      <FormDescription>
                        Incorporate colloquial Aussie slang where appropriate.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                 <Wand2 className="mr-2 h-4 w-4" />
                Generate {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating your {type}...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {result && !isLoading && (
        <ResultCard
          content={type === 'story' ? (result as GenerateOutbackStoryOutput).story : (result as GenerateOutbackPoemOutput).poem}
          theme={resultTheme}
          type={type}
        />
      )}
    </div>
  );
}
