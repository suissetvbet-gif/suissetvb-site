import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, Clock, CheckCircle, XCircle, Search, RefreshCw, TrendingUp } from "lucide-react";

interface Subscription {
  id: string;
  user_id: string;
  jeu: string;
  type_abonnement: string;
  heure_reception: string;
  email_reception: string;
  statut: string;
  mode_paiement: string;
  montant_eur: number | null;
  duree_mois: number;
  date_debut: string | null;
  date_expiration: string | null;
  created_at: string;
  user?: {
    nom: string;
    prenom: string;
    email: string;
    pays: string;
    telephone: string;
  };
}

type StatusFilter = "all" | "pending" | "active" | "expired" | "cancelled";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente",  color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  active:    { label: "Actif",       color: "bg-green-500/15 text-green-400 border-green-500/30" },
  expired:   { label: "Expiré",      color: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
  cancelled: { label: "Annulé",      color: "bg-red-500/15 text-red-400 border-red-500/30" },
};

const JEU_LABELS: Record<string, string> = {
  wheelbet: "Wheelbet",
  fifa: "FIFA Virtuel",
};

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data: abos, error } = await supabase
      .from("abonnements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
      setLoading(false);
      return;
    }

    if (!abos || abos.length === 0) {
      setSubs([]);
      setLoading(false);
      return;
    }

    // Fetch user profiles
    const userIds = [...new Set(abos.map((a: Subscription) => a.user_id))];
    const { data: profiles } = await supabase
      .from("users")
      .select("id, nom, prenom, email, pays, telephone")
      .in("id", userIds);

    const profileMap: Record<string, Subscription["user"]> = {};
    if (profiles) {
      profiles.forEach((p: { id: string; nom: string; prenom: string; email: string; pays: string; telephone: string }) => {
        profileMap[p.id] = { nom: p.nom, prenom: p.prenom, email: p.email, pays: p.pays, telephone: p.telephone };
      });
    }

    setSubs(abos.map((a: Subscription) => ({ ...a, user: profileMap[a.user_id] })));
    setLoading(false);
  }, [toast]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    const updates: Record<string, unknown> = { statut: newStatus };
    if (newStatus === "active") {
      updates.date_debut = new Date().toISOString();
      const sub = subs.find(s => s.id === id);
      if (sub) {
        const exp = new Date();
        exp.setMonth(exp.getMonth() + (sub.duree_mois || 1));
        updates.date_expiration = exp.toISOString();
      }
    }
    const { error } = await supabase.from("abonnements").update(updates).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Erreur", description: error.message });
    } else {
      setSubs(prev => prev.map(s => s.id === id ? { ...s, statut: newStatus, ...updates } : s));
      toast({ title: "Statut mis à jour", description: `Abonnement marqué comme "${STATUS_LABELS[newStatus]?.label || newStatus}".` });
    }
    setUpdatingId(null);
  }

  const filtered = subs.filter(s => {
    const matchStatus = filter === "all" || s.statut === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || (
      s.user?.nom?.toLowerCase().includes(q) ||
      s.user?.prenom?.toLowerCase().includes(q) ||
      s.user?.email?.toLowerCase().includes(q) ||
      s.type_abonnement?.toLowerCase().includes(q) ||
      s.jeu?.toLowerCase().includes(q)
    );
    return matchStatus && matchSearch;
  });

  // Stats
  const total   = subs.length;
  const pending  = subs.filter(s => s.statut === "pending").length;
  const active   = subs.filter(s => s.statut === "active").length;
  const revenue  = subs.filter(s => s.statut === "active").reduce((acc, s) => acc + (s.montant_eur || 0), 0);

  function formatDate(d: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fr-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <div>
            <h1 className="text-3xl font-serif text-primary tracking-tight">Tableau de bord Admin</h1>
            <p className="text-muted-foreground text-sm mt-1">Gestion des abonnements SuisseTVb</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAll}
            disabled={loading}
            className="border-border gap-2"
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CreditCard, label: "Total abonnements", value: total, color: "text-primary" },
            { icon: Clock,       label: "En attente",        value: pending, color: "text-yellow-400" },
            { icon: CheckCircle, label: "Actifs",            value: active, color: "text-green-400" },
            { icon: TrendingUp,  label: "Revenus actifs",    value: `${revenue.toFixed(0)} €`, color: "text-primary" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email, type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              data-testid="input-admin-search"
              className="pl-9 bg-background border-border rounded-none"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {(["all", "pending", "active", "expired", "cancelled"] as StatusFilter[]).map(f => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                data-testid={`button-filter-${f}`}
                className={`rounded-none text-xs ${filter === f ? "bg-primary text-primary-foreground" : "border-border"}`}
              >
                {f === "all" ? "Tous" : STATUS_LABELS[f]?.label}
                {f !== "all" && (
                  <span className="ml-1 opacity-70">
                    {subs.filter(s => s.statut === f).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-6 w-6 animate-spin text-primary mr-3" />
              <span className="text-muted-foreground">Chargement...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Users className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-muted-foreground">Aucun abonnement trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Jeu / Plan</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Paiement</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Montant</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Réception</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Dates</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Statut</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sub, i) => (
                    <tr
                      key={sub.id}
                      data-testid={`row-subscription-${sub.id}`}
                      className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-background/20"}`}
                    >
                      {/* Client */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-foreground">
                            {sub.user ? `${sub.user.prenom} ${sub.user.nom}` : "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">{sub.user?.email || sub.email_reception}</p>
                          {sub.user?.pays && (
                            <p className="text-xs text-muted-foreground/60">{sub.user.pays}</p>
                          )}
                        </div>
                      </td>

                      {/* Jeu / Plan */}
                      <td className="px-4 py-3">
                        <p className="text-primary font-medium text-xs">{JEU_LABELS[sub.jeu] || sub.jeu}</p>
                        <p className="text-foreground text-xs mt-0.5">{sub.type_abonnement}</p>
                        <p className="text-muted-foreground text-xs">{sub.duree_mois} mois</p>
                      </td>

                      {/* Paiement */}
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 border ${sub.mode_paiement === "crypto" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : "border-purple-500/30 text-purple-400 bg-purple-500/10"}`}>
                          {sub.mode_paiement === "crypto" ? "Crypto" : "Assistant"}
                        </span>
                      </td>

                      {/* Montant */}
                      <td className="px-4 py-3">
                        <span className="text-foreground font-medium">
                          {sub.montant_eur != null ? `${sub.montant_eur} €` : "—"}
                        </span>
                      </td>

                      {/* Réception */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-foreground">{sub.heure_reception}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{sub.email_reception}</p>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-muted-foreground">Créé : {formatDate(sub.created_at)}</p>
                        {sub.date_debut && (
                          <p className="text-xs text-muted-foreground">Début : {formatDate(sub.date_debut)}</p>
                        )}
                        {sub.date_expiration && (
                          <p className="text-xs text-muted-foreground">Fin : {formatDate(sub.date_expiration)}</p>
                        )}
                      </td>

                      {/* Statut badge */}
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 border rounded-sm ${STATUS_LABELS[sub.statut]?.color || "border-border text-muted-foreground"}`}>
                          {STATUS_LABELS[sub.statut]?.label || sub.statut}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <Select
                          value={sub.statut}
                          onValueChange={val => updateStatus(sub.id, val)}
                          disabled={updatingId === sub.id}
                        >
                          <SelectTrigger
                            data-testid={`select-status-${sub.id}`}
                            className="h-7 w-32 text-xs bg-background border-border rounded-none"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="active">Activer</SelectItem>
                            <SelectItem value="expired">Expirer</SelectItem>
                            <SelectItem value="cancelled">Annuler</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground mt-3 text-right">
            {filtered.length} abonnement{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}
          </p>
        )}

        {/* SQL reminder for first-time setup */}
        <div className="mt-8 border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="text-xs text-yellow-400/80 font-medium mb-1">Configuration requise dans Supabase</p>
          <p className="text-xs text-muted-foreground">
            Pour activer l'accès admin, exécutez dans SQL Editor :
          </p>
          <code className="block mt-2 text-xs bg-background border border-border px-3 py-2 text-primary font-mono whitespace-pre-wrap">
{`-- Ajouter la colonne is_admin
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Politique RLS : les admins lisent tous les abonnements
CREATE POLICY "admin_select_all_abonnements"
  ON public.abonnements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Politique RLS : les admins modifient tous les abonnements
CREATE POLICY "admin_update_all_abonnements"
  ON public.abonnements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Politique RLS : les admins lisent tous les profils
CREATE POLICY "admin_select_all_users"
  ON public.users FOR SELECT
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Donner le statut admin à votre compte
UPDATE public.users SET is_admin = true WHERE email = 'votre@email.com';`}
          </code>
        </div>

      </div>
    </div>
  );
}
