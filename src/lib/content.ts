// Central content/data source for the ROOSTER Tree - Lawn Services landing page.
// Keeping copy and structured data here makes it easy to edit from a phone
// (one file, no hunting through JSX) and keeps components presentation-only.

export const siteConfig = {
  /** Full legal-ish name used in metadata and structured data. */
  name: "ROOSTER Tree & Lawn Services",
  /** Wordmark shown in the UI. */
  brand: "ROOSTER",
  descriptor: "Tree - Lawn Services",
  slogan: "Reliable Property Care When You Need It.",
  phone: "832-989-8795",
  phoneHref: "tel:+18329898795",
  phoneDisplay: "(832) 989-8795",
  hours: "7:00 AM – 7:00 PM",
  emergency: "24/7 Emergency Tree Service",
  // NOTE: no public email yet — the client has not confirmed one. Form
  // submissions are routed through the CONTACT_EMAIL environment variable.
  // Replace this placeholder domain once the real one is live.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  ogImage: "/images/real/hero-climber-pine.jpg",
  logoDark: "/images/logo/rooster-logo-dark.png",
  logoLight: "/images/logo/rooster-logo-light.png",
} as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#our-work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export type ServiceItem = {
  slug: string;
  title: string;
  description: string;
  icon: IconName;
  size: "lg" | "sm";
  image?: string;
  imageAlt?: string;
  /** Tailwind object-position utility so photos crop on the subject. */
  imagePosition?: string;
  /** True for licensed stock photos (never used in the Our Work gallery). */
  isStock?: boolean;
};

/**
 * Licensed stock photos, used only for services the client has no photo of
 * yet. Every other image on the site is the client's real work. Credits are
 * rendered in the footer — remove an entry as soon as a real photo replaces it.
 */
export const photoCredits = [
  {
    subject: "Stump grinding",
    title: "Stump grinder",
    author: "Wikideas1",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Stump_grinder.jpg",
  },
  {
    subject: "Lawn services",
    title: "Mowing lawn",
    author: "rawpixel",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl:
      "https://www.rawpixel.com/image/5920140/mowing-the-lawn-free-public-domain-cc0-photo",
  },
] as const;

// "lg" services are the five the client highlights. "sm" services are the
// additional work listed on their business card.
export const services: ServiceItem[] = [
  {
    slug: "tree-services",
    title: "Tree Services",
    description:
      "Professional tree work for residential and commercial properties, handled safely from the first cut to the final cleanup.",
    icon: "axe",
    size: "lg",
    image: "/images/real/gallery-removal-trunk-park.jpg",
    imageAlt: "Large tree sectioned down to the trunk with logs stacked on the lawn",
    imagePosition: "object-[50%_62%]",
  },
  {
    slug: "stump-grinding",
    title: "Stump Grinding",
    description:
      "Remove unwanted stumps and reclaim usable outdoor space, leaving the ground level and ready for whatever comes next.",
    icon: "grind",
    size: "lg",
    image: "/images/stock/stump-grinding.jpg",
    imageAlt: "Stump grinder at work on a lawn behind safety fencing",
    imagePosition: "object-[42%_42%]",
    isStock: true,
  },
  {
    slug: "lawn-services",
    title: "Lawn Services",
    description:
      "Routine lawn care to keep outdoor spaces clean, healthy, and well maintained all season long.",
    icon: "shears",
    size: "lg",
    image: "/images/stock/lawn-services.jpg",
    imageAlt: "Lawn mower cutting fresh green grass in a well-kept yard",
    imagePosition: "object-[50%_55%]",
    isStock: true,
  },
  {
    slug: "mulching",
    title: "Mulching",
    description:
      "Fresh mulch installation for cleaner, healthier landscape areas that hold moisture and look sharp.",
    icon: "mulch",
    size: "lg",
  },
  {
    slug: "sod-installation",
    title: "Sod Installation",
    description:
      "Transform bare or worn-out areas with professionally installed fresh sod.",
    icon: "grass",
    size: "lg",
  },
  {
    slug: "flower-beds",
    title: "Flower Beds",
    description: "Clean, defined beds built and maintained.",
    icon: "flower",
    size: "sm",
  },
  {
    slug: "wood-fence",
    title: "Wood Fence",
    description: "Wood fencing for privacy and property lines.",
    icon: "fence",
    size: "sm",
  },
  {
    slug: "power-washing",
    title: "Power Washing",
    description: "Surfaces washed back to looking new.",
    icon: "wash",
    size: "sm",
  },
  {
    slug: "junk-hauling",
    title: "Junk Hauling",
    description: "Debris and unwanted items hauled away.",
    icon: "haul",
    size: "sm",
  },
  {
    slug: "property-maintenance",
    title: "Property Maintenance",
    description: "Ongoing upkeep for homes and businesses.",
    icon: "maintenance",
    size: "sm",
  },
];

export type IconName =
  | "axe"
  | "shears"
  | "grind"
  | "mulch"
  | "grass"
  | "flower"
  | "fence"
  | "wash"
  | "haul"
  | "maintenance"
  | "estimate"
  | "building"
  | "clock"
  | "emergency"
  | "leaf"
  | "phone"
  | "check";

export const trustPoints = [
  {
    icon: "estimate" as IconName,
    title: "Free Estimates",
    description: "No-obligation quotes before any work begins.",
  },
  {
    icon: "building" as IconName,
    title: "Residential & Commercial",
    description: "Homes, businesses, and everything in between.",
  },
  {
    icon: "clock" as IconName,
    title: "Open 7 AM – 7 PM",
    description: "Regular service hours, seven days a week.",
  },
  {
    icon: "emergency" as IconName,
    title: "24/7 Tree Emergencies",
    description: "Storm damage response around the clock.",
  },
  {
    icon: "leaf" as IconName,
    title: "Tree & Lawn Care",
    description: "One crew for the whole property.",
  },
];

export type GalleryCategory = "Tree Removal" | "Tree Work" | "Special Projects";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  caption: string;
};

// Exclusively real photographs supplied by the client. No stock imagery
// appears in this section.
export const galleryItems: GalleryItem[] = [
  {
    id: "removal-two-pines",
    src: "/images/real/why-two-pines-topping.jpg",
    alt: "Two tall pine trees being sectioned and removed near a house",
    category: "Tree Removal",
    caption: "Large pine takedown, sectioned piece by piece",
  },
  {
    id: "removal-house",
    src: "/images/real/gallery-removal-house.jpg",
    alt: "Tall pine trunk being removed next to a historic home",
    category: "Tree Removal",
    caption: "Careful removal within feet of a home and street",
  },
  {
    id: "removal-rv",
    src: "/images/real/gallery-removal-rv.jpg",
    alt: "Climber working near the top of a large tree beside an RV and shed",
    category: "Tree Removal",
    caption: "Tight-space removal around structures and vehicles",
  },
  {
    id: "removal-trunk-park",
    src: "/images/real/gallery-removal-trunk-park.jpg",
    alt: "Large tree trunk sectioned with logs on the ground in a park-like yard",
    category: "Tree Removal",
    caption: "Clean bucking and cleanup after a large removal",
  },
  {
    id: "removal-ascent",
    src: "/images/real/featured-climber-ascent.jpg",
    alt: "Climber ascending a large stripped trunk mid-removal",
    category: "Tree Removal",
    caption: "Climbing the trunk to set the next cut",
  },
  {
    id: "canopy-work",
    src: "/images/real/hero-climber-pine.jpg",
    alt: "Climber working on limbs inside a pine tree canopy",
    category: "Tree Work",
    caption: "In-canopy work high off the ground",
  },
  {
    id: "special-water",
    src: "/images/real/why-water-removal.jpg",
    alt: "Crew member working on a storm-fallen tree over a pond",
    category: "Special Projects",
    caption: "Storm-damaged tree removal over water",
  },
  {
    id: "special-bees",
    src: "/images/real/why-bee-removal.jpg",
    alt: "Worker in a beekeeping suit removing a hive high in a tree",
    category: "Special Projects",
    caption: "Bee hive removal, high in the canopy",
  },
];

export type StoryItem = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const storyItems: StoryItem[] = [
  {
    title: "Safety First",
    description:
      "Every climb, cut, and rig is planned around what's underneath it — your home, your family, and your neighbors.",
    image: "/images/real/featured-climber-ascent.jpg",
    imageAlt: "Climber ascending a large tree trunk with full safety gear",
  },
  {
    title: "Ready When Storms Hit",
    description:
      "Storm damage, flooded yards, awkward angles — our crew handles the jobs that require real experience, and tree emergencies are answered 24/7.",
    image: "/images/real/why-water-removal.jpg",
    imageAlt: "Crew removing a storm-fallen tree over water",
  },
  {
    title: "Care for the Whole Property",
    description:
      "From the canopy down to the lawn, we handle tree work, stump grinding, lawn care, mulching, and sod so your property is looked after end to end.",
    image: "/images/real/why-bee-removal.jpg",
    imageAlt: "Worker in protective gear removing a hive from a tree",
  },
];

export const serviceOptions = [
  "Tree Services",
  "Stump Grinding",
  "Lawn Services",
  "Mulching",
  "Sod Installation",
  "Flower Beds",
  "Wood Fence",
  "Power Washing",
  "Junk Hauling",
  "Property Maintenance",
  "Other",
] as const;

export const propertyTypeOptions = ["Residential", "Commercial"] as const;
