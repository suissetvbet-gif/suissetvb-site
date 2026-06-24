import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center border border-border bg-card p-10 shadow-2xl">
        <CheckCircle2 className="mx-auto h-20 w-20 text-primary mb-6" />
        <h1 className="text-3xl font-serif text-foreground mb-4">Paiement Confirmé</h1>
        <p className="text-muted-foreground mb-8">
          Votre transaction a été validée avec succès. Votre abonnement est désormais actif. Nos experts vous enverront vos prédictions selon vos préférences.
        </p>
        <Button onClick={() => setLocation("/")} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none">
          Retour au Tableau de bord
        </Button>
      </div>
    </div>
  );
}
