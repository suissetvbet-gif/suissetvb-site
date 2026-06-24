import { useLocation } from "wouter";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import fifaHero from "@assets/FC25-Rush-cover_1782141567084.jpg";
import fifaLogo from "@assets/1_1782141588471.jpg";

export default function Fifa() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Hero Banner */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src={fifaHero}
          alt="FIFA Virtuel"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-12">
          <h1 className="text-5xl md:text-6xl font-serif text-primary tracking-tight drop-shadow-lg mb-3">
            FIFA Virtuel
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl font-light drop-shadow">
            Algorithmes prédictifs sur les compétitions e-sport FIFA. Résultats constants sur les ligues simulées.
          </p>
        </div>
      </div>

      {/* Secondary image strip + intro */}
      <div className="max-w-6xl mx-auto px-6 mt-10 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center bg-card border border-border p-6">
          <div className="relative w-full md:w-56 h-36 flex-shrink-0 overflow-hidden">
            <img
              src={fifaLogo}
              alt="FIFA"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-primary mb-2">Comment fonctionne FIFA Virtuel ?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le FIFA Virtuel est un e-sport simulé disponible 24h/24. Nos modèles algorithmiques analysent chaque match en temps réel sur plusieurs ligues simultanément. Vous recevez vos prédictions aux créneaux définis lors de votre abonnement, avec les informations suivantes selon votre formule : équipe gagnante, total de buts, résultat pair ou impair, et score exact pour les abonnements Penalty.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-serif text-foreground mb-8 text-center">Choisissez votre abonnement</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <SubscriptionCard
            title="FIFA Virtuel Standard"
            priceInEur={39}
            priceLabel="/ mois"
            description="Recevez nos meilleures prédictions sur les ligues majeures FIFA Virtuel avec vainqueur, total des buts et parité."
            details={[
              "2 prédictions par jour",
              "Résultats : équipe gagnante, total de buts, pair/impair",
              "FC 26 · 5x5 Rush Superligue",
              "FC 24 · 4x4 Championnat d'Angleterre",
              "FC 25 · 3x3 Ligue de Conférence",
              "FC 26 · Championnat Ligue",
              "FC 25 · Championnat d'Angleterre",
              "FC 25 · Ligue Européenne"
            ]}
            onSubscribe={() => setLocation("/subscribe/fifa-standard")}
          />

          <SubscriptionCard
            title="FIFA Virtuel Penalty"
            priceInEur={45}
            priceLabel="/ mois"
            description="Le marché des penaltys décrypté par nos algorithmes. Prédiction du score exact pour un rendement optimal."
            details={[
              "3 prédictions par jour",
              "Résultats : équipe gagnante et score exact",
              "FC 24 · Penalty",
              "FC 25 · Penalty",
              "FC 26 · Penalty",
              "Alertes en temps réel"
            ]}
            onSubscribe={() => setLocation("/subscribe/fifa-penalty")}
          />
        </div>
      </div>

    </div>
  );
}
