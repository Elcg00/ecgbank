import {
  Home,
  Receipt,
  PieChart,
  CalendarClock,
  CreditCard,
  TrendingDown,
  Target,
  Users,
  MoreHorizontal,
  Plus,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const desktopNav: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/extrato", label: "Transações", icon: Receipt },
  { href: "/orcamento", label: "Orçamento", icon: PieChart },
  { href: "/contas", label: "Contas a pagar", icon: CalendarClock },
  { href: "/cartao", label: "Cartão de crédito", icon: CreditCard },
  { href: "/dividas", label: "Dívidas", icon: TrendingDown },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/familia", label: "Família", icon: Users },
];

export const mobileNav: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/extrato", label: "Extrato", icon: Receipt },
  { href: "/lancar", label: "Lançar", icon: Plus },
  { href: "/orcamento", label: "Planejar", icon: PieChart },
  { href: "/mais", label: "Mais", icon: MoreHorizontal },
];

export const maisMenu: NavItem[] = [
  { href: "/contas", label: "Contas a pagar", icon: CalendarClock },
  { href: "/cartao", label: "Cartão de crédito", icon: CreditCard },
  { href: "/familia", label: "Família", icon: Users },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export const planTabs = [
  { href: "/orcamento", label: "Orçamento" },
  { href: "/metas", label: "Metas" },
  { href: "/dividas", label: "Dívidas" },
];
