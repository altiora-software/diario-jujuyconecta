'use client';

import { useState } from "react";
import { Play, Pause, Volume2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-news-border shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Play controls */}
          <div className="flex items-center space-x-3">
            <Button
              size="icon"
              variant="default"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-10 w-10 rounded-full bg-primary hover:bg-news-hover"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">Radio en Vivo</p>
              <p className="text-xs text-text-secondary">
                {isPlaying ? "Al aire ahora" : "Fuera del aire"}
              </p>
            </div>
          </div>

          {/* Program info */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            <div className="text-center">
              <p className="text-sm font-medium">Programa Matutino</p>
              <p className="text-xs text-text-secondary">Con María González • 08:00 - 12:00</p>
            </div>
          </div>

          {/* Volume & expand */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
            <Link href="/radio">
              <Button variant="ghost" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
