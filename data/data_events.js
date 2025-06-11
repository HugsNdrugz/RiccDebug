// data_events.js

// Defines a list of possible world events that can impact gameplay.
// Each event has an ID, name, description, duration (in game turns),
// and an 'effects' object detailing its impact on various game parameters.
export const possibleWorldEvents = [
    {
        id: "police_crackdown",
        name: "Police Crackdown!",
        description: "5-0 is swarming the streets! Heat builds faster, and fiends are skittish.",
        duration: 3, // Lasts for 3 game turns
        effects: { 
            heatModifier: 1.5,           // Heat accumulation is 1.5x faster
            customerScareChance: 0.2,    // 20% chance customers get scared off
            drugPriceModifier: 0.8       // Drug prices are 20% lower (demand drops)
        }
    },
    {
        id: "party_weekend",
        name: "It's Party Weekend!",
        description: "Everyone's looking to score! Higher demand for party favors.",
        duration: 2,
        effects: { 
            drugDemandModifier: 1.3,     // General drug demand is 30% higher
            drugPriceModifier: 1.2,      // Drug prices are 20% higher
            specificItemDemand: ["blue_magic", "liquid_giggles", "psy_sunshine"] // Specific items are in higher demand
        }
    },
    {
        id: "rival_tension",
        name: "Rival Tension High",
        description: "Word is another crew is making moves. Deals are riskier.",
        duration: 4,
        effects: { 
            heatModifier: 1.2,           // Heat builds 20% faster
            dealFailChance: 0.1          // 10% chance for deals to fall through
        }
    },
    {
        id: "supply_drought",
        name: "Supply Drought",
        description: "Hard to find good product. Prices are up for what's left.",
        duration: 3,
        effects: { 
            itemScarcity: true,          // Flag indicating items are scarce (affects generation)
            allPriceModifier: 1.15       // All item prices are 15% higher
        }
    }
];