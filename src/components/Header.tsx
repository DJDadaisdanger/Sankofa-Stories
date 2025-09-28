import Link from 'next/link';
import { Feather, GalleryHorizontal } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              Sankofa Stories
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
                <Button variant="ghost" asChild>
                    <Link href="/gallery">
                        <GalleryHorizontal className="h-5 w-5 mr-2" />
                        Gallery
                    </Link>
                </Button>
            </nav>
        </div>
      </div>
    </header>
  );
}
