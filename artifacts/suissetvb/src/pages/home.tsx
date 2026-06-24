import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import logoSrc from "@assets/suissetvb_logo.png";
import wheelbetHero from "@assets/thumbnail-wheelbet.jpg_1782141572887.webp";
import wheelbetCards from "@assets/cards1-2-300x203.jpg_1782141563597.webp";
import fifaCover from "@assets/FC25-Rush-cover_1782141567084.jpg";
import fifaAction from "@assets/1_1782141588471.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: i * 0.12, ease: "easeOut" as const } }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({ opacity: 1, transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const } }),
};

function PublicHome() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background images collage */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.18, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${wheelbetHero})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/12 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="z-10 flex flex-col items-center">
          <img
            src={logoSrc}
            alt="SuisseTVb"
            className="w-32 h-32 md:w-44 md:h-44 mx-auto mb-6 object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.35)]"
          />
        </motion.div>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          className="z-10 text-5xl md:text-7xl font-serif text-foreground tracking-tight mb-4 leading-tight"
        >
          Pronostics <span className="text-primary">d'élite</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          className="z-10 text-lg md:text-xl text-muted-foreground font-light mb-10 tracking-wide max-w-lg"
        >
          La plateforme suisse de référence pour investir sur le sport avec précision.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={3}
          className="z-10 flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" onClick={() => setLocation('/auth')} className="text-base px-10 py-6 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 tracking-widest uppercase">
            Commencer
          </Button>
          <Button size="lg" variant="outline" onClick={() => setLocation('/auth')} className="text-base px-10 py-6 rounded-none border-primary/50 text-primary hover:bg-primary/10 tracking-widest uppercase">
            Se connecter
          </Button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ── Stat bar ── */}
      <section className="bg-card border-y border-border py-10 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "98%", label: "Taux de réussite ciblé" },
            { value: "3+", label: "Années d'expérience" },
            { value: "500+", label: "Membres actifs" },
            { value: "24/7", label: "Support disponible" },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              variants={fadeUp} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-serif text-primary mb-1 drop-shadow-[0_0_12px_rgba(212,175,55,0.3)]">{value}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Services — Wheelbet ── */}
      <section className="py-28 px-6 bg-background overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <motion.div
            variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative"
          >
            <motion.img
              src={wheelbetHero}
              alt="Wheelbet"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-full object-cover border border-border shadow-2xl shadow-black/40"
              style={{ aspectRatio: "16/10" }}
            />
            <motion.img
              src={wheelbetCards}
              alt="Wheelbet cards"
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -right-6 w-2/5 object-cover border-2 border-primary/30 shadow-2xl hidden md:block"
              style={{ aspectRatio: "3/2" }}
            />
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-primary/20 pointer-events-none" />
          </motion.div>

          {/* Text */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col gap-5"
          >
            <div className="inline-flex">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary border border-primary/30 px-3 py-1 bg-primary/5">
                Pronostics Sportifs
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">Wheelbet</h2>
            <p className="text-muted-foreground leading-relaxed">
              Des pronostics sportifs d'une précision chirurgicale, analysés par nos experts suisses. Choisissez votre niveau de cote et recevez vos analyses directement à l'heure que vous souhaitez.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Cote 2 — 49€/mois", "Cote 3 — 35€/mois", "Cote 6 — 80€/mois", "Cote 12 VIP — 249€/mois"].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => setLocation('/auth')}
              className="w-fit mt-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8 tracking-widest uppercase text-xs"
            >
              Découvrir Wheelbet
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Services — FIFA Virtuel ── */}
      <section className="py-28 px-6 bg-card border-y border-border overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Text — left side on desktop */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col gap-5 order-2 md:order-1"
          >
            <div className="inline-flex">
              <span className="text-xs font-semibold tracking-widest uppercase text-primary border border-primary/30 px-3 py-1 bg-primary/5">
                E-Sport &amp; Virtuel
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">FIFA Virtuel</h2>
            <p className="text-muted-foreground leading-relaxed">
              Investissez sur l'e-sport avec nos analyses algorithmiques sur FIFA Virtuel. Un marché en pleine expansion aux rendements constants, disponible tous les jours de l'année.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Standard — 39€/mois", "Penalty — 45€/mois"].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => setLocation('/auth')}
              className="w-fit mt-2 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8 tracking-widest uppercase text-xs"
            >
              Découvrir FIFA Virtuel
            </Button>
          </motion.div>

          {/* Images */}
          <motion.div
            variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative order-1 md:order-2"
          >
            <motion.img
              src={fifaCover}
              alt="FIFA Virtuel"
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-full object-cover border border-border shadow-2xl shadow-black/40"
              style={{ aspectRatio: "16/10" }}
            />
            <motion.img
              src={fifaAction}
              alt="FIFA action"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 w-2/5 object-cover border-2 border-primary/30 shadow-2xl hidden md:block"
              style={{ aspectRatio: "1/1" }}
            />
            <div className="absolute -top-4 -right-4 w-24 h-24 border border-primary/20 pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-3">Comment ça marche</h2>
            <div className="h-px w-16 bg-primary mx-auto" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              { n: "1", title: "Inscription", desc: "Créez votre compte membre en quelques minutes et accédez à notre plateforme sécurisée." },
              { n: "2", title: "Abonnement", desc: "Sélectionnez le plan et le service adapté à vos objectifs d'investissement." },
              { n: "3", title: "Réception", desc: "Recevez vos pronostics par Email, Telegram ou WhatsApp à l'heure choisie, chaque jour." },
            ].map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                variants={fadeUp} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }}
                className="flex flex-col items-center text-center z-10"
              >
                <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center text-2xl font-serif text-primary mb-6 bg-background shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                  {n}
                </div>
                <h4 className="text-xl font-medium mb-3">{title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
            <div className="hidden md:block absolute top-8 left-20 right-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-3">Ce que disent nos membres</h2>
            <div className="h-px w-16 bg-primary mx-auto" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Jean-Marc V.", pays: "Suisse", text: "Mes investissements sont devenus beaucoup plus rentables grâce aux analyses de SuisseTVb. Un service sérieux et professionnel." },
              { name: "Farida K.", pays: "France", text: "Je recommande vivement. Les pronostics arrivent toujours à l'heure, et les résultats parlent d'eux-mêmes depuis 4 mois." },
              { name: "Carlos M.", pays: "Belgique", text: "Le service VIP Cote 12 est exceptionnel. Le rapport qualité-prix est imbattable. Je suis membre depuis plus d'un an." },
            ].map(({ name, pays, text }, i) => (
              <motion.div
                key={name}
                variants={fadeUp} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }}
                className="bg-background border border-border p-6 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="text-primary text-sm">&#9733;</span>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">"{text}"</p>
                <div>
                  <p className="text-sm font-medium text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{pays}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner ── */}
      <div className="flex justify-center py-8 bg-background border-b border-border/50">
        <iframe scrolling="no" frameBorder="0" style={{ padding: 0, margin: 0, border: "none" }} width={470} height={60} src="https://refbanners.com/I?tag=d_1979983m_2789c_&site=1979983&ad=2789" title="1xBet Banner" />
      </div>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-3">Questions Fréquentes</h2>
            <div className="h-px w-16 bg-primary mx-auto" />
          </motion.div>
          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "Comment s'effectuent les paiements ?", a: "Nous acceptons les paiements via cryptomonnaies (Plisio) pour une discrétion totale, ainsi que par virement ou portefeuille électronique via notre assistant Telegram." },
              { q: "À quelle heure recevrai-je mes pronostics ?", a: "Lors de votre souscription, vous choisissez votre heure de réception GMT : 05h00, 12h00, 18h00 ou 20h00." },
              { q: "Garantissez-vous les résultats ?", a: "Nos analyses ciblent un taux de réussite très élevé, mais le risque zéro n'existe pas en investissement sportif. Misez toujours de manière responsable." },
              { q: "Comment sont livrés les pronostics ?", a: "Les pronostics sont envoyés par Email, Telegram ou WhatsApp selon le canal que vous sélectionnez lors de l'abonnement." },
            ].map(({ q, a }, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="hover:text-primary text-left">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url(${fifaCover})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />
        </div>
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Prêt à investir avec précision ?</h2>
          <p className="text-muted-foreground mb-8">Rejoignez des centaines de membres qui font confiance à SuisseTVb pour leurs pronostics sportifs.</p>
          <Button
            size="lg"
            onClick={() => setLocation('/auth')}
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-base tracking-widest uppercase shadow-[0_0_30px_rgba(212,175,55,0.25)]"
          >
            Créer mon compte
          </Button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-card pt-16 pb-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          <div>
            <img src={logoSrc} alt="SuisseTVb" className="w-14 h-14 object-contain mb-3" />
            <p className="text-muted-foreground text-sm max-w-xs">L'excellence suisse du pronostic sportif depuis Bad Ragaz.</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Services</p>
            <button onClick={() => setLocation('/auth')} className="text-sm text-foreground hover:text-primary transition-colors text-left">Wheelbet</button>
            <button onClick={() => setLocation('/auth')} className="text-sm text-foreground hover:text-primary transition-colors text-left">FIFA Virtuel</button>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Contact</p>
            <Button variant="outline" size="sm" className="border-border hover:text-primary rounded-none" onClick={() => window.open('https://t.me/suissetvb', '_blank')}>
              Canal Telegram
            </Button>
            <Button variant="outline" size="sm" className="border-border hover:text-primary rounded-none" onClick={() => window.open('mailto:support@suissetvb.com')}>
              support@suissetvb.com
            </Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto text-center md:text-left text-xs text-muted-foreground/60 flex flex-col md:flex-row justify-between border-t border-border pt-6 gap-2">
          <p>© {new Date().getFullYear()} SuisseTVb. Tous droits réservés.</p>
          <p>Hans Albrecht-Strasse 5, 7310 Bad Ragaz, Suisse</p>
          <p>support@suissetvb.com</p>
        </div>
      </footer>
    </div>
  );
}

function PrivateDashboard() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const prenom = user?.user_metadata?.prenom || "Membre";

  return (
    <div className="min-h-screen bg-background pt-24 px-6 pb-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.header variants={fadeUp} initial="hidden" animate="show">
          <h1 className="text-4xl font-serif text-foreground mb-2">Bienvenue, <span className="text-primary">{prenom}</span>.</h1>
          <p className="text-muted-foreground">Votre espace d'investissement privé.</p>
        </motion.header>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { label: "Abonnements actifs", val: "0", gold: true },
            { label: "Total Souscriptions", val: "0", gold: false },
          ].map(({ label, val, gold }, i) => (
            <motion.div key={label} variants={fadeUp} initial="hidden" animate="show" custom={i + 1} className="p-6 border border-border bg-card">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</h3>
              <div className={`text-4xl font-serif ${gold ? "text-primary" : "text-foreground"}`}>{val}</div>
            </motion.div>
          ))}
        </div>

        {/* Game cards with images */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Wheelbet", img: wheelbetHero, desc: "Pronostics sportifs de haute précision.", path: "/wheelbet" },
            { title: "FIFA Virtuel", img: fifaCover, desc: "Analyses algorithmiques sur l'e-sport FIFA.", path: "/fifa" },
          ].map(({ title, img, desc, path }, i) => (
            <motion.div
              key={title}
              variants={fadeUp} initial="hidden" animate="show" custom={i + 3}
              className="group relative border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setLocation(path)}
            >
              <img src={img} alt={title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl font-serif text-primary mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.section
          variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="p-8 border border-border bg-card relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl font-serif mb-6">Comment fonctionne votre service</h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed">
            <p>1. Parcourez nos offres Wheelbet et FIFA Virtuel depuis les cartes ci-dessus.</p>
            <p>2. Sélectionnez l'abonnement correspondant à votre stratégie et la fréquence souhaitée.</p>
            <p>3. Procédez au paiement sécurisé en cryptomonnaie ou contactez notre assistant Telegram.</p>
            <p>4. Recevez vos pronostics par Email/Telegram/WhatsApp à l'heure convenue, chaque jour.</p>
          </div>
        </motion.section>

        <div className="flex justify-center py-4 opacity-80 hover:opacity-100 transition-opacity">
          <iframe scrolling="no" frameBorder="0" style={{ padding: 0, margin: 0, border: "none" }} width={470} height={60} src="https://refbanners.com/I?tag=d_1979983m_2789c_&site=1979983&ad=2789" title="1xBet Banner" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) return <PrivateDashboard />;
  return <PublicHome />;
}
