
'use client';

import { useLocalStorage } from "@/hooks/use-local-storage";
import { SavedItem } from "@/lib/types";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { format, parseISO } from 'date-fns';
import { Check, Copy, Trash2, Home, BookOpen, Sparkles, FileText } from "lucide-react";
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
import { ScrollArea } from "./ui/scroll-area";

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
                           {item.theme}
                        </CardTitle>
                        <CardDescription>A {item.type} created on {format(parseISO(item.createdAt), 'MMM d, yyyy')}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed line-clamp-4">{item.content}</p>
            </CardContent>
            <CardFooter className="gap-2">
                 <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary">
                            <FileText className="mr-2 h-4 w-4"/>
                            Read More
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="capitalize">{item.theme}</DialogTitle>
                            <DialogDescription>
                                A {item.type} created on {format(parseISO(item.createdAt), 'MMM d, yyyy')}
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh] pr-6">
                           <div className="flex flex-col gap-4">
                            <p className={`whitespace-pre-wrap text-foreground/90 leading-relaxed ${item.type === 'poem' ? 'text-center' : ''}`}>{item.content}</p>
                           </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>

                <Button onClick={handleCopy} variant="outline" size="icon" aria-label="Copy content">
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" aria-label="Delete item">
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
            {gallery.sort((a,b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime()).map(item => (
                <SavedItemCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
        </div>
    )
}
