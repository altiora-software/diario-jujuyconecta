"use client";

import { useState } from "react";
import { programas } from "@/data/mockData";
import { Play, Pause, Volume2, Radio as RadioIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type { Metadata } from "next";


const RadioPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number[]>([70]);
  const programaActual = programas[0];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Player principal */}
        <section className="mb-12">
          <Card className="overflow-hidden border-news-border">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Cover */}
                <div className="relative h-80 lg:h-96 bg-gradient-to-br from-primary to-news-hover">
                  <img
                    src={programaActual.cover_url}
                    alt={programaActual.nombre}
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="icon"
                      type="button"
                      onClick={() => setIsPlaying((prev) => !prev)}
                      className="h-24 w-24 rounded-full bg-primary-foreground hover:bg-secondary"
                    >
                      {isPlaying ? (
                        <Pause className="h-12 w-12 text-primary" />
                      ) : (
                        <Play className="h-12 w-12 ml-2 text-primary" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-8 flex flex-col justify-center bg-card">
                  <div className="flex items-center space-x-2 mb-4">
                    <RadioIcon className="h-5 w-5 text-primary animate-pulse" />
                    <span className="text-sm font-semibold text-primary">
                      {isPlaying ? "EN VIVO AHORA" : "FUERA DEL AIRE"}
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold mb-4">
                    {programaActual.nombre}
                  </h1>

                  <p className="text-lg text-text-secondary mb-6">
                    Con {programaActual.conductor}
                  </p>

                  <p className="text-text-muted mb-6">
                    {programaActual.descripcion}
                  </p>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">Horario:</span>
                    <span className="text-sm text-text-secondary">
                      {programaActual.horario}
                    </span>
                  </div>

                  {/* Control de volumen */}
                  <div className="mt-8 flex items-center space-x-4">
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-text-muted w-12 text-right">
                      {volume[0]}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Grilla de programas */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-primary">
            Programación
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programas.map((programa) => (
              <Card
                key={programa.id}
                className="overflow-hidden card-hover border-news-border"
              >
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <img
                      src={programa.cover_url}
                      alt={programa.nombre}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {programa.nombre}
                      </h3>
                      <p className="text-sm text-white/90">
                        {programa.horario}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium mb-2">
                      Con {programa.conductor}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {programa.descripcion}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Info técnica */}
        <section className="mt-12 bg-card border border-news-border rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Cómo Escucharnos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">📻 Frecuencia FM</h4>
              <p className="text-text-secondary">FM 100.5 MHz</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🌐 Streaming Online</h4>
              <p className="text-text-secondary">Disponible 24/7</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📱 App Móvil</h4>
              <p className="text-text-secondary">iOS y Android</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RadioPage;
