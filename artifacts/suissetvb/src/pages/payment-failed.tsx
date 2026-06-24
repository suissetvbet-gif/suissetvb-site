import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentFailed() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center border border-destructive/20 bg-card p-10 shadow-2xl">
        <XCircle className="mx-auto h-20 w-20 text-destructive mb-6" />
        <h1 className="text-3xl font-serif text-foreground mb-4">Paiement Échoué</h1>
        <p className="text-muted-foreground mb-8">
          Une erreur est survenue lors de votre transaction. Aucun montant n'a été débité. Veuillez réessayer ou contacter notre support.
        </p>
        <div className="flex flex-col gap-4">
          <Button onClick={() => setLocation("/wheelbet")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
            Réessayer
          </Button>
          <Button variant="outline" onClick={() => window.open('https://t.me/suissetvb')} className="w-full border-border rounded-none hover:text-primary">
            Contacter le support
          </Button>
        </div>
      </div>
    </div>
  );
}
