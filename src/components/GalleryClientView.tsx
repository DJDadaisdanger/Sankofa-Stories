'use client';

import { useLocalStorage } from "@/hooks/use-local-storage";
import { SavedItem } from "@/lib/types";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { format, parseISO } from 'date-fns';
import { Check, Copy, Trash2, Home, BookOpen, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function SavedItemCard({ item, onDelete }: { item: SavedItem, onDelete: (id: string) => void }) {
    const { toast } = useToast();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(item.content);
        setIsCopied(true);
        toast({ title: 'Copied to clipboard!' });
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="capitalize flex items-center gap-2">
                           {item.type === 'story' ? <BookOpen className="h-5 w-5"/> : <Sparkles className="h-5 w-5"/>}
                           {item.type}
                        </CardTitle>
                        <CardDescription>Theme: {item.theme}</CardDescription>
                    </div>
                    <div className="text-xs text-muted-foreground pt-1">
                        {format(parseISO(item.createdAt), 'MMM d, yyyy')}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed line-clamp-6">{item.content}</p>
            </CardContent>
            <CardFooter className="gap-2">
                <Button onClick={handleCopy} variant="outline" size="sm">
                    {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                    {isCopied ? 'Copied' : 'Copy'}
                </Button>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this {item.type} from your gallery.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    )
}

export function GalleryClientView() {
    const [gallery, setGallery] = useLocalStorage<SavedItem[]>('sankofa-gallery', []);

    const handleDelete = (id: string) => {
        setGallery(gallery.filter(item => item.id !== id));
        toast({
            title: 'Item deleted',
            description: 'Your creation has been removed from the gallery.',
        });
    };
    
    if (gallery.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h2 className="text-2xl font-semibold mb-2">Your Gallery is Empty</h2>
                <p className="text-muted-foreground mb-6">Go create some magic to see it here.</p>
                <Button asChild>
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Creation
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map(item => (
                <SavedItemCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
        </div>
    )
}
