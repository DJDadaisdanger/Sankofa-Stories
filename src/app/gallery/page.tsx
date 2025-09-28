import { GalleryClientView } from "@/components/GalleryClientView";

export default function GalleryPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight">
                    Your Saved Creations
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    A collection of the tales and verses you've woven from the spirit of the Outback.
                </p>
            </div>
            <GalleryClientView />
        </div>
    );
}
