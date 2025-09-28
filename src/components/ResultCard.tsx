
'use client';

import { Check, Copy, Save } from 'lucide-react';
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { SavedItem } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ResultCardProps {
  content: string;
  theme: string;
  type: 'story' | 'poem';
  imageUrl?: string;
}

export function ResultCard({ content, theme, type, imageUrl }: ResultCardProps) {
  const { toast } = useToast();
  const [gallery, setGallery] = useLocalStorage<SavedItem[]>('sankofa-gallery', []);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    toast({
      title: 'Copied to clipboard!',
      description: `Your ${type} has been copied.`,
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveToGallery = () => {
    const newItem: SavedItem = {
      id: new Date().toISOString(),
      type,
      theme,
      content,
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    setGallery([newItem, ...gallery]);
    toast({
      title: 'Saved to Gallery!',
      description: `Your ${type} about "${theme}" has been saved.`,
    });
  };

  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-5 duration-500">
      <CardHeader>
        <CardTitle>Your {type}</CardTitle>
        <CardDescription>Based on the theme: "{theme}"</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {imageUrl && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                <Image src={imageUrl} alt={`Illustration for ${theme}`} fill className="object-cover" />
            </div>
        )}
        <p className={`whitespace-pre-wrap text-foreground/90 leading-relaxed ${type === 'poem' ? 'text-center' : ''}`}>{content}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button onClick={handleCopyToClipboard} variant="outline">
          {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {isCopied ? 'Copied' : 'Copy'}
        </Button>
        <Button onClick={handleSaveToGallery}>
          <Save className="mr-2 h-4 w-4" />
          Save to Gallery
        </Button>
      </CardFooter>
    </Card>
  );
}
