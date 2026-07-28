import {
  Mic,
  Radio,
  TowerControl,
  Users,
  Languages,
  WifiOff,
  ShieldCheck,
  Radar,
  Plane,
  Headphones,
  Crosshair,
  Target,
  ShieldAlert,
  Compass,
  Anchor,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Mic,
  Radio,
  TowerControl,
  Users,
  Languages,
  WifiOff,
  ShieldCheck,
  Radar,
  Plane,
  Headphones,
  Crosshair,
  Target,
  ShieldAlert,
  Compass,
  Anchor,
};

export function FeatureIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Radar;
  return <Icon className={className} aria-hidden="true" focusable="false" />;
}
