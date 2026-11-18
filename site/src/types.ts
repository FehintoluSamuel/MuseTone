import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface Reviewer {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

export interface ColourFeature {
  id: string;
  title: string;
  description: string;
  badge?: string;
}
