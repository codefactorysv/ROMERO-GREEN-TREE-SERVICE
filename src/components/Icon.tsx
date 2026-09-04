import {
  Axe,
  Scissors,
  Disc3,
  Layers,
  Sprout,
  Flower2,
  Fence,
  Droplets,
  Truck,
  Wrench,
  ClipboardCheck,
  Building2,
  Clock,
  Siren,
  Leaf,
  Phone,
  Check,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/content";

const iconMap: Record<IconName, React.ComponentType<LucideProps>> = {
  axe: Axe,
  shears: Scissors,
  grind: Disc3,
  mulch: Layers,
  grass: Sprout,
  flower: Flower2,
  fence: Fence,
  wash: Droplets,
  haul: Truck,
  maintenance: Wrench,
  estimate: ClipboardCheck,
  building: Building2,
  clock: Clock,
  emergency: Siren,
  leaf: Leaf,
  phone: Phone,
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
