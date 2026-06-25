import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Mapping plan IDs to prices and names
const planDetails: Record<string, { name: string, basePriceEur: number, isVip?: boolean }> = {
  "wheelbet-cote-2": { name: "Wheelbet Cote 2", basePriceEur: 49 },
  "wheelbet-cote-3": { name: "Wheelbet Cote 3", basePriceEur: 35 },
  "wheelbet-cote-6": { name: "Wheelbet Cote 6", basePriceEur: 80 },
  "wheelbet-cote-12-vip": { name: "Wheelbet Cote 12 VIP", basePriceEur: 249, isVip: true },
  "fifa-standard": { name: "FIFA Virtuel Standard", basePriceEur: 39 },
  "fifa-penalty": { name: "FIFA Virtuel Penalty", basePriceEur: 45 },
};

export default function Subscribe() {
  const [match, params] = useRoute("/subscribe/:plan");
  const planId = params?.plan || "";
  const planInfo = planDetails[planId];
  
  const { user, loading } = useAuth();
  const { currency, formatPrice } = useCurrency();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [useDefaultEmail, setUseDefaultEmail] = useState(true);
  const [customEmail, setCustomEmail] = useState("");
  const [receptionTime, setReceptionTime] = useState("12h00");
  const [duration, setDuration] = useState("1");
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [assistantContactMethod, setAssistantContactMethod] = useState("Telegram");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/auth");
    }
  }, [user, loading, setLocation]);

  if (loading || !user) return <LoadingScreen />;
  if (!planInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Plan introuvable.</p>
        <Button onClick={() => setLocation("/")} className="ml-4">Retour</Button>
      </div>
    );
  }

  const durationNum = parseInt(duration, 10);
  let multiplier = durationNum;
  let discount = 0;
  if (durationNum === 2) discount = 0.15;
  if (durationNum === 3) discount = 0.25;

  const finalPriceEur = planInfo.basePriceEur * multiplier * (1 - discount);
  const finalEmail = useDefaultEmail ? user.email : customEmail;

  const handleCryptoPayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError("");

    // Record pending subscription
    const { error: insertError } = await supabase.from("abonnements").insert({
      user_id: user.id,
      jeu: planId.includes("fifa") ? "FIFA" : "Wheelbet",
      type_abonnement: planInfo.name,
      heure_reception: receptionTime,
      email_reception: finalEmail,
      statut: "pending",
      mode_paiement: "Crypto",
      date_debut: new Date().toISOString(),
      // just a placeholder date, technically updated after payment confirmation
      date_expiration: new Date(Date.now() + durationNum * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    if (insertError) {
      console.error("Erreur enregistrement abonnement (crypto):", insertError.message);
    }

    const plisioApiKey = import.meta.env.VITE_PLISIO_API_KEY;
    if (!plisioApiKey) {
      // Fallback for dev if missing
      setLocation("/payment-success");
      return;
    }

    const searchParams = new URLSearchParams({
      source_currency: "EUR",
      source_amount: finalPriceEur.toString(),
      order_name: `${planInfo.name} (${durationNum} mois)`,
      order_number: `stvb-${Date.now()}`,
      callback_url: window.location.origin + "/payment-success",
      success_url: window.location.origin + "/payment-success",
      fail_url: window.location.origin + "/payment-failed",
      email: finalEmail || "",
      api_key: plisioApiKey,
    });

    try {
      const response = await fetch(
        `https://api.plisio.net/api/v1/invoices/new?${searchParams.toString()}`
      );
      const result = await response.json();

      if (result.status === "success" && result.data?.invoice_url) {
        // Redirige vers la vraie page de paiement Plisio
        window.location.href = result.data.invoice_url;
      } else {
        const message =
          result.data?.message || "Une erreur est survenue lors de la création du paiement.";
        setPaymentError(message);
        setIsProcessingPayment(false);
      }
    } catch (err) {
      console.error("Erreur appel API Plisio:", err);
      setPaymentError("Impossible de contacter le service de paiement. Veuillez réessayer.");
      setIsProcessingPayment(false);
    }
  };

  const handleAssistantPayment = async () => {
    const { error: insertError } = await supabase.from("abonnements").insert({
      user_id: user.id,
      jeu: planId.includes("fifa") ? "FIFA" : "Wheelbet",
      type_abonnement: planInfo.name,
      heure_reception: receptionTime,
      email_reception: finalEmail,
      statut: "pending",
      mode_paiement: "Assistant",
      date_debut: new Date().toISOString(),
      date_expiration: new Date(Date.now() + durationNum * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    if (insertError) {
      console.error("Erreur enregistrement abonnement (assistant):", insertError.message);
    }

    window.open("https://t.me/suissetvb", "_blank");
    setIsAssistantModalOpen(false);
    setLocation("/profile"); // Redirect to profile or a pending state page
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_350px] gap-12">
        {/* Form Section */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-serif text-primary mb-2">Finaliser l'abonnement</h1>
            <p className="text-muted-foreground">Veuillez confirmer vos préférences de réception.</p>
          </div>

          <div className="space-y-6 bg-card p-6 border border-border">
            <h2 className="text-xl font-medium border-b border-border pb-2">Coordonnées de réception</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="default-email" checked={useDefaultEmail} onCheckedChange={(c) => setUseDefaultEmail(!!c)} />
                <label htmlFor="default-email" className="text-sm font-medium leading-none cursor-pointer">
                  Utiliser mon email d'inscription ({user.email})
                </label>
              </div>

              {!useDefaultEmail && (
                <div className="space-y-2 pl-6">
                  <Label htmlFor="custom-email">Email de réception alternatif</Label>
                  <Input 
                    id="custom-email" 
                    type="email" 
                    value={customEmail} 
                    onChange={(e) => setCustomEmail(e.target.value)} 
                    className="bg-background border-border" 
                    placeholder="exemple@email.com"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 space-y-4 border-t border-border">
              <Label>Heure de réception GMT souhaitée</Label>
              <RadioGroup value={receptionTime} onValueChange={setReceptionTime} className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="05h00" id="t1" />
                  <Label htmlFor="t1" className="cursor-pointer">05h00 GMT</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12h00" id="t2" />
                  <Label htmlFor="t2" className="cursor-pointer">12h00 GMT</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="18h00" id="t3" />
                  <Label htmlFor="t3" className="cursor-pointer">18h00 GMT</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="20h00" id="t4" />
                  <Label htmlFor="t4" className="cursor-pointer">20h00 GMT</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 sticky top-24">
            <h2 className="text-xl font-medium mb-4 pb-2 border-b border-border">Résumé</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan sélectionné</p>
                <p className="font-serif text-lg text-primary">{planInfo.name}</p>
              </div>

              <div>
                <Label className="mb-2 block">Durée de l'engagement</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mois</SelectItem>
                    <SelectItem value="2">2 mois (-15%)</SelectItem>
                    <SelectItem value="3">3 mois (-25%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-border flex justify-between items-end">
                <p className="text-sm text-muted-foreground">Total à payer</p>
                <p className="text-3xl font-bold text-foreground">{formatPrice(finalPriceEur)}</p>
              </div>
            </div>

            {paymentError && (
              <p className="text-sm text-destructive text-center" data-testid="text-payment-error">
                {paymentError}
              </p>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleCryptoPayment}
                disabled={isProcessingPayment}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                {isProcessingPayment ? "Création du paiement..." : "Payer avec Crypto"}
              </Button>
              <Button
                onClick={() => setIsAssistantModalOpen(true)}
                disabled={isProcessingPayment}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 font-medium"
              >
                Payer avec l'Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAssistantModalOpen} onOpenChange={setIsAssistantModalOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-primary">Paiement Assisté</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              Votre demande a été prise en charge. Un agent va vous contacter pour confirmer la méthode de paiement disponible (Virement, Carte, etc). Vous recevrez vos prédictions après confirmation du paiement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Préférence de contact pour l'assistance</Label>
              <RadioGroup value={assistantContactMethod} onValueChange={setAssistantContactMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Telegram" id="c1" />
                  <Label htmlFor="c1">Telegram</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="WhatsApp" id="c2" />
                  <Label htmlFor="c2">WhatsApp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Email" id="c3" />
                  <Label htmlFor="c3">Email</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(!!c)} />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-snug cursor-pointer">
                J'accepte les conditions et je comprends que l'abonnement ne sera actif qu'après confirmation manuelle du paiement.
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssistantModalOpen(false)} className="border-border">
              Annuler
            </Button>
            <Button onClick={handleAssistantPayment} disabled={!termsAccepted} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Contacter l'assistant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
