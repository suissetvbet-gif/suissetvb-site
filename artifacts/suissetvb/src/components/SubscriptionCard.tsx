import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionCardProps {
  title: string;
  priceInEur: number;
  priceLabel?: string;
  description: string;
  details: string[];
  isVip?: boolean;
  onSubscribe: () => void;
}

export function SubscriptionCard({
  title,
  priceInEur,
  priceLabel,
  description,
  details,
  isVip = false,
  onSubscribe,
}: SubscriptionCardProps) {
  const { formatPrice } = useCurrency();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${isVip ? 'border-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-border hover:border-primary/50'}`}>
      {isVip && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
          VIP
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl font-bold font-serif tracking-tight">{title}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold text-primary">{formatPrice(priceInEur)}</span>
          {priceLabel && <span className="text-muted-foreground ml-2 text-sm">{priceLabel}</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {isExpanded ? (
            <>Masquer les détails <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>Lire les détails <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 mt-4 pt-4 border-t border-border">
                {details.map((detail, idx) => (
                  <li key={idx} className="flex items-start text-sm">
                    <Check className="h-4 w-4 text-primary mr-2 mt-0.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSubscribe} 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide"
        >
          M'abonner
        </Button>
      </CardFooter>
    </Card>
  );
}
