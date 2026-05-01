export interface FacetValueMeta {
    description: string;
    traits?: string[];
    image?: string;
}

export interface FacetMeta {
    label: string;
    prompt: string;
    intro: string;
    eyebrow: string;
    values: Record<string, FacetValueMeta>;
    fallback: FacetValueMeta;
}

export const SHOP_EMAIL = 'consultation@everandalways.com';

export const JOURNEY_FACET_ORDER = [
    'diamond shape',
    'metal type',
    'carat weight',
    'cut quality',
    'diamond color',
    'diamond clarity',
    'setting style',
    'ring size',
    'band width',
];

const norm = (s: string) => s.trim().toLowerCase();

export const FACET_META: Record<string, FacetMeta> = {
    'diamond shape': {
        label: 'Diamond Shape',
        prompt: 'Choose Your Shape',
        eyebrow: 'Step · Silhouette',
        intro: 'The shape sets the soul of the stone — every silhouette catches light its own way.',
        values: {
            round: {
                description: 'The most popular cut — 58 facets engineered to return maximum light and brilliance.',
                traits: ['Maximum brilliance', 'Timeless and classic', 'Suits every setting'],
                image: '/round.png',
            },
            princess: {
                description: 'A modern square cut with sharp corners and brilliant sparkle for a contemporary edge.',
                traits: ['Modern silhouette', 'Brilliant sparkle', 'Excellent value'],
                image: '/princess.png',
            },
            emerald: {
                description: 'Step-cut facets create a hall-of-mirrors effect — refined, vintage, and quietly luxurious.',
                traits: ['Hall-of-mirrors clarity', 'Vintage glamour', 'Showcases purity'],
                image: '/emerald.png',
            },
            oval: {
                description: 'An elongated brilliant — visually larger on the finger with the same fire as a round.',
                traits: ['Elongating silhouette', 'Looks larger per carat', 'Flattering on every hand'],
                image: '/oval.png',
            },
            cushion: {
                description: 'Pillow-soft corners with romantic, candle-lit fire — old-world charm in a modern stone.',
                traits: ['Romantic vintage feel', 'Soft pillow shape', 'Exceptional fire'],
                image: '/cushion.png',
            },
            pear: {
                description: 'A teardrop fusion of round and marquise — distinctive, elegant, and finger-lengthening.',
                traits: ['Unique teardrop form', 'Elongates the finger', 'Eye-catching presence'],
                image: '/pear.png',
            },
            marquise: {
                description: 'A regal, elongated football-shaped cut that maximises perceived carat weight.',
                traits: ['Largest face-up size', 'Slimming on the finger', 'Royal heritage'],
            },
            radiant: {
                description: 'Trimmed corners with brilliant-cut facets — the durability of a princess with the fire of a round.',
                traits: ['Hybrid brilliance', 'Durable corners', 'Bold and contemporary'],
            },
            asscher: {
                description: 'A square step-cut with deep pavilion and Art Deco geometry — vintage Hollywood in stone form.',
                traits: ['Art Deco heritage', 'Geometric clarity', 'Distinctive character'],
            },
            heart: {
                description: 'A deeply romantic cut with two perfectly symmetrical lobes — a singular declaration of love.',
                traits: ['Symbolic and romantic', 'One-of-a-kind statement', 'Best at 1ct and above'],
            },
        },
        fallback: {
            description: 'A distinctive cut crafted to bring out unique fire and personality in every stone.',
            traits: ['Unique character', 'Expert-crafted facets', 'Hand-selected quality'],
        },
    },
    'metal type': {
        label: 'Metal',
        prompt: 'Pick Your Metal',
        eyebrow: 'Step · Foundation',
        intro: 'The metal carries the diamond and frames its colour — choose the tone that lives with you daily.',
        values: {
            'platinum': {
                description: 'The rarest and most enduring choice — naturally white, hypoallergenic, and built to last generations.',
                traits: ['Naturally white forever', 'Hypoallergenic', 'Heirloom durability'],
            },
            '18k white gold': {
                description: 'Bright, cool, and contemporary — finished with rhodium for a clean, polished glow.',
                traits: ['Cool, modern brightness', 'Rhodium-finished', 'Lighter than platinum'],
            },
            '14k white gold': {
                description: 'A more durable white gold blend — everyday-friendly with the same crisp finish.',
                traits: ['Daily-wear durability', 'Crisp white finish', 'Excellent value'],
            },
            '18k yellow gold': {
                description: 'A warm, classic gold — rich in tone and beautifully traditional against any skin.',
                traits: ['Warm, classic glow', 'Highest pure-gold content', 'Rich vintage feel'],
            },
            '14k yellow gold': {
                description: 'A balanced yellow gold — slightly lighter in hue and built for resilience.',
                traits: ['Resilient daily wear', 'Balanced warm hue', 'Outstanding value'],
            },
            '18k rose gold': {
                description: 'Romantic, blushed, and unmistakably modern — a copper alloy gives its signature warmth.',
                traits: ['Romantic blush tone', 'Flattering on every skin', 'Modern heirloom'],
            },
            '14k rose gold': {
                description: 'A deeper, slightly cooler rose — durable enough for the everyday adventure.',
                traits: ['Stronger alloy', 'Subtle blush colour', 'Wear-friendly'],
            },
            'palladium': {
                description: 'Rare and lightweight white metal — a quieter alternative to platinum with a similar look.',
                traits: ['Lightweight feel', 'Naturally white', 'Hypoallergenic'],
            },
        },
        fallback: {
            description: 'A precious metal hand-selected to complement your stone and stand the test of daily life.',
            traits: ['Premium alloy', 'Expert finishing', 'Lifetime craftsmanship'],
        },
    },
    'carat weight': {
        label: 'Carat',
        prompt: 'Choose Your Carat',
        eyebrow: 'Step · Presence',
        intro: 'Carat is the diamond’s weight — and quietly, its presence. Pick the scale that feels right for you.',
        values: {
            '0.25 ct': { description: 'Delicate and refined — perfect for stacking, accents, or a discreet everyday ring.', traits: ['Subtle and elegant', 'Stack-friendly', 'Comfortable for daily wear'] },
            '0.5 ct': { description: 'A graceful classic — substantial enough to catch light, light enough to wear forever.', traits: ['Balanced presence', 'Universally flattering', 'Excellent everyday choice'] },
            '0.75 ct': { description: 'A confident in-between — noticeable sparkle without overwhelming the hand.', traits: ['Confident presence', 'Beautiful proportions', 'Smart value tier'] },
            '1.0 ct': { description: 'The benchmark milestone — universally recognised as the classic engagement weight.', traits: ['Iconic milestone', 'Strong presence', 'Resale-strong'] },
            '1.5 ct': { description: 'A statement that turns heads — substantial, luminous, and unmistakably present.', traits: ['Statement scale', 'High brilliance', 'Heirloom-worthy'] },
            '2.0 ct': { description: 'Bold luxury — a clear declaration with significant face-up size and fire.', traits: ['Bold luxury', 'Major presence', 'Show-stopping fire'] },
            '3.0 ct': { description: 'Rare and remarkable — a heritage-grade stone worthy of a centrepiece setting.', traits: ['Rare and remarkable', 'Investment-grade', 'Centre-stage worthy'] },
        },
        fallback: {
            description: 'A carefully chosen weight to deliver the presence and proportion you want on the finger.',
            traits: ['Hand-selected weight', 'Balanced proportions', 'Quality assured'],
        },
    },
    'cut quality': {
        label: 'Cut Quality',
        prompt: 'Choose Your Cut Grade',
        eyebrow: 'Step · Light',
        intro: 'Cut grade is the single biggest driver of how much your diamond actually sparkles.',
        values: {
            excellent: { description: 'The highest grade — engineered for maximum brilliance, fire, and scintillation.', traits: ['Top-tier sparkle', 'Maximum light return', 'Premium craftsmanship'] },
            'very good': { description: 'A near-excellent finish — exceptional sparkle at a more accessible price.', traits: ['Outstanding sparkle', 'Smart value', 'Indistinguishable to the eye'] },
            good: { description: 'Beautiful brilliance with a careful balance of value and visual fire.', traits: ['Strong brilliance', 'Balanced value', 'Reliable everyday beauty'] },
            ideal: { description: 'A precision-cut grade reserved for stones with mathematically optimised proportions.', traits: ['Mathematically optimised', 'Crisp light return', 'Connoisseur favourite'] },
            'super ideal': { description: 'The pinnacle — hand-finished, hearts-and-arrows precision for unrivalled performance.', traits: ['Hearts-and-arrows precision', 'Top 1% craftsmanship', 'Unrivalled fire'] },
        },
        fallback: {
            description: 'A quality cut grade that prioritises brilliance and proportion.',
            traits: ['Quality cut', 'Verified proportions', 'Beautiful light return'],
        },
    },
    'diamond color': {
        label: 'Colour',
        prompt: 'Choose Your Colour',
        eyebrow: 'Step · Tone',
        intro: 'Colour is graded D (icy white) through Z (warm). Most eyes can’t tell apart neighbours on the scale.',
        values: {
            d: { description: 'Absolutely colourless — the rarest and whitest grade, prized by collectors.', traits: ['Icy, colourless white', 'Rarest grade', 'Investment-grade'] },
            e: { description: 'Colourless to the unaided eye — exceptional whiteness with rare quality.', traits: ['Eye-clean colourless', 'Top 1% rarity', 'Stunning brilliance'] },
            f: { description: 'Colourless face-up — only a trained gemologist could detect any tint.', traits: ['Face-up colourless', 'Expert-grade purity', 'Excellent value vs D/E'] },
            g: { description: 'Near-colourless with exceptional value — appears white in nearly every setting.', traits: ['Near-colourless white', 'Outstanding value', 'Setting-friendly'] },
            h: { description: 'Near-colourless and the smart sweet spot — great whiteness for the price.', traits: ['Smart value pick', 'Looks white-set', 'Popular choice'] },
            i: { description: 'A faint warmth visible only loose — beautiful in yellow or rose gold settings.', traits: ['Warm, romantic tone', 'Pairs with yellow/rose gold', 'Excellent value'] },
            j: { description: 'A warmer, vintage-feeling stone — exceptional value with character.', traits: ['Vintage warmth', 'Strong value', 'Best in warm metals'] },
        },
        fallback: {
            description: 'A carefully colour-graded stone matched to your setting and preference.',
            traits: ['Graded by experts', 'Verified report', 'Balanced colour'],
        },
    },
    'diamond clarity': {
        label: 'Clarity',
        prompt: 'Choose Your Clarity',
        eyebrow: 'Step · Purity',
        intro: 'Clarity describes the tiny inclusions inside the stone — most are invisible without 10× magnification.',
        values: {
            fl: { description: 'Flawless — no inclusions or blemishes even under 10× magnification. The pinnacle.', traits: ['Absolute purity', 'Top 0.5% rarity', 'Collector grade'] },
            if: { description: 'Internally Flawless — no inclusions inside, only minor surface marks.', traits: ['Internally pristine', 'Investment grade', 'Exceptional clarity'] },
            vvs1: { description: 'Inclusions extremely difficult to spot under 10×. Visually flawless.', traits: ['Eye-clean perfection', 'Top-tier clarity', 'Premium grade'] },
            vvs2: { description: 'Tiny inclusions only a trained grader can find — visually pristine.', traits: ['Visually pristine', 'Top-tier clarity', 'Smart upper-tier value'] },
            vs1: { description: 'Eye-clean with inclusions only visible at 10× — excellent value at premium quality.', traits: ['Eye-clean', 'Excellent value', 'Looks top-tier set'] },
            vs2: { description: 'Eye-clean to the naked eye — the smart choice for maximum quality per dollar.', traits: ['Eye-clean to the eye', 'Best value tier', 'Highly recommended'] },
            si1: { description: 'Inclusions visible at 10× but rarely to the naked eye — outstanding value.', traits: ['Often eye-clean', 'Outstanding value', 'Beautiful when set'] },
            si2: { description: 'Visible inclusions under 10× and sometimes to the naked eye — best value tier.', traits: ['Best value', 'Hand-pick for eye-clean', 'Maximum size per dollar'] },
        },
        fallback: {
            description: 'A clarity grade chosen to balance purity, value, and visual perfection.',
            traits: ['Lab-graded clarity', 'Hand-inspected', 'Visually beautiful'],
        },
    },
    'setting style': {
        label: 'Setting',
        prompt: 'Choose Your Setting',
        eyebrow: 'Step · Style',
        intro: 'The setting holds the stone — and defines the entire personality of the ring.',
        values: {
            solitaire: { description: 'A single diamond on a clean band — the timeless classic that lets the stone speak.', traits: ['Timeless and clean', 'Maximises stone presence', 'Pairs with any band'] },
            halo: { description: 'A ring of smaller diamonds surrounds the centre — visually enlarges and amplifies sparkle.', traits: ['Looks larger', 'Extra sparkle', 'Romantic feel'] },
            'three stone': { description: 'Past, present, and future — a centre stone flanked by two meaningful side diamonds.', traits: ['Symbolic trio', 'Maximum brilliance', 'Statement scale'] },
            pavé: { description: 'Tiny diamonds set into the band — endless sparkle from every angle.', traits: ['Sparkle in the band', 'Romantic detailing', 'Modern classic'] },
            pave: { description: 'Tiny diamonds set into the band — endless sparkle from every angle.', traits: ['Sparkle in the band', 'Romantic detailing', 'Modern classic'] },
            channel: { description: 'Diamonds set flush within the band — sleek, snag-free, and beautifully geometric.', traits: ['Snag-free comfort', 'Sleek geometry', 'Active-life friendly'] },
            bezel: { description: 'A metal rim secures the stone — modern, protective, and architecturally clean.', traits: ['Modern silhouette', 'Most secure setting', 'Snag-free'] },
            'tension': { description: 'The diamond appears to float between two ends of the band — striking and contemporary.', traits: ['Floating illusion', 'Architectural', 'Contemporary'] },
            cathedral: { description: 'Arched metalwork rises to lift the stone — adds height and architectural drama.', traits: ['Lifted presence', 'Architectural arches', 'Classic elegance'] },
            vintage: { description: 'Filigree, milgrain, and heritage details — the romance of another era reimagined.', traits: ['Heritage detailing', 'Hand-engraved feel', 'Romantic'] },
        },
        fallback: {
            description: 'A setting hand-crafted to elevate your stone with character and security.',
            traits: ['Crafted by hand', 'Designed for the stone', 'Built to last'],
        },
    },
    'ring size': {
        label: 'Size',
        prompt: 'Choose Your Ring Size',
        eyebrow: 'Step · Fit',
        intro: 'Pick the size you wear today — every ring is hand-finished to your exact measurement.',
        values: {},
        fallback: {
            description: 'A precise ring size — every piece is hand-finished to fit perfectly. Unsure of your size? We’ll send a complimentary sizer.',
            traits: ['Hand-finished to size', 'Complimentary resize within 60 days', 'Accurate fit guaranteed'],
        },
    },
    'band width': {
        label: 'Band Width',
        prompt: 'Choose Your Band Width',
        eyebrow: 'Step · Proportion',
        intro: 'Band width changes the entire feel of the ring — delicate, balanced, or bold.',
        values: {
            '1.5mm': { description: 'Whisper-thin — delicate, modern, and beautifully understated.', traits: ['Delicate look', 'Maximises stone presence', 'Modern silhouette'] },
            '1.8mm': { description: 'A refined slim band — balanced for daily comfort.', traits: ['Refined balance', 'Daily-wear comfort', 'Subtle elegance'] },
            '2mm': { description: 'A timeless balance — neither too thin nor too bold.', traits: ['Universally flattering', 'Comfortable wear', 'Classic proportion'] },
            '2.2mm': { description: 'Slightly more substantial — a confident classic with everyday presence.', traits: ['Confident classic', 'Everyday presence', 'Balanced fit'] },
            '2.5mm': { description: 'A confident, substantial band — grounded presence on the finger.', traits: ['Grounded presence', 'Statement classic', 'Built to last'] },
            '3mm': { description: 'Bold and architectural — for the modernist who loves clean weight.', traits: ['Bold proportion', 'Architectural feel', 'Statement scale'] },
            '4mm': { description: 'A heritage-weight band — substantial, sculptural, and unmistakably present.', traits: ['Heritage weight', 'Sculptural form', 'Unmistakable presence'] },
        },
        fallback: {
            description: 'A balanced band proportion crafted to feel as good as it looks.',
            traits: ['Comfort-fit profile', 'Hand-finished edges', 'Built for daily wear'],
        },
    },
    'fluorescence': {
        label: 'Fluorescence',
        prompt: 'Choose Fluorescence',
        eyebrow: 'Step · Glow',
        intro: 'Some diamonds glow under UV light — a subtle property with surprising effects on appearance and price.',
        values: {
            none: { description: 'No reaction to UV — the most-requested option for purist collectors.', traits: ['Purist favourite', 'Maximum resale value', 'Crystalline appearance'] },
            faint: { description: 'A barely-there glow — undetectable in normal light, often a smart value pick.', traits: ['Undetectable in daylight', 'Strong value', 'Unaffected appearance'] },
            medium: { description: 'A soft glow under UV — can subtly improve the look of warmer-coloured stones.', traits: ['Can mask warmth', 'Smart value', 'Subtle effect'] },
            strong: { description: 'A noticeable glow under UV — significant value at the right price tier.', traits: ['Maximum value', 'Striking under UV', 'Best in lower colour grades'] },
        },
        fallback: {
            description: 'A fluorescence grade chosen for its balance of value and visual quality.',
            traits: ['Lab-verified', 'Hand-picked', 'Quality assured'],
        },
    },
    'symmetry': {
        label: 'Symmetry',
        prompt: 'Choose Symmetry Grade',
        eyebrow: 'Step · Precision',
        intro: 'Symmetry grades the precision of the diamond’s facet alignment — vital for crisp light performance.',
        values: {
            excellent: { description: 'Perfect facet alignment — the highest precision grade.', traits: ['Top precision', 'Crisp light play', 'Connoisseur grade'] },
            'very good': { description: 'Near-perfect alignment — visually identical to excellent at smart value.', traits: ['Visually flawless', 'Smart value', 'Beautiful light return'] },
            good: { description: 'Solid alignment with strong overall sparkle.', traits: ['Strong sparkle', 'Reliable performance', 'Excellent value'] },
        },
        fallback: { description: 'A precision symmetry grade for crisp facet alignment.', traits: ['Quality grade', 'Verified report', 'Beautiful light play'] },
    },
    'polish': {
        label: 'Polish',
        prompt: 'Choose Polish Grade',
        eyebrow: 'Step · Finish',
        intro: 'Polish grades the smoothness of the diamond’s surface — smoother surfaces mean cleaner light return.',
        values: {
            excellent: { description: 'A mirror-smooth surface — the highest finish grade.', traits: ['Mirror-smooth', 'Maximum light return', 'Premium finish'] },
            'very good': { description: 'A near-perfect polish — visually identical to excellent.', traits: ['Visually flawless', 'Excellent value', 'Premium feel'] },
            good: { description: 'A clean polish with strong everyday sparkle.', traits: ['Clean finish', 'Reliable sparkle', 'Smart value'] },
        },
        fallback: { description: 'A polish grade hand-picked for crisp, mirror-finish brilliance.', traits: ['Premium finish', 'Hand-inspected', 'Quality assured'] },
    },
    'certification': {
        label: 'Certification',
        prompt: 'Choose Certification',
        eyebrow: 'Step · Provenance',
        intro: 'Every diamond comes with an independent grading report — pick the lab you trust most.',
        values: {
            gia: { description: 'The Gemological Institute of America — the global gold standard for diamond grading.', traits: ['Global gold standard', 'Most stringent grading', 'Highest resale value'] },
            igi: { description: 'The International Gemological Institute — widely respected, especially for lab-grown stones.', traits: ['Trusted worldwide', 'Lab-grown specialist', 'Strong consistency'] },
            ags: { description: 'The American Gem Society — known for the strictest cut-grading standards.', traits: ['Strictest cut grading', 'Premium reputation', 'Connoisseur choice'] },
            hrd: { description: 'The Antwerp HRD — Europe’s leading diamond grading authority.', traits: ['European authority', 'Trusted in EU', 'High-precision grading'] },
        },
        fallback: { description: 'An independently certified report for full provenance and peace of mind.', traits: ['Independently graded', 'Verified provenance', 'Lifetime assurance'] },
    },
};

export function getFacetMeta(facetName: string): FacetMeta | undefined {
    return FACET_META[norm(facetName)];
}

export function getValueMeta(facetName: string, valueName: string): FacetValueMeta {
    const facet = getFacetMeta(facetName);
    if (!facet) {
        return {
            description: 'A carefully selected option to bring your vision to life.',
            traits: ['Hand-selected', 'Crafted to order', 'Quality assured'],
        };
    }
    return facet.values[norm(valueName)] ?? facet.fallback;
}

export function getFacetLabel(facetName: string): string {
    return getFacetMeta(facetName)?.label ?? facetName.replace(/\b\w/g, c => c.toUpperCase());
}
