import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Profile() {
  const { user, loading } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [pays, setPays] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/auth");
    }
    
    if (user) {
      fetchUserProfile();
    }
  }, [user, loading, setLocation]);

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single();
      
    if (data) {
      setUserData(data);
      setNom(data.nom || "");
      setPrenom(data.prenom || "");
      setTelephone(data.telephone || "");
      setPays(data.pays || "");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await supabase
      .from('users')
      .update({ nom, prenom, telephone, pays })
      .eq('id', user?.id);
      
    setIsSaving(false);
    
    if (error) {
      toast({ variant: "destructive", description: "Erreur lors de la mise à jour du profil." });
    } else {
      toast({ description: "Profil mis à jour avec succès." });
      setIsEditing(false);
      fetchUserProfile();
    }
  };

  if (loading || !userData) return <LoadingScreen />;

  const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || "ST";

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 flex items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarFallback className="bg-primary/20 text-primary text-2xl font-serif">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-serif text-primary">{prenom} {nom}</h1>
            <p className="text-muted-foreground">{userData.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Membre depuis {new Date(userData.date_inscription).toLocaleDateString()}
            </p>
          </div>
        </header>

        <div className="p-8 border border-border bg-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">Informations Personnelles</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Modifier
              </Button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nom Complet</p>
                <p className="font-medium text-lg">{prenom} {nom}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="font-medium text-lg">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Téléphone</p>
                <p className="font-medium text-lg">{telephone || "Non renseigné"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pays de résidence</p>
                <p className="font-medium text-lg">{pays || "Non renseigné"}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-prenom">Prénom</Label>
                  <Input id="edit-prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-nom">Nom</Label>
                  <Input id="edit-nom" value={nom} onChange={(e) => setNom(e.target.value)} required className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Téléphone</Label>
                  <Input id="edit-phone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required className="bg-background border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pays">Pays de résidence</Label>
                  <Select value={pays} onValueChange={setPays} required>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Suisse">🇨🇭 Suisse</SelectItem>
                      <SelectItem value="France">🇫🇷 France</SelectItem>
                      <SelectItem value="Belgique">🇧🇪 Belgique</SelectItem>
                      <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="border-border">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {isSaving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
