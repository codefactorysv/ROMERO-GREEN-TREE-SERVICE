// Central content/data source for the Romero Green Tree Service landing page.
// Keeping copy and structured data here makes it easy to edit from a phone
// (one file, no hunting through JSX) and keeps components presentation-only.

export const siteConfig = {
  name: "Romero Green Tree Service",
  shortName: "Romero Green Tree",
  slogan: "Keeping Families Safe Through Professional Tree Services.",
  phone: "832-272-4373",
  phoneHref: "tel:+18322724373",
  phoneDisplay: "(832) 272-4373",
  email: "greentreeromero@gmail.com",
  emailHref: "mailto:greentreeromero@gmail.com",
  domain: "romerogreentree.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://romerogreentree.com",
  ogImage: "/images/real/hero-climber-pine.jpg",
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
  /** Tailwind object-position utility so portrait photos crop on the subject. */
  imagePosition?: string;
  /** True for licensed stock photos (never used in the Our Work gallery). */
  isStock?: boolean;
};

/**
 * Licensed stock photos used only where the client has no photo of their own
 * (stump grinding and landscaping). Every other image on the site is the
 * client's real work. Credits are rendered in the footer as the licenses
 * require — remove an entry here as soon as a real photo replaces it.
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
    subject: "Landscaping",
    title: "Cottage garden border at Boreham, Essex, England",
    author: "Acabashi",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cottage_garden_border_at_Boreham,_Essex,_England.jpg",
  },
] as const;

// "lg" services get a full visual treatment (photo or icon-forward hero
// card). "sm" services are the supporting/complementary list.
export const services: ServiceItem[] = [
  {
    slug: "tree-removal",
    title: "Tree Removal",
    description:
      "Safe, controlled removal of hazardous, dead, or unwanted trees — even in tight residential spaces near homes, fences, and power lines.",
    icon: "axe",
    size: "lg",
    image: "/images/real/gallery-removal-trunk-park.jpg",
    imageAlt:
      "Large tree sectioned down to the trunk with logs bucked and stacked on the lawn",
    imagePosition: "object-[50%_62%]",
  },
  {
    slug: "tree-pruning",
    title: "Tree Pruning",
    description:
      "Climbing-based pruning that improves tree health and structure while keeping your canopy looking clean and well cared for.",
    icon: "shears",
    size: "lg",
    image: "/images/real/hero-climber-pine.jpg",
    imageAlt: "Climber pruning limbs high in a pine tree canopy",
    imagePosition: "object-[55%_55%]",
  },
  {
    slug: "tree-trimming",
    title: "Tree Trimming",
    description:
      "Routine trimming to manage growth, clear structures and rooflines, and keep trees safe around your property year-round.",
    icon: "leaf",
    size: "lg",
    image: "/images/real/gallery-removal-rv.jpg",
    imageAlt: "Climber trimming a large tree in a tight space beside a carport",
    imagePosition: "object-[50%_26%]",
  },
  {
    slug: "stump-grinding",
    title: "Stump Grinding",
    description:
      "Clean, professional stump removal so your yard is left level, safe, and ready for grass, mulch, or new landscaping.",
    icon: "grind",
    size: "lg",
    image: "/images/stock/stump-grinding.jpg",
    imageAlt: "Stump grinder at work on a residential lawn behind safety fencing",
    imagePosition: "object-[42%_42%]",
    isStock: true,
  },
  {
    slug: "landscaping",
    title: "Landscaping",
    description:
      "Full-property landscaping that complements your tree work, from bed design to seasonal cleanups.",
    icon: "landscape",
    size: "lg",
    image: "/images/stock/landscaping.jpg",
    imageAlt: "Landscaped garden border with shrubs and flowers along a mown lawn",
    imagePosition: "object-[50%_72%]",
    isStock: true,
  },
  {
    slug: "limb-cleaning",
    title: "Limb Cleaning",
    description: "Deadwood and loose limb removal to reduce storm risk.",
    icon: "branch",
    size: "sm",
  },
  {
    slug: "mulching",
    title: "Mulching",
    description: "Fresh mulch beds that protect roots and look sharp.",
    icon: "mulch",
    size: "sm",
  },
  {
    slug: "flower-beds",
    title: "Flower Beds",
    description: "Clean, defined flower beds built and maintained.",
    icon: "flower",
    size: "sm",
  },
  {
    slug: "plant-grass",
    title: "Plant Grass",
    description: "Grass installation to fill in and restore your lawn.",
    icon: "grass",
    size: "sm",
  },
  {
    slug: "and-more",
    title: "And More",
    description: "Ask us — if it involves trees or your yard, we can help.",
    icon: "more",
    size: "sm",
  },
];

export type IconName =
  | "axe"
  | "shears"
  | "leaf"
  | "grind"
  | "landscape"
  | "branch"
  | "mulch"
  | "flower"
  | "grass"
  | "more"
  | "shield"
  | "estimate"
  | "equipment"
  | "building"
  | "language"
  | "phone"
  | "mail"
  | "check";

export const trustPoints = [
  {
    icon: "shield" as IconName,
    title: "Licensed & Insured",
    description: "Work you and your property are protected on.",
  },
  {
    icon: "estimate" as IconName,
    title: "Free Estimates",
    description: "No-obligation quotes before any work begins.",
  },
  {
    icon: "equipment" as IconName,
    title: "Professional Equipment",
    description: "Climbing gear and tools built for the job.",
  },
  {
    icon: "building" as IconName,
    title: "Residential & Commercial",
    description: "Homes, businesses, and everything in between.",
  },
  {
    icon: "language" as IconName,
    title: "English & Español",
    description: "Hablamos Español — always happy to help.",
  },
];

export type GalleryCategory =
  | "Tree Removal"
  | "Tree Trimming & Pruning"
  | "Special Projects";

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
    id: "pruning-pine",
    src: "/images/real/hero-climber-pine.jpg",
    alt: "Climber pruning limbs inside a pine tree canopy",
    category: "Tree Trimming & Pruning",
    caption: "In-canopy pruning for tree health and structure",
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
    title: "Ready for Difficult Conditions",
    description:
      "Storm damage, flooded yards, awkward angles — our crew handles the jobs that require real experience, not shortcuts.",
    image: "/images/real/why-water-removal.jpg",
    imageAlt: "Crew removing a storm-fallen tree over water",
  },
  {
    title: "Specialized When It Counts",
    description:
      "From routine pruning to a live hive high in the canopy, we come prepared for what your property actually needs.",
    image: "/images/real/why-bee-removal.jpg",
    imageAlt: "Worker in protective beekeeping gear removing a hive from a tree",
  },
];

export const serviceOptions = [
  "Tree Removal",
  "Tree Trimming",
  "Tree Pruning",
  "Stump Grinding",
  "Landscaping",
  "Other",
] as const;

export const propertyTypeOptions = ["Residential", "Commercial"] as const;
