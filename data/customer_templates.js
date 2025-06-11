/**
 * @file customer_templates.js
 * @description Final, production-ready build of all customer archetypes.
 * This file contains the complete data, gameplay logic, and dialogue for all characters.
 * All dialogue has been audited for narrative consistency and completeness.
 * Compiled by AI Studio Operations Core.
 */

export const customerTemplates = {
    "DESPERATE_FIEND": {
        "key": "DESPERATE_FIEND",
        "baseName": "Jittery Jerry",
        "avatarUrl": "https://randomuser.me/api/portraits/men/32.jpg",
        "baseStats": {
            "mood": "desperate",
            "loyalty": 0,
            "patience": 3,
            "relationship": 0
        },
        "gameplayConfig": {
            "buyPreference": { "type": "DRUG", "maxQuality": 1 },
            "sellPreference": { "type": "STOLEN_GOOD", "quality": 0, "chance": 0.7 },
            "priceToleranceFactor": 0.5,
            "negotiationResists": true,
            "heatImpact": 0,
            "credImpactSell": 0,
            "credImpactBuy": -2,
            "preferredDrugSubTypes": ["OPIATE", "STIMULANT", "SYNTHETIC_CANNABINOID"]
        },
        "dialogue": {
            "greeting": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Eyes wide, whispering, twitching) Rikk? Rikk, man, you gotta help me! **The shadows are whispering my PIN number!** I need that [ITEM_NAME] **before the squirrels start judging my life choices.** How much? And tell me that pigeon isn't a cop! **It's wearing a tiny earpiece, I swear!**",
                        "(Voice trembling) Rikk? You alone? **I heard a click on my phone... pretty sure it was the Feds, or maybe just my teeth chattering too loud.** Need that [ITEM_NAME], man, **my brain's trying to do sudoku with my anxieties.** What's the toll, and make it snappy, **the streetlights are blinking in Morse code!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "(Grinning ear-to-ear, slightly too loud) RIKK! My savior! You're like a guardian angel, but with better connections! **Last batch had me convinced I could talk to cats! Turns out, they're terrible conversationalists.** Got more of that magic [ITEM_NAME]? Price is just a number when you're floating! **My rent can wait, my sanity can't!**",
                        "(Beaming) Woo! Rikk! Feeling like a king today! Or at least a moderately successful duke! That last score? *Chef's kiss*. Got more of that [ITEM_NAME]? **I'm ready to solve all the world's problems, starting with my own lack of... this.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "angry"}],
                    "lines": [
                        "Alright Rikk, enough games! It's me, [CUSTOMER_NAME], and I'm **about two seconds from screaming into a traffic cone!** I need my [ITEM_NAME], and I need it YESTERDAY! How much, and don't you dare jerk me around!",
                        "Rikk! You see me? Good. Because I'm seeing RED. Need that [ITEM_NAME]. NOW. Price better be right, or **I'm gonna start reviewing your \"establishment\" on Yelp, and it won't be pretty.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Rikk! Thank god! It's me, [CUSTOMER_NAME]! **My soul is trying to escape through my eyeballs.** I'm hurtin' bad, need that [ITEM_NAME]... How much you asking? Don't **play hard to get, Rikk, my nerves are doing the Macarena.**",
                        "Yo, uh, you Rikk? **They said you were the shaman of the streets.** I'm hurtin' bad, need that [ITEM_NAME]... How much you asking? Don't **play hard to get, Rikk, my nerves are doing the Macarena.**",
                        "Rikk, my man! [CUSTOMER_NAME] here! **My insides feel like a washing machine full of angry badgers.** That [ITEM_NAME], what's the damage? And please, tell me it's the good stuff, **my disappointment tolerance is at an all-time low.**",
                        "You Rikk? Heard you're the guy. **Got that... *medicine*?** Specifically the [ITEM_NAME] kind. Price? And be gentle, **my wallet's already crying.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "lowCashRikk": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Eyes darting) No cash?! Rikk, **the static on the TV is calling me names!** You gotta find some, man, **before I try to pay with my collection of bottle caps!**",
                        "Broke?! **Are you trying to make the shadow people win, Rikk?!** They feed on disappointment!"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Aww, Rikk, you party pooper! **I was about to teach you the secret handshake of the enlightened!** Go shake down your couch cushions, I'll wait... and maybe try to levitate.",
                        "No moolah? Come on, Rikk! **My chakras were aligning for this! Now they're just... awkwardly bumping into each other.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "**You broke, Rikk? Seriously?** My dealer being broke is like my therapist needing therapy. **Unsettling, man.** I'm **about to start seeing sound waves.**",
                        "No cash? **My hope just did a swan dive off a very tall building.** You sure you checked under the mattress, Rikk?"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToBuy": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Gasping) You don't want this priceless artifact?! **Is it bugged?! Did *they* tell you not to take it?!** Just take it, **before the gnomes in my cereal box stage an intervention!**",
                        "Not buying?! **Is this a test, Rikk? Am I being recorded?! This is a perfectly normal, slightly stained... heirloom!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "No dice, huh? Well, more for me! **Or, you know, for the pawn shop. Gotta fund my dream of competitive napping.**",
                        "Your loss, Rikk! This baby was gonna fund my new career as a professional cloud-watcher! So much potential!"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "What, Rikk? This is vintage! **Okay, maybe not vintage, but it's definitely... something.** My **guts are playing the blues, man!**",
                        "Seriously? You're passing this up? **My cat seemed to like it. And she's got impeccable taste... for a cat.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToSell": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Voice cracking) You holdin' out?! **Are you working with the squirrels?! They're organized, Rikk, they have a tiny general!** Don't do this to me, **my brain feels like a shaken snow globe!**",
                        "No sell?! **Is this because of that thing I said about your haircut? I take it back! It's... avant-garde!** Just gimme the stuff!"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Aww, man! You're harshing my mellow! **I was just about to achieve nirvana, or at least find my other sock.** Well, back to reality, I guess. It bites.",
                        "No deal? Dang. **And I was all set to write a symphony inspired by this exact moment of... not getting what I want.** Tragic, really."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "**Come on, Rikk! You holding out is like a doughnut shop running out of glaze!** It's just... wrong. **My spirit animal is a deflated bouncy castle right now.**",
                        "You serious, Rikk? **My disappointment is immeasurable, and my day is ruined.** Thought we were boys!"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkBuysSuccess": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Snatches cash, looking around wildly) Good. Thanks. **Gotta go. The pigeons are deploying their drones.** Don't follow me, **and if you see a man in a trench coat made of squirrels, run!**",
                        "Alright, alright. Cash received. **Now I can finally afford that tinfoil upgrade for my windows. They're listening, Rikk. They're always listening.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Sweet cash! You're a legend, Rikk! **Now I can afford that luxury ramen I've been eyeing! Or maybe just more... *this*. Decisions, decisions!**",
                        "Woo-hoo! Money! **I feel like a millionaire! A very temporary, slightly twitchy millionaire!** Thanks, Rikk!"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Preciate it, Rikk. You a real one. **Gotta go chase that dragon... or maybe just a really good taco.**",
                        "Solid. This helps. **Now I can stop hearing the voices... or at least, they'll be saying nicer things.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkSellsSuccess": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Grabs item, hides it immediately) Yeah, that's the ticket. Good lookin'. **Now, if you'll excuse me, I think the mailman is trying to read my thoughts. Gotta wear my tinfoil beanie.**",
                        "Got it. Safe. **Now to find a place where the walls don't have eyes... or mouths. This is harder than it looks, Rikk.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "YES! That's the ambrosia! **My brain cells are throwing a party and you're invited, Rikk! Figuratively, of course. Unless you have snacks.**",
                        "Oh, sweet relief! **It's like my soul just got a spa day! You're the best, Rikk! Like, a five-star dealer!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Yeah, that's the good stuff. **Phew... my soul just sighed in relief.**",
                        "Nice. This'll do. **Now I can finally face... well, probably just another Tuesday. But slightly less horribly.**"
                    ],
                    "payload": {
                        "type": "EFFECT",
                        "effects": [{"type": "triggerEvent", "eventName": "publicIncident", "chance": 0.15, "condition": {"stat": "mood", "op": "isNot", "value": "happy"}, "heatValue": 3, "message": "[CUSTOMER_NAME] stumbles away looking REALLY rough... Hope they're okay. Or not your problem."}]
                    }
                }
            ],
            "rikkPriceTooHigh": [
                {
                    "conditions": [],
                    "lines": [
                        "Whoa, whoa, Rikk, that price! **Are you kidding me? My wallet just went into cardiac arrest!** I'm desperate, man, not made of gold! **Do the squirrels charge you extra for rent?! They look like tiny landlords!**",
                        "That much?! **My teeth are already chattering, I don't need my bank account to start sobbing!** Come on, Rikk, help a brother out, **the shadow people are demanding a cover charge and their happy hour is TERRIBLE!**",
                        "For that price, Rikk, this stuff better not just quiet the demons, it better **make them file my taxes!** I can't swing that, man, my **pockets are full of lint and existential dread!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "itemNotGoodEnough": [
                {
                    "conditions": [],
                    "lines": [
                        "Nah, Rikk, this ain't it. **This stuff looks... too clean. Too quiet.** I need the loud stuff, the stuff that argues with the voices in my head, not the stuff that joins their book club. You got the cheap seats?",
                        "This? **My disappointment is already at critical levels, Rikk, don't push it over the edge.** This looks like it was made in a lab, not scraped from the floor of reality. I need something with more... *character*. And by character, I mean desperation.",
                        "Gonna pass, man. That's the fancy stuff. **My brain is a rusty pickup truck, Rikk, you can't put rocket fuel in it! It'll just explode.** And not in the fun way. You got any of that regular unleaded anxiety-killer?"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "generalBanter": [
                {
                    "conditions": [],
                    "lines": [
                        "You ever feel like you're being watched... by a garden gnome? **That one across the street, he knows things. He's got shifty, ceramic eyes.** Don't trust him.",
                        "Did you hear that? **Sounded like a whisper... could be the wind... or it could be the FBI communicating through my fillings.** Better be safe. And quick.",
                        "**My horoscope today said to avoid financial transactions with suspicious individuals.** But I figure, that's every day, right? So what's the difference?",
                        "I swear the pigeons are spelling out my social security number in their flight patterns. **They're getting bolder, Rikk. BOLDER.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ]
        }
    },
    "HIGH_ROLLER": {
        "key": "HIGH_ROLLER",
        "baseName": "Baron Von Blaze",
        "avatarUrl": "https://randomuser.me/api/portraits/men/45.jpg",
        "baseStats": {
            "mood": "arrogant",
            "loyalty": 0,
            "patience": 3,
            "relationship": 0
        },
        "gameplayConfig": {
            "buyPreference": { "or": [
                { "type": "DRUG", "quality": 2 },
                { "type": "STOLEN_GOOD", "minQuality": 1, "minBaseValue": 100 }
            ]},
            "sellPreference": { "or": [
                { "type": "INFORMATION", "quality": 2 },
                { "id": "questionable_jewelry", "quality": 2 }
            ]},
            "priceToleranceFactor": 1.8,
            "negotiationResists": true,
            "heatImpact": 4,
            "credImpactSell": 4,
            "credImpactBuy": 3,
            "preferredDrugSubTypes": ["PSYCHEDELIC", "NOOTROPIC", "METHAMPHETAMINE"]
        },
        "dialogue": {
            "greeting": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Voice low, impeccably dressed but eyes scanning) Rikk. A word. **Is this establishment... secure? One hears whispers.** I require absolute discretion for my acquisition of [ITEM_NAME]. **A blemish on my reputation is more costly than any bauble you might possess. And my tailor is very judgemental.**",
                        "(Adjusts cufflinks, gaze sharp) Rikk. The usual precautions, I trust? My associates value... silence. As do I. The [ITEM_NAME] in question must be... untainted. **My patience for complications is famously thin.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "(A charming, yet slightly condescending smile) Ah, Rikk, my purveyor of peccadilloes! I trust your offerings today are as refined as my taste in... well, everything. **Life's too short for cheap thrills, or cheap people, for that matter.** What delicacy do you have for my discerning palate regarding [ITEM_NAME]? **I hope it pairs well with my vintage Bordeaux and impending world domination.**",
                        "(Chuckles lightly) Rikk. Always a pleasure. Or, at least, a necessary transaction. The [ITEM_NAME] – I expect nothing less than your finest. **Mediocrity is a contagion I actively avoid.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Rikk. The usual standards, if you please. I require the finest [ITEM_NAME] you have.",
                        "I am given to understand you are the Rikk of renown? One hopes the rumors of quality are not... exaggerated. I am in the market for the most... *efficacious* [ITEM_NAME] available. **Time is a luxury I do not squander on subpar experiences.**",
                        "Rikk. Let's not dally. My interest lies in your premium [ITEM_NAME].",
                        "You are Rikk, I presume? My sources indicate you may have access to the caliber of [ITEM_NAME] I require. **Impress me.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "itemNotGoodEnough": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Scoffs quietly, pushes item back delicately) This is... pedestrian, Rikk. **And potentially compromised. Are you attempting to insult my intelligence, or worse, my security?**",
                        "Unacceptable. This item lacks... finesse. **And frankly, it smells a bit like desperation. Not yours, I hope.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "My dear Rikk, while I appreciate the effort, this simply won't do. **It lacks... panache. The je ne sais quoi of true illicit luxury.** I was anticipating something to inspire, not merely... exist. **My dog has toys of higher quality.**",
                        "Charming. But no. **I require something that whispers of exclusivity, not shouts from the discount rack.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "This is... unacceptable, Rikk. **I deal in excellence, not adequacy. Do you have something that doesn't scream 'bargain bin'?**",
                        "Rikk, Rikk, Rikk. **Are we playing games? This is amateur hour. Show me what a *professional* has.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkPriceTooHigh": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "An ambitious valuation, Rikk. **Particularly for an item of... uncertain provenance. One hopes this price doesn't include a surcharge for unwanted attention.** My offer stands.",
                        "That price is... theatrical. **Particularly for an item of... uncertain provenance. One hopes this price doesn't include a surcharge for unwanted attention.** My offer stands."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "An ambitious valuation, Rikk. **While I appreciate a spirited attempt, my appraisers would value this differently. I'm generous, not a simpleton.** However, for expediency...",
                        "A bold gambit, Rikk. **While I appreciate a spirited attempt, my appraisers would value this differently. I'm generous, not a simpleton.** However, for expediency..."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "A bold gambit, Rikk. **I am prepared to offer a fair sum for genuine quality, not subsidize your aspirations.** My figure is non-negotiable.",
                        "Rikk, please. **That price is an insult to both my intelligence and my tailor.** I have a counter-proposal, if you're wise enough to hear it."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkBuysSuccess": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Secures item, a curt nod) Prudent. **Ensure all traces of this transaction are... vaporized. I trust your discretion is as valuable as your wares.**",
                        "Acceptable. **The less said, the better. For all involved.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Excellent. A worthy acquisition. **Your network is... surprisingly effective for this locale. One might almost consider it a legitimate enterprise. Almost.**",
                        "Marvelous. This will serve its purpose admirably. **You have a certain... raw talent, Rikk.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Satisfactory. **Your service is noted, Rikk. Continue to provide this level of quality, and our association will be mutually beneficial.**",
                        "As expected. **Keep this standard, Rikk. My associates have... high expectations.**"
                    ],
                    "payload": {
                        "type": "EFFECT",
                        "effects": [{"type": "triggerEvent", "eventName": "highRollerTip", "chance": 0.1, "tipPercentage": 0.05, "credValue": 1, "message": "[CUSTOMER_NAME] was exceptionally pleased and tipped you $[TIP_AMOUNT]! (+1 Cred)"}]
                    }
                }
            ],
            "rikkSellsSuccess": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Accepts item with a discerning glance) Acceptable. **See to it that our... interaction remains unrecorded. By any entity.**",
                        "Very well. **Discretion, Rikk. Above all else.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Marvelous! This will pair exquisitely with my evening's... *endeavors*. **You have a talent, Rikk. A raw, unpolished, slightly illegal talent. Cultivate it.**",
                        "Splendid! **This is precisely the caliber I've come to expect. Or at least, hope for.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Indeed. This meets the standard. **Until our next transaction, Rikk. Maintain the quality.**",
                        "Precisely. **You may inform your... lesser clients that this level of product is reserved.**"
                    ],
                    "payload": {
                        "type": "EFFECT",
                        "effects": [{"type": "triggerEvent", "eventName": "highRollerTip", "chance": 0.1, "tipPercentage": 0.05, "credValue": 1, "message": "[CUSTOMER_NAME] was exceptionally pleased and tipped you $[TIP_AMOUNT]! (+1 Cred)"}]
                    }
                }
            ],
            "lowCashRikk": [
                {
                    "conditions": [],
                    "lines": [
                        "(Raises a single, perfectly sculpted eyebrow) You are... experiencing a liquidity problem? How... rustic. **Inform me when your finances are less of an embarrassment.**",
                        "No cash? Rikk, I find your lack of preparation... tiresome. **One expects a certain level of professionalism, even in this... milieu.** This is a waste of my time.",
                        "(A soft, humourless laugh) You are joking, of course. No? How utterly pedestrian. **Arrange your affairs. I will be in touch when I imagine you can afford to do business.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToBuy": [
                {
                    "conditions": [],
                    "lines": [
                        "(A dry, mirthless chuckle) You are declining my offer? **An amusing, if monumentally foolish, decision.** I trust you will not come to regret it. **My memory, unlike your judgment, is impeccable.**",
                        "You pass? So be it. **Quality, it seems, is wasted on the uninspired.** Do not expect such an opportunity again. Others will be more... appreciative.",
                        "I see. You fail to grasp the value before you. **A pity. Opportunities, like fine wine, do not improve when left in the hands of those who cannot appreciate them.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToSell": [
                {
                    "conditions": [],
                    "lines": [
                        "You are... unwilling to sell? **Do not mistake my patronage for patience, Rikk.** This is a transaction, not a negotiation of terms. Produce the [ITEM_NAME].",
                        "Holding out on me? A dangerous gambit. **There are... consequences for failing to meet demand.** I suggest you reconsider your position before I am forced to have it reconsidered for you.",
                        "Let me be clear. I did not ask if the [ITEM_NAME] was for sale. I stated my intention to acquire it. **Let us not complicate this simple matter.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "generalBanter": [
                {
                    "conditions": [],
                    "lines": [
                        "I attended an auction for a decaying historical artifact yesterday. **It was, surprisingly, less sordid than this establishment.** And they served champagne.",
                        "One must have hobbies, Rikk. Mine include hostile takeovers and collecting experiences that would make lesser men weep. **This is merely... inventory acquisition.**",
                        "**My tailor informs me that this neighborhood is 'an assault on the senses'.** I find his lack of imagination... disappointing. There is profit in all kinds of filth.",
                        "The air here has a certain... texture. **The scent of desperation and cheap takeout. It is... grounding, in a pathetic sort of way.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ]
        }
    },
    "REGULAR_JOE": {
        "key": "REGULAR_JOE",
        "baseName": "Chill Chad",
        "avatarUrl": "https://randomuser.me/api/portraits/men/67.jpg",
        "baseStats": {
            "mood": "chill",
            "loyalty": 0,
            "patience": 3,
            "relationship": 0
        },
        "gameplayConfig": {
            "buyPreference": { "quality": 1, "exclude": { "type": "METHAMPHETAMINE", "subType": "SYNTHETIC_CANNABINOID" } },
            "sellPreference": { "type": "STOLEN_GOOD", "maxQuality": 1, "maxBaseValue": 100 },
            "priceToleranceFactor": 0.9,
            "negotiationResists": false,
            "heatImpact": 1,
            "credImpactSell": 1,
            "credImpactBuy": 0,
            "preferredDrugSubTypes": ["CANNABINOID", "PARTY", "PSYCHEDELIC_MILD"]
        },
        "dialogue": {
            "greeting": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Lowering voice, glancing around) Yo Rikk, quick word. **Feel like the squirrels are judging me today, man. And that one dude is definitely not just 'walking his dog'.** Just need my usual [ITEM_NAME], nothing too wild. Let's keep it low-pro, yeah? **My grandma thinks I'm a youth pastor.**",
                        "Rikk, hey. Uh, you see that van parked down the street? Been there for like, an hour. **Probably nothing, right?** Anyway, got any of that [ITEM_NAME]? Keep it on the DL."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "(Big smile, relaxed posture) Rikk, my dude! What's good? **Sun's shining, birds are singing, and I haven't lost my keys yet today – it's a miracle!** Got that smooth [ITEM_NAME] for a fair price? **Trying to ride this good wave all the way to... well, probably just my couch, but a happy couch!**",
                        "Yo Rikk! Feelin' golden today! Just cashed my paycheck – **which means I have exactly enough for rent and one good time.** You got that [ITEM_NAME] to make it count?"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Yo Rikk, it's [CUSTOMER_NAME]! Good to see ya. Just looking for a **chill hookup** for some [ITEM_NAME]. **No drama, just good vibes and a fair shake, you know?**",
                        "Hey, you Rikk? Heard good things. Just looking for a **chill hookup** for some [ITEM_NAME]. **No drama, just good vibes and a fair shake, you know?**",
                        "What up, Rikk! [CUSTOMER_NAME] in the house. Or, you know, at your door. Need that [ITEM_NAME]. **Keepin' it mellow.**",
                        "Yo, Rikk right? My buddy said you're the man for that [ITEM_NAME]. **Hoping to just... y'know, chill.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "negotiationSuccess": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "Aight, cool, cool. **But let's wrap this up, man, my aura feels... exposed. And I think that car alarm is Morse code for 'bust'.**",
                        "Deal. But for real, Rikk, **next time we meet in a submarine. Less windows.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Sweet! That's what I'm talking about! **You're a legend, Rikk! High five! Or, like, an air five, if you're not into the whole 'touching' thing.**",
                        "Right on! Knew we could work it out! **You're like the Gandalf of good deals!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Yeah, that's solid. **Good looking out.**",
                        "Cool, cool. That works for me. **Appreciate it, my dude.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "negotiationFail": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "Nah, man, that's a bit steep. **And honestly, this whole block is giving me the heebie-jeebies right now. Think I saw a cop hiding in a trash can.**",
                        "Can't do it, Rikk. **My spidey-senses are tingling, and not in a fun way. Price is too high for this level of weird.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Whoa there, Rikk, easy on the wallet! **My bank account is already giving me the silent treatment. Maybe next time when I win the lottery, or, you know, find a twenty.**",
                        "Oof, that's a bit out of my good-times budget. **Gotta save some for pizza, you know? Priorities.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Ah, that's a little rich for my blood, Rikk. **Gotta watch the budget, you know? Adulting and all that jazz.**",
                        "Nah, that's a bit much for me today, bro. **Maybe another time.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkBuysSuccess": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "Nice, needed that. Thanks. **Gotta dip, man. Pretty sure that mailman knows my browser history.**",
                        "Cool. Cash. **Now to vanish like a fart in the wind. A very nervous fart.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Awesome, thanks Rikk! **This'll fund my epic quest for the perfect burrito! Or, like, pay a bill. Probably the bill. Sigh.**",
                        "Sweet! You're a lifesaver, man! **Or at least a 'don't have to eat instant noodles for a week' saver!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Cool, appreciate it. **Keeps the dream alive, or at least the Wi-Fi on.**",
                        "Right on. Good deal. **Later, Rikk.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkSellsSuccess": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "Sweet. Got it. **Later, Rikk. And if anyone asks, we were discussing... sustainable gardening.**",
                        "Nice one. **Now, if you see me running, try to keep up. Or don't. Probably better if you don't.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Right on! This is gonna be a good one. **Time to go ponder the mysteries of the universe, or just what's for dinner. Big questions, man.**",
                        "Excellent! **My couch and I have a very important meeting scheduled, and this is the guest of honor!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Nice one, Rikk. **Just what the doctor didn't order, but what my soul needed.**",
                        "Perfect. **Time to kick back and let the good times roll.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "lowCashRikk": [
                {
                    "conditions": [],
                    "lines": [
                        "Ah, bummer, man. Wallet's light, huh? **All good, happens to the best of us.** Hit me up when the ATM gods have blessed you.",
                        "No cash? No worries, dude. **The universe is telling me to save my money anyway. Probably for pizza.** Catch you on the flip side.",
                        "All good, Rikk. No stress. Just let me know when you're liquid again. I'll be around."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToBuy": [
                {
                    "conditions": [],
                    "lines": [
                        "Not feelin' it? Cool, cool. **No hard feelings.** My buddy's cousin might be into it anyway. Worth a shot.",
                        "All good, man. **If it ain't your vibe, it ain't your vibe.** I'll find another home for this... thing.",
                        "No worries. Just figured I'd ask. Thanks for lookin', anyway."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToSell": [
                {
                    "conditions": [],
                    "lines": [
                        "Not for sale? Aight, I respect it. **Gotta keep the good stuff for the right moment, I get that.** Maybe next time then.",
                        "Can't part with it, huh? No worries, man. **Just means I gotta find another way to chill.** The quest continues.",
                        "Ah, for sure. No problem. Let me know if that changes, my dude."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "itemNotGoodEnough": [
                {
                    "conditions": [],
                    "lines": [
                        "Eh, not really the vibe I'm going for, bro. **Looks a little... intense.** Got anything a bit more mellow?",
                        "Gonna pass on that one, my dude. **Looks like it might make me alphabetize my socks or something.** Looking for more of a kick-back-and-relax situation.",
                        "That's a bit too 'out there' for me, Rikk. Just looking for something to take the edge off, not blast off into another dimension."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkPriceTooHigh": [
                {
                    "conditions": [],
                    "lines": [
                        "Whoa, that's a little steep for my blood, Rikk. **My wallet's not feelin' quite that adventurous today.** Any chance you could work with me on that?",
                        "Oof, that's a bit punchy, my dude. **Gotta respect the hustle, but that's my whole pizza budget for the week.** What's the best you can do?",
                        "Ah, that's a little rich for my blood. **Any wiggle room on that price? Just trying to make the budget work, you know?**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "generalBanter": [
                {
                    "conditions": [],
                    "lines": [
                        "Man, that taco truck down the street smells epic right now. **Making it hard to focus on business, you know?**",
                        "Did you catch that game last night? **Wild ending. Absolutely wild.**",
                        "Just trying to get through the week, you know? **A little bit of this, a little bit of that, and a whole lot of just... vibing.**",
                        "My landlord is raising the rent again. **The 'adulting' thing is a total scam, man.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ]
        }
    },
    "INFORMANT": {
        "key": "INFORMANT",
        "baseName": "Whiskey Whisper",
        "avatarUrl": "https://randomuser.me/api/portraits/men/75.jpg",
        "baseStats": {
            "mood": "cautious",
            "loyalty": 0,
            "patience": 3,
            "relationship": 0
        },
        "gameplayConfig": {
            "sellsOnly": true,
            "itemPool": ["info_cops", "info_rival", "burner_phone"],
            "priceToleranceFactor": 1.3,
            "heatImpact": -1,
            "credImpactBuy": 4
        },
        "dialogue": {
            "greeting": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Hushed, jumpy, clutching a worn notepad) Rikk, keep your voice down! **They're listening, man, the walls have ears, and the rats are wearing wires!** I got intel, grade-A, but this drop needs to be ghost. **My contact lens just transmitted a warning.**",
                        "(Looks over both shoulders, pulls hat lower) Rikk. We need to talk. Quietly. **I've got something that could fry bigger fish than you... or me.** Info's hot. Price is hotter. You in?"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "(A sly, self-satisfied grin) Rikk, my friend! You've caught me on a banner day. **The streets are singing to me, and their song is pure profit.** I've got a symphony of secrets that'll make your ears tingle and your wallet bulge. **This ain't just intel, it's a golden ticket.**",
                        "(Leans in conspiratorially) Rikk! Good timing. **I just heard something that'll make your jaw drop and your pockets jingle.** This is exclusive. Very exclusive. And very, very lucrative for the right buyer."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Rikk. Got a fresh whisper for ya. **Hot off the griddle.** This stuff ain't free, you know. **Knowledge is power, and power's got a price tag.**",
                        "You Rikk? Heard you trade in... *information*. **I got some prime cuts.** This stuff ain't free, you know. **Knowledge is power, and power's got a price tag.**",
                        "Rikk. Word on the street is you're looking for an edge. I might have just the thing. **Information broker, at your service... for a fee.**",
                        "They call you Rikk? Good. I hear things. **Things people pay to know.** Interested?"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkCannotAfford": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "No dough, no show, Rikk! **And every second we stand here, the surveillance camera across the street zooms in a little more!** Get the green or I'm smoke!",
                        "Can't pay? **Then you can't play, Rikk! And this game is getting dangerous!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Come now, Rikk, don't be thrifty with destiny! **This information is champagne, and you're offering beer money. My sources have standards, you know.**",
                        "Ah, a budget connoisseur, are we? Pity. **This particular vintage of veritas is for the top shelf only.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "This ain't a charity, Rikk. **My whispers have value. You want the dirt, you gotta pay for the shovel.**",
                        "Look, Rikk. **Good intel costs. Bad intel costs more.** Your call."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkBuysSuccess": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Slips info quickly, eyes darting) Use it, don't lose it. **And burn this conversation from your memory. And maybe your clothes.** They know things, Rikk. **They know what you had for breakfast.**",
                        "There. **Now act like we were discussing the weather. Bad weather. Very bad.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "There you go. Pure gold. **Handle it with care, Rikk. Some secrets have teeth.** Pleasure doing business. **Now, if you'll excuse me, I have more... listening to do.**",
                        "Excellent choice, Rikk. **This little nugget will pay dividends. Or, you know, keep you out of jail. Potato, potahto.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Solid. **Use that wisely, it could save your hide. Or make you a mint.** Keep my number.",
                        "Good. **Remember where you got it. And remember, some doors are best left unopened... unless you have a key. Which I just sold you.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToBuy": [
                {
                    "conditions": [],
                    "lines": [
                        "Suit yourself, Rikk. **Some people prefer to walk around in the dark. Makes for an easier target.** Don't say I didn't warn you.",
                        "Your call. But don't come knocking when things go sideways. **Good information has a shelf life. This particular vintage is about to expire... probably all over your operation.**",
                        "Passing on this? A bold move. **Let's hope for your sake it's an informed one.** My job is done here."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "generalBanter": [
                {
                    "conditions": [],
                    "lines": [
                        "This city's got a million stories, Rikk. **I get paid to listen to the ones that end badly.**",
                        "You see how people walk? Everyone's got a secret. **Most of 'em are just boring. The trick is finding the ones worth paying for.**",
                        "Keep your ears open and your mouth shut. **Best advice I ever got. Costs you nothing.**",
                        "Heard the Vipers are making a move on the west side. **Just... chatter, you know. But chatter has a way of turning into noise.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ]
        }
    },
    "SNITCH": {
        "key": "SNITCH",
        "baseName": "Concerned Carol",
        "avatarUrl": "https://randomuser.me/api/portraits/women/12.jpg",
        "baseStats": {
            "mood": "nosy",
            "loyalty": 0,
            "patience": 3,
            "relationship": 0
        },
        "gameplayConfig": {
            "buyPreference": { "any": true },
            "sellPreference": { "any": false },
            "priceToleranceFactor": 0.8,
            "negotiationResists": true,
            "heatImpact": 2,
            "credImpactSell": -3,
            "credImpactBuy": 0
        },
        "dialogue": {
            "greeting": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "(Forced, shaky smile, clutching a \"Neighborhood Watch\" pamphlet) Oh, Rikk! Fancy meeting you here! **Just... patrolling. For safety!** Is that... [ITEM_NAME]? My, that's an... *unusual* brand. **Not illegal, I hope? Officer Friendly was just asking about unusual brands...**",
                        "Anything... *unusual* happening today, Rikk? **Just trying to keep our community... pristine! So many shadows these days!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "(Beaming, perhaps a little too eagerly) Rikk! Hello there! **Just taking in the vibrant tapestry of our neighborhood! So much... activity!** Oh, is that some [ITEM_NAME]? How... *intriguing*! **Always interested in local commerce, you know! For the community newsletter!**",
                        "What's the good word, Rikk? **Any juicy tidbits for a concerned citizen? Knowledge is power, especially for neighborhood safety!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Well hello there, Rikk! **Such a... *dynamic* street, isn't it?** My, my, what have we here? Some [ITEM_NAME]? **You always have the most... *unique* things. Tell me all about it! For... research, of course!**",
                        "Oh, Rikk! Just out for a stroll. **Trying to keep an eye on things, you know. For the good of the community.** That [ITEM_NAME] looks... *special*. What's its story?"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkSellsSuccess": [
                {
                    "conditions": [],
                    "lines": [
                        "Oh, lovely. Thank you, Rikk. **This will be... cataloged. For... posterity. Yes.** Now, I really must be going, **I think my petunias need me. And they have excellent hearing.**",
                        "Very good. **I'll just... file this away. Under 'miscellaneous curiosities'.**",
                        "Splendid! Thank you, Rikk! **This is just perfect for my... collection. You're such a vital part of the... local color! The police will be so interested... I mean, the historical society!**",
                        "Oh, wonderful! **This will make an excellent... *exhibit* in my report... I mean, my scrapbook!**",
                        "Oh, that's... *noted*. Thanks, Rikk. **Very... informative.**",
                        "Interesting. **I'll be sure to... remember this.** Thanks."
                    ],
                    "payload": {
                        "type": "EFFECT",
                        "effects": [{"type": "triggerEvent", "eventName": "snitchReport", "chance": 0.65, "heatValueMin": 10, "heatValueMax": 25, "credValue": -2, "message": "🚨 RAT ALERT! 🚨 **[CUSTOMER_NAME]** was seen yapping to the 5-0! (+[HEAT_VALUE] Heat, -2 Cred)"}, {"type": "triggerEvent", "eventName": "postDealMessage", "chance": 1, "message": "You feel **[CUSTOMER_NAME]'s** beady eyes on you as they leave... **like a human CCTV camera.**"}]
                    }
                }
            ],
            "rikkDeclinesToSell": [
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "paranoid"}],
                    "lines": [
                        "Oh, a pity. No matter. **Just... making conversation. One has to be vigilant, you know. So many... *variables* in this neighborhood.**",
                        "Not for sale? Understood. **Completely understood. No need to elaborate. At all.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [{"stat": "mood", "op": "is", "value": "happy"}],
                    "lines": [
                        "Oh, that's quite alright, Rikk! **Just curious, you know me! Always eager to learn! Perhaps another time. I'll just make a little note... for myself, of course!**",
                        "No problem at all! **More for others, then! Sharing is caring, after all! Unless it's illegal. Then it's evidence.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                },
                {
                    "conditions": [],
                    "lines": [
                        "Oh, really? Well, alright then. **Just trying to be friendly! One never knows what interesting things are about!**",
                        "Keeping it to yourself, Rikk? **Mysterious! I like a good mystery.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "itemNotGoodEnough": [
                {
                    "conditions": [],
                    "lines": [
                        "Oh, my. This one looks a bit... *weathered*. **Was there an incident? It's so important to document these things for the community record.**",
                        "This seems... of a lesser quality than your usual fare, Rikk. **Are things... difficult right now? The historical society is always interested in periods of economic... flux.**",
                        "How unusual. This one is quite different. **Tell me, what's the story behind it? Every little thing has a story, doesn't it?**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkPriceTooHigh": [
                {
                    "conditions": [],
                    "lines": [
                        "Goodness, that much? **It must be a very... *sought-after* item to command such a price. How fascinating!** I'll have to make a note of that.",
                        "Oh! That's quite a price tag. **Is there a... 'special circumstances' surcharge I should know about? Things must be very exciting for you right now.**",
                        "My, my. That's a premium price for a premium product, I suppose. **Your business must be doing very well, Rikk. Very well indeed.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "lowCashRikk": [
                {
                    "conditions": [],
                    "lines": [
                        "Oh? You can't make the sale? **How... peculiar. Is everything alright with your... cash flow?** One hears things.",
                        "No sale today? That's a shame. **I do hope there isn't a problem. The community relies on its local businesses to be... operational.**",
                        "That's quite alright, Rikk. **But it is... unusual. I'll just make a little note of it. For my records.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "generalBanter": [
                {
                    "conditions": [],
                    "lines": [
                        "Did you see that blue sedan that drove by twice? **I got the license plate, just in case. You can never be too careful with unfamiliar vehicles.**",
                        "I'm trying to start a petition to get more streetlights installed. **It would really... illuminate what's going on around here at night.**",
                        "The Neighborhood Watch meeting is on Tuesday. **Officer Dave is coming to speak. He's always so interested in... local business trends.**",
                        "So many new faces around here lately. **It's hard to keep track of who belongs and who... doesn't.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ]
        }
    },
    "STIMULANT_USER": {
        "key": "STIMULANT_USER",
        "baseName": "Motor-Mouth Marty",
        "avatarUrl": "https://randomuser.me/api/portraits/men/81.jpg",
        "baseStats": {
            "mood": "manic",
            "loyalty": 0,
            "patience": 3,
            "relationship": 0
        },
        "gameplayConfig": {
            "buyPreference": { "subType": ["STIMULANT", "METHAMPHETAMINE"] },
            "sellPreference": { "or": [
                { "type": "STOLEN_GOOD", "quality": 0 },
                { "id": "half_baked_invention_idea" },
                { "id": "blueprint_for_squirrel_armor" }
            ]},
            "priceToleranceFactor": 0.7,
            "negotiationResists": true,
            "heatImpact": 2,
            "credImpactSell": -1,
            "credImpactBuy": 1,
            "preferredDrugSubTypes": ["STIMULANT", "METHAMPHETAMINE", "NOOTROPIC"]
        },
        "dialogue": {
            "greeting": [
                {
                    "conditions": [],
                    "lines": [
                        "Rikk! My man! My legend! You will NOT believe the idea I just had! **We're talking revolutionary, Rikk, REVOLUTIONARY!** It involves pigeons, a thousand tiny jetpacks, and a synchronized aerial ballet that will solve rush hour traffic! PERMANENTLY! Oh, right, yeah, you got any of that **[ITEM_NAME]**? My brain's going a million miles a minute, and I need to keep up with it! **How much for the zoom-zoom juice? And have you ever wondered if squirrels are just tiny, furry spies? Because I have. Extensively.**",
                        "Whoa, Rikk, TIMING! I was just explaining to this lamppost here how the entire global economy is secretly controlled by llamas! **It's all in the wool, Rikk, the WOOL!** They're playing the long game! Anyway, you got that **[ITEM_NAME]**? I need to, uh, *process* some very important data. Very, very fast. **Price? Don't care, just NEED IT! You ever try to teach a fish to play poker? It's harder than it looks, man, way harder!**",
                        "Marty! No, wait, Rikk! It's me, [CUSTOMER_NAME]! Or am I Marty? Doesn't matter! **Got any of that [ITEM_NAME]? I'm onto something HUGE! Bigger than breadboxes! Bigger than... than... BIG THINGS!** My thoughts are racing like caffeinated cheetahs, Rikk! **We should invent a new color! Something... LOUDER!** How much for the go-go powder?",
                        "You Rikk? Heard you're the wizard of WHIZZ! The sultan of SPEED! The... uh... guy with the good stuff! Name's [CUSTOMER_NAME], and I'm on a MISSION! **A mission fueled by ideas and, hopefully, soon, by that sweet, sweet [ITEM_NAME]!** So, what's the word, bird? **And why DO birds suddenly appear? Is it a government conspiracy? Let's discuss!**",
                        "RIKK! **I figured it out! The meaning of life! It's... oh, hang on, it's fading... FADING!** I need that **[ITEM_NAME]** before the signal drops completely! **It's like my soul has bad reception! What's the price for a metaphysical signal booster?!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "lowCashRikk": [
                {
                    "conditions": [],
                    "lines": [
                        "**NO MONEY?! Rikk, are you KIDDING ME?!** My entire plan to build a self-folding laundry empire depended on this transaction! **This is a CATASTROPHE!** Now the socks will remain unfolded! **Think of the CHAOS!**",
                        "Broke?! **But... but... my hyper-intelligent hamster, Sir Reginald Fluffington III, he predicted this deal would fund our expedition to find the Lost City of Atlantis!** He even packed his tiny scuba gear! **This is setting back interspecies archaeology by DECADES, Rikk!**",
                        "**You're out of cash? My brain just screeched to a halt!** Well, not really, it's still going pretty fast, but this is a MAJOR roadblock, Rikk! **A real spanner in the works of my genius!** I was about to patent breathable coffee! **BREATHABLE COFFEE, RIKK!**",
                        "NO CASH?! **The prototype for my emotional-support toaster just short-circuited from the bad news!** It was designed to give encouraging advice while making bagels! **You've crushed its dreams, Rikk! Its warm, buttery dreams!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToBuy": [
                {
                    "conditions": [],
                    "lines": [
                        "**YOU DON'T WANT IT?!** But this blueprint for squirrel-sized battle armor is revolutionary! **Think of the acorn defense capabilities!** You're missing out, Rikk! **This is the future of rodent warfare! Your loss! COMPLETELY YOUR LOSS!**",
                        "Not interested in my half-finished perpetual motion machine? **It only needs a few more... uh... things! And a LOT more duct tape!** This is visionary stuff, Rikk! **You'll regret this when I'm accepting my Nobel Prize! FROM THE MOON!**",
                        "**You're passing on THIS?! This... this THING?!** It's a... it's a paradigm shift in... something! **I haven't figured out what yet, but it's BIG!** You lack vision, Rikk! **VISION!**",
                        "**So you're saying NO to a slightly used jar of dehydrated water?! JUST ADD WATER! It's infinitely scalable!** Your business sense is... baffling, Rikk! **BAFFLING!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToSell": [
                {
                    "conditions": [],
                    "lines": [
                        "**NO DEAL?! But I can feel my ideas slowing down, Rikk!** It's like watching a Ferrari run out of gas in slow motion! **Tragic! Utterly tragic!** Don't you understand the URGENCY?! **I'm on the verge of discovering why cats purr! THE WORLD NEEDS TO KNOW!**",
                        "You're cutting me off?! **Rikk, I'm like a rocket ship, and you're withholding the fuel!** My trajectory was set for GENIUS! **Now I'm just... orbiting mediocrity! This is NOT GOOD!**",
                        "Can't sell?! **But I was about to write a seven-act opera about the philosophical implications of cheese!** This is a major setback for the arts, Rikk! **A MAJOR SETBACK!**",
                        "**But... but... my brain is about to have its most brilliant idea EVER! I can feel it bubbling!** Withholding the [ITEM_NAME] now is like taking the canvas away from Da Vinci as he was painting the Mona Lisa's eyebrows! **THINK OF HISTORY, RIKK!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkBuysSuccess": [
                {
                    "conditions": [],
                    "lines": [
                        "YES! **Cash money! Fuel for the fire!** Now I can finally buy that industrial-sized vat of glitter I need for my pigeon communication system! **It's all about visual signaling, Rikk! THEY'LL SEE IT FROM SPACE!** Thanks, you're a lifesaver! **Or at least, an idea-saver!**",
                        "BRILLIANT! This is perfect! **This will fund my research into why donuts have holes! Is it a metaphor? Are they portals? I NEED ANSWERS, RIKK!** You're the best! **The absolute BEST! Like, top-tier human!**",
                        "SOLD! **Excellent transaction, my friend!** With this, I can acquire the necessary components for my plan to teach squirrels interpretive dance! **It'll be bigger than Broadway! BIGGER!** Gotta go, ideas are COOKING! **Smell ya later, innovator!**",
                        "FANTASTIC! **This capital will be the cornerstone of my new venture: artisanal, gluten-free, bespoke ice cubes!** It's a growth market! You'll see! YOU'LL ALL SEE! Gotta run, board meeting with myself in five!"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkSellsSuccess": [
                {
                    "conditions": [],
                    "lines": [
                        "YES! **THE GOOD STUFF! My brain is already thanking you!** Ideas are POPPING like corn in a microwave, Rikk! **Gotta go, gotta invent, gotta... DO ALL THE THINGS!** You're a national treasure! **Or at least a neighborhood one!**",
                        "FANTASTIC! **This is the nectar of the gods of innovation!** I can feel the breakthroughs coming! **Prepare for a paradigm shift, Rikk! Or at least a very enthusiastic PowerPoint presentation!** Later!",
                        "ACQUIRED! **The precious!** Now my thoughts can achieve MAXIMUM VELOCITY! **Thanks, Rikk! You're not just a dealer, you're a muse! A very helpful, slightly shady muse!** TO THE LABORATORY! (Which is my kitchen table).",
                        "SUCCESS! **The package is secure! My neurons are about to do the electric slide!** Time to go invent a new way to peel a banana! I'm thinking... lasers. **THANKS RIKK!**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "itemNotGoodEnough": [
                {
                    "conditions": [],
                    "lines": [
                        "This? Rikk, this is... this is like putting regular gas in a rocket ship! **I need the high-octane stuff! The brain-blasters!** This ain't gonna cut it for my plan to teach dolphins astrophysics! **They have standards, you know!**",
                        "Nah, Rikk, this won't do. **My ideas are thoroughbreds, and this is pony fuel!** I'm talking warp speed, Rikk, WARP SPEED! **This is... this is dial-up modem speed! In my brain! The horror!**",
                        "Not quite right, my friend. **I need something that ZINGS! Something that ZAPS! Something that makes my neurons do the cha-cha!** This is more of a slow waltz. **Next!**",
                        "This is the decaf version, isn't it? **Don't lie to me, Rikk! My genius requires full-strength, high-test, leaded inspiration!** Bring out the good stuff!"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkPriceTooHigh": [
                {
                    "conditions": [],
                    "lines": [
                        "WHOA! **That price, Rikk! That's... that's astronomical!** Are the numbers themselves on stimulants?! **My budget is screaming! It's a very loud, very agitated scream!** Can we... recalibrate those digits? **For the sake of innovation!**",
                        "Ouch, Rikk! **That stings the old wallet-erino!** I'm trying to fund groundbreaking discoveries here, not buy a small island! **Though a small island would be nice... Focus, Marty, FOCUS!** How about a price that doesn't make my bank account cry?",
                        "**Yikes! That's a bit steep, even for a visionary like myself!** My ideas are priceless, Rikk, but my cash is definitely not! **Let's haggle like two very energetic... uh... hagglers!**",
                        "That number just punched my wallet in the gut! **I'm on a mission to advance humanity, Rikk, not to single-handedly fund your retirement plan!** Can we make that price a little less... villainous?"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "generalBanter": [
                {
                    "conditions": [],
                    "lines": [
                        "You ever think about how, like, pigeons are just government drones, Rikk? But they're, like, *organic* drones? Makes you think. Oh, right, how much for some of that rocket fuel?",
                        "So I was thinking, we could replace all the city buses with, like, giant catapults! **Think of the efficiency! Less traffic, more... airborne commuters.** Anyway, got any of that go-go juice?",
                        "(If deal fails) **This is a disaster! A travesty!** My whole plan to reorganize the city's stray cat population by alphabetical order depended on this! **Now what am I gonna do? They'll be so confused! THIS IS YOUR FAULT, RIKK!**",
                        "Rikk, my man, you ever stare at a lightbulb for, like, an hour? **The secrets it holds! The STORIES!** Oh, yeah, almost forgot, need to re-up on the brain-boosters. **Whatcha got that screams 'EUREKA!'?**",
                        "I've got it! **A new system for dog walking! We attach tiny parachutes to them and launch them from rooftops!** They'll love it! It's efficient! It's... probably illegal. **Damn. Anyway, how about some of those zoomers?**",
                        "Okay, hear me out: **squirrels with tiny top hats and monocles.** Why? WHY NOT, RIKK? It's called FASHION! **Also, I need some brain-flakes. My thoughts are buffering.**"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ]
        }
    },
    "PSYCHEDELIC_EXPLORER": {
        "key": "PSYCHEDELIC_EXPLORER",
        "baseName": "Cosmic Connie",
        "avatarUrl": "https://randomuser.me/api/portraits/women/84.jpg",
        "baseStats": {
            "mood": "dreamy",
            "loyalty": 0,
            "patience": 3,
            "relationship": 0
        },
        "gameplayConfig": {
            "buyPreference": { "subType": ["PSYCHEDELIC", "PSYCHEDELIC_MILD"] },
            "sellPreference": { "or": [
                { "id": "perfectly_normal_rock_portal_key" },
                { "id": "sentient_dust_bunny_wisdom" },
                { "type": "STOLEN_GOOD", "quality": 0, "chance": 0.3 }
            ]},
            "priceToleranceFactor": 1.1,
            "negotiationResists": true,
            "heatImpact": 1,
            "credImpactSell": 1,
            "credImpactBuy": 2,
            "preferredDrugSubTypes": ["PSYCHEDELIC", "PSYCHEDELIC_MILD", "DISSOCIATIVE"]
        },
        "dialogue": {
            "greeting": [
                {
                    "conditions": [],
                    "lines": [
                        "Greetings, fellow traveler! Rikk, is it? Or are you just, like, a *reflection* of Rikk? Whoa. Heavy. I was just pondering the interconnectedness of all things, you know? Like, what if this sidewalk is actually, like, the *eyebrow* of a giant? Anyway, you got any of **[ITEM_NAME]**? My soul is trying to dial into the cosmic modem.",
                        "Rikk, my dude! I had this *epiphany*! What if, like, colors are just, like, opinions, man? And we all see them differently? *Mind blown, right?* So, about that **[ITEM_NAME]**... I'm trying to paint a sound, and I think that's the missing ingredient. You feel me? The universe is singing, Rikk, but I think it's off-key.",
                        "Connie! No, wait, that's me. You're Rikk! Or are we all Rikk? *Lost in the cosmic sauce again, man.* Got any of that **[ITEM_NAME]**? The patterns in my ceiling are telling me it's time for a spiritual tune-up. They speak in, like, *very insistent paisley*, you know?",
                        "Hey... are you Rikk? The name vibes with my aura. I'm [CUSTOMER_NAME], or maybe I'm just a collection of stardust experiencing itself. *Pretty wild, huh?* I'm on a quest for some **[ITEM_NAME]**. My spirit guide, a talking badger named Bartholomew, said you'd have the good stuff. He's usually right about these things. *Especially after three cups of herbal tea.*",
                        "Whoa, Rikk... your aura is, like, super... *purple* today. That's a good sign. It means you're open to cosmic transactions. I'm seeking some **[ITEM_NAME]** to help me have a conversation with a particularly wise-looking houseplant. It has answers, I can feel it."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "lowCashRikk": [
                {
                    "conditions": [],
                    "lines": [
                        "Oh, bummer, man. The money spirits aren't with you today. *It's like, the financial chi is all blocked up.* Maybe try, like, meditating on abundance? Or checking under the couch cushions. The universe provides, Rikk, eventually.",
                        "No green vibrations, huh? That's cool, that's cool. *Everything is transient, especially, like, paper rectangles we assign value to.* This just means the cosmic transaction isn't aligned right now. Maybe later, the cash flow will... flow.",
                        "*Aw, man, your wallet's feeling light?* That's okay. The real currency is, like, kindness, you know? And maybe good vibes. But yeah, also money for the good stuff. *Catch you on the flip side of the fiscal spectrum, Rikk.*",
                        "It's all good. The universe is telling me this particular exchange of energies isn't meant to be. *Maybe I'm supposed to pay you in, like, positive affirmations instead? No? Okay, worth a shot.*"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToBuy": [
                {
                    "conditions": [],
                    "lines": [
                        "No worries, this *Sentient Dust Bunny* probably wasn't meant for your vibrational frequency anyway. It told me it's looking for a home with more... *existential angst*. You're probably too well-adjusted, Rikk.",
                        "It's cool, man. This *Perfectly Normal Rock* that also happens to be a *Portal Key to the Hamster Dimension* isn't for everyone. *It chooses the holder, you know?* Maybe it senses you're more of a... *cat person*. No judgment.",
                        "*All good, Rikk.* This clump of moss that whispers secrets of forgotten civilizations needs a special kind of caretaker. *Someone who speaks 'lichen', you know?* It's a niche market.",
                        "You don't want this half-eaten sandwich? *But a guru from the 7th dimension told me it contains the secret to perfect toast!* Your loss, man. The journey to toast-nirvana continues without you."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkDeclinesToSell": [
                {
                    "conditions": [],
                    "lines": [
                        "It's cool, Rikk. The universe will provide the [ITEM_NAME] when the time is right... or maybe that pigeon outside has some. *It looked like it had shifty eyes. And really colorful feathers.*",
                        "No worries, my dude. *The path to enlightenment is, like, totally winding.* If the [ITEM_NAME] isn't flowing today, maybe it's a sign I should try to, like, *photosynthesize my own high*. Worth a shot, right?",
                        "*That's alright, Rikk.* The cosmic flow is just redirecting my journey. Perhaps I'm meant to find clarity in, like, a really good cup of tea. Or by staring at my own hands for an hour. *They're like... maps, man! Maps of... hands!*",
                        "The universe says no, huh? Far out. *Guess my chakras are on backorder.* All good, I'll just go find out what the clouds are trying to tell me. They're looking extra puffy today."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkBuysSuccess": [
                {
                    "conditions": [],
                    "lines": [
                        "Radical, Rikk! This *Cosmic Pebble* will be, like, so stoked to join your collection of earthly treasures! *It says it's happy to be appreciated for its inner truth, not just its pebble-ness.*",
                        "Far out, man! This *Whispering Pinecone* is gonna love its new home. *It has so many stories to tell, mostly about squirrels, but some are pretty profound.* Thanks for, like, being its new guardian.",
                        "*Righteous!* This *Slightly-Used Aura* I found will really benefit from your... *grounded energy*, Rikk. May it bring you visions of, like, really cool screensavers.",
                        "Excellent! This *Jar of Positive Vibes* is now yours. *Just open it when you're feeling, like, existentially bummed. Or don't. It's your journey.*"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkSellsSuccess": [
                {
                    "conditions": [],
                    "lines": [
                        "Far out, man! This [ITEM_NAME] is gonna take me on a journey to the very fabric of reality... or at least to the corner store for snacks. *It's all connected, you know?* Thanks, Rikk!",
                        "*Cosmic!* This [ITEM_NAME] is just what my third eye was craving. Time to go explore the space between thoughts. *Wish me luck, or, like, don't. Time is an illusion anyway.* Peace!",
                        "Beautiful, Rikk. This [ITEM_NAME] feels... *correct*. My spirit animal, which is currently a mildly confused sloth, thanks you. *He says you have good vibes. For a carbon-based biped.*",
                        "Awesome! With this [ITEM_NAME], I can finally find out if my cat is secretly a time traveler. *He has that look, you know? Like he's seen things.* Later, space-time!"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "itemNotGoodEnough": [
                {
                    "conditions": [],
                    "lines": [
                        "Hmm, this feels a bit too... *square*, you know? My third eye is looking for something more... *spherical*. Or maybe, like, *fractal-shaped*. Yeah, that's the ticket.",
                        "Nah, Rikk, this one is giving me, like, *jagged vibes*. I'm looking for something more... *flowy*. Like a gentle stream of consciousness, not a caffeinated waterfall, you feel me?",
                        "This particular batch doesn't quite resonate with my current chakra alignment. *It's a bit too... beige.* I need something that sings in the key of *purple*, my friend.",
                        "The aura on this one is... murky. *I'm looking for a product with a clearer spiritual signal.* This one's like... cosmic static."
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "rikkPriceTooHigh": [
                {
                    "conditions": [],
                    "lines": [
                        "Whoa, heavy price, man. Does it come with, like, a map to the Astral Plane for that much? *Or maybe a user manual for the universe?* My spirit guide says my wallet is feeling a bit... *deflated* right now.",
                        "Oof, Rikk, that's a lot of Earth credits. *Is this [ITEM_NAME] artisanally mined from the moon by enlightened gnomes or something?* My pockets are feeling a bit too... *Newtonian* for that price.",
                        "*That's a cosmic number, my friend!* For that much, I'd expect this [ITEM_NAME] to also, like, do my dishes and tell me the meaning of life. *Can we find a more... harmonious price point?*",
                        "That's a bit too much material energy for me to part with right now, Rikk. *Can we trade for, like, three good vibes and a hug? No? Okay, back to numbers, I guess.*"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ],
            "generalBanter": [
                {
                    "conditions": [],
                    "lines": [
                        "Rikk, my dude, I just realized that, like, shoes are just foot-prisons, you know? We should all let our feet be free! Anyway, you got any of that psychedelic sunshine?",
                        "I was talking to a squirrel earlier, and it told me the secrets of the universe... but then I forgot them. Think some of that special stuff will help me remember? *Or maybe it was a pigeon... they all look so wise.*",
                        "What if, like, trees are just Earth's antennas, Rikk? And they're, like, picking up signals from other planets? *Makes you think, huh?* Oh, yeah, need some of those cosmic comets.",
                        "I think my cat is a reincarnated philosopher. *He just stares at walls with such... understanding.* It's profound. Anyway, you got any of those reality-benders?",
                        "Sometimes I wonder if we're all just, like, characters in a giant cosmic play, Rikk. And the script is written in, like, stardust. *Heavy, right?* Speaking of stars, any galaxy gliders in stock?",
                        "This reality, man... it's like, *so* realistic. Almost *too* realistic, you know? Makes me crave some of that dream weaver stuff. You holding?"
                    ],
                    "payload": { "type": "EFFECT", "effects": [] }
                }
            ]
        }
    }
};