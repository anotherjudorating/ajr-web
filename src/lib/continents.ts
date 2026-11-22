// IOC code -> the IJF continental union the nation belongs to (Africa, Asia, Europe,
// Pan America, Oceania), by the key of its name in the dictionary (i18n/en/country.ts
// continents). Past nations (Soviet Union, Yugoslavia…) go with their successors;
// teams that are not a nation (neutral athletes, refugees) have none.
export type Continent = "africa" | "asia" | "europe" | "panAmerica" | "oceania";

const UNIONS: Record<Continent, string> = {
  africa:
    "ALG ANG BDI BEN BOT BUR CAF CGO CHA CIV CMR COD COM CPV DJI EGY ERI ETH GAB GAM GBS GEQ GHA GUI KEN LBA LBR LES MAD MAR MAW MLI MOZ MRI MTN NAM NGR NIG REU RSA RWA SEN SEY SLE SOM SSD STP SUD SWZ TAN TOG TUN UGA ZAI ZAM ZIM",
  asia:
    "AFG BAN BHU BRN BRU CAM CHN COR HKG INA IND IRI IRQ JOR JPN KAZ KGZ KOR KSA KUW LAO LBN MAC MAS MDV MGL MYA NEP OMA PAK PHI PLE PRK QAT SGP SRI SYR THA TJK TKM TLS TPE UAE UZB VIE YAR YEM _RC",
  europe:
    "ALB AND ARM AUT AZE BEL BIH BLR BUL CRO CYP CZE DEN ENG ESP EST FIN FRA FRG FRO GBR GDR GEO GER GIB GRE HUN IRL ISL ISR ITA JEY KOS LAT LIE LTU LUX MDA MKD MLT MNE MON NED NIR NOR POL POR RJF ROC ROU RPC RUS SCG SCO SLO SMR SRB SUI SVK SWE TCH TUR UKR URS WAL YUG",
  panAmerica:
    "AHO ANT ARG ARU BAH BAR BER BIZ BOL BRA CAN CAY CHI COL CRC CUB CUW DMA DOM ECU ESA GLP GRN GUA GUY HAI HON ISV IVB JAM LCA MEX NCA PAN PAR PER PUR SKN SUR SXM TTO URU USA VEN VIN",
  oceania: "ASA AUS COK FIJ FSM GUM KIR MHL MNP NCL NFI NIU NRU NZL PLW PNG PYF SAM SOL TGA TKL TUV VAN",
};

export const CONTINENTS: Record<string, Continent> = Object.fromEntries(
  (Object.entries(UNIONS) as [Continent, string][]).flatMap(([union, codes]) => codes.split(" ").map((code) => [code, union])),
);
