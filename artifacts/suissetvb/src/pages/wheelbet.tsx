import { useLocation } from "wouter";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import wheelbetHero from "@assets/thumbnail-wheelbet.jpg_1782141572887.webp";
import wheelbetCards from "@assets/cards1-2-300x203.jpg_1782141563597.webp";

export default function Wheelbet() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Hero Banner */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src={wheelbetHero}
          alt="Wheelbet"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-12">
          <h1 className="text-5xl md:text-6xl font-serif text-primary tracking-tight drop-shadow-lg mb-3">
            Wheelbet
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl font-light drop-shadow">
            Analyses pointues et pronostics d'élite. Choisissez la cote adaptée à votre stratégie.
          </p>
        </div>
      </div>

      {/* Secondary image strip + intro */}
      <div className="max-w-6xl mx-auto px-6 mt-10 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center bg-card border border-border p-6">
          <div className="relative w-full md:w-56 h-36 flex-shrink-0 overflow-hidden">
            <img
              src={wheelbetCards}
              alt="Wheelbet games"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-primary mb-2">Comment fonctionne Wheelbet ?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wheelbet est une plateforme de paris sportifs en direct diffusée en continu. Notre équipe d'analystes surveille chaque session et vous envoie des pronostics précis aux créneaux horaires choisis lors de votre abonnement. Vous recevez la cote sélectionnée avec l'analyse associée, directement sur votre canal de communication préféré.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-serif text-foreground mb-8 text-center">Choisissez votre abonnement</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <SubscriptionCard
            title="Cote 2"
            priceInEur={49}
            priceLabel="/ mois (1/jour) ou 25€ (1/2 jours)"
            description="L'investissement quotidien sécurisé. Un pronostic professionnel avec une cote ciblée à 2.0."
            details={[
              "Cote cible : ~2.00",
              "Option 1 : 1 prédiction par jour (49€)",
              "Option 2 : 1 prédiction tous les 2 jours (25€)",
              "Analyse pré-match détaillée",
              "Support prioritaire"
            ]}
            onSubscribe={() => setLocation("/subscribe/wheelbet-cote-2")}
          />

          <SubscriptionCard
            title="Cote 3"
            priceInEur={35}
            priceLabel="/ mois"
            description="Le compromis idéal entre sécurité et rentabilité. Une opportunité pour accroître votre capital."
            details={[
              "Cote cible : ~3.00",
              "1 prédiction tous les 2 jours",
              "Analyse experte approfondie",
              "Sélection des meilleurs événements"
            ]}
            onSubscribe={() => setLocation("/subscribe/wheelbet-cote-3")}
          />

          <SubscriptionCard
            title="Cote 6"
            priceInEur={80}
            priceLabel="/ mois"
            description="Pour les investisseurs audacieux cherchant des rendements supérieurs avec des analyses combinées de pointe."
            details={[
              "Cote cible : ~6.00",
              "1 prédiction tous les 2 jours",
              "Combinaisons expertes exclusives",
              "Gestion de risque avancée"
            ]}
            onSubscribe={() => setLocation("/subscribe/wheelbet-cote-6")}
          />

          <SubscriptionCard
            title="Cote 12 VIP"
            priceInEur={249}
            priceLabel="/ mois"
            description="Le service le plus exclusif de SuisseTVb. Des cotes exceptionnelles réservées à notre clientèle VIP."
            details={[
              "Cote cible : ~12.00",
              "1 prédiction tous les 3 jours",
              "Tickets ultra-confidentiels",
              "Canal de communication direct VIP",
              "Analyses confidentielles"
            ]}
            isVip={true}
            onSubscribe={() => setLocation("/subscribe/wheelbet-cote-12-vip")}
          />
        </div>
      </div>

    </div>
  );
}
