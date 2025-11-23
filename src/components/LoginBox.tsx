import { useState } from "react";
import { signIn, signUp, signOut, getUser } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginBox() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const on = (fn: () => Promise<any>) => async () => {
    try {
      await fn();
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Acceso</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="grid gap-1">
          <Label>Email</Label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@..."
          />
        </div>
        <div className="grid gap-1">
          <Label>Clave</Label>
          <Input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="mín. 6 caracteres"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={on(() => signUp(email, pass))} variant="secondary">
            Crear cuenta
          </Button>
          <Button onClick={on(() => signIn(email, pass))}>
            Iniciar sesión
          </Button>
          <Button onClick={on(signOut)} variant="outline">
            Salir
          </Button>
        </div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      </CardContent>
    </Card>
  );
}
