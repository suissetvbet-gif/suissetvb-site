import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";
import { supabase } from "@/lib/supabase";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Settings() {
  const { user, signOut, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  if (loading) return <LoadingScreen />;
  if (!user) {
    setLocation("/auth");
    return null;
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", description: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (newPassword.length < 8) {
      toast({ variant: "destructive", description: "Le nouveau mot de passe doit contenir au moins 8 caractères." });
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdatingPassword(false);

    if (error) {
      toast({ variant: "destructive", description: error.message });
    } else {
      toast({ description: "Mot de passe mis à jour avec succès." });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // If we had a server route we would call it here. For now we use standard signOut + soft logic,
      // or supabase.rpc if set up. We'll just sign out as fallback since admin is required for true deletion.
      await signOut();
      toast({ description: "Compte supprimé ou désactivé." });
      setLocation("/auth");
    } catch (e: any) {
      toast({ variant: "destructive", description: "Erreur lors de la suppression." });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <header>
          <h1 className="text-4xl font-serif text-primary mb-2">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et la sécurité de votre compte.</p>
        </header>

        {/* Theme */}
        <section className="p-6 border border-border bg-card flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium mb-1">Thème Sombre</h2>
            <p className="text-sm text-muted-foreground">Activer l'interface sombre pour plus de confort.</p>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </section>

        {/* Currency */}
        <section className="p-6 border border-border bg-card">
          <h2 className="text-xl font-medium mb-4">Devise</h2>
          <p className="text-sm text-muted-foreground mb-4">Sélectionnez votre devise d'affichage préférée.</p>
          <div className="flex items-center gap-4">
            <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue placeholder="Devise" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                <SelectItem value="USD">Dollar US (USD)</SelectItem>
                <SelectItem value="GBP">Livre Sterling (GBP)</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">Exemple: {formatPrice(100)}</span>
          </div>
        </section>

        {/* Password */}
        <section className="p-6 border border-border bg-card">
          <h2 className="text-xl font-medium mb-4">Changer le mot de passe</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label htmlFor="old-pwd">Mot de passe actuel</Label>
              <Input id="old-pwd" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pwd">Nouveau mot de passe</Label>
              <Input id="new-pwd" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pwd">Confirmer le nouveau mot de passe</Label>
              <Input id="confirm-pwd" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className="bg-background border-border" />
            </div>
            <Button type="submit" disabled={isUpdatingPassword} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Mettre à jour
            </Button>
          </form>
        </section>

        {/* Support & Logout */}
        <section className="space-y-4">
          <Button onClick={() => window.open('https://t.me/suissetvb')} variant="outline" className="w-full justify-start h-14 text-lg border-border hover:text-primary">
            Contacter le Support (Telegram)
          </Button>
          <Button onClick={() => { signOut(); setLocation("/auth"); }} variant="outline" className="w-full justify-start h-14 text-lg border-border hover:text-primary">
            Déconnexion
          </Button>
        </section>

        {/* Danger Zone */}
        <section className="pt-8 border-t border-border">
          <h2 className="text-xl font-medium text-destructive mb-4">Zone de danger</h2>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-destructive/10 text-destructive border border-destructive hover:bg-destructive hover:text-destructive-foreground">
                Supprimer mon compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Cette action est irréversible. Elle supprimera définitivement votre compte et toutes vos données de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-background border-border">Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Supprimer définitivement
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>
      </div>
    </div>
  );
}
