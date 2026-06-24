import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import logoSrc from "@assets/suissetvb_logo.png";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SiGoogle } from "react-icons/si";
import { CountryPhoneInput } from "@/components/CountryPhoneInput";
import { COUNTRIES } from "@/lib/countries";
import { useToast } from "@/hooks/use-toast";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const { signInWithGoogle } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regNom, setRegNom] = useState("");
  const [regPrenom, setRegPrenom] = useState("");
  const [regCountryCode, setRegCountryCode] = useState("CH");
  const [regPays, setRegPays] = useState("Suisse");
  const [regPhone, setRegPhone] = useState("+41");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
      
      // Deliberate 4-5s delay for premium feel
      setTimeout(() => {
        setLocation("/");
      }, 4000);
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Vérifiez vos identifiants.",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword.length < 8) {
      toast({ variant: "destructive", title: "Erreur", description: "Le mot de passe doit contenir au moins 8 caractères." });
      return;
    }
    
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: {
          data: { nom: regNom, prenom: regPrenom, pays: regPays, telephone: regPhone }
        }
      });
      if (error) throw error;

      if (data.user) {
        // Cet insert peut échouer si les politiques RLS ne sont pas encore en place,
        // ou si un trigger côté base crée déjà la ligne automatiquement.
        // On ne bloque jamais l'inscription pour cette raison : le compte Auth existe déjà.
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          nom: regNom,
          prenom: regPrenom,
          pays: regPays,
          telephone: regPhone,
          email: regEmail,
          date_inscription: new Date().toISOString()
        });
        if (insertError) {
          console.error('Profil non créé dans la table users (RLS ou doublon probable):', insertError.message);
        }
      }

      setTimeout(() => {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte.",
        });
        setIsProcessing(false);
        // Switch to login conceptually or tell them to check email
      }, 4500);

    } catch (error: any) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue.",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!loginEmail) {
      toast({ variant: "destructive", description: "Veuillez entrer votre email d'abord." });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail);
    if (error) {
      toast({ variant: "destructive", description: error.message });
    } else {
      toast({ description: "Email de réinitialisation envoyé." });
    }
  };

  if (isProcessing) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-20">
      <div className="w-full max-w-md bg-card border border-border p-8 shadow-2xl">
        <div className="text-center mb-8">
          <img src={logoSrc} alt="SuisseTVb" className="w-20 h-20 object-contain mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Accès Membre Exclusif</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-background border border-border rounded-none p-1">
            <TabsTrigger value="login" className="rounded-none data-[state=active]:bg-card data-[state=active]:text-primary">Connexion</TabsTrigger>
            <TabsTrigger value="register" className="rounded-none data-[state=active]:bg-card data-[state=active]:text-primary">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email professionnel</Label>
                <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="bg-background border-border rounded-none focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <button type="button" onClick={handleResetPassword} className="text-xs text-primary hover:underline">Mot de passe oublié ?</button>
                </div>
                <div className="relative">
                  <Input id="login-password" type={showPassword ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="bg-background border-border rounded-none focus-visible:ring-primary pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-medium tracking-wide">
                Se Connecter
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Où continuer avec</span>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={signInWithGoogle} className="w-full bg-white text-black hover:bg-gray-100 rounded-none border-border h-11">
              <SiGoogle className="mr-2 h-4 w-4 text-[#4285F4]" />
              Continuer avec Google
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-nom">Nom</Label>
                  <Input id="reg-nom" value={regNom} onChange={(e) => setRegNom(e.target.value)} required className="bg-background border-border rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-prenom">Prénom</Label>
                  <Input id="reg-prenom" value={regPrenom} onChange={(e) => setRegPrenom(e.target.value)} required className="bg-background border-border rounded-none" />
                </div>
              </div>

              <CountryPhoneInput
                country={regCountryCode}
                phone={regPhone}
                onCountryChange={(code, _dialCode) => {
                  setRegCountryCode(code);
                  const found = COUNTRIES.find(c => c.code === code);
                  if (found) setRegPays(found.name);
                }}
                onPhoneChange={setRegPhone}
              />

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="bg-background border-border rounded-none" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Mot de passe</Label>
                <Input id="reg-password" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength={8} className="bg-background border-border rounded-none" />
                {regPassword.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Force: {regPassword.length > 8 ? <span className="text-green-500">Excellente</span> : <span className="text-yellow-500">Moyenne</span>}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-medium tracking-wide mt-2">
                Devenir Membre
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Où</span>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={signInWithGoogle} className="w-full bg-white text-black hover:bg-gray-100 rounded-none border-border h-11">
              <SiGoogle className="mr-2 h-4 w-4 text-[#4285F4]" />
              S'inscrire avec Google
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
