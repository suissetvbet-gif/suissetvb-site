import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/70 via-primary to-primary/70 bg-clip-text text-transparent">
          SuisseTVb
        </h1>
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-2 border-primary/50 rounded-full animate-spin-reverse"></div>
        </div>
        <p className="text-muted-foreground text-sm uppercase tracking-widest">
          Traitement en cours...
        </p>
      </motion.div>
    </div>
  );
}
