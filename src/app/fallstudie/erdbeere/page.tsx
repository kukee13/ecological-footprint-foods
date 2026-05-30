'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, Droplets, Truck, Calendar, Euro, Wind, BookOpen, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────
const CS_TRANS = {
  de: {
    header: { breadcrumb: 'Fallstudie', back: 'ECOFOOTPRINT' },
    hero: {
      overline: 'Fallstudie',
      h1a: 'Die', h1b: 'Erdbeere',
      subline: 'Eine spanische Erdbeere kann klimafreundlicher sein als eine deutsche. Warum?',
      body: 'Erdbeeren gehören zu den beliebtesten Obstsorten in Deutschland. 2025 importierte Deutschland rund 133.000 Tonnen — der größte Teil aus Spanien. Doch ist regional automatisch besser? Diese Fallstudie vergleicht Anbau, Wasserverbrauch, Transport, CO₂-Ausstoß und Preise in Deutschland, Spanien und den Niederlanden.',
      importNum: '133.000 Tonnen',
      scroll: 'Scrollen',
    },
    comparison: {
      h2: 'Drei Länder im Vergleich',
      subtitle: 'Anbau · Wasser · Transport · Preis',
      fieldSeason: 'Saison',
      fieldCultivation: 'Hauptanbau',
      fieldCo2: 'CO₂e',
      fieldWater: 'Wasser',
      fieldTransport: 'Transport (n. NRW)',
      fieldPrice: 'Preis',
      de: {
        season: 'Mai – August',
        cultivation: 'Freiland + Folientunnel',
        co2: '0,3 kg/kg (Saison) · 3,4 kg/kg (Winter)',
        water: '321 L/kg (überwiegend Regenwasser)',
        transport: '~225 km',
        price: '6 – 13 €/kg',
        quote: 'Regional ≠ Nachhaltig',
      },
      es: {
        season: 'Januar/Februar – Juni',
        cultivation: 'Folientunnel, fast ausschließlich unter Glas',
        co2: '0,88 kg/kg',
        water: '209 L/kg (Grundwasser — Doñana belastet)',
        transport: 'Huelva → NRW, ~2.300 km',
        price: '4 – 6 €/kg',
        quote: 'Wichtigster Lieferant Deutschlands',
      },
      nl: {
        season: 'ganzjährig (Hightech-Gewächshaus)',
        cultivation: 'Hightech-Gewächshaus mit Geothermie',
        co2: '1,64 kg/kg',
        water: '~280 L/kg (Durchschnittswert)',
        transport: 'NL → NRW, ~250 km',
        price: '5 – 10 €/kg',
        quote: 'Technik senkt Energie — aber nicht genug',
      },
    },
    comparisonDetail: {
      label: 'Anbau im Detail',
      source: 'ISG M15 Präsentation (Folien 10–14), Frankfurt UAS; BMEL-Statistik 2025; Statista 2025',
      de: {
        blocks: [
          { title: '', bullets: ['Anbaufläche: ca. 10.640 Hektar Freiland (2025)', 'Saison: Mai/Juni bis August/September', 'Ernte: fast ausschließlich per Hand'] },
          { title: 'Hauptanbaugebiete', bullets: ['Niedersachsen', 'Baden-Württemberg', 'Nordrhein-Westfalen'] },
          { title: 'Freilandanbau', bullets: ['Stark witterungsabhängig', 'Erträge ca. 10 t/ha', 'Anbaufläche geht seit Jahren zurück'] },
          { title: 'Geschützter Anbau (Folie/Gewächshaus)', bullets: ['Erträge mehr als doppelt so hoch (ca. 23 t/ha) — deshalb wirtschaftlich attraktiver', 'Vorteil: frühere und längere Ernte, weniger Pflanzenschutzmittel nötig', 'Nachteil: Plastikfolien → Lösung: kompostierbare Folien aus nachwachsenden Rohstoffen (bereits in ökologischen Betrieben)'] },
        ],
        notes: ['Mulchfolien: Reduzieren Unkrautwachstum, halten Bodenfeuchtigkeit, schützen vor Schädlingen.', 'Ökologischer Anbau: Pflanzen wachsen mit mehr Abstand → weniger Pilzkrankheiten, aber auch geringerer Ertrag.'],
      },
      es: {
        blocks: [
          { title: '', bullets: ['Hauptregion: Huelva (Andalusien) — größter Erdbeer-Anbaugebiet Europas', 'Klima: warm, trocken → Ernte beginnt schon im Winter / frühen Frühjahr'] },
          { title: 'Typische Merkmale', bullets: ['Große Monokulturen unter Plastikfolien', 'Fast ausschließlich unter Glas/Folie (hohe Produktivität)', 'Sehr frühe Saison → versorgt Europa, wenn nirgendwo sonst Erdbeeren wachsen', 'Starke Exportorientierung', 'Intensive Bewässerung notwendig (Grundwasser, teils illegale Brunnen)', 'Bewässerung belastet den Nationalpark Doñana (UNESCO-Weltnaturerbe)'] },
        ],
        notes: ['Soziale Dimension: Schlechte Arbeitsbedingungen für Erntehelfer:innen — ein häufig kritisierter Aspekt bei spanischen Erdbeer-Importen.', 'Produktionskosten: Im Vergleich zu Deutschland deutlich niedriger — warmes Klima eliminiert Heizkosten, günstigere Löhne. Hauptkosten: Transport und Verpackung.'],
      },
      nl: {
        blocks: [
          { title: 'Anbauweise', bullets: ['Fast ausschließlich Hightech-Gewächshäuser', '66 von 86 Tausend Tonnen (2024) werden unter Glas produziert — ca. 76 %', 'Substrat- oder hydroponischer Anbau (Pflanzen wachsen ohne Erde in Nährlösung)', 'Hohe Produktivität auf kleiner Fläche', 'Lange Saison durch Klimakontrolle'] },
          { title: 'Technologie', bullets: ['Automatisierte Bewässerung und Klimasteuerung', 'Teilweise beheizte Gewächshäuser → hoher Energieaufwand', 'Geothermie und Wärmespeicher werden eingesetzt, um Energiekosten zu senken', 'Trotzdem: Gewächshausproduktion bleibt emissionsintensiv'] },
          { title: 'Kosten', bullets: ['Hohe Fixkosten für Infrastruktur und Technik', 'Energie für Heizung, Beleuchtung, Klimaregulierung macht den größten Teil der Produktionskosten aus'] },
        ],
        notes: [],
      },
    },
    co2: {
      badge: 'CO₂ Deep-Dive',
      h2: 'CO₂-Ausstoß: Produktionsweise schlägt Transportweg',
      lead: 'Oft wird angenommen, dass importierte Lebensmittel automatisch klimaschädlicher sind als regionale. Die Daten zeigen das Gegenteil: Bei Erdbeeren hat die Produktionsweise — vor allem Heizung im Gewächshaus — häufig den größten Einfluss auf die CO₂-Bilanz.',
      chartLabel: 'CO₂e (kg pro kg Erdbeeren)',
      calloutBadge: 'Aha-Moment',
      calloutNum: '11×',
      calloutBody: 'mehr CO₂. Deutsche Winter-Erdbeeren aus beheizten Gewächshäusern verursachen 11× so viele Emissionen wie deutsche Saison-Erdbeeren — und ~4× so viele wie spanische Importware.',
      source: 'Quellen: REWE Product-Carbon-Footprint-Studie, MyCarbon-Datenbank, Alfa Laval (Dutch Greenhouses), Utopia, Bayern 3',
      bars: [
        { label: 'DE Saison (Freiland)', sublabel: 'Mai – August' },
        { label: 'ES (Folientunnel + Transport)', sublabel: 'Huelva → NRW, 2.300 km' },
        { label: 'NL (Hightech-Gewächshaus)', sublabel: 'ganzjährig, Geothermie' },
        { label: 'DE Winter (beheiztes Gewächshaus)', sublabel: 'November – April' },
      ],
    },
    water: {
      badge: 'Wasser Deep-Dive',
      h2: 'Wasserverbrauch: Es kommt auf die Art an',
      lead: 'Erdbeeren bestehen zu 90 % aus Wasser — doch noch mehr Wasser braucht ihr Anbau. Im Durchschnitt sind das 280 Liter pro Kilo. Entscheidend ist aber nicht nur die Menge, sondern die Art des Wassers: „grünes Wasser" stammt aus Niederschlägen, „blaues Wasser" aus Bewässerungsanlagen und Grundwasserreserven.',
      leadBold: '280 Liter pro Kilo',
      chartLabel: 'Liter Wasser pro kg',
      chartNote: 'Weniger Liter bedeutet hier nicht automatisch besser — die Herkunft des Wassers ist entscheidend.',
      bars: [
        { label: 'Spanien', sublabel: 'blaues Wasser (Grundwasser)' },
        { label: 'Global Ø', sublabel: 'Mittelwert' },
        { label: 'Deutschland', sublabel: 'grünes Wasser (Regen)' },
      ],
      box1Title: '„Blaues Wasser" Spanien',
      box1Body: 'In Südspanien ist es trocken und mild. Erdbeeren werden mit Grundwasser bewässert — auch aus illegal angelegten Brunnen rund um den Doñana-Nationalpark. Das trocknet die Region weiter aus.',
      box2Title: '„Grünes Wasser" Deutschland',
      box2Body: 'In Deutschland deckt überwiegend Regenwasser den Bedarf. Der absolute Verbrauch pro Kilo ist zwar höher, belastet aber lokale Wasserressourcen weniger.',
      box3Title: '⚠️ Arbeitsbedingungen in Spanien',
      box3Body: 'Neben dem ökologischen Problem des Doñana-Nationalparks wird der spanische Erdbeeranbau regelmäßig wegen der Arbeitsbedingungen der Erntehelfer:innen kritisiert. Die Arbeit auf den Folienplantagen ist körperlich anspruchsvoll, die Löhne oft gering und Wohnverhältnisse auf dem Feld mangelhaft. Der günstige Preis spanischer Erdbeeren hat also nicht nur ökologische, sondern auch soziale Kosten.',
      source: 'Quellen: BUND, Naturfreunde, WWF, Water Footprint Network, taten-statt-worte.ch; BUND, Utopia (Arbeitsbedingungen)',
      nlWaterNote: '* Für die Niederlande liegt kein länderspezifischer Messwert vor. Der globale Durchschnittswert von 280 L/kg (Water Footprint Network, 2018) wird als Näherungswert verwendet.',
      waterSplit: {
        h3: 'Anbauweise bestimmt den Wasserverbrauch',
        body: 'Der Wasserverbrauch hängt nicht nur vom Land ab, sondern stark von der Anbauweise. Freilandanbau nutzt überwiegend Regenwasser, Gewächshaus- und Folienanbau benötigt deutlich mehr aktive Bewässerung.',
        freiland: {
          icon: '🌿',
          label: 'Freilandanbau',
          value: '~200 L/kg',
          sub: 'Überwiegend Niederschlag (grünes Wasser). Geringerer Bewässerungsbedarf.',
        },
        greenhouse: {
          icon: '🏭',
          label: 'Gewächshaus / Folienanbau',
          value: '~300 L/kg',
          sub: 'Aktive Bewässerung notwendig (blaues Wasser). 50 % mehr als im Freiland.',
        },
        insight: 'Das erklärt den Unterschied zwischen Ländern: Deutschland hat viel Freilandanbau → 321 L/kg Durchschnitt mit viel grünem Wasser. Spanien setzt auf Folien und intensive Bewässerung → 209 L/kg, aber fast ausschließlich blaues Grundwasser.',
        source: 'WWF, Naturfreunde — „Durchschnittlich 200 Liter im Freiland und 300 Liter im Folienanbau bzw. Gewächshaus sind für ein Kilo Beeren nötig."',
      },
      statsBox: {
        kicker: 'WASSER IN ZAHLEN',
        h3: 'Was der Wasserverbrauch in Zahlen bedeutet',
        intro: 'Für Deutschland und Spanien liegen länderspezifische Messwerte vor (321 L/kg bzw. 209 L/kg). Für die Niederlande wird der globale Durchschnittswert von 280 L/kg verwendet, da kein nationaler Messwert existiert. Die folgenden Gesamtmengen basieren auf der jeweiligen Jahresproduktion 2024.',
        stats: [
          { val: '38,6 Mrd. L', lab: 'DEUTSCHLAND 2024', sub: '321 L/kg × 120.350 t Erdbeeren (länderspezifischer Wert)' },
          { val: '67,6 Mrd. L', lab: 'SPANIEN 2024', sub: '209 L/kg × 323.460 t Erdbeeren (länderspezifischer Wert)' },
          { val: '24,19 Mrd. L', lab: 'NIEDERLANDE 2024', sub: '280 L/kg × 86.400 t (Durchschnittswert, da kein länderspezifischer Wert) — davon 12.271 t Export nach Deutschland' },
          { val: '78,4 Mrd. L', lab: 'DEUTSCHLAND 2023/24', sub: 'Verbrauch inkl. importierter Erdbeeren (280 L/kg × 280.000 t Gesamtverbrauch)' },
        ],
        perKopfH3: 'Pro-Kopf-Verbrauch: Erdbeeren in der persönlichen Wasserbilanz',
        perKopfBody: 'Im Schnitt isst jede:r Deutsche etwa 3,3 kg Erdbeeren pro Jahr (Stand 2025). Wie viel Wasser dahintersteht, hängt stark davon ab, woher die Erdbeeren kommen:',
        perKopfRows: [
          { icon: '🌐', label: 'Durchschnittswert (gemischte Herkunft)', val: 'ca. 924 L', calc: '3,3 kg × 280 L/kg' },
          { icon: '🇩🇪', label: 'Nur deutsche Erdbeeren', val: 'ca. 1.059 L', calc: '3,3 kg × 321 L/kg' },
          { icon: '🇪🇸', label: 'Nur spanische Erdbeeren', val: 'ca. 690 L', calc: '3,3 kg × 209 L/kg' },
        ],
        perKopfInsight: 'Bezogen auf den deutschen Gesamtverbrauch (≈280.000 t Erdbeeren pro Jahr) sind das rund 78,4 Mrd. Liter Wasser allein für den Erdbeerkonsum eines Jahres. Wichtig: Spanische Erdbeeren brauchen pro Kilo zwar weniger Wasser — aber aus belasteten Grundwasserreserven (blaues Wasser), während deutsche Erdbeeren überwiegend mit Regenwasser auskommen.',
        statSource: 'Eigene Berechnungen mit länderspezifischen Wasserwerten (Deutschland 321 L/kg, Spanien 209 L/kg) bzw. Durchschnittswert (Niederlande 280 L/kg). Quellen: Naturfreunde.de (Rottmann, 2015), Warenvergleich.de (2020), Statista (2024), Water Footprint Network (2018). Pro-Kopf-Verbrauch: Statista (2025), BLE.',
      },
    },
    transport: {
      badge: 'Transport-Routen',
      h2: 'Transport: 3.666 LKWs allein aus Huelva',
      lead: 'Frische Erdbeeren werden in Europa fast ausschließlich per Kühl-LKW transportiert. Bei einer Nutzlast von 20 t pro LKW ergeben sich pro Jahr ganz unterschiedliche Transportbilanzen.',
      leadBold: '20 t pro LKW',
      chartLabel: 'CO₂e Transport pro Jahr (Tonnen)',
      bars: [
        { label: 'Spanien', sublabel: 'Huelva → NRW, 73.312 t/Jahr, 2.300 km' },
        { label: 'Deutschland (intern)', sublabel: 'Inlandstransport, 128.410 t/Jahr, 225 km' },
        { label: 'Niederlande', sublabel: 'NL → NRW, 14.015 t/Jahr, 250 km' },
      ],
      thOrigin: 'Herkunft', thDist: 'Distanz', thTrips: 'LKW-Fahrten/Jahr', thCo2: 'CO₂e pro 500-g-Schale', thCost: 'Transportkosten/Schale',
      tableNote: '* Importmengen: UN Comtrade / WITS, vollständige Jahresdaten 2024. Für 2025 liegen noch keine vollständigen Daten vor.',
      truckH3: 'Warum (fast) immer der Kühl-LKW?',
      truckLead: 'Frische Erdbeeren sind kurzlebig, druckempfindlich und brauchen eine durchgängige Kühlkette. Andere Transportmittel sind technisch möglich, spielen aber bei Erdbeeren kaum eine Rolle.',
      source: 'Quellen: WITS/UN Comtrade, BMEL, Thünen-Institut, REWE PCF, EcoTransIT, GHG Protocol, UK DESNZ (Conversion Factors 2025), IRU',
    },
    season: {
      badge: 'Saison-Kalender',
      h2: 'Wann kommt welche Erdbeere?',
      lead: 'Ein Blick in den Saisonkalender zeigt, wann Erdbeeren aus welchem Land verfügbar sind — und wann beheizte Gewächshäuser nötig werden.',
      months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      rows: ['🇩🇪 Deutschland (Freiland)', '🇪🇸 Spanien', '🇳🇱 Niederlande (Hightech)', '🇩🇪 DE Winter-Gewächshaus'],
      note: 'Hinweis: Die rote Zeile markiert Wintermonate, in denen deutsche Erdbeeren aus beheizten Gewächshäusern kommen — ~3,4 kg CO₂e/kg.',
      takeaway: 'Die klimafreundlichste Wahl ist die',
      takeawayBold1: 'deutsche Erdbeere von Mai bis August',
      takeawayMid: '. Außerhalb dieser Zeit ist eine',
      takeawayBold2: 'spanische Saison-Erdbeere meist besser als deutsche Winterware',
      takeawayEnd: '.',
    },
    price: {
      badge: 'Preis-Breakdown',
      h2: 'Was kostet eine 500-g-Schale wirklich?',
      chartLabel: 'Verkaufspreis-Spanne (€/kg)',
      transportLabel: 'Davon Transportkosten pro 500-g-Schale',
      insightBadge: 'Insight',
      insightBody: 'Der Transport macht selbst bei der weitesten Strecke (Spanien → Deutschland) nur etwa 9 – 11 Cent je Schale aus. Größere Preisunterschiede entstehen durch Lohn-, Ernte- und Energiekosten.',
      insightBold: '9 – 11 Cent je Schale',
    },
    prodCosts: {
      badge: 'PRODUKTIONSKOSTEN',
      h2: 'Warum Erdbeeren so unterschiedlich teuer sind',
      erkBadge: 'ERKENNTNIS',
      erkBody: 'Länder mit wärmerem Klima benötigen weniger Energie für die Produktion. Gewächshausanbau in kälteren Regionen verursacht deutlich höhere Produktionskosten — und höhere CO₂-Emissionen. Das erklärt, warum spanische Erdbeeren trotz weiter Transportwege oft günstiger sind als deutsche Winterware.',
      erkSource: 'Quelle: DGG (Deutsche Gartenbauwissenschaftliche Gesellschaft) 2018',
      cards: [
        { flag: '🇩🇪', country: 'Deutschland', accent: 'bg-country-de', text: 'text-charcoal', headline: 'Saison günstig, Winter teuer', bullets: ['Saisonaler Freilandanbau: vergleichsweise geringe Energiekosten', 'Außerhalb der Saison: Kosten steigen stark durch beheizte Gewächshäuser', 'Hohe Arbeitskosten in der Ernte'] },
        { flag: '🇪🇸', country: 'Spanien', accent: 'bg-country-es', text: 'text-white', headline: 'Klima senkt Energiekosten', bullets: ['Warmes Klima reduziert Heizkosten deutlich', 'Folientunnel oder unbeheizte Gewächshäuser dominieren', 'Hauptkosten: Transport und Verpackung'] },
        { flag: '🇳🇱', country: 'Niederlande', accent: 'bg-country-nl', text: 'text-white', headline: 'Technik treibt die Kosten', bullets: ['Hightech-Gewächshäuser benötigen Heizung, Beleuchtung und Klimasteuerung', 'Moderne Geothermie soll Energiekosten senken', 'Hohe Fixkosten für Infrastruktur und Technik'] },
      ],
    },
    preisentwicklung: {
      badge: 'PREISENTWICKLUNG',
      h2: 'Warum deutsche Erdbeeren immer teurer werden',
      intro: 'Die Preise für heimische Erdbeeren sind in den vergangenen zehn Jahren um fast 70 Prozent gestiegen — und das hat strukturelle Ursachen. Während Importe aus Spanien günstiger bleiben, kämpft der deutsche Erdbeeranbau mit steigenden Löhnen, schrumpfenden Betrieben und sinkender Selbstversorgung.',
      stats: [
        { value: '+68,8 %', label: 'Preisanstieg 2015–2024', sub: '3,94 €/kg (2015) → 6,65 €/kg (2024)', cls: 'text-amber-600' },
        { value: '−24,1 %', label: 'Weniger Betriebe', sub: 'Rückgang auf 1.702 Betriebe (Statistisches Bundesamt)', cls: 'text-rose-600' },
        { value: '−28,4 %', label: 'Anbaufläche geschrumpft', sub: 'Von ~18.400 ha auf 13.149 ha', cls: 'text-rose-600' },
        { value: '−30,3 %', label: 'Weniger Ernte', sub: 'Erntemenge sank auf 120.352 Tonnen', cls: 'text-rose-600' },
        { value: '50–60 %', label: 'Personalkosten-Anteil', sub: 'Ernte per Hand — größter Kostenfaktor', cls: 'text-burgundy' },
        { value: '68 % → 50 %', label: 'Selbstversorgungsgrad', sub: 'Deutschland deckt nur noch die Hälfte des Bedarfs selbst', cls: 'text-rose-600' },
      ],
      mindestlohn: {
        title: 'Der Mindestlohn als Haupttreiber',
        text: 'Da Erdbeeren ausschließlich von Hand geerntet werden, machen Personalkosten 50–60 % der Produktionskosten aus. Der gestiegene Mindestlohn hat den deutschen Anbau unter starken Druck gesetzt.',
        year2015: { year: '2015', lohn: '8,50 €/Std', lohnLabel: 'Mindestlohn', preis: '3,94 €/kg', preisLabel: 'Erdbeerpreis' },
        year2025: { year: '2025', lohn: '12,82 €/Std', lohnLabel: 'Mindestlohn', preis: '6,65 €/kg', preisLabel: 'Erdbeerpreis (2024)' },
        lohnChange: '+51 %',
        preisChange: '+69 %',
        lohnChangeLabel: 'Mindestlohn',
        preisChangeLabel: 'Erdbeerpreis',
      },
      insight: {
        badge: 'ERKENNTNIS',
        text: 'Laut dem Verband Süddeutscher Spargel- und Erdbeeranbauer (VSSE) haben viele Betriebe wegen der Lohnkostensteigerungen aufgegeben oder ihre Anbauflächen reduziert. Die Folge: Deutschland importiert heute mehr Erdbeeren denn je — vor allem aus Spanien.',
      },
      chain: {
        title: 'Die Kettenreaktion',
        steps: [
          { label: 'Mindestlohn', change: '↑' },
          { label: 'Personalkosten', change: '↑' },
          { label: 'Betriebe geben auf', change: '' },
          { label: 'Anbaufläche', change: '↓' },
          { label: 'Ernte', change: '↓' },
          { label: 'Selbstversorgung', change: '↓' },
          { label: 'Importquote', change: '↑' },
          { label: 'Spanien-Abhängigkeit', change: '↑' },
        ],
        source: 'Quelle: Agrarmarkt Informations-Gesellschaft (AMI), Statistisches Bundesamt, VSSE — zitiert in: Welt.de, 2024',
      },
    },
    market: {
      badge: 'Marktdaten',
      h2: 'Der Erdbeere-Markt in Zahlen',
      lead: 'Wer produziert wie viel? Wie viel kauft Deutschland ein? Und wie verändert sich der heimische Anbau? Ein Blick auf die Marktdaten zeigt: Spanien dominiert die EU-Produktion, Deutschland importiert mehr als die Hälfte seines Bedarfs — und die heimische Anbaufläche schrumpft seit Jahren.',
      chartA: 'Top 8 Erdbeer-Produzenten in der EU 2024 (in 1.000 Tonnen)',
      chartASource: 'Quelle: Statista (2025), Eurostat',
      chartB: 'Wichtigste Lieferländer von Erdbeerimporten nach Deutschland (Werte in Tsd. Tonnen)',
      chartBCaption: 'Spanien liefert über 60 % der deutschen Erdbeerimporte — Tendenz steigend.',
      chartBSource: 'Quelle: Statista (2025), Statistisches Bundesamt',
      chartC: 'Anbaufläche von Erdbeeren in Deutschland 2012–2024 (in 1.000 Hektar)',
      chartCSource: 'Quelle: Statista (2025), Statistisches Bundesamt',
      chartD: 'Erntemenge in Deutschland 2024 nach Anbauweise',
      chartDCaption: 'Der Anteil des geschützten Anbaus steigt — die Erträge dort sind mehr als doppelt so hoch wie im Freiland (≈23 t/ha vs. ≈10 t/ha).',
      chartDSource: 'Quelle: Statista (2025), BMEL',
      chartE: 'Pro-Kopf-Verbrauch von Erdbeeren in Deutschland (kg pro Jahr)',
      chartECaption: 'Der Konsum schwankt zwischen 3,3 und 4,0 kg pro Kopf — Erdbeeren bleiben beliebt, trotz schrumpfender Anbaufläche.',
      chartESource: 'Quelle: Statista (2025), BLE',
      donutLabel: 'Freiland',
      donutSeg1: 'Freiland — 78.600 t (65 %)',
      donutSeg2: 'Geschützter Anbau — 41.750 t (35 %)',
      summaryBadge: 'Was die Zahlen zeigen',
      summaryBody: 'Deutschland produziert nur etwa 39 % seines Erdbeerbedarfs selbst — und der heimische Anbau geht zurück. Gleichzeitig steigt der Anteil des geschützten Anbaus (Folie/Glas), der zwar ertragreicher, aber auch energieintensiver ist. Die Lücke füllen Importe — vor allem aus Spanien.',
      summaryBold: '39 % seines Erdbeerbedarfs',
      bioH3: 'Bio-Erdbeeren: ein verschwindender Markt',
      bioChartTitle: 'Bio-Erdbeer-Ernte in Deutschland 2013–2024 (in Tonnen)',
      bioAnnotation: '−67 % seit 2014',
      bioStat1Val: '1 %', bioStat1Sub: 'Bio-Anteil an der Gesamternte',
      bioStat2Val: '−67 %', bioStat2Sub: 'Bio-Rückgang seit Spitzenjahr 2014',
      bioStat3Val: '1.258 t', bioStat3Sub: 'Bio-Ernte 2024 (von 120.350 t gesamt)',
      bioCaption: 'Während Verbraucher zunehmend nach nachhaltigen Produkten fragen, geht die deutsche Bio-Erdbeer-Produktion seit Jahren zurück. Höhere Kosten, niedrigere Erträge und Konkurrenz durch importierte Bio-Ware spielen eine Rolle.',
      bioSource: 'Quelle: Statista (2025), Statistisches Bundesamt',
    },
    conclusion: {
      badge: 'Fazit',
      h2: 'Drei Erkenntnisse',
      findings: [
        { num: '01', title: 'Saison schlägt Region', body: 'Deutsche Erdbeeren in der Saison (Mai – August) sind die klimafreundlichste Wahl. Außerhalb der Saison: lieber spanische Saison-Erdbeeren als deutsche Winterware.' },
        { num: '02', title: 'Produktionsweise > Transportweg', body: 'Heizung, Beleuchtung und Klimatechnik im Gewächshaus verursachen oft mehr CO₂ als der LKW-Transport über 2.300 km.' },
        { num: '03', title: 'Wasser ist nicht gleich Wasser', body: 'Spanien verbraucht weniger Liter — aber aus belasteten Grundwasserreserven. Deutschland verbraucht mehr Liter — aber überwiegend aus Niederschlägen.' },
      ],
      sourcesH3: 'Quellen & Methodik',
      sourcesSubtitle: 'Alle Daten basieren auf peer-reviewten Studien und offiziellen Datenbanken',
    },
    methodik: {
      badge: 'Methodik',
      h2: 'Methodik der Ökobilanz',
      lca: {
        title: 'Lebenszyklusanalyse (LCA)',
        intro: 'Die LCA ist die zentrale Methode zur Durchführung einer Ökobilanz. Sie analysiert alle Umweltwirkungen über den gesamten Lebenszyklus eines Produkts — von der Rohstoffgewinnung bis zur Entsorgung (\'cradle to grave\'). Bei Lebensmitteln hilft sie, die relevantesten Emissionsquellen zu identifizieren.',
        phases: [
          'Ziel- und Untersuchungsrahmen definieren',
          'Sachbilanz (Life Cycle Inventory – LCI): Datenerfassung aller Inputs und Outputs',
          'Wirkungsabschätzung (Life Cycle Impact Assessment – LCIA): Berechnung von Klimawirkung, Wasserverbrauch, etc.',
          'Interpretation der Ergebnisse',
        ],
      },
      systemgrenzen: {
        title: 'Systemgrenzen: Farm to Fork',
        text: 'Die Systemgrenzen legen fest, welche Prozessschritte in der Analyse berücksichtigt werden. Diese Fallstudie folgt dem \'Farm to Fork\'-Ansatz — vom Anbau bis zum Kaufpunkt.',
        steps: [
          { icon: '🌱', label: 'Produktion', sub: 'Anbau, Bewässerung, Dünger' },
          { icon: '📦', label: 'Verarbeitung & Verpackung', sub: '' },
          { icon: '🚛', label: 'Transport & Handel', sub: '' },
          { icon: '🛒', label: 'Konsum', sub: '' },
        ],
        note: 'Prozesse außerhalb dieser Grenzen — z. B. Verpackungsentsorgung nach dem Kauf — bleiben unberücksichtigt. Die Systemgrenzen beeinflussen die Vergleichbarkeit der Ergebnisse.',
      },
      co2e: {
        title: 'CO₂-Äquivalente (CO₂e)',
        text: 'CO₂e ist eine standardisierte Einheit, die verschiedene Treibhausgase über ihr Global Warming Potential (GWP) vergleichbar macht. Berücksichtigte Gase:',
        gases: [
          { formula: 'CO₂', name: 'Kohlendioxid' },
          { formula: 'CH₄', name: 'Methan' },
          { formula: 'N₂O', name: 'Lachgas' },
        ],
        footer: 'Angegeben als kg CO₂e pro kg Lebensmittel — der zentrale Indikator für die Klimawirkung von Lebensmitteln in dieser Fallstudie.',
      },
      disclaimer: {
        title: 'ℹ️ Methodische Einschränkung',
        text: 'Die Transportemissionen in dieser Fallstudie sind Modellrechnungen auf Basis von 0,12 kg CO₂e/tkm (gekühlter Straßengütertransport). Sie umfassen ausschließlich den Transport — nicht Anbau, Verpackung, Lagerung oder Handel. Die Gesamtemissionen pro kg Erdbeeren (0,3 / 0,88 / 1,64 / 3,4 kg CO₂e) stammen aus Produktlebenszyklus-Studien (REWE PCF-Studie, MyCarbon-Datenbank) mit eigenem Systemgrenzen-Rahmen.',
        source: 'Methodik: ISG M15 Präsentation, Frankfurt University of Applied Sciences',
      },
    },
    forschungsfrage: {
      label: 'Forschungsfrage',
      text: 'Wie unterscheiden sich die Ökobilanzen von Erdbeeren aus Deutschland, Spanien und den Niederlanden hinsichtlich Wasserverbrauch, Energieeinsatz und Transportemissionen?',
    },
    wissen: {
      sectionLabel: 'Allgemeines',
      title: 'Was du vielleicht noch nicht wusstest 🍓',
      cards: [
        { icon: '🔬', title: 'Sammelnussfrucht', body: 'Erdbeeren sind botanisch keine Beeren, sondern Sammelnussfrüchte — die rote Frucht ist der verdickte Blütenboden.' },
        { icon: '🌍', title: '1.000+ Sorten weltweit', body: 'Über 1.000 verschiedene Erdbeersorten sind weltweit bekannt und kultiviert.' },
        { icon: '💧', title: '90 % Wasser', body: 'Eine Erdbeere besteht zu 90 % aus Wasser. Für die Herstellung von 1 kg werden ca. 280 Liter benötigt — etwa 2 volle Badewannen.' },
        { icon: '🌱', title: 'Vitaminreich', body: 'Erdbeeren liefern Vitamin C, Calcium, Magnesium und Kalium.' },
        { icon: '🌐', title: '9 Mio. Tonnen/Jahr weltweit', body: 'Jährlich werden knapp 9 Millionen Tonnen Erdbeeren geerntet. Ein Drittel davon kommt aus China — vor allem als Trockenfrüchte und Fruchtjoghurts.' },
        { icon: '🏆', title: 'Spanien: Platz 6 weltweit', body: 'Mit ca. 360.000 Tonnen ist Spanien der sechstgrößte Produzent weltweit und mit Abstand der größte in der EU. Deutschland liegt auf Platz 13.' },
      ],
    },
    gesamtanalyse: {
      badge: 'GESAMTANALYSE',
      h2: 'Wer gewinnt — und in welcher Kategorie?',
      intro: 'Keine Erdbeere ist in jeder Hinsicht die beste Wahl. Die Ökobilanz hängt immer von Jahreszeit, Produktionsweise und Bewertungskriterium ab. Diese Tabelle zeigt, welches Herkunftsland in welcher Dimension die Nase vorn hat.',
      thDimension: 'Dimension',
      thDe: '🇩🇪 DE Saison',
      thDeWinter: '🇩🇪 DE Winter',
      thEs: '🇪🇸 Spanien',
      thNl: '🇳🇱 Niederlande',
      legend: '🟢 Bestes Ergebnis in dieser Kategorie  ·  🟡 Mittleres Ergebnis  ·  🔴 Schlechtestes Ergebnis',
      rows: [
        { dim: 'CO₂e (Produktion)', cells: [
          { score: 'GOOD', val: '0,3 kg/kg' },
          { score: 'BAD', val: '3,4 kg/kg' },
          { score: 'MEDIUM', val: '0,88 kg/kg' },
          { score: 'BAD', val: '1,64 kg/kg' },
        ]},
        { dim: 'CO₂e (Transport)', cells: [
          { score: 'GOOD', val: '14 g/Schale' },
          { score: 'GOOD', val: '14 g/Schale' },
          { score: 'BAD', val: '138 g/Schale' },
          { score: 'MEDIUM', val: '15 g/Schale' },
        ]},
        { dim: 'Wasserverbrauch (L/kg)', cells: [
          { score: 'MEDIUM', val: '321 L (grün)' },
          { score: 'MEDIUM', val: '321 L (grün)' },
          { score: 'GOOD', val: '209 L (blau)' },
          { score: 'MEDIUM', val: '280 L' },
        ]},
        { dim: 'Wasserqualität', cells: [
          { score: 'GOOD', val: 'Regenwasser' },
          { score: 'GOOD', val: 'Regenwasser' },
          { score: 'BAD', val: 'Grundwasser' },
          { score: 'MEDIUM', val: 'Gemischt' },
        ]},
        { dim: 'Verkaufspreis', cells: [
          { score: 'BAD', val: '6–13 €/kg' },
          { score: 'BAD', val: '6–13 €/kg' },
          { score: 'GOOD', val: '4–6 €/kg' },
          { score: 'MEDIUM', val: '5–10 €/kg' },
        ]},
        { dim: 'Saisonverfügbarkeit', cells: [
          { score: 'BAD', val: '4 Monate' },
          { score: 'MEDIUM', val: 'ganzjährig' },
          { score: 'GOOD', val: '6 Monate' },
          { score: 'GOOD', val: 'ganzjährig' },
        ]},
        { dim: 'Arbeitsbedingungen', cells: [
          { score: 'GOOD', val: 'gut' },
          { score: 'GOOD', val: 'gut' },
          { score: 'BAD', val: 'kritisiert' },
          { score: 'MEDIUM', val: 'mittel' },
        ]},
      ],
      takeaways: [
        { title: 'Die beste Wahl im Sommer', body: 'Wer von Mai bis August einkauft, sollte zur deutschen Freiland-Erdbeere greifen: niedrigster CO₂-Fußabdruck, kurze Transportwege, kein belastetes Grundwasser.' },
        { title: 'Die beste Wahl im Winter/Frühjahr', body: 'Außerhalb der deutschen Saison ist die spanische Freiland-Erdbeere in der CO₂-Bilanz deutlich besser als deutsche Gewächshausware — trotz 2.300 km Transport.' },
        { title: 'Das versteckte Problem', body: 'Niederländische und deutsche Wintererdbeeren aus beheizten Gewächshäusern sehen nachhaltig aus (kurze Wege, modernes Gebäude) — sind es aber wegen des Energieaufwands nicht. Produktionsweise schlägt Transportweg fast immer.' },
      ],
      erkBadge: 'Erkenntnis',
      source: 'ISG M15 Präsentation (Gliederung Punkt 8), CO₂-Ausstoß-Daten, Transportwege Erdbeeren, Wasserverbrauchsanalyse, Produktionskosten-Daten',
    },
    vorteile: {
      badge: 'VERGLEICH',
      h2: 'Vorteile & Nachteile auf einen Blick',
      intro: 'Jedes Herkunftsland hat ökologische, wirtschaftliche und soziale Stärken und Schwächen. Die folgende Übersicht fasst die wichtigsten zusammen.',
      vorteilLabel: 'Vorteile',
      nachteilLabel: 'Nachteile',
      source: 'ISG M15 Präsentation (Folien 32–34), Frankfurt UAS; CO₂-Ausstoß-Daten; Transportwege Erdbeeren',
      de: {
        vorteile: [
          'Kurze Transportwege → geringe Transportemissionen',
          'Frische und aromatische Früchte (kurze Zeit vom Feld zum Markt)',
          'Beste Klimabilanz während der Saison (0,3 kg CO₂e/kg)',
          'Regenwasser-Bewässerung — belastet Grundwasser kaum',
        ],
        nachteile: [
          'Höchste Preise (6–13 €/kg)',
          'Stark wetterabhängig — Ernteausfälle möglich',
          'Kurze Saison (nur Mai–August)',
          'Außerhalb der Saison: Gewächshaus nötig → bis zu 3,4 kg CO₂e/kg',
          'Steigende Produktionskosten durch hohen Mindestlohn',
        ],
      },
      es: {
        vorteile: [
          'Günstigste Preise (4–6 €/kg)',
          'Lange Saison (Januar–Juni) → versorgt Europa im Winter/Frühjahr',
          'Geringer Energiebedarf durch warmes Klima',
          'Hohe Produktionsmengen (größter EU-Produzent)',
          'Trotz langer Strecke: Klimabilanz besser als deutsche Winterware',
        ],
        nachteile: [
          'Höchste Transportemissionen (138 g CO₂e pro 500-g-Schale)',
          'Grundwasserentnahme belastet Doñana-Nationalpark (UNESCO)',
          'Teils illegale Brunnen',
          'Schlechte Arbeitsbedingungen für Erntehelfer:innen',
          'Plastikfolien als Abfallproblem',
        ],
      },
      nl: {
        vorteile: [
          'Ganzjährige Verfügbarkeit durch Hightech-Gewächshäuser',
          'Hohe Erträge auf kleiner Fläche',
          'Kurze Transportwege nach Deutschland (~250 km)',
          'Einsatz von Geothermie und Wärmespeichern senkt Energiekosten',
          'Substrat-/hydroponischer Anbau — kein Bodenverschleiß',
        ],
        nachteile: [
          'Höchster CO₂e-Wert unter den Import-Optionen (1,64 kg CO₂e/kg)',
          'Hoher Energiebedarf für Heizung, Beleuchtung, Klimasteuerung',
          'Hohe Fixkosten für Infrastruktur und Technik',
          'Gewächshausproduktion bleibt emissionsintensiv trotz moderner Technik',
        ],
      },
    },
    saisonluecke: {
      title: '💡 Die Saisonlücke: 8 Monate ohne deutsche Erdbeeren',
      body: 'Die deutsche Freiland-Saison dauert nur 4 Monate — von Mai bis August. Den Rest des Jahres, also 8 Monate, muss Deutschland seinen Erdbeerkonsum vollständig durch Importe oder energieintensive Gewächshäuser decken. Genau diese Lücke macht Spanien zum unverzichtbaren Lieferanten: Spanische Erdbeeren sind ab Januar verfügbar — vier Monate bevor die erste deutsche Freilanderdbeere reif ist.',
      bar1Label: '4 Monate — Deutsche Freiland-Saison (Mai–August)',
      bar1Co2: '0,3 kg CO₂e/kg',
      bar2Label: '8 Monate — Importbedarf oder Gewächshaus (Sep–April)',
      bar2Co2: 'bis zu 3,4 kg CO₂e/kg',
      insight: 'Wer im Oktober eine deutsche Erdbeere kauft, kauft mit hoher Wahrscheinlichkeit Gewächshausware — mit über 11× dem CO₂-Fußabdruck einer Sommer-Erdbeere.',
    },
    footer: {
      team: 'Eine Fallstudie des ECOFOOTPRINT-Teams: Bianca Wassmann, Ivana Cvijetinović, Jenny Senge, Kartik Chauhan, Lars Krüger, Mohammed Al-Awadhi',
      course: 'M15 ISG · Modul Ökologische Nachhaltigkeit · Frankfurt University of Applied Sciences',
      backBtn: 'Zurück zur Übersicht',
    },
  },

  en: {
    header: { breadcrumb: 'Case Study', back: 'ECOFOOTPRINT' },
    hero: {
      overline: 'Case Study',
      h1a: 'The', h1b: 'Strawberry',
      subline: 'A Spanish strawberry can be more climate-friendly than a German one. Why?',
      body: 'Strawberries are one of Germany\'s most popular fruits. In 2025, Germany imported around 133,000 tonnes — mostly from Spain. But does regional automatically mean better? This case study compares cultivation, water usage, transport, CO₂ emissions and prices in Germany, Spain and the Netherlands.',
      importNum: '133,000 tonnes',
      scroll: 'Scroll',
    },
    comparison: {
      h2: 'Three Countries Compared',
      subtitle: 'Cultivation · Water · Transport · Price',
      fieldSeason: 'Season',
      fieldCultivation: 'Cultivation',
      fieldCo2: 'CO₂e',
      fieldWater: 'Water',
      fieldTransport: 'Transport (to NRW)',
      fieldPrice: 'Price',
      de: {
        season: 'May – August',
        cultivation: 'Open field + polytunnel',
        co2: '0.3 kg/kg (in season) · 3.4 kg/kg (winter)',
        water: '321 L/kg (mostly rainwater)',
        transport: '~225 km',
        price: '€6 – 13/kg',
        quote: 'Regional ≠ Sustainable',
      },
      es: {
        season: 'January/February – June',
        cultivation: 'Polytunnel, almost entirely under cover',
        co2: '0.88 kg/kg',
        water: '209 L/kg (groundwater — Doñana at risk)',
        transport: 'Huelva → NRW, ~2,300 km',
        price: '€4 – 6/kg',
        quote: "Germany's largest supplier",
      },
      nl: {
        season: 'Year-round (high-tech greenhouse)',
        cultivation: 'High-tech greenhouse with geothermal',
        co2: '1.64 kg/kg',
        water: '~280 L/kg (average)',
        transport: 'NL → NRW, ~250 km',
        price: '€5 – 10/kg',
        quote: 'Technology reduces energy — but not enough',
      },
    },
    comparisonDetail: {
      label: 'Cultivation in Detail',
      source: 'ISG M15 Presentation (Slides 10–14), Frankfurt UAS; BMEL Statistics 2025; Statista 2025',
      de: {
        blocks: [
          { title: '', bullets: ['Cultivation area: approx. 10,640 ha open field (2025)', 'Season: May/June to August/September', 'Harvest: almost exclusively by hand'] },
          { title: 'Main growing regions', bullets: ['Lower Saxony', 'Baden-Württemberg', 'North Rhine-Westphalia'] },
          { title: 'Open-field growing', bullets: ['Highly weather-dependent', 'Yields approx. 10 t/ha', 'Cultivation area has been declining for years'] },
          { title: 'Protected growing (polytunnel/greenhouse)', bullets: ['Yields more than double (approx. 23 t/ha) — hence economically more attractive', 'Advantage: earlier and longer harvest, fewer pesticides needed', 'Disadvantage: plastic film → solution: compostable films from renewable raw materials (already used by organic farms)'] },
        ],
        notes: ['Mulch films: reduce weed growth, retain soil moisture, protect against pests.', 'Organic growing: plants grow with more spacing → fewer fungal diseases, but also lower yields.'],
      },
      es: {
        blocks: [
          { title: '', bullets: ['Main region: Huelva (Andalusia) — largest strawberry growing area in Europe', 'Climate: warm and dry → harvest starts as early as winter / early spring'] },
          { title: 'Typical characteristics', bullets: ['Large monocultures under plastic film', 'Almost exclusively under glass/film (high productivity)', 'Very early season → supplies Europe when no strawberries grow elsewhere', 'Strong export orientation', 'Intensive irrigation required (groundwater, partly illegal wells)', 'Irrigation threatens Doñana National Park (UNESCO World Heritage Site)'] },
        ],
        notes: ['Social dimension: poor working conditions for harvest workers — a frequently criticised aspect of Spanish strawberry imports.', 'Production costs: significantly lower than in Germany — warm climate eliminates heating costs, cheaper labour. Main costs: transport and packaging.'],
      },
      nl: {
        blocks: [
          { title: 'Growing method', bullets: ['Almost exclusively high-tech greenhouses', '66 of 86 thousand tonnes (2024) produced under glass — approx. 76%', 'Substrate or hydroponic growing (plants grow without soil in nutrient solution)', 'High productivity on small area', 'Long season through climate control'] },
          { title: 'Technology', bullets: ['Automated irrigation and climate control', 'Partially heated greenhouses → high energy use', 'Geothermal and thermal storage used to reduce energy costs', 'Nevertheless: greenhouse production remains emission-intensive'] },
          { title: 'Costs', bullets: ['High fixed costs for infrastructure and technology', 'Energy for heating, lighting and climate regulation accounts for the largest share of production costs'] },
        ],
        notes: [],
      },
    },
    co2: {
      badge: 'CO₂ Deep-Dive',
      h2: 'CO₂ Emissions: Production Method Beats Transport',
      lead: 'It is often assumed that imported food is automatically more harmful to the climate than local produce. The data shows the opposite: for strawberries, the production method — especially greenhouse heating — usually has the biggest impact on the carbon footprint.',
      chartLabel: 'CO₂e (kg per kg of strawberries)',
      calloutBadge: 'Key Finding',
      calloutNum: '11×',
      calloutBody: 'more CO₂. German winter strawberries from heated greenhouses produce 11× as many emissions as German in-season strawberries — and ~4× as many as Spanish imports.',
      source: 'Sources: REWE Product Carbon Footprint Study, MyCarbon Database, Alfa Laval (Dutch Greenhouses), Utopia, Bayern 3',
      bars: [
        { label: 'DE Season (Open field)', sublabel: 'May – August' },
        { label: 'ES (Polytunnel + Transport)', sublabel: 'Huelva → NRW, 2,300 km' },
        { label: 'NL (High-tech greenhouse)', sublabel: 'Year-round, geothermal' },
        { label: 'DE Winter (Heated greenhouse)', sublabel: 'November – April' },
      ],
    },
    water: {
      badge: 'Water Deep-Dive',
      h2: 'Water Usage: What Matters Is the Type',
      lead: 'Strawberries are 90% water — yet growing them requires even more. On average, that\'s 280 litres per kilo. What matters is not only the quantity, but the type of water: "green water" comes from rainfall, "blue water" from irrigation systems and groundwater reserves.',
      leadBold: '280 litres per kilo',
      chartLabel: 'Litres of water per kg',
      chartNote: 'Fewer litres does not automatically mean better — the source of the water is what matters.',
      bars: [
        { label: 'Spain', sublabel: 'blue water (groundwater)' },
        { label: 'Global avg.', sublabel: 'average' },
        { label: 'Germany', sublabel: 'green water (rainfall)' },
      ],
      box1Title: '"Blue Water" Spain',
      box1Body: 'Southern Spain is hot and dry. Strawberries are irrigated with groundwater — including from illegally drilled wells around the Doñana National Park. This further depletes the region\'s water reserves.',
      box2Title: '"Green Water" Germany',
      box2Body: 'In Germany, rainfall mostly covers the crop\'s water needs. While the total litres per kilo is higher, it places less strain on local water resources.',
      box3Title: '⚠️ Working Conditions in Spain',
      box3Body: 'Alongside the ecological problem of Doñana National Park, Spanish strawberry growing is regularly criticised for the working conditions of harvest workers. Work on the polytunnel plantations is physically demanding, wages are often low and on-farm housing is frequently inadequate. The low price of Spanish strawberries therefore carries not only ecological but also social costs.',
      source: 'Sources: BUND, Naturfreunde, WWF, Water Footprint Network, taten-statt-worte.ch; BUND, Utopia (working conditions)',
      nlWaterNote: '* No country-specific measurement is available for the Netherlands. The global average of 280 L/kg (Water Footprint Network, 2018) is used as an approximation.',
      waterSplit: {
        h3: 'Cultivation method determines water use',
        body: 'Water consumption depends not only on the country but strongly on the cultivation method. Open-field growing uses mainly rainwater; greenhouse and polytunnel growing requires significantly more active irrigation.',
        freiland: {
          icon: '🌿',
          label: 'Open-field growing',
          value: '~200 L/kg',
          sub: 'Mainly rainfall (green water). Lower irrigation requirement.',
        },
        greenhouse: {
          icon: '🏭',
          label: 'Greenhouse / polytunnel',
          value: '~300 L/kg',
          sub: 'Active irrigation required (blue water). 50% more than open field.',
        },
        insight: 'This explains the difference between countries: Germany has a lot of open-field growing → 321 L/kg average with mostly green water. Spain relies on film and intensive irrigation → 209 L/kg, but almost exclusively blue groundwater.',
        source: 'WWF, Naturfreunde — "On average 200 litres in open-field and 300 litres in polytunnel / greenhouse growing are needed for one kilo of berries."',
      },
      statsBox: {
        kicker: 'WATER IN NUMBERS',
        h3: 'What the Water Footprint Means in Numbers',
        intro: 'Country-specific measurements are available for Germany and Spain (321 L/kg and 209 L/kg respectively). For the Netherlands the global average of 280 L/kg is used, as no national figure exists. The totals below are based on the respective 2024 production volumes.',
        stats: [
          { val: '38.6 bn L', lab: 'GERMANY 2024', sub: '321 L/kg × 120,350 t of strawberries (country-specific value)' },
          { val: '67.6 bn L', lab: 'SPAIN 2024', sub: '209 L/kg × 323,460 t of strawberries (country-specific value)' },
          { val: '24.19 bn L', lab: 'NETHERLANDS 2024', sub: '280 L/kg × 86,400 t (average value, no country-specific figure) — of which 12,271 t exported to Germany' },
          { val: '78.4 bn L', lab: 'GERMANY 2023/24', sub: 'Consumption incl. imported strawberries (280 L/kg × 280,000 t total consumption)' },
        ],
        perKopfH3: 'Per-Capita Consumption: Strawberries in Your Personal Water Footprint',
        perKopfBody: 'On average, each person in Germany eats about 3.3 kg of strawberries per year (as of 2025). How much water that represents depends heavily on where the strawberries come from:',
        perKopfRows: [
          { icon: '🌐', label: 'Average value (mixed origin)', val: 'ca. 924 L', calc: '3.3 kg × 280 L/kg' },
          { icon: '🇩🇪', label: 'German strawberries only', val: 'ca. 1,059 L', calc: '3.3 kg × 321 L/kg' },
          { icon: '🇪🇸', label: 'Spanish strawberries only', val: 'ca. 690 L', calc: '3.3 kg × 209 L/kg' },
        ],
        perKopfInsight: 'Based on total German consumption (≈280,000 t strawberries per year), that is around 78.4 billion litres of water for strawberry consumption alone in a single year. Important: Spanish strawberries need less water per kilo — but from stressed groundwater reserves (blue water), while German strawberries are predominantly rain-fed (green water).',
        statSource: 'Own calculations using country-specific water values (Germany 321 L/kg, Spain 209 L/kg) and average value (Netherlands 280 L/kg). Sources: Naturfreunde.de (Rottmann, 2015), Warenvergleich.de (2020), Statista (2024), Water Footprint Network (2018). Per-capita consumption: Statista (2025), BLE.',
      },
    },
    transport: {
      badge: 'Transport Routes',
      h2: 'Transport: 3,666 trucks from Huelva alone',
      lead: 'Fresh strawberries in Europe are transported almost exclusively by refrigerated truck. With a payload of 20 t per truck, the annual transport footprints differ dramatically.',
      leadBold: '20 t per truck',
      chartLabel: 'CO₂e transport per year (tonnes)',
      bars: [
        { label: 'Spain', sublabel: 'Huelva → NRW, 73,312 t/year, 2,300 km' },
        { label: 'Germany (domestic)', sublabel: 'Domestic, 128,410 t/year, 225 km' },
        { label: 'Netherlands', sublabel: 'NL → NRW, 14,015 t/year, 250 km' },
      ],
      thOrigin: 'Origin', thDist: 'Distance', thTrips: 'Truck trips/year', thCo2: 'CO₂e per 500g punnet', thCost: 'Transport cost/punnet',
      tableNote: '* Import volumes: UN Comtrade / WITS, complete annual data 2024. Complete 2025 data is not yet available.',
      truckH3: 'Why refrigerated trucks (almost) every time?',
      truckLead: 'Fresh strawberries are perishable, pressure-sensitive and require an unbroken cold chain. Other transport modes are technically possible but play almost no role for strawberries.',
      source: 'Sources: WITS/UN Comtrade, BMEL, Thünen Institute, REWE PCF, EcoTransIT, GHG Protocol, UK DESNZ (Conversion Factors 2025), IRU',
    },
    season: {
      badge: 'Season Calendar',
      h2: 'When does each strawberry arrive?',
      lead: 'The season calendar shows when strawberries from each country are available — and when heated greenhouses become necessary.',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      rows: ['🇩🇪 Germany (Open field)', '🇪🇸 Spain', '🇳🇱 Netherlands (High-tech)', '🇩🇪 DE Winter Greenhouse'],
      note: 'Note: The red row marks winter months when German strawberries come from heated greenhouses — ~3.4 kg CO₂e/kg.',
      takeaway: 'The most climate-friendly choice is',
      takeawayBold1: 'German strawberries from May to August',
      takeawayMid: '. Outside this window,',
      takeawayBold2: 'Spanish in-season strawberries are usually better than German winter produce',
      takeawayEnd: '.',
    },
    price: {
      badge: 'Price Breakdown',
      h2: 'What does a 500g punnet really cost?',
      chartLabel: 'Retail price range (€/kg)',
      transportLabel: 'Of which transport costs per 500g punnet',
      insightBadge: 'Insight',
      insightBody: 'Even over the longest route (Spain → Germany), transport adds just 9 – 11 cents per punnet. Larger price differences come from labour, harvesting and energy costs.',
      insightBold: '9 – 11 cents per punnet',
    },
    prodCosts: {
      badge: 'PRODUCTION COSTS',
      h2: 'Why Strawberry Prices Vary So Much',
      erkBadge: 'KEY FINDING',
      erkBody: 'Countries with warmer climates require less energy for production. Greenhouse growing in colder regions causes significantly higher production costs — and higher CO₂ emissions. This explains why Spanish strawberries are often cheaper than German winter produce despite the long transport routes.',
      erkSource: 'Source: DGG (Deutsche Gartenbauwissenschaftliche Gesellschaft) 2018',
      cards: [
        { flag: '🇩🇪', country: 'Germany', accent: 'bg-country-de', text: 'text-charcoal', headline: 'Cheap in season, expensive in winter', bullets: ['Open-field in season: comparatively low energy costs', 'Out of season: costs rise sharply with heated greenhouses', 'High harvest labour costs'] },
        { flag: '🇪🇸', country: 'Spain', accent: 'bg-country-es', text: 'text-white', headline: 'Climate reduces energy costs', bullets: ['Warm climate significantly reduces heating costs', 'Polytunnels or unheated greenhouses dominate', 'Main costs: transport and packaging'] },
        { flag: '🇳🇱', country: 'Netherlands', accent: 'bg-country-nl', text: 'text-white', headline: 'Technology drives costs', bullets: ['High-tech greenhouses require heating, lighting and climate control', 'Modern geothermal aims to reduce energy costs', 'High fixed costs for infrastructure and technology'] },
      ],
    },
    preisentwicklung: {
      badge: 'PRICE TRENDS',
      h2: 'Why German Strawberries Keep Getting More Expensive',
      intro: 'Prices for domestic strawberries have risen by almost 70% over the past ten years — and this has structural causes. While imports from Spain remain cheaper, German strawberry growing is under pressure from rising wages, shrinking farms and falling self-sufficiency.',
      stats: [
        { value: '+68.8%', label: 'Price rise 2015–2024', sub: '€3.94/kg (2015) → €6.65/kg (2024)', cls: 'text-amber-600' },
        { value: '−24.1%', label: 'Fewer farms', sub: 'Decline to 1,702 farms (Federal Statistical Office)', cls: 'text-rose-600' },
        { value: '−28.4%', label: 'Cultivation area shrank', sub: 'From ~18,400 ha to 13,149 ha', cls: 'text-rose-600' },
        { value: '−30.3%', label: 'Lower harvest', sub: 'Harvest fell to 120,352 tonnes', cls: 'text-rose-600' },
        { value: '50–60%', label: 'Labour cost share', sub: 'Hand-picked harvest — biggest cost factor', cls: 'text-burgundy' },
        { value: '68% → 50%', label: 'Self-sufficiency rate', sub: 'Germany now covers only half its own demand', cls: 'text-rose-600' },
      ],
      mindestlohn: {
        title: 'The Minimum Wage as the Main Driver',
        text: 'Since strawberries are harvested exclusively by hand, labour costs account for 50–60% of production costs. The rising minimum wage has placed German growing under intense pressure.',
        year2015: { year: '2015', lohn: '€8.50/hr', lohnLabel: 'Minimum wage', preis: '€3.94/kg', preisLabel: 'Strawberry price' },
        year2025: { year: '2025', lohn: '€12.82/hr', lohnLabel: 'Minimum wage', preis: '€6.65/kg', preisLabel: 'Strawberry price (2024)' },
        lohnChange: '+51%',
        preisChange: '+69%',
        lohnChangeLabel: 'Min. wage',
        preisChangeLabel: 'Price',
      },
      insight: {
        badge: 'KEY FINDING',
        text: 'According to the Association of South German Asparagus and Strawberry Growers (VSSE), many farms have shut down or reduced their growing areas due to rising labour costs. The result: Germany imports more strawberries today than ever before — primarily from Spain.',
      },
      chain: {
        title: 'The Chain Reaction',
        steps: [
          { label: 'Min. wage', change: '↑' },
          { label: 'Labour costs', change: '↑' },
          { label: 'Farms close', change: '' },
          { label: 'Growing area', change: '↓' },
          { label: 'Harvest', change: '↓' },
          { label: 'Self-sufficiency', change: '↓' },
          { label: 'Import share', change: '↑' },
          { label: 'Spain dependency', change: '↑' },
        ],
        source: 'Source: Agrarmarkt Informations-Gesellschaft (AMI), Federal Statistical Office, VSSE — cited in: Welt.de, 2024',
      },
    },
    market: {
      badge: 'Market Data',
      h2: 'The Strawberry Market in Numbers',
      lead: 'Who produces how much? How much does Germany import? And how is domestic cultivation changing? Market data shows: Spain dominates EU production, Germany imports more than half its supply — and domestic acreage has been shrinking for years.',
      chartA: 'Top 8 Strawberry Producers in the EU 2024 (in 1,000 tonnes)',
      chartASource: 'Source: Statista (2025), Eurostat',
      chartB: 'Key Suppliers of Strawberry Imports to Germany (values in thousand tonnes)',
      chartBCaption: 'Spain supplies over 60% of Germany\'s strawberry imports — and the share is rising.',
      chartBSource: 'Source: Statista (2025), Federal Statistical Office',
      chartC: 'Strawberry Cultivation Area in Germany 2012–2024 (in 1,000 hectares)',
      chartCSource: 'Source: Statista (2025), Federal Statistical Office',
      chartD: 'German Harvest 2024 by Cultivation Method',
      chartDCaption: 'The share of protected cultivation is rising — yields there are more than double those of open-field growing (≈23 t/ha vs. ≈10 t/ha).',
      chartDSource: 'Source: Statista (2025), BMEL',
      chartE: 'Per-Capita Strawberry Consumption in Germany (kg per year)',
      chartECaption: 'Consumption fluctuates between 3.3 and 4.0 kg per capita — strawberries remain popular despite shrinking domestic acreage.',
      chartESource: 'Source: Statista (2025), BLE',
      donutLabel: 'Open field',
      donutSeg1: 'Open field — 78,600 t (65%)',
      donutSeg2: 'Protected cultivation — 41,750 t (35%)',
      summaryBadge: 'What the numbers show',
      summaryBody: 'Germany produces only around 39% of its strawberry needs domestically — and domestic cultivation is declining. At the same time, the share of protected (polytunnel/glass) growing is rising; it is more productive but also more energy-intensive. The gap is filled by imports — above all from Spain.',
      summaryBold: '39% of its strawberry needs',
      bioH3: 'Organic Strawberries: a Shrinking Market',
      bioChartTitle: 'Organic Strawberry Harvest in Germany 2013–2024 (in tonnes)',
      bioAnnotation: '−67% since 2014',
      bioStat1Val: '1%', bioStat1Sub: 'Organic share of total harvest',
      bioStat2Val: '−67%', bioStat2Sub: 'Organic decline since peak year 2014',
      bioStat3Val: '1,258 t', bioStat3Sub: 'Organic harvest 2024 (of 120,350 t total)',
      bioCaption: 'While consumers increasingly demand sustainable products, German organic strawberry production has been declining for years. Higher costs, lower yields and competition from imported organic produce all play a role.',
      bioSource: 'Source: Statista (2025), Federal Statistical Office',
    },
    conclusion: {
      badge: 'Conclusion',
      h2: 'Three Key Findings',
      findings: [
        { num: '01', title: 'Season beats region', body: 'German strawberries in season (May – August) are the most climate-friendly choice. Outside the season: Spanish in-season strawberries are better than German winter produce.' },
        { num: '02', title: 'Production method > transport distance', body: 'Heating, lighting and climate control in greenhouses often generate more CO₂ than trucking over 2,300 km.' },
        { num: '03', title: 'Not all water is equal', body: 'Spain uses fewer litres — but from stressed groundwater reserves. Germany uses more litres — but mostly from rainfall.' },
      ],
      sourcesH3: 'Sources & Methodology',
      sourcesSubtitle: 'All data is based on peer-reviewed studies and official databases',
    },
    methodik: {
      badge: 'Methodology',
      h2: 'Life Cycle Assessment Methodology',
      lca: {
        title: 'Life Cycle Assessment (LCA)',
        intro: 'LCA is the core method for conducting an ecological footprint analysis. It examines all environmental impacts across the entire life cycle of a product — from raw material extraction to disposal (\'cradle to grave\'). For food products, it helps identify the most relevant emission sources.',
        phases: [
          'Define goal and system scope',
          'Life Cycle Inventory (LCI): data collection of all inputs and outputs',
          'Life Cycle Impact Assessment (LCIA): calculating climate impact, water use, etc.',
          'Interpretation of results',
        ],
      },
      systemgrenzen: {
        title: 'System Boundaries: Farm to Fork',
        text: 'System boundaries define which process steps are included in the analysis. This case study follows the \'Farm to Fork\' approach — from cultivation to point of sale.',
        steps: [
          { icon: '🌱', label: 'Production', sub: 'Cultivation, irrigation, fertiliser' },
          { icon: '📦', label: 'Processing & Packaging', sub: '' },
          { icon: '🚛', label: 'Transport & Retail', sub: '' },
          { icon: '🛒', label: 'Consumption', sub: '' },
        ],
        note: 'Processes outside these boundaries — e.g. packaging disposal after purchase — are not included. System boundaries affect the comparability of results.',
      },
      co2e: {
        title: 'CO₂ Equivalents (CO₂e)',
        text: 'CO₂e is a standardised unit that makes different greenhouse gases comparable via their Global Warming Potential (GWP). Gases included:',
        gases: [
          { formula: 'CO₂', name: 'Carbon dioxide' },
          { formula: 'CH₄', name: 'Methane' },
          { formula: 'N₂O', name: 'Nitrous oxide' },
        ],
        footer: 'Expressed as kg CO₂e per kg of food — the central indicator for the climate impact of food in this case study.',
      },
      disclaimer: {
        title: 'ℹ️ Methodological Limitation',
        text: 'The transport emissions in this case study are modelled calculations based on 0.12 kg CO₂e/tkm (refrigerated road freight). They cover transport only — not cultivation, packaging, storage or retail. The total emissions per kg of strawberries (0.3 / 0.88 / 1.64 / 3.4 kg CO₂e) are taken from product life cycle studies (REWE PCF study, MyCarbon database) with their own system boundary framework.',
        source: 'Methodology: ISG M15 Presentation, Frankfurt University of Applied Sciences',
      },
    },
    forschungsfrage: {
      label: 'Research Question',
      text: 'How do the ecological footprints of strawberries from Germany, Spain and the Netherlands differ with respect to water consumption, energy use and transport emissions?',
    },
    wissen: {
      sectionLabel: 'General Facts',
      title: 'What you might not have known 🍓',
      cards: [
        { icon: '🔬', title: 'Accessory fruit', body: 'Strawberries are not botanically berries but accessory fruits — the red flesh is the enlarged floral receptacle.' },
        { icon: '🌍', title: '1,000+ varieties worldwide', body: 'Over 1,000 different strawberry varieties are known and cultivated worldwide.' },
        { icon: '💧', title: '90% water', body: 'A strawberry consists of 90% water. Producing 1 kg requires around 280 litres — roughly 2 full bathtubs.' },
        { icon: '🌱', title: 'Rich in vitamins', body: 'Strawberries provide vitamin C, calcium, magnesium and potassium.' },
        { icon: '🌐', title: '9 million tonnes/year worldwide', body: 'Nearly 9 million tonnes of strawberries are harvested globally each year. One third comes from China — mainly as dried fruit and fruit yoghurts.' },
        { icon: '🏆', title: 'Spain: 6th worldwide', body: 'With around 360,000 tonnes, Spain is the sixth-largest producer in the world and by far the largest in the EU. Germany ranks 13th.' },
      ],
    },
    gesamtanalyse: {
      badge: 'OVERALL ANALYSIS',
      h2: 'Who wins — and in which category?',
      intro: 'No strawberry is the best choice in every respect. The ecological footprint always depends on the season, production method and evaluation criterion. This table shows which country leads in which dimension.',
      thDimension: 'Dimension',
      thDe: '🇩🇪 DE Season',
      thDeWinter: '🇩🇪 DE Winter',
      thEs: '🇪🇸 Spain',
      thNl: '🇳🇱 Netherlands',
      legend: '🟢 Best result in this category  ·  🟡 Medium result  ·  🔴 Worst result',
      rows: [
        { dim: 'CO₂e (production)', cells: [
          { score: 'GOOD', val: '0.3 kg/kg' },
          { score: 'BAD', val: '3.4 kg/kg' },
          { score: 'MEDIUM', val: '0.88 kg/kg' },
          { score: 'BAD', val: '1.64 kg/kg' },
        ]},
        { dim: 'CO₂e (transport)', cells: [
          { score: 'GOOD', val: '14 g/punnet' },
          { score: 'GOOD', val: '14 g/punnet' },
          { score: 'BAD', val: '138 g/punnet' },
          { score: 'MEDIUM', val: '15 g/punnet' },
        ]},
        { dim: 'Water use (L/kg)', cells: [
          { score: 'MEDIUM', val: '321 L (green)' },
          { score: 'MEDIUM', val: '321 L (green)' },
          { score: 'GOOD', val: '209 L (blue)' },
          { score: 'MEDIUM', val: '280 L' },
        ]},
        { dim: 'Water quality', cells: [
          { score: 'GOOD', val: 'Rainwater' },
          { score: 'GOOD', val: 'Rainwater' },
          { score: 'BAD', val: 'Groundwater' },
          { score: 'MEDIUM', val: 'Mixed' },
        ]},
        { dim: 'Retail price', cells: [
          { score: 'BAD', val: '€6–13/kg' },
          { score: 'BAD', val: '€6–13/kg' },
          { score: 'GOOD', val: '€4–6/kg' },
          { score: 'MEDIUM', val: '€5–10/kg' },
        ]},
        { dim: 'Season availability', cells: [
          { score: 'BAD', val: '4 months' },
          { score: 'MEDIUM', val: 'year-round' },
          { score: 'GOOD', val: '6 months' },
          { score: 'GOOD', val: 'year-round' },
        ]},
        { dim: 'Working conditions', cells: [
          { score: 'GOOD', val: 'good' },
          { score: 'GOOD', val: 'good' },
          { score: 'BAD', val: 'criticised' },
          { score: 'MEDIUM', val: 'medium' },
        ]},
      ],
      takeaways: [
        { title: 'Best choice in summer', body: 'Anyone shopping from May to August should choose German open-field strawberries: lowest carbon footprint, short transport, no stressed groundwater.' },
        { title: 'Best choice in winter/spring', body: 'Outside the German season, Spanish open-field strawberries have a significantly better carbon footprint than German greenhouse produce — despite 2,300 km of transport.' },
        { title: 'The hidden problem', body: 'Dutch and German winter strawberries from heated greenhouses look sustainable (short distances, modern buildings) — but are not, due to energy use. Production method almost always beats transport distance.' },
      ],
      erkBadge: 'Key Finding',
      source: 'ISG M15 Presentation (Outline item 8), CO₂ emissions data, Strawberry transport routes, Water use analysis, Production cost data',
    },
    vorteile: {
      badge: 'COMPARISON',
      h2: 'Advantages & Disadvantages at a Glance',
      intro: 'Each country of origin has ecological, economic and social strengths and weaknesses. The following overview summarises the most important ones.',
      vorteilLabel: 'Advantages',
      nachteilLabel: 'Disadvantages',
      source: 'ISG M15 Presentation (Slides 32–34), Frankfurt UAS; CO₂ emissions data; Strawberry transport routes',
      de: {
        vorteile: [
          'Short transport routes → low transport emissions',
          'Fresh and aromatic fruit (short time from field to market)',
          'Best carbon footprint during the season (0.3 kg CO₂e/kg)',
          'Rainwater irrigation — minimal strain on groundwater',
        ],
        nachteile: [
          'Highest prices (€6–13/kg)',
          'Highly weather-dependent — crop failures possible',
          'Short season (May–August only)',
          'Out of season: greenhouse required → up to 3.4 kg CO₂e/kg',
          'Rising production costs due to high minimum wage',
        ],
      },
      es: {
        vorteile: [
          'Lowest prices (€4–6/kg)',
          'Long season (January–June) → supplies Europe in winter/spring',
          'Low energy demand thanks to warm climate',
          'High production volumes (largest EU producer)',
          'Despite long distance: better carbon footprint than German winter produce',
        ],
        nachteile: [
          'Highest transport emissions (138 g CO₂e per 500g punnet)',
          'Groundwater extraction harms Doñana National Park (UNESCO)',
          'Partly illegal wells',
          'Poor working conditions for harvest workers',
          'Plastic film as a waste problem',
        ],
      },
      nl: {
        vorteile: [
          'Year-round availability through high-tech greenhouses',
          'High yields on small areas',
          'Short transport distances to Germany (~250 km)',
          'Use of geothermal and thermal storage reduces energy costs',
          'Substrate/hydroponic growing — no soil depletion',
        ],
        nachteile: [
          'Highest CO₂e figure among import options (1.64 kg CO₂e/kg)',
          'High energy demand for heating, lighting, climate control',
          'High fixed costs for infrastructure and technology',
          'Greenhouse production remains emission-intensive despite modern technology',
        ],
      },
    },
    saisonluecke: {
      title: '💡 The Season Gap: 8 Months Without German Strawberries',
      body: 'The German open-field season lasts only 4 months — from May to August. For the remaining 8 months, Germany must cover its strawberry consumption entirely through imports or energy-intensive greenhouses. This gap is precisely what makes Spain an indispensable supplier: Spanish strawberries are available from January — four months before the first German open-field strawberry is ripe.',
      bar1Label: '4 months — German open-field season (May–August)',
      bar1Co2: '0.3 kg CO₂e/kg',
      bar2Label: '8 months — imports or greenhouse required (Sep–April)',
      bar2Co2: 'up to 3.4 kg CO₂e/kg',
      insight: 'Anyone buying a German strawberry in October is very likely buying greenhouse produce — with more than 11× the carbon footprint of a summer strawberry.',
    },
    footer: {
      team: 'A case study by the ECOFOOTPRINT team: Bianca Wassmann, Ivana Cvijetinović, Jenny Senge, Kartik Chauhan, Lars Krüger, Mohammed Al-Awadhi',
      course: 'M15 ISG · Ecological Sustainability Module · Frankfurt University of Applied Sciences',
      backBtn: 'Back to overview',
    },
  },
} as const;

type Lang = 'DE' | 'EN';
type CountryKey = 'de' | 'es' | 'nl';

const COUNTRY_META: Record<CountryKey, { flag: string; name: string; nameEn: string; accent: string; text: string }> = {
  de: { flag: '🇩🇪', name: 'Deutschland', nameEn: 'Germany', accent: 'bg-country-de', text: 'text-charcoal' },
  es: { flag: '🇪🇸', name: 'Spanien', nameEn: 'Spain', accent: 'bg-country-es', text: 'text-white' },
  nl: { flag: '🇳🇱', name: 'Niederlande', nameEn: 'Netherlands', accent: 'bg-country-nl', text: 'text-white' },
};

// ─── HEADER ───────────────────────────────────────────────────────────────
function PageHeader({ lang, onToggle }: { lang: Lang; onToggle: () => void }) {
  const t = CS_TRANS[lang.toLowerCase() as 'de' | 'en'];
  return (
    <div className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3">
        <span className="px-5 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-xl bg-burgundy text-white">
          {t.header.breadcrumb}
        </span>
        <Link
          href="/explorer"
          className="glass px-5 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase hover:bg-charcoal hover:text-white transition-all duration-500 shadow-xl border-white/40 hidden md:inline-block"
        >
          Explorer
        </Link>
      </div>
      <div className="pointer-events-auto">
        <button
          onClick={onToggle}
          className="glass px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] hover:bg-charcoal hover:text-white transition-all duration-500 shadow-xl border-white/40"
        >
          {lang}
        </button>
      </div>
    </div>
  );
}

// ─── HORIZONTAL BAR CHART ─────────────────────────────────────────────────
interface BarDatum {
  label: string;
  value: number;
  unit?: string;
  color: string;
  sublabel?: string;
  highlighted?: boolean;
}

function HorizontalBars({ data, max, unit, decimals = 1, ariaLabel }: {
  data: BarDatum[]; max: number; unit?: string; decimals?: number; ariaLabel: string;
}) {
  return (
    <div role="img" aria-label={ariaLabel} className="w-full space-y-6">
      {data.map((d, i) => {
        const widthPct = Math.min((d.value / max) * 100, 100);
        return (
          <div key={i} className={cn('space-y-2', d.highlighted && '-mx-4 px-4 py-3 bg-rose-50/60 rounded-2xl')}>
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className={cn('text-sm font-black uppercase tracking-[0.18em]', d.highlighted ? 'text-accent-warning' : 'text-charcoal/70')}>{d.label}</p>
                {d.sublabel && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30 mt-0.5">{d.sublabel}</p>}
              </div>
              <p className={cn('text-2xl font-serif font-black tabular-nums', d.highlighted ? 'text-accent-warning' : 'text-charcoal')}>
                {d.value.toFixed(decimals)}{unit && <span className="text-xs font-normal text-charcoal/40 ml-1">{unit}</span>}
              </p>
            </div>
            <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${widthPct}%` }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1.1, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="h-full rounded-full"
                style={{ backgroundColor: d.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── COUNTRY CARD ─────────────────────────────────────────────────────────
interface CountryDetail {
  readonly blocks: ReadonlyArray<{
    readonly title: string;
    readonly bullets: ReadonlyArray<string>;
  }>;
  readonly notes: ReadonlyArray<string>;
}

interface CountryCardProps {
  country: CountryKey;
  lang: Lang;
  fieldLabels: { season: string; cultivation: string; co2: string; water: string; transport: string; price: string };
  data: { season: string; cultivation: string; co2: string; water: string; transport: string; price: string; quote: string };
  detail: CountryDetail;
  detailLabel: string;
  detailSource: string;
}

function CountryCard({ country, lang, fieldLabels, data, detail, detailLabel, detailSource }: CountryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const meta = COUNTRY_META[country];
  const name = lang === 'DE' ? meta.name : meta.nameEn;
  const rows = [
    { label: fieldLabels.season, value: data.season },
    { label: fieldLabels.cultivation, value: data.cultivation },
    { label: fieldLabels.co2, value: data.co2 },
    { label: fieldLabels.water, value: data.water },
    { label: fieldLabels.transport, value: data.transport },
    { label: fieldLabels.price, value: data.price },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col bg-white rounded-[2rem] border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden h-full"
    >
      <div className={cn('px-7 pt-7 pb-5 flex items-center gap-3', meta.accent, meta.text)}>
        <span className="text-3xl leading-none">{meta.flag}</span>
        <h3 className="text-2xl font-serif font-black tracking-tight">{name}</h3>
      </div>
      <div className="flex-1 px-7 py-6 space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-charcoal/30">{r.label}</p>
            <p className="font-serif text-base text-charcoal leading-snug">{r.value}</p>
          </div>
        ))}
      </div>

      {/* Accordion toggle */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-7 py-4 border-t border-black/5 hover:bg-alabaster transition-colors duration-200 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-burgundy">{detailLabel}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={14} className="text-charcoal/40 group-hover:text-charcoal/70 transition-colors shrink-0" />
        </motion.span>
      </button>

      {/* Accordion content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-7 pt-4 pb-6 bg-alabaster space-y-5">
              {detail.blocks.map((block, bi) => (
                <div key={bi} className="space-y-2">
                  {block.title && (
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-charcoal/40">{block.title}</p>
                  )}
                  <ul className="space-y-1.5">
                    {block.bullets.map((bullet, bj) => (
                      <li key={bj} className="flex items-start gap-2 text-sm text-charcoal/70 leading-relaxed">
                        <span className="text-burgundy mt-0.5 shrink-0 text-xs">—</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {detail.notes.length > 0 && (
                <div className="space-y-2 pt-3 border-t border-black/10">
                  {detail.notes.map((note, ni) => (
                    <p key={ni} className="text-xs font-serif italic text-charcoal/50 leading-relaxed">{note}</p>
                  ))}
                </div>
              )}
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-charcoal/25 pt-2">{detailSource}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote footer */}
      <div className="px-7 py-5 bg-alabaster border-t border-black/5 flex items-start gap-3">
        <Quote size={14} className="text-burgundy shrink-0 mt-1" />
        <p className="font-serif italic text-charcoal/70 text-sm leading-snug">&bdquo;{data.quote}&ldquo;</p>
      </div>
    </motion.div>
  );
}

// ─── SEASON CALENDAR ──────────────────────────────────────────────────────
function SeasonCalendar({ months, rows: rowLabels }: { months: string[]; rows: string[] }) {
  const seasonRows = [
    { active: [5, 6, 7, 8, 9, 10], color: 'bg-country-de', warning: false },
    { active: [1, 2, 3, 4, 5, 6], color: 'bg-country-es', warning: false },
    { active: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], color: 'bg-country-nl', warning: false },
    { active: [11, 12, 1, 2, 3, 4], color: 'bg-accent-warning', warning: true },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[180px_repeat(12,_1fr)] gap-1.5 items-center text-[10px] font-black uppercase tracking-widest text-charcoal/30">
        <span />
        {months.map((m) => <span key={m} className="text-center">{m}</span>)}
      </div>
      {seasonRows.map((row, ri) => (
        <div key={ri} className="grid grid-cols-[180px_repeat(12,_1fr)] gap-1.5 items-center">
          <p className={cn('text-sm font-serif leading-tight pr-3', row.warning ? 'text-accent-warning' : 'text-charcoal/80')}>
            {rowLabels[ri]}
          </p>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <div key={m} className={cn('h-9 rounded-md', row.active.includes(m) ? row.color : 'bg-black/5')} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── SVG CHART HELPERS ────────────────────────────────────────────────────
const SVG_W = 560;

function LineAreaChart({ data, labels, yMin, yMax, color = '#9B2226', showArea = false, annotation, ariaLabel, height = 200, showTooltip = false, tooltipUnit = 'Tsd. ha' }: {
  data: number[]; labels: string[]; yMin: number; yMax: number; color?: string; showArea?: boolean; annotation?: string; ariaLabel: string; height?: number; showTooltip?: boolean; tooltipUnit?: string;
}) {
  const [hovI, setHovI] = useState<number | null>(null);
  const H = height, pL = 44, pR = 16, pT = 16, pB = 36;
  const iW = SVG_W - pL - pR, iH = H - pT - pB;
  const n = data.length;
  const px = (i: number) => (pL + (i / (n - 1)) * iW).toFixed(1);
  const py = (v: number) => (pT + (1 - (v - yMin) / (yMax - yMin)) * iH).toFixed(1);
  const bot = (pT + iH).toFixed(1);
  const linePts = data.map((v, i) => `${px(i)},${py(v)}`).join(' ');
  const areaD = `M${px(0)},${bot} ${data.map((v, i) => `L${px(i)},${py(v)}`).join(' ')} L${px(n - 1)},${bot} Z`;
  const showEvery = Math.ceil(n / 6);
  return (
    <svg viewBox={`0 0 ${SVG_W} ${H}`} className="w-full h-auto" role="img" aria-label={ariaLabel}>
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pL} x2={SVG_W - pR} y1={(pT + iH * (1 - t)).toFixed(1)} y2={(pT + iH * (1 - t)).toFixed(1)} stroke="#0000000b" strokeWidth="1" />
      ))}
      {showArea && <path d={areaD} fill={color} fillOpacity="0.09" />}
      <polyline points={linePts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={px(i)} cy={py(v)} r={showTooltip ? '5' : '3.5'} fill={color}
          {...(showTooltip ? { onMouseEnter: () => setHovI(i), onMouseLeave: () => setHovI(null), style: { cursor: 'pointer' } } : {})}
        />
      ))}
      {/* first + last value labels when tooltip mode active */}
      {showTooltip && (
        <>
          <text x={px(0)} y={(parseFloat(py(data[0])) - 8).toFixed(1)} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{data[0].toFixed(2)}</text>
          <text x={px(n - 1)} y={(parseFloat(py(data[n - 1])) - 8).toFixed(1)} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{data[n - 1].toFixed(2)}</text>
        </>
      )}
      {labels.map((l, i) => (i % showEvery === 0 || i === n - 1) ? (
        <text key={i} x={px(i)} y={H - 4} textAnchor="middle" fontSize="11" fill="#1A1A1A55">{l}</text>
      ) : null)}
      {annotation && (
        <text x={SVG_W - pR} y={pT + 14} textAnchor="end" fontSize="13" fontWeight="800" fill={color}>{annotation}</text>
      )}
      {/* hover tooltip */}
      {showTooltip && hovI !== null && (() => {
        const cx = parseFloat(px(hovI)), cy = parseFloat(py(data[hovI]));
        const tipW = 140, tipH = 40;
        const tipX = Math.max(pL, Math.min(SVG_W - pR - tipW, cx - tipW / 2));
        const tipY = Math.max(pT, cy - tipH - 10);
        return (
          <g>
            <rect x={tipX} y={tipY} width={tipW} height={tipH} rx="6" fill="white" stroke="#00000018" strokeWidth="1" />
            <text x={tipX + tipW / 2} y={tipY + 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A1A1A">{labels[hovI]}</text>
            <text x={tipX + tipW / 2} y={tipY + 29} textAnchor="middle" fontSize="11" fill="#1A1A1A77">{data[hovI].toFixed(2)} {tooltipUnit}</text>
          </g>
        );
      })()}
    </svg>
  );
}

function DonutChart({ segments, donutLabel, ariaLabel }: {
  segments: { value: number; color: string; label: string }[]; donutLabel: string; ariaLabel: string;
}) {
  const r = 70, cx = 110, cy = 110;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0);
  const accOffsets = segments.reduce<number[]>((acc, seg) => {
    acc.push((acc[acc.length - 1] ?? 0) + (seg.value / total) * circ);
    return acc;
  }, []);
  const offsets = [0, ...accOffsets.slice(0, -1)];
  return (
    <svg viewBox="0 0 260 220" className="w-full max-w-[260px] h-auto mx-auto" role="img" aria-label={ariaLabel}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="28"
            strokeDasharray={`${dash.toFixed(2)} ${(circ - dash).toFixed(2)}`}
            strokeDashoffset={(-offsets[i] + circ / 4).toFixed(2)}
          />
        );
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1A1A1A">{Math.round((segments[0].value / total) * 100)}%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#1A1A1A66">{donutLabel}</text>
      {segments.map((seg, i) => (
        <g key={i} transform={`translate(0,${155 + i * 22})`}>
          <rect x="8" y="0" width="12" height="12" rx="3" fill={seg.color} />
          <text x="26" y="10" fontSize="12" fill="#1A1A1A99">{seg.label}</text>
        </g>
      ))}
    </svg>
  );
}

function HGroupedBarsChart({ groups, series, seriesLabels, max, ariaLabel }: {
  groups: string[]; series: number[][]; seriesLabels: string[]; max: number; ariaLabel: string;
}) {
  const H = 320, pT = 42, pB = 8, pL = 112, pR = 56;
  const iW = SVG_W - pL - pR;
  const iH = H - pT - pB;
  const g = groups.length;
  const groupH = iH / g;
  const barH = 11, barGap = 4;
  const bw = (v: number) => (v / max) * iW;
  return (
    <svg viewBox={`0 0 ${SVG_W} ${H}`} className="w-full h-auto" style={{ minHeight: '280px' }} role="img" aria-label={ariaLabel}>
      {/* Legend */}
      <rect x={pL} y={9} width={12} height={10} rx="2" fill="rgba(198,11,30,0.18)" stroke="#C60B1E" strokeWidth="1.5" />
      <text x={pL + 16} y={18} fontSize="11" fill="#1A1A1A88">{seriesLabels[0]}</text>
      <rect x={pL + 60} y={9} width={12} height={10} rx="2" fill="#C60B1E" />
      <text x={pL + 76} y={18} fontSize="11" fill="#1A1A1A88">{seriesLabels[1]}</text>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((t) => {
        const x = pL + iW * t;
        return (
          <g key={t}>
            <line x1={x.toFixed(1)} x2={x.toFixed(1)} y1={pT} y2={(pT + iH).toFixed(1)} stroke="#0000000b" strokeWidth="1" />
            <text x={x.toFixed(1)} y={pT - 6} textAnchor="middle" fontSize="10" fill="#1A1A1A44">
              {Math.round(max * t / 1000)}k
            </text>
          </g>
        );
      })}
      {/* Rows */}
      {groups.map((grp, gi) => {
        const gy = pT + gi * groupH;
        const topPad = (groupH - (barH * 2 + barGap)) / 2;
        const y24 = gy + topPad;
        const y25 = y24 + barH + barGap;
        const w24 = bw(series[0][gi]);
        const w25 = bw(series[1][gi]);
        return (
          <g key={gi}>
            <text x={pL - 6} y={(gy + groupH / 2 + 4).toFixed(1)} textAnchor="end" fontSize="11" fill="#1A1A1A88">{grp}</text>
            <rect x={pL} y={y24.toFixed(1)} width={w24.toFixed(1)} height={barH} rx="2"
              fill="rgba(198,11,30,0.18)" stroke="#C60B1E" strokeWidth="1.5" />
            <rect x={pL} y={y25.toFixed(1)} width={w25.toFixed(1)} height={barH} rx="2"
              fill="#C60B1E" />
            <text x={(pL + w25 + 4).toFixed(1)} y={(y25 + barH - 1).toFixed(1)} fontSize="10" fill="#C60B1E88">
              {Math.round(series[1][gi] / 1000)}k
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SECTION SHELL ────────────────────────────────────────────────────────
function Section({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className={cn('relative z-10 px-6 md:px-20 py-24', className)}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.section>
  );
}

// ─── SOURCES (language-neutral academic refs) ─────────────────────────────
const SOURCES = [
  { title: "Reducing food's environmental impacts through producers and consumers", author: 'Poore & Nemecek', year: '2018', url: 'https://science.sciencemag.org/content/360/6392/987' },
  { title: 'Environmental Impacts of Food Production', author: 'Our World in Data', year: '2022', url: 'https://ourworldindata.org/environmental-impacts-of-food' },
  { title: 'Water Footprint of Food', author: 'Water Footprint Network', year: '2021', url: 'https://www.waterfootprint.org' },
  { title: 'Ökobilanz von Lebensmitteln', author: 'Umweltbundesamt', year: '2023', url: 'https://www.umweltbundesamt.de' },
  { title: 'Food in the Anthropocene', author: 'EAT-Lancet Commission', year: '2019', url: 'https://eatforum.org/eat-lancet-commission' },
  { title: 'Erdbeersaison startet: Umwelt und Arbeiterinnen leiden', author: 'BUND', year: '', url: 'https://www.bund.net/themen/aktuelles/detailaktuelles/news/erdbeersaison-startet-umwelt-und-arbeiterinnen-leiden/' },
  { title: 'Die Wasserbilanz von Erdbeeren im Ländervergleich', author: 'Naturfreunde', year: '', url: 'https://www.naturfreunde.de/die-wasserbilanz-von-erdbeeren-im-laendervergleich' },
  { title: 'Erdbeeren zur richtigen Zeit vom richtigen Ort', author: 'WWF', year: '', url: 'https://www.wwf.de/aktiv-werden/tipps-fuer-den-alltag/vernuenftig-einkaufen/erdbeeren-zur-richtigen-zeit-vom-richtigen-ort' },
  { title: 'Germany strawberry imports 2024', author: 'WITS / UN Comtrade', year: '2024', url: 'https://wits.worldbank.org/trade/comtrade/en/country/DEU/year/2024/tradeflow/Imports/partner/ALL/product/081010' },
  { title: 'Anbau und Ernte von Erdbeeren', author: 'BMEL', year: '', url: 'https://www.bmel-statistik.de/landwirtschaft/gartenbau/obstanbau/erdbeeren' },
  { title: 'Steckbrief Obstbau: Erdbeeren', author: 'Thünen-Institut', year: '2025', url: 'https://www.thuenen.de/media/ti-themenfelder/Pflanzenproduktion/Gartenbau/20250728_Steckbrief_Obstbau_Erdbeeren.pdf' },
  { title: 'Greenhouse gas reporting conversion factors 2025', author: 'UK DESNZ', year: '2025', url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025' },
  { title: 'EcoTransIT Methodology', author: 'EcoTransIT World', year: '', url: 'https://www.ecotransit.org/en/methodology/' },
  { title: 'Scope 3 Cat. 4', author: 'GHG Protocol', year: '', url: 'https://ghgprotocol.org/sites/default/files/2022-12/Chapter4.pdf' },
  { title: 'PCF Erdbeeren', author: 'REWE', year: '', url: 'https://www.pcf-projekt.de/files/1232962839/pcf_rewe_erdbeeren.pdf' },
  { title: 'Goods transport cost per km', author: 'IRU', year: '', url: 'https://www.iru.org/what-we-do/facilitating-trade-and-transit/different-types-freight-transport/how-much-does-goods-transport-cost-kilometre' },
  { title: 'Strawberry Produce Facts', author: 'UC Davis Postharvest', year: '', url: 'https://postharvest.ucdavis.edu/produce-facts-sheets/strawberry' },
  { title: 'Erdbeeren auf dem Acker', author: 'BZfE', year: '', url: 'https://www.bzfe.de/kueche-und-alltag/vom-acker-bis-zum-teller/erdbeeren/erdbeeren-auf-dem-acker' },
  { title: 'Marktdaten zu Erdbeeren in Deutschland und der EU', author: 'Statista', year: '2025', url: 'https://www.statista.com' },
  { title: 'Außenhandelsstatistik Obst', author: 'Statistisches Bundesamt (Destatis)', year: '', url: 'https://www.destatis.de' },
  { title: 'Verbrauchsstatistik Obst und Gemüse', author: 'BLE', year: '', url: 'https://www.ble.de' },
];

// ═══════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function ErdbeereCaseStudyPage() {
  const [lang, setLang] = useState<Lang>('DE');
  const t = CS_TRANS[lang.toLowerCase() as 'de' | 'en'];

  const fl = { // field labels shorthand
    season: t.comparison.fieldSeason,
    cultivation: t.comparison.fieldCultivation,
    co2: t.comparison.fieldCo2,
    water: t.comparison.fieldWater,
    transport: t.comparison.fieldTransport,
    price: t.comparison.fieldPrice,
  };

  const co2Bars: BarDatum[] = [
    { label: t.co2.bars[0].label, value: 0.3, sublabel: t.co2.bars[0].sublabel, color: '#16A34A' },
    { label: t.co2.bars[1].label, value: 0.88, sublabel: t.co2.bars[1].sublabel, color: '#C60B1E' },
    { label: t.co2.bars[2].label, value: 1.64, sublabel: t.co2.bars[2].sublabel, color: '#FF6E00' },
    { label: t.co2.bars[3].label, value: 3.4, sublabel: t.co2.bars[3].sublabel, color: '#B91C1C', highlighted: true },
  ];

  const waterBars: BarDatum[] = [
    { label: t.water.bars[0].label, value: 209, sublabel: t.water.bars[0].sublabel, color: '#2563EB' },
    { label: t.water.bars[1].label, value: 280, sublabel: t.water.bars[1].sublabel, color: '#9CA3AF' },
    { label: t.water.bars[2].label, value: 321, sublabel: t.water.bars[2].sublabel, color: '#16A34A' },
  ];

  const transportBars: BarDatum[] = [
    { label: t.transport.bars[0].label, value: 20234, sublabel: t.transport.bars[0].sublabel, color: '#C60B1E' },
    { label: t.transport.bars[1].label, value: 3467, sublabel: t.transport.bars[1].sublabel, color: '#FFCC00' },
    { label: t.transport.bars[2].label, value: 420, sublabel: t.transport.bars[2].sublabel, color: '#FF6E00' },
  ];

  const priceRanges = [
    { label: `🇪🇸 ${lang === 'DE' ? 'Spanien' : 'Spain'}`, min: 4, max: 6, color: '#C60B1E' },
    { label: `🇳🇱 ${lang === 'DE' ? 'Niederlande' : 'Netherlands'}`, min: 5, max: 10, color: '#FF6E00' },
    { label: `🇩🇪 ${lang === 'DE' ? 'Deutschland' : 'Germany'}`, min: 6, max: 13, color: '#FFCC00' },
  ];
  const priceMax = 13;

  const euProdBars: BarDatum[] = [
    { label: `🇪🇸 ${lang === 'DE' ? 'Spanien' : 'Spain'}`, value: 323.5, color: '#C60B1E' },
    { label: lang === 'DE' ? 'Polen' : 'Poland', value: 173.4, color: '#9CA3AF' },
    { label: lang === 'DE' ? 'Italien' : 'Italy', value: 129.0, color: '#9CA3AF' },
    { label: `🇩🇪 ${lang === 'DE' ? 'Deutschland' : 'Germany'}`, value: 120.4, color: '#FFCC00' },
    { label: `🇳🇱 ${lang === 'DE' ? 'Niederlande' : 'Netherlands'}`, value: 86.4, color: '#FF6E00' },
    { label: lang === 'DE' ? 'Griechenland' : 'Greece', value: 81.6, color: '#9CA3AF' },
    { label: lang === 'DE' ? 'Frankreich' : 'France', value: 51.5, color: '#9CA3AF' },
    { label: lang === 'DE' ? 'Belgien' : 'Belgium', value: 49.6, color: '#9CA3AF' },
  ];

  const importGroups = lang === 'DE'
    ? ['Spanien', 'Griechenland', 'Niederlande', 'Ägypten', 'Belgien', 'Italien']
    : ['Spain', 'Greece', 'Netherlands', 'Egypt', 'Belgium', 'Italy'];

  return (
    <main className="relative min-h-screen bg-alabaster text-charcoal mesh-gradient font-sans">
      <PageHeader lang={lang} onToggle={() => setLang(l => l === 'DE' ? 'EN' : 'DE')} />

      {/* ── 2.1 HERO ─────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative text-center max-w-5xl mx-auto"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-burgundy mb-8 flex items-center justify-center gap-3">
            <BookOpen size={14} />
            {t.hero.overline}
          </p>
          <h1 className="relative text-6xl md:text-[7rem] font-serif mb-10 tracking-tighter leading-[0.92] text-charcoal font-black select-none">
            {t.hero.h1a} <span className="italic text-burgundy">{t.hero.h1b}</span>
            <motion.span
              animate={{ y: [0, -10, 0], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block text-[5rem] md:text-[7rem] ml-4 align-middle"
            >🍓</motion.span>
          </h1>
          <p className="text-xl md:text-3xl font-serif italic text-charcoal/60 max-w-3xl mx-auto leading-snug mb-12">
            {t.hero.subline}
          </p>
          <p className="text-base md:text-lg text-charcoal/70 max-w-3xl mx-auto leading-relaxed font-sans">
            {t.hero.body.split(t.hero.importNum).map((part, i) => i === 0
              ? <span key={i}>{part}<strong>{t.hero.importNum}</strong></span>
              : <span key={i}>{part}</span>
            )}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-charcoal/20"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.hero.scroll}</span>
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="w-px h-16 bg-gradient-to-b from-charcoal/20 to-transparent" />
        </motion.div>
      </section>

      {/* ── 2.1b FORSCHUNGSFRAGE + WISSEN ───────────────────────────── */}
      <Section className="border-t border-black/5">
        {/* Forschungsfrage Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="border-l-4 border-burgundy bg-white rounded-r-[1.5rem] pl-8 pr-8 py-8 shadow-sm mb-16"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy mb-4">{t.forschungsfrage.label}</p>
          <p className="font-serif italic text-xl md:text-2xl text-charcoal/80 leading-snug">{t.forschungsfrage.text}</p>
        </motion.div>

        {/* Erdbeer-Wissen Fact Strip */}
        <div className="space-y-3 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">{t.wissen.sectionLabel}</p>
          <h2 className="text-3xl md:text-4xl font-serif font-black italic text-charcoal tracking-tight">{t.wissen.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.wissen.cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white rounded-[1.5rem] border border-black/5 shadow-sm p-7 space-y-3"
            >
              <span className="text-3xl leading-none">{card.icon}</span>
              <p className="font-serif font-black text-charcoal text-lg leading-snug">{card.title}</p>
              <p className="text-charcoal/70 text-sm leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── 2.2 COUNTRY COMPARISON ──────────────────────────────────── */}
      <Section id="vergleich">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-charcoal italic">{t.comparison.h2}</h2>
          <p className="text-charcoal/30 font-sans font-black uppercase tracking-[0.4em] text-[10px]">{t.comparison.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['de', 'es', 'nl'] as CountryKey[]).map((c) => (
            <CountryCard
              key={c}
              country={c}
              lang={lang}
              fieldLabels={fl}
              data={t.comparison[c]}
              detail={t.comparisonDetail[c]}
              detailLabel={t.comparisonDetail.label}
              detailSource={t.comparisonDetail.source}
            />
          ))}
        </div>
      </Section>

      {/* ── 2.2c VOR- & NACHTEILE ────────────────────────────────────── */}
      <Section id="vorteile" className="border-t border-black/5">
        <div className="space-y-4 mb-14">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">{t.vorteile.badge}</span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.vorteile.h2}</h2>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">{t.vorteile.intro}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['de', 'es', 'nl'] as CountryKey[]).map((c, ci) => {
            const meta = COUNTRY_META[c];
            const card = t.vorteile[c];
            return (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: ci * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col bg-white rounded-[2rem] border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden"
              >
                <div className={cn('px-7 pt-7 pb-5 flex items-center gap-3', meta.accent, meta.text)}>
                  <span className="text-3xl leading-none">{meta.flag}</span>
                  <h3 className="text-2xl font-serif font-black tracking-tight">
                    {lang === 'DE' ? meta.name : meta.nameEn}
                  </h3>
                </div>
                <div className="flex-1 px-7 py-6 space-y-6">
                  {/* Vorteile */}
                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">{t.vorteile.vorteilLabel}</p>
                    <ul className="space-y-2">
                      {card.vorteile.map((v, vi) => (
                        <li key={vi} className="flex items-start gap-2 text-sm text-charcoal/70 leading-relaxed">
                          <span className="text-emerald-500 font-black shrink-0 mt-0.5 text-xs">✓</span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Nachteile */}
                  <div className="space-y-3 pt-5 border-t border-black/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-600">{t.vorteile.nachteilLabel}</p>
                    <ul className="space-y-2">
                      {card.nachteile.map((n, ni) => (
                        <li key={ni} className="flex items-start gap-2 text-sm text-charcoal/70 leading-relaxed">
                          <span className="text-rose-500 font-black shrink-0 mt-0.5 text-xs">✗</span>
                          <span>{n}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.vorteile.source}</p>
      </Section>

      {/* ── 2.2b METHODIK ───────────────────────────────────────────── */}
      <Section id="methodik" className="border-t border-black/5">
        <div className="space-y-4 mb-14">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">{t.methodik.badge}</span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.methodik.h2}</h2>
        </div>

        <div className="space-y-8">

          {/* ① LCA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}
            className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10"
          >
            <h3 className="text-2xl font-serif font-black text-charcoal mb-4">{t.methodik.lca.title}</h3>
            <p className="text-charcoal/70 leading-relaxed mb-8">{t.methodik.lca.intro}</p>
            <div>
              {t.methodik.lca.phases.map((phase, i) => {
                const isLast = i === t.methodik.lca.phases.length - 1;
                return (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-burgundy text-white flex items-center justify-center text-xs font-black shrink-0">
                        {i + 1}
                      </div>
                      {!isLast && <div className="w-px flex-1 bg-black/10 my-2 min-h-[1.5rem]" />}
                    </div>
                    <p className={cn('text-charcoal/80 leading-relaxed pt-1 font-serif text-base', isLast ? 'pb-0' : 'pb-6')}>{phase}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ② Systemgrenzen */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10"
          >
            <h3 className="text-2xl font-serif font-black text-charcoal mb-4">{t.methodik.systemgrenzen.title}</h3>
            <p className="text-charcoal/70 leading-relaxed mb-8">{t.methodik.systemgrenzen.text}</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 mb-8">
              {t.methodik.systemgrenzen.steps.map((step, i) => {
                const isLast = i === t.methodik.systemgrenzen.steps.length - 1;
                return (
                  <div key={i} className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
                    <div className="flex flex-col items-center text-center bg-alabaster rounded-2xl px-5 py-4 min-w-[130px]">
                      <span className="text-2xl mb-1.5 leading-none">{step.icon}</span>
                      <p className="text-sm font-black text-charcoal leading-tight">{step.label}</p>
                      {step.sub && (
                        <p className="text-[10px] text-charcoal/40 mt-1 leading-snug">{step.sub}</p>
                      )}
                    </div>
                    {!isLast && (
                      <span className="text-charcoal/25 text-xl font-black shrink-0 md:mx-3 rotate-90 md:rotate-0">→</span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-sm font-serif italic text-charcoal/50 border-t border-black/5 pt-5">{t.methodik.systemgrenzen.note}</p>
          </motion.div>

          {/* ③ CO₂e */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10"
          >
            <h3 className="text-2xl font-serif font-black text-charcoal mb-4">{t.methodik.co2e.title}</h3>
            <p className="text-charcoal/70 leading-relaxed mb-6">{t.methodik.co2e.text}</p>
            <div className="flex flex-wrap gap-3 mb-7">
              {t.methodik.co2e.gases.map((gas, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-alabaster rounded-full border border-black/10">
                  <span className="text-sm font-black text-burgundy font-mono">{gas.formula}</span>
                  <span className="text-charcoal/30">—</span>
                  <span className="text-sm text-charcoal/70">{gas.name}</span>
                </div>
              ))}
            </div>
            <p className="text-sm font-serif italic text-charcoal/60 border-t border-black/5 pt-5">{t.methodik.co2e.footer}</p>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-sky-50/60 border border-sky-100 rounded-[1.5rem] p-8"
          >
            <p className="font-black text-charcoal mb-3">{t.methodik.disclaimer.title}</p>
            <p className="text-charcoal/70 leading-relaxed text-sm mb-5">{t.methodik.disclaimer.text}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.methodik.disclaimer.source}</p>
          </motion.div>

        </div>
      </Section>

      {/* ── 2.3 CO₂ DEEP-DIVE ───────────────────────────────────────── */}
      <Section id="co2" className="border-t border-black/5">
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3 text-burgundy">
            <Wind size={22} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.co2.badge}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.co2.h2}</h2>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">{t.co2.lead}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30 mb-8">{t.co2.chartLabel}</p>
            <HorizontalBars data={co2Bars} max={3.5} unit="kg/kg" decimals={2} ariaLabel={t.co2.chartLabel} />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-accent-warning text-white rounded-[2rem] p-10 shadow-xl"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-3">{t.co2.calloutBadge}</p>
            <p className="text-7xl font-serif font-black tracking-tighter mb-4">{t.co2.calloutNum}</p>
            <p className="text-base leading-relaxed opacity-90">{t.co2.calloutBody}</p>
          </motion.div>
        </div>
        <div className="mt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30">{t.co2.source}</p>
        </div>
      </Section>

      {/* ── 2.4 WATER DEEP-DIVE ─────────────────────────────────────── */}
      <Section id="wasser" className="border-t border-black/5">
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3 text-sky-600">
            <Droplets size={22} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.water.badge}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.water.h2}</h2>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">{t.water.lead}</p>
        </div>
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30 mb-3">{t.water.chartLabel}</p>
          <p className="text-sm font-serif italic text-charcoal/50 mb-7">{t.water.chartNote}</p>
          <HorizontalBars data={waterBars} max={350} unit="L/kg" decimals={0} ariaLabel={t.water.chartLabel} />
        </div>

        {/* ── Anbauweise Wasserverbrauch ── */}
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10 mb-10">
          <h3 className="text-2xl font-serif font-black text-charcoal mb-3">{t.water.waterSplit.h3}</h3>
          <p className="text-charcoal/70 leading-relaxed mb-8">{t.water.waterSplit.body}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-2">
              <p className="text-2xl leading-none">{t.water.waterSplit.freiland.icon}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">{t.water.waterSplit.freiland.label}</p>
              <p className="text-4xl font-serif font-black text-emerald-700">{t.water.waterSplit.freiland.value}</p>
              <p className="text-sm text-charcoal/60 leading-relaxed">{t.water.waterSplit.freiland.sub}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-2">
              <p className="text-2xl leading-none">{t.water.waterSplit.greenhouse.icon}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-600">{t.water.waterSplit.greenhouse.label}</p>
              <p className="text-4xl font-serif font-black text-amber-700">{t.water.waterSplit.greenhouse.value}</p>
              <p className="text-sm text-charcoal/60 leading-relaxed">{t.water.waterSplit.greenhouse.sub}</p>
            </div>
          </div>
          <p className="text-sm font-serif italic text-charcoal/60 border-t border-black/5 pt-5 mb-4">{t.water.waterSplit.insight}</p>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.water.waterSplit.source}</p>
        </div>

        {/* Wasser in Zahlen */}
        <div className="bg-alabaster rounded-[2rem] border border-black/5 p-8 md:p-10 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600 mb-4">{t.water.statsBox.kicker}</p>
          <h3 className="text-2xl font-serif font-black text-charcoal mb-4">{t.water.statsBox.h3}</h3>
          <p className="text-sm text-charcoal/70 leading-relaxed mb-8">{t.water.statsBox.intro}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {t.water.statsBox.stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
                <p className="text-2xl font-serif font-black text-sky-600">{s.val}</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-charcoal/50 mt-1">{s.lab}</p>
                <p className="text-xs text-charcoal/40 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-black/5 pt-6">
            <h4 className="text-lg font-serif font-black text-charcoal mb-2">{t.water.statsBox.perKopfH3}</h4>
            <p className="text-sm text-charcoal/70 leading-relaxed mb-5">{t.water.statsBox.perKopfBody}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {t.water.statsBox.perKopfRows.map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-black/5 shadow-sm">
                  <p className="text-xl mb-1">{r.icon}</p>
                  <p className="text-xs font-black uppercase tracking-wide text-charcoal/50 mb-1">{r.label}</p>
                  <p className="text-xl font-serif font-black text-sky-600">{r.val}</p>
                  <p className="text-xs text-charcoal/40 mt-0.5">{r.calc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm font-serif italic text-charcoal/70 leading-relaxed">{t.water.statsBox.perKopfInsight}</p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30 mt-6">{t.water.statsBox.statSource}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-sky-50 border border-sky-100 rounded-[1.5rem] p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-700 mb-3">{t.water.box1Title}</p>
            <p className="text-charcoal/80 leading-relaxed font-serif">{t.water.box1Body}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-[1.5rem] p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 mb-3">{t.water.box2Title}</p>
            <p className="text-charcoal/80 leading-relaxed font-serif">{t.water.box2Body}</p>
          </div>
        </div>
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-[1.5rem] p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700 mb-3">{t.water.box3Title}</p>
          <p className="text-charcoal/80 leading-relaxed font-serif">{t.water.box3Body}</p>
        </div>
        <div className="mt-8 space-y-2">
          <p className="text-[11px] font-serif italic text-charcoal/40 leading-relaxed">{t.water.nlWaterNote}</p>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30">{t.water.source}</p>
        </div>
      </Section>

      {/* ── 2.5 TRANSPORT ───────────────────────────────────────────── */}
      <Section id="transport" className="border-t border-black/5">
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3 text-burgundy">
            <Truck size={22} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.transport.badge}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.transport.h2}</h2>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">
            {t.transport.lead.split(t.transport.leadBold).map((part, i) => i === 0
              ? <span key={i}>{part}<strong>{t.transport.leadBold}</strong></span>
              : <span key={i}>{part}</span>
            )}
          </p>
        </div>
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30 mb-8">{t.transport.chartLabel}</p>
          <HorizontalBars data={transportBars} max={21000} unit={lang === 'DE' ? 't/Jahr' : 't/year'} decimals={0} ariaLabel={t.transport.chartLabel} />
        </div>
        <div className="overflow-x-auto rounded-[2rem] border border-black/5 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-alabaster">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                {[t.transport.thOrigin, t.transport.thDist, t.transport.thTrips, t.transport.thCo2, t.transport.thCost].map((h) => (
                  <th key={h} className="px-6 py-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="font-serif">
              <tr className="border-t border-black/5">
                <td className="px-6 py-5">🇪🇸 {lang === 'DE' ? 'Spanien (Huelva)' : 'Spain (Huelva)'}</td>
                <td className="px-6 py-5">{lang === 'DE' ? '2.300 km' : '2,300 km'}</td>
                <td className="px-6 py-5">~3.666</td>
                <td className="px-6 py-5 font-black">138 g</td>
                <td className="px-6 py-5">{lang === 'DE' ? '8,6 – 10,9 ct' : '8.6 – 10.9 ct'}</td>
              </tr>
              <tr className="border-t border-black/5">
                <td className="px-6 py-5">🇳🇱 {lang === 'DE' ? 'Niederlande' : 'Netherlands'}</td>
                <td className="px-6 py-5">250 km</td>
                <td className="px-6 py-5">~701</td>
                <td className="px-6 py-5 font-black">15 g</td>
                <td className="px-6 py-5">{lang === 'DE' ? '0,9 – 1,2 ct' : '0.9 – 1.2 ct'}</td>
              </tr>
              <tr className="border-t border-black/5">
                <td className="px-6 py-5">🇩🇪 {lang === 'DE' ? 'Deutschland (Ø)' : 'Germany (avg.)'}</td>
                <td className="px-6 py-5">225 km</td>
                <td className="px-6 py-5">~6.420</td>
                <td className="px-6 py-5 font-black">14 g</td>
                <td className="px-6 py-5">{lang === 'DE' ? '0,6 – 1,4 ct' : '0.6 – 1.4 ct'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[11px] font-serif italic text-charcoal/40 leading-relaxed">{t.transport.tableNote}</p>
        {/* Transportmittel comparison table */}
        <div className="mt-12">
          <h3 className="text-2xl font-serif italic text-charcoal mb-3">{t.transport.truckH3}</h3>
          <p className="text-charcoal/70 mb-6 leading-relaxed">{t.transport.truckLead}</p>
          <div className="overflow-x-auto rounded-[2rem] border border-black/5 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-alabaster">
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                  {(['Transportmittel', 'Rolle bei Erdbeeren', 'Vorteile', 'Nachteile'] as const).map((h) => (
                    <th key={h} className="px-5 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-serif">
                {[
                  { icon: '🚛', label: lang === 'DE' ? 'Kühl-LKW' : 'Reefer truck', role: lang === 'DE' ? 'Standard in Europa' : 'Standard in Europe', pros: lang === 'DE' ? 'Direkt, schnell, flexibel, geschlossene Kühlkette' : 'Direct, fast, flexible, closed cold chain', cons: lang === 'DE' ? 'Höhere CO₂e als Bahn, Dieselabhängigkeit, Staus' : 'Higher CO₂e than rail, diesel dependency, congestion', highlight: true },
                  { icon: '🚆', label: lang === 'DE' ? 'Bahn / Kühlzug' : 'Rail / refrigerated train', role: lang === 'DE' ? 'Technisch möglich, aber selten' : 'Technically possible, but rare', pros: lang === 'DE' ? 'Klimafreundlicher auf langen Strecken' : 'More climate-friendly over long distances', cons: lang === 'DE' ? 'Terminalumschlag, Vor-/Nachlauf per LKW, weniger flexibel' : 'Terminal handling, first/last mile by truck, less flexible', highlight: false },
                  { icon: '✈️', label: lang === 'DE' ? 'Flugzeug' : 'Aircraft', role: lang === 'DE' ? 'Innerhalb EU kaum relevant' : 'Rarely relevant within EU', pros: lang === 'DE' ? 'Sehr schnell' : 'Very fast', cons: lang === 'DE' ? 'Sehr teuer, sehr hohe Emissionen' : 'Very expensive, very high emissions', highlight: false },
                  { icon: '🚢', label: lang === 'DE' ? 'Schiff / Kühlcontainer' : 'Ship / reefer container', role: lang === 'DE' ? 'Für EU-Erdbeeren kaum relevant' : 'Barely relevant for EU strawberries', pros: lang === 'DE' ? 'Günstig & CO₂-arm pro tkm' : 'Cheap & low CO₂ per tkm', cons: lang === 'DE' ? 'Zu langsam und unflexibel' : 'Too slow and inflexible', highlight: false },
                ].map((row, i) => (
                  <tr key={i} className={cn('border-t border-black/5', row.highlight && 'bg-amber-50/50')}>
                    <td className="px-5 py-4 font-black text-charcoal">{row.icon} {row.label}</td>
                    <td className="px-5 py-4 text-charcoal/70">{row.role}</td>
                    <td className="px-5 py-4 text-emerald-700">{row.pros}</td>
                    <td className="px-5 py-4 text-rose-700">{row.cons}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30">{t.transport.source}</p>
        </div>
      </Section>

      {/* ── 2.6 SEASON CALENDAR ─────────────────────────────────────── */}
      <Section id="saison" className="border-t border-black/5">
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3 text-charcoal/60">
            <Calendar size={22} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.season.badge}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.season.h2}</h2>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">{t.season.lead}</p>
        </div>
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10 overflow-x-auto mb-4">
          <div className="min-w-[700px]">
            <SeasonCalendar months={t.season.months as unknown as string[]} rows={t.season.rows as unknown as string[]} />
          </div>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 mb-6 px-1">
          {([
            { color: 'bg-country-de', label: lang === 'DE' ? '🇩🇪 Deutschland (Freiland)' : '🇩🇪 Germany (Open field)' },
            { color: 'bg-country-es', label: lang === 'DE' ? '🇪🇸 Spanien' : '🇪🇸 Spain' },
            { color: 'bg-country-nl', label: lang === 'DE' ? '🇳🇱 Niederlande (Hightech)' : '🇳🇱 Netherlands (High-tech)' },
            { color: 'bg-accent-warning', label: lang === 'DE' ? '🇩🇪 DE Winter-Gewächshaus ⚠️' : '🇩🇪 DE Winter Greenhouse ⚠️' },
          ] as const).map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={cn('w-4 h-4 rounded-sm shrink-0', item.color)} />
              <span className="text-sm text-charcoal/60">{item.label}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-warning/80 px-1">{t.season.note}</p>
        <p className="text-charcoal/80 max-w-4xl text-lg leading-relaxed font-serif italic mt-6">
          {t.season.takeaway}{' '}
          <strong className="not-italic font-black text-charcoal">{t.season.takeawayBold1}</strong>
          {t.season.takeawayMid}{' '}
          <strong className="not-italic font-black text-burgundy">{t.season.takeawayBold2}</strong>
          {t.season.takeawayEnd}
        </p>

        {/* Saisonlücke Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="mt-12 bg-charcoal rounded-[2rem] p-8 md:p-10 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-serif font-black mb-4">{t.saisonluecke.title}</h3>
          <p className="text-white/70 leading-relaxed mb-8 max-w-3xl font-serif">{t.saisonluecke.body}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-5 border border-emerald-400/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🟢</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '33%' }} />
                </div>
                <span className="text-sm font-black text-emerald-400 shrink-0">4 / 12</span>
              </div>
              <p className="text-sm font-black text-white">{t.saisonluecke.bar1Label}</p>
              <p className="text-xs text-white/50">{t.saisonluecke.bar1Co2}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-amber-400/20 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔴</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '67%' }} />
                </div>
                <span className="text-sm font-black text-amber-400 shrink-0">8 / 12</span>
              </div>
              <p className="text-sm font-black text-white">{t.saisonluecke.bar2Label}</p>
              <p className="text-xs text-white/50">{t.saisonluecke.bar2Co2}</p>
            </div>
          </div>
          <p className="text-sm font-serif italic text-white/60 border-t border-white/10 pt-6">{t.saisonluecke.insight}</p>
        </motion.div>
      </Section>

      {/* ── 2.7 PRICE ────────────────────────────────────────────────── */}
      <Section id="preis" className="border-t border-black/5">
        <div className="space-y-6 mb-12">
          <div className="flex items-center gap-3 text-charcoal/60">
            <Euro size={22} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t.price.badge}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.price.h2}</h2>
        </div>
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30 mb-8">{t.price.chartLabel}</p>
          <div className="space-y-7">
            {priceRanges.map((r) => {
              const left = (r.min / priceMax) * 100;
              const width = ((r.max - r.min) / priceMax) * 100;
              return (
                <div key={r.label} className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-charcoal/70">{r.label}</p>
                    <p className="text-xl font-serif font-black tabular-nums text-charcoal">
                      {r.min} – {r.max} <span className="text-xs text-charcoal/40">€/kg</span>
                    </p>
                  </div>
                  <div className="relative h-3 w-full bg-black/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0, left: `${left}%` }}
                      whileInView={{ width: `${width}%`, left: `${left}%` }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute h-full rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10 mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30 mb-6">{t.price.transportLabel}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { flag: '🇪🇸', name: lang === 'DE' ? 'Spanien' : 'Spain', value: lang === 'DE' ? '8,6 – 10,9 ct' : '8.6 – 10.9 ct' },
              { flag: '🇳🇱', name: lang === 'DE' ? 'Niederlande' : 'Netherlands', value: lang === 'DE' ? '0,9 – 1,2 ct' : '0.9 – 1.2 ct' },
              { flag: '🇩🇪', name: lang === 'DE' ? 'Deutschland' : 'Germany', value: lang === 'DE' ? '0,6 – 1,4 ct' : '0.6 – 1.4 ct' },
            ].map((d) => (
              <div key={d.name} className="bg-alabaster rounded-2xl p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/40 mb-2">{d.flag} {d.name}</p>
                <p className="text-2xl font-serif font-black text-charcoal">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-burgundy text-white rounded-[2rem] p-10 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-4">{t.price.insightBadge}</p>
          <p className="text-xl md:text-2xl font-serif italic leading-snug max-w-3xl">
            {t.price.insightBody.split(t.price.insightBold).map((part, i) => i === 0
              ? <span key={i}>{part}<strong className="not-italic">{t.price.insightBold}</strong></span>
              : <span key={i}>{part}</span>
            )}
          </p>
        </div>
      </Section>

      {/* ── 2.7b PRODUKTIONSKOSTEN ──────────────────────────────────── */}
      <Section id="produktionskosten" className="border-t border-black/5">
        <div className="space-y-6 mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">{t.prodCosts.badge}</span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.prodCosts.h2}</h2>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">
            {lang === 'DE' ? (
              <>Die Produktionskosten von Erdbeeren werden von sechs Faktoren bestimmt: <strong>Energieverbrauch, Arbeitskosten, Bewässerung, Verpackung, Transport und Technik/Infrastruktur</strong>. Den größten Einfluss hat fast immer der <strong>Energiebedarf</strong> — vor allem Heizung, Beleuchtung und Klimaregulierung im Gewächshaus. Dadurch steigen sowohl Produktionskosten als auch CO₂-Emissionen.</>
            ) : (
              <>Strawberry production costs are driven by six factors: <strong>energy consumption, labour costs, irrigation, packaging, transport and technology/infrastructure</strong>. The single biggest driver is almost always <strong>energy</strong> — especially heating, lighting and climate control in greenhouses. This raises both production costs and CO₂ emissions.</>
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {t.prodCosts.cards.map((card, i) => (
            <div key={i} className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden flex flex-col">
              <div className={cn('px-7 pt-7 pb-5 flex items-center gap-3', card.accent, card.text)}>
                <span className="text-2xl leading-none">{card.flag}</span>
                <h3 className="text-xl font-serif font-black tracking-tight">{card.country}</h3>
              </div>
              <div className="px-7 py-6 flex-1">
                <p className="font-serif font-black text-charcoal text-lg mb-4">{card.headline}</p>
                <ul className="space-y-3">
                  {card.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-charcoal/70 text-sm leading-relaxed">
                      <span className="text-burgundy mt-0.5 shrink-0">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-burgundy text-white rounded-[2rem] p-10 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-4">{t.prodCosts.erkBadge}</p>
          <p className="text-xl md:text-2xl font-serif italic leading-snug max-w-3xl">{t.prodCosts.erkBody}</p>
        </div>
        <div className="mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/30">{t.prodCosts.erkSource}</p>
        </div>
      </Section>

      {/* ── 2.7c PREISENTWICKLUNG ───────────────────────────────────── */}
      <Section id="preisentwicklung" className="border-t border-black/5">
        <div className="space-y-6 mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">{t.preisentwicklung.badge}</span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.preisentwicklung.h2}</h2>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">{t.preisentwicklung.intro}</p>
        </div>

        {/* ── Stat grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
          {t.preisentwicklung.stats.map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: i * 0.07 }}
              className="bg-white rounded-[1.5rem] border border-black/5 shadow-sm p-6 space-y-2"
            >
              <p className={cn('text-3xl md:text-4xl font-serif font-black tracking-tighter leading-none', stat.cls)}>{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/50 leading-snug">{stat.label}</p>
              <p className="text-xs text-charcoal/40 leading-snug">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Mindestlohn comparison ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}
          className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10 mb-8"
        >
          <h3 className="text-2xl font-serif font-black text-charcoal mb-3">{t.preisentwicklung.mindestlohn.title}</h3>
          <p className="text-charcoal/70 leading-relaxed mb-8">{t.preisentwicklung.mindestlohn.text}</p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-center">
            {/* 2015 */}
            <div className="bg-alabaster rounded-2xl p-6 space-y-5">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-charcoal/30">{t.preisentwicklung.mindestlohn.year2015.year}</p>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-charcoal/40 mb-1">{t.preisentwicklung.mindestlohn.year2015.lohnLabel}</p>
                <p className="text-3xl font-serif font-black text-charcoal">{t.preisentwicklung.mindestlohn.year2015.lohn}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-charcoal/40 mb-1">{t.preisentwicklung.mindestlohn.year2015.preisLabel}</p>
                <p className="text-3xl font-serif font-black text-charcoal">{t.preisentwicklung.mindestlohn.year2015.preis}</p>
              </div>
            </div>
            {/* Change column */}
            <div className="flex flex-row md:flex-col items-center justify-center gap-4 md:gap-6 px-2">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xl font-serif font-black text-amber-600">{t.preisentwicklung.mindestlohn.lohnChange}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/30 text-center leading-tight">{t.preisentwicklung.mindestlohn.lohnChangeLabel}</span>
              </div>
              <span className="text-charcoal/15 text-2xl font-black rotate-90 md:rotate-0">→</span>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xl font-serif font-black text-rose-600">{t.preisentwicklung.mindestlohn.preisChange}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-charcoal/30 text-center leading-tight">{t.preisentwicklung.mindestlohn.preisChangeLabel}</span>
              </div>
            </div>
            {/* 2025 */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-6 space-y-5">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-rose-400">{t.preisentwicklung.mindestlohn.year2025.year}</p>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-charcoal/40 mb-1">{t.preisentwicklung.mindestlohn.year2025.lohnLabel}</p>
                <p className="text-3xl font-serif font-black text-amber-600">{t.preisentwicklung.mindestlohn.year2025.lohn}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-charcoal/40 mb-1">{t.preisentwicklung.mindestlohn.year2025.preisLabel}</p>
                <p className="text-3xl font-serif font-black text-rose-600">{t.preisentwicklung.mindestlohn.year2025.preis}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Insight box ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-burgundy text-white rounded-[2rem] p-10 shadow-xl mb-8"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-70 mb-4">{t.preisentwicklung.insight.badge}</p>
          <p className="text-xl md:text-2xl font-serif italic leading-snug max-w-3xl">{t.preisentwicklung.insight.text}</p>
        </motion.div>

        {/* ── Chain reaction ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 md:p-10"
        >
          <h3 className="text-2xl font-serif font-black text-charcoal mb-8">{t.preisentwicklung.chain.title}</h3>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-1 min-w-max">
              {t.preisentwicklung.chain.steps.map((step, i) => {
                const isLast = i === t.preisentwicklung.chain.steps.length - 1;
                return (
                  <div key={i} className="flex items-center gap-1">
                    <div className="flex items-center gap-1.5 bg-alabaster border border-black/10 rounded-xl px-3 py-2.5">
                      <p className="text-xs font-black text-charcoal whitespace-nowrap">{step.label}</p>
                      {step.change && (
                        <span className="text-xs font-black text-rose-500">{step.change}</span>
                      )}
                    </div>
                    {!isLast && (
                      <span className="text-charcoal/20 text-sm font-black shrink-0 mx-0.5">→</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30 mt-6">{t.preisentwicklung.chain.source}</p>
        </motion.div>
      </Section>

      {/* ── 2.8 MARKT ───────────────────────────────────────────────── */}
      <Section id="markt" className="border-t border-black/5">
        <div className="space-y-6 mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">{t.market.badge}</span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.market.h2}</h2>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">{t.market.lead}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 space-y-6">
            <p className="font-serif font-black text-charcoal text-lg leading-snug">{t.market.chartA}</p>
            <HorizontalBars ariaLabel={t.market.chartA} max={340} unit="" decimals={1} data={euProdBars} />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.market.chartASource}</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 space-y-4">
            <p className="font-serif font-black text-charcoal text-lg leading-snug">{t.market.chartB}</p>
            <HGroupedBarsChart
              ariaLabel={t.market.chartB}
              groups={importGroups}
              series={[[73772, 22057, 13271, 4084, 4084, 1964], [77229, 23649, 15894, 4855, 4772, 2381]]}
              seriesLabels={['2024', '2025']}
              max={80000}
            />
            <p className="text-sm font-serif italic text-charcoal/60">{t.market.chartBCaption}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.market.chartBSource}</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 space-y-4">
            <p className="font-serif font-black text-charcoal text-lg leading-snug">{t.market.chartC}</p>
            <LineAreaChart
              ariaLabel={t.market.chartC}
              data={[19.05, 19.43, 19.12, 18.37, 17.93, 17.81, 17.70, 16.68, 16.15, 16.42, 14.86, 14.01, 13.15]}
              labels={['2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024']}
              yMin={12} yMax={20} color="#B91C1C" showArea annotation="−31 %" height={210} showTooltip tooltipUnit={lang === 'DE' ? 'Tsd. ha' : 'ths. ha'}
            />
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.market.chartCSource}</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 space-y-4">
            <p className="font-serif font-black text-charcoal text-lg leading-snug">{t.market.chartD}</p>
            <DonutChart
              ariaLabel={t.market.chartD}
              donutLabel={t.market.donutLabel}
              segments={[
                { value: 78600, color: '#16A34A', label: t.market.donutSeg1 },
                { value: 41750, color: '#FF6E00', label: t.market.donutSeg2 },
              ]}
            />
            <p className="text-sm font-serif italic text-charcoal/60">{t.market.chartDCaption}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.market.chartDSource}</p>
          </div>

          <div className="md:col-span-2 bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 space-y-4">
            <p className="font-serif font-black text-charcoal text-lg leading-snug">{t.market.chartE}</p>
            <LineAreaChart
              ariaLabel={t.market.chartE}
              data={[3.3,3.5,3.7,3.6,3.5,3.5,3.7,3.4,3.5,3.5,3.8,3.8,3.7,4.0,3.4,3.3]}
              labels={['08/09','09/10','10/11','11/12','12/13','13/14','14/15','15/16','16/17','17/18','18/19','19/20','20/21','21/22','22/23','23/24']}
              yMin={3.0} yMax={4.2} color="#9B2226" showArea height={200}
            />
            <p className="text-sm font-serif italic text-charcoal/60">{t.market.chartECaption}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.market.chartESource}</p>
          </div>
        </div>

        {/* ── Bio sub-section ── */}
        <div className="mt-14 pt-14 border-t border-black/5 space-y-8">
          <h3 className="text-2xl md:text-3xl font-serif italic text-charcoal">{t.market.bioH3}</h3>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">
            {lang === 'DE' ? (
              <>Während der Gesamtanbau in Deutschland zurückgeht, schrumpft der Bio-Anteil noch dramatischer. Von <strong>120.350 Tonnen Erdbeeren</strong> in Deutschland (2024) waren nur <strong>1.258 Tonnen Bio</strong> — das sind rund <strong>1 %</strong>. Und der Trend zeigt steil nach unten.</>
            ) : (
              <>While overall cultivation in Germany is declining, the organic share is shrinking even more dramatically. Of <strong>120,350 tonnes of strawberries</strong> in Germany (2024), only <strong>1,258 tonnes were organic</strong> — that is around <strong>1%</strong>. And the trend is steeply downward.</>
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-start">
            <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 space-y-4">
              <p className="font-serif font-black text-charcoal text-base">{t.market.bioChartTitle}</p>
              <LineAreaChart
                ariaLabel={t.market.bioChartTitle}
                data={[2575, 3772, 2711, 2894, 1855, 3214, 2569, 1819, 1671, 1651, 1357, 1258]}
                labels={['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024']}
                yMin={1000} yMax={4000} color="#16A34A" showArea annotation={t.market.bioAnnotation} height={200}
              />
            </div>
            <div className="space-y-5">
              {([
                { val: t.market.bioStat1Val, sub: t.market.bioStat1Sub, cls: 'text-emerald-600' },
                { val: t.market.bioStat2Val, sub: t.market.bioStat2Sub, cls: 'text-rose-600' },
                { val: t.market.bioStat3Val, sub: t.market.bioStat3Sub, cls: 'text-charcoal' },
              ] as const).map((s, i) => (
                <div key={i} className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
                  <p className={cn('text-4xl font-serif font-black tracking-tighter', s.cls)}>{s.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-charcoal/40 mt-2 leading-snug">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm font-serif italic text-charcoal/60">{t.market.bioCaption}</p>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.market.bioSource}</p>
        </div>

        <div className="mt-10 bg-alabaster rounded-[2rem] border border-black/10 p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy mb-4">{t.market.summaryBadge}</p>
          <p className="text-lg font-serif text-charcoal/80 leading-relaxed max-w-4xl">
            {t.market.summaryBody.split(t.market.summaryBold).map((part, i) => i === 0
              ? <span key={i}>{part}<strong>{t.market.summaryBold}</strong></span>
              : <span key={i}>{part}</span>
            )}
          </p>
        </div>
      </Section>

      {/* ── 2.8b GESAMTANALYSE ──────────────────────────────────────── */}
      <Section id="gesamtanalyse" className="border-t border-black/5">
        <div className="space-y-4 mb-14">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">{t.gesamtanalyse.badge}</span>
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-charcoal italic leading-[1.1]">{t.gesamtanalyse.h2}</h2>
          <p className="text-charcoal/70 max-w-3xl text-lg leading-relaxed">{t.gesamtanalyse.intro}</p>
        </div>

        {/* Dimension Winner Table */}
        <div className="overflow-x-auto rounded-[2rem] border border-black/5 bg-white shadow-sm mb-5">
          <table className="w-full text-left text-sm">
            <thead className="bg-alabaster">
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">
                <th className="px-6 py-5 min-w-[180px]">{t.gesamtanalyse.thDimension}</th>
                <th className="px-6 py-5 whitespace-nowrap">{t.gesamtanalyse.thDe}</th>
                <th className="px-6 py-5 whitespace-nowrap">{t.gesamtanalyse.thDeWinter}</th>
                <th className="px-6 py-5 whitespace-nowrap">{t.gesamtanalyse.thEs}</th>
                <th className="px-6 py-5 whitespace-nowrap">{t.gesamtanalyse.thNl}</th>
              </tr>
            </thead>
            <tbody>
              {t.gesamtanalyse.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-black/5 hover:bg-black/[0.015] transition-colors">
                  <td className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-charcoal/50 whitespace-nowrap">{row.dim}</td>
                  {row.cells.map((cell, ci) => (
                    <td key={ci} className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 text-sm font-black whitespace-nowrap',
                        cell.score === 'GOOD' ? 'text-emerald-700' : cell.score === 'BAD' ? 'text-rose-600' : 'text-amber-600'
                      )}>
                        <span>{cell.score === 'GOOD' ? '🟢' : cell.score === 'BAD' ? '🔴' : '🟡'}</span>
                        <span>{cell.val}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs font-serif text-charcoal/40 mb-14">{t.gesamtanalyse.legend}</p>

        {/* Three takeaway callouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {t.gesamtanalyse.takeaways.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="bg-alabaster border border-black/5 rounded-[1.5rem] p-7 space-y-3"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-burgundy">{t.gesamtanalyse.erkBadge}</p>
              <p className="font-serif font-black text-charcoal text-lg leading-snug">{item.title}</p>
              <p className="text-charcoal/70 text-sm leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/30">{t.gesamtanalyse.source}</p>
      </Section>

      {/* ── 2.9 FAZIT ───────────────────────────────────────────────── */}
      <Section id="fazit" className="border-t border-black/5">
        <div className="space-y-6 mb-14">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-burgundy">{t.conclusion.badge}</span>
          <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-charcoal italic leading-[1.05]">{t.conclusion.h2}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {t.conclusion.findings.map((c) => (
            <motion.div
              key={c.num}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7 }}
              className="bg-white rounded-[2rem] border border-black/5 p-10 shadow-sm space-y-4"
            >
              <p className="text-7xl font-serif font-black text-burgundy/20 tracking-tighter leading-none">{c.num}</p>
              <h3 className="text-2xl font-serif font-black text-charcoal italic leading-tight">{c.title}</h3>
              <p className="text-charcoal/70 leading-relaxed font-sans">{c.body}</p>
            </motion.div>
          ))}
        </div>
        <div className="space-y-10 pt-16 border-t border-black/5">
          <div>
            <h3 className="text-3xl font-serif italic text-charcoal tracking-tight">{t.conclusion.sourcesH3}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-charcoal/30 mt-3">{t.conclusion.sourcesSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SOURCES.map((src, i) => (
              <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                className="group p-6 bg-white rounded-3xl border border-black/5 shadow-sm hover:shadow-md hover:border-burgundy/20 transition-all duration-300"
              >
                <p className="font-serif font-black text-charcoal text-base leading-snug group-hover:text-burgundy transition-colors duration-300">{src.title}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 mt-2">{src.author}{src.year && ` · ${src.year}`}</p>
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CLOSING ─────────────────────────────────────────────────── */}
      <footer className="py-32 px-6 md:px-20 text-center text-charcoal/30 border-t border-black/5 mx-6 md:mx-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-burgundy/[0.02] blur-[120px] rounded-full pointer-events-none" />
        <p className="font-serif italic tracking-tight text-charcoal/60 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">{t.footer.team}</p>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal/30 mt-8">{t.footer.course}</p>
        <Link href="/explorer" className="inline-flex items-center gap-2 mt-12 px-8 py-4 bg-charcoal text-alabaster rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-burgundy transition-colors">
          <ArrowLeft size={14} />
          {t.footer.backBtn}
        </Link>
      </footer>
    </main>
  );
}
