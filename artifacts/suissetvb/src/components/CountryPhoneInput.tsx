import { useState, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COUNTRIES, findCountryByDialCode, type Country } from "@/lib/countries";

interface CountryPhoneInputProps {
  country: string;           // ISO code, e.g. "CH"
  phone: string;             // full phone string incl. dial code, e.g. "+41 79 123 45 67"
  onCountryChange: (code: string, dialCode: string) => void;
  onPhoneChange: (value: string) => void;
}

export function CountryPhoneInput({ country, phone, onCountryChange, onPhoneChange }: CountryPhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = COUNTRIES.find(c => c.code === country) ?? null;

  const filtered = search.trim() === ""
    ? COUNTRIES
    : COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dialCode.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      );

  function handleCountrySelect(c: Country) {
    setOpen(false);
    setSearch("");
    onCountryChange(c.code, c.dialCode);
    // Preserve whatever the user typed after the old dial code
    const old = selectedCountry?.dialCode ?? "";
    const suffix = phone.startsWith(old) ? phone.slice(old.length) : "";
    onPhoneChange(c.dialCode + suffix);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handlePhoneInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onPhoneChange(val);
    // Try to detect country from typed dial code
    if (val.startsWith("+") && val.length >= 2) {
      const found = findCountryByDialCode(val);
      if (found && found.code !== country) {
        onCountryChange(found.code, found.dialCode);
      }
    }
  }

  return (
    <div className="space-y-2">
      <Label>Pays de résidence</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            data-testid="button-country-select"
            className="w-full justify-between bg-background border-border rounded-none font-normal hover:bg-background/80 h-10"
          >
            {selectedCountry ? (
              <span className="flex items-center gap-2">
                <span className="text-lg leading-none">{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
                <span className="text-muted-foreground text-xs">{selectedCountry.dialCode}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Sélectionnez un pays</span>
            )}
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 border-border bg-card"
          align="start"
          sideOffset={4}
        >
          {/* Search bar */}
          <div className="p-2 border-b border-border">
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un pays..."
              data-testid="input-country-search"
              className="w-full bg-background border border-border rounded-none px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {/* Country list */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">Aucun résultat</div>
            ) : (
              filtered.map(c => (
                <button
                  key={c.code}
                  type="button"
                  data-testid={`option-country-${c.code}`}
                  onClick={() => handleCountrySelect(c)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                >
                  <span className="text-base leading-none w-6 shrink-0">{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-muted-foreground text-xs shrink-0">{c.dialCode}</span>
                  {c.code === country && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Phone number input */}
      <div className="space-y-1 mt-3">
        <Label htmlFor="reg-phone">Numéro de téléphone</Label>
        <div className="flex">
          {selectedCountry && (
            <span className="flex items-center gap-1.5 px-3 bg-muted border border-r-0 border-border text-sm text-foreground shrink-0">
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="text-muted-foreground">{selectedCountry.dialCode}</span>
            </span>
          )}
          <Input
            ref={inputRef}
            id="reg-phone"
            type="tel"
            value={phone}
            onChange={handlePhoneInput}
            placeholder={selectedCountry ? `${selectedCountry.dialCode} 00 000 00 00` : "+XX 00 000 00 00"}
            data-testid="input-phone"
            required
            className="bg-background border-border rounded-none focus-visible:ring-primary flex-1 min-w-0"
            style={{ borderRadius: selectedCountry ? "0" : undefined }}
          />
        </div>
      </div>
    </div>
  );
}
