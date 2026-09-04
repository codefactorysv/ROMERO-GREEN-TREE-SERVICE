import {
  Axe,
  Scissors,
  Leaf,
  Disc3,
  Trees,
  TreeDeciduous,
  Layers,
  Flower2,
  Sprout,
  Sparkles,
  ShieldCheck,
  ClipboardCheck,
  Wrench,
  Building2,
  Languages,
  Phone,
  Mail,
  Check,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/content";

const iconMap: Record<IconName, React.ComponentType<LucideProps>> = {
  axe: Axe,
  shears: Scissors,
  leaf: Leaf,
  grind: Disc3,
  landscape: Trees,
  branch: TreeDeciduous,
  mulch: Layers,
  flower: Flower2,
  grass: Sprout,
  more: Sparkles,
  shield: ShieldCheck,
  estimate: ClipboardCheck,
  equipment: Wrench,
  building: Building2,
  language: Languages,
  phone: Phone,
  mail: Mail,
  check: Check,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = iconMap[name];
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
