"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

import loginBg from "@/assets/login-bg.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: error.message,
      });
      return;
    }

    toast({
      title: "¡Bienvenido de nuevo!",
      description: "Accediendo a la redacción digital.",
    });

    router.push("/admin");
  };

  const inputStyles = "bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-slate-600 h-12 transition-all";

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#020817]">
      {/* Columna formulario */}
      <div className="flex flex-col justify-center px-8 py-12 lg:px-24 animate-fade-in relative z-10">
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al diario
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <div className="h-12 w-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-primary h-6 w-6" />
            </div>
            <h1 className="text-4xl font-black mb-3 text-white tracking-tighter italic uppercase">
              Newsroom <span className="text-primary">Login</span>
            </h1>
            <p className="text-slate-400 font-medium">
              Ingresa tus credenciales para gestionar el contenido de Jujuy Conecta.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="periodista@jujuyconecta.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className={inputStyles}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">
                  Contraseña
                </Label>
                <Link
                  href="#"
                  className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-primary/80 transition-colors"
                >
                  ¿Olvidaste el acceso?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                disabled={loading}
                className={inputStyles}
              />
            </div>

            <div className="flex items-center space-x-3 ml-1">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked: any) =>
                  setRemember(Boolean(checked))
                }
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-black"
              />
              <label
                htmlFor="remember"
                className="text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none"
              >
                Mantener sesión iniciada
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest py-6 h-auto transition-all shadow-lg shadow-primary/10 group" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Entrar a la redacción"
              )}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-slate-500 font-medium">
              ¿Eres nuevo colaborador?{" "}
              <Link
                href="/signup"
                className="font-bold text-primary hover:underline underline-offset-4"
              >
                Solicitar acceso
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Columna imagen / ilustración */}
      <div className="hidden lg:block relative overflow-hidden">
        <Image
          src={loginBg}
          alt="Redacción Jujuy Conecta"
          fill
          priority
          className="object-cover scale-105"
          sizes="50vw"
        />
        {/* Overlay sofisticado */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/40 to-transparent flex items-end p-20">
          <div className="max-w-lg animate-scale-in">
            <div className="h-1 w-12 bg-primary mb-6" />
            <h2 className="text-5xl font-black text-white mb-6 leading-none italic uppercase tracking-tighter">
              La noticia <br />
              <span className="text-primary underline decoration-white/20 underline-offset-8">no se detiene.</span>
            </h2>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              Herramientas de gestión editorial de última generación para el diario digital más importante de la provincia.
            </p>
          </div>
        </div>
        
        {/* Efecto de cristal sutil en el borde */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}