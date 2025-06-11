// data_items.js

// Defines the various quality levels for different item types.
// Used for display and for determining price modifiers.
export const ITEM_QUALITY_LEVELS = {
    DRUG: ["Stepped On", "Decent Batch", "Pure Fire"],
    STOLEN_GOOD: ["Rough Shape", "Used", "Mint Condition"],
    INFORMATION: ["Basic Intel", "Solid Tip", "Verified Blueprint"],
    TOOL: ["Shoddy", "Standard", "Pro Grade"]
};

// Defines the price modifiers based on item type and quality level index.
// E.g., DRUG quality 0 (Stepped On) has a 0.6x modifier.
export const ITEM_QUALITY_MODIFIERS = {
    DRUG: [0.6, 1.0, 1.5],
    STOLEN_GOOD: [0.5, 1.0, 1.8],
    INFORMATION: [0.8, 1.0, 1.3],
    TOOL: [0.7, 1.0, 1.4]
};

// Defines all available item types in the game.
// Each item has properties for gameplay mechanics, visuals, and descriptions.
export const itemTypes = [
    // --- Standard Drugs ---
    { id: "green_crack", name: "Bag of 'Green Crack'", baseValue: 60, range: 20, type: "DRUG", subType: "STIMULANT", heat: 3, description: "Budget-friendly, gets the job done.", effects: ["energy_boost", "jitters"], addictionChance: 0.1 },
    { id: "blue_magic", name: "Few 'Blue Magic' Pills", baseValue: 40, range: 15, type: "DRUG", subType: "PARTY", heat: 2, description: "Small pills, big promises.", effects: ["euphoria", "sociability"], addictionChance: 0.15 },
    { id: "white_pony", name: "Gram of 'White Pony'", baseValue: 100, range: 30, type: "DRUG", subType: "STIMULANT", heat: 5, description: "The uptown special. Potent.", effects: ["focus", "confidence", "paranoia_high_dose"], addictionChance: 0.3 },
    { id: "psy_sunshine", name: "Sheet of 'Psychedelic Sunshine'", baseValue: 150, range: 50, type: "DRUG", subType: "PSYCHEDELIC", heat: 6, description: "A trip to another dimension.", effects: ["visuals", "altered_perception", "anxiety_chance"], addictionChance: 0.05 },
    { id: "liquid_giggles", name: "Vial of 'Liquid Giggles'", baseValue: 80, range: 25, type: "DRUG", subType: "PARTY", heat: 4, description: "Warning: May cause uncontrollable laughter.", effects: ["euphoria", "disinhibition"], addictionChance: 0.2 },
    { id: "afghan_gold", name: "Brick of 'Afghan Gold' (Hash)", baseValue: 250, range: 80, type: "DRUG", subType: "CANNABINOID", heat: 8, description: "Top-shelf import, heavy hitter.", effects: ["relaxation", "hunger", "red_eyes"], addictionChance: 0.08 },
    { id: "lean_syrup", name: "Bottle of 'Lean Back Syrup'", baseValue: 120, range: 40, type: "DRUG", subType: "OPIATE", heat: 5, description: "Slow your roll... way down.", effects: ["sedation", "euphoria_mild", "nausea_chance"], addictionChance: 0.4 },
    { id: "moon_rocks", name: "Nug of 'Moon Rocks'", baseValue: 180, range: 60, type: "DRUG", subType: "CANNABINOID_POTENT", heat: 7, description: "Potent and pricey space weed.", effects: ["intense_relaxation", "couch_lock", "anxiety_high_dose"], addictionChance: 0.12 },
    { id: "synth_spice", name: "Packet of 'Synth Spice'", baseValue: 30, range: 10, type: "DRUG", subType: "SYNTHETIC_CANNABINOID", heat: 4, description: "Cheap, unpredictable, and sketchy.", effects: ["erratic_behavior", "hallucinations_mild", "health_risk"], addictionChance: 0.25 },
    { id: "crystal_clear", name: "Shard of 'Crystal Clear'", baseValue: 200, range: 70, type: "DRUG", subType: "METHAMPHETAMINE", heat: 9, description: "High power, high risk, high paranoia.", effects: ["extreme_energy", "insomnia", "aggression_chance", "psychosis_risk"], addictionChance: 0.6 },
    { id: "pharma_oxy", name: "Few 'Pharma Oxy' Pills", baseValue: 150, range: 50, type: "DRUG", subType: "OPIATE_PRESCRIPTION", heat: 6, description: "Diverted prescription strength painkiller.", effects: ["strong_pain_relief", "euphoria", "drowsiness", "high_overdose_risk"], addictionChance: 0.5 },
    { id: "ketamine_k", name: "Bump of 'Special K'", baseValue: 90, range: 30, type: "DRUG", subType: "DISSOCIATIVE", heat: 5, description: "Enter the K-hole. Or don't.", effects: ["dissociation", "hallucinations", "numbness", "confusion"], addictionChance: 0.1 },
    { id: "nootropics_focus", name: "Bottle of 'FocusMax' Nootropics", baseValue: 70, range: 20, type: "DRUG", subType: "NOOTROPIC", heat: 1, description: "Brain boosters for the grinders. Mostly legal-ish.", effects: ["improved_focus", "slight_energy", "headache_chance"], addictionChance: 0.01 },
    // --- New Drugs (Stimulant User & Psychedelic Explorer) ---
    { id: "tina_turbo_tabs", name: "Bag of 'Tina's Turbo Tabs'", baseValue: 180, range: 60, type: "DRUG", subType: "METHAMPHETAMINE", heat: 8, description: "Tiny tabs, titanic tweak. Not for the faint of heart.", effects: ["extreme_energy", "insomnia", "severe_paranoia", "psychosis_risk"], addictionChance: 0.65 },
    { id: "lucy_sky_diamonds", name: "Sheet of 'Lucy's Sky Diamonds'", baseValue: 160, range: 50, type: "DRUG", subType: "PSYCHEDELIC", heat: 6, description: "Pure, uncut inspiration... or insanity. Handle with care.", effects: ["intense_visuals", "ego_dissolution", "cosmic_insight", "bad_trip_chance"], addictionChance: 0.03 },
    { id: "special_k_os_cereal", name: "Box of 'Special K-Os Cereal'", baseValue: 100, range: 35, type: "DRUG", subType: "DISSOCIATIVE", heat: 5, description: "Breakfast of champions... or disconnected space cadets.", effects: ["dissociation", "altered_reality", "numbness", "k_hole_risk"], addictionChance: 0.12 },
    { id: "zoomer_boomers", name: "Handful of 'Zoomer Boomers' (Shrooms)", baseValue: 120, range: 40, type: "DRUG", subType: "PSYCHEDELIC_MILD", heat: 4, description: "Earthy delights for a gentle journey inwards. Mostly.", effects: ["mild_visuals", "giggles", "nature_connection", "introspection"], addictionChance: 0.06 },
    { id: "fast_forward_flakes", name: "Pinch of 'Fast Forward Flakes'", baseValue: 90, range: 30, type: "DRUG", subType: "STIMULANT", heat: 4, description: "Like hitting the fast-forward button on your brain.", effects: ["energy_boost", "rapid_thoughts", "jitters", "attention_deficit"], addictionChance: 0.2 },
    // --- Stolen Goods & Oddities ---
    { id: "used_phone", name: "Slightly-Used Smartphone", baseValue: 90, range: 40, type: "STOLEN_GOOD", heat: 2, description: "Screen's a bit cracked, but it works."},
    { id: "power_tool", name: "Power Tool (No Questions)", baseValue: 70, range: 30, type: "STOLEN_GOOD", heat: 1, description: "Fresh off a 'job site'."},
    { id: "designer_bag", name: "Designer Handbag (Scuffed)", baseValue: 130, range: 60, type: "STOLEN_GOOD", heat: 3, description: "Still got the label, mostly."},
    { id: "premium_liquor", name: "Crate of 'Premium' Liquor", baseValue: 100, range: 40, type: "STOLEN_GOOD", heat: 2, description: "Fell off a truck, you know the vibes."},
    { id: "questionable_jewelry", name: "Jewelry (Questionable Origin)", baseValue: 200, range: 100, type: "STOLEN_GOOD", heat: 4, description: "Shiny, but don't ask where it came from."},
    { id: "hot_laptop", name: "High-End Laptop (Needs Charger)", baseValue: 180, range: 70, type: "STOLEN_GOOD", heat: 3, description: "Top specs, just a little... warm."},
    // --- New Oddities (STOLEN_GOOD subType ODDITY) ---
    { id: "blueprint_for_squirrel_armor", name: "Blueprint for Squirrel Armor", baseValue: 15, range: 10, type: "STOLEN_GOOD", subType: "ODDITY", heat: 0, description: "Detailed schematics for tiny, acorn-resistant battle gear. Seems legit."},
    { id: "perfectly_normal_rock_portal_key", name: "Perfectly Normal Rock (Portal Key?)", baseValue: 20, range: 15, type: "STOLEN_GOOD", subType: "ODDITY", heat: 0, description: "Just a rock. Or is it? Feels... tingly. Probably just a rock."},
    { id: "sentient_dust_bunny_wisdom", name: "Sentient Dust Bunny (Contains Wisdom)", baseValue: 10, range: 5, type: "STOLEN_GOOD", subType: "ODDITY", heat: 0, description: "A surprisingly philosophical dust bunny. Might whisper secrets if you listen hard enough."},
    { id: "half_baked_invention_idea", name: "Half-Baked Invention Idea (Napkin)", baseValue: 5, range: 4, type: "STOLEN_GOOD", subType: "ODDITY", heat: 0, description: "A scrawled diagram on a greasy napkin. Involves rubber chickens and a small fusion reactor."},
    // --- Information & Tools ---
    { id: "info_cops", name: "Intel: Cop Patrol Routes", baseValue: 75, range: 25, type: "INFORMATION", heat: 0, effect: "reduce_heat_small", description: "Know where the 5-0 ain't."},
    { id: "info_rival", name: "Intel: Rival Stash Location", baseValue: 150, range: 50, type: "INFORMATION", heat: 1, effect: "rival_op_chance", description: "Knowledge is power... and profit."},
    { id: "burner_phone", name: "Untraceable Burner Phone", baseValue: 50, range: 10, type: "TOOL", heat: 0, effect: "deal_heat_reduction", uses: 3, description: "Clean calls for dirty deals. Good for 3 uses."},
];