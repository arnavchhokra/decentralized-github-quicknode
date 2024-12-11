import { useState } from "react";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import image from "./image.png"
import Image from "next/image"; // Import Image from next/image


export default function Hero() {
  const [account, setAccount] = useState<string | null>(null);
  const [text, setText] = useState("Connect");
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">We&apos;re live!</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
                Speak Volumes Code Freely
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
               DCNT GIT is a platform that utilizes Peer-to-Peer (P2P) networking to store, retrieve, and manage versioned repositories. 
               </p>
            </div>
            <div className="flex flex-row gap-4">
              <Button
                size="lg"
                className="gap-4"
                disabled={loading}
                onClick={()=>{
                    window.location.href="/Repo/add"
                }}
              >
                {text}
                <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="bg-muted rounded-md aspect-square overflow-hidden flex">
          <Image
              src={image}
              alt="Hero Image"
              objectFit="contain" // Ensures the image covers the div while maintaining its aspect ratio
            />       
          </div>
        </div>
      </div>
    </div>
  );
}