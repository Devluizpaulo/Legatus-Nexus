import { Logo } from "@/components/layout/logo";
import { Card } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authBgImage = PlaceHolderImages.find(p => p.id === 'hero');
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-secondary/50 dark:bg-background">
       {authBgImage && (
            <div className="absolute inset-0 -z-10 opacity-5">
                 <Image
                    src={authBgImage.imageUrl}
                    alt={authBgImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={authBgImage.imageHint}
                />
            </div>
          )}
      <Card className="w-full max-w-md p-6 md:p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
            <Logo />
        </div>
        {children}
      </Card>
    </main>
  );
}
