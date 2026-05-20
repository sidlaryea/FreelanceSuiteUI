import {
  Building2,
  Palette,
  Brain,
  Users,
  CreditCard,
  Bell,
  Shield,
  Code2,
  DollarSign,
} from "lucide-react";

export const settingsTabs = [
  {
    id: "Profile",
    label: "Profile",
    icon: Users,
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: Building2,
  },
  {
    id: "payments",
    label: "Payments",
    icon: DollarSign,
  },
  {
    id: "billing",
    label: "Billing & Subscription",
    icon: CreditCard,
  },

  {
    id: "developer",
    label: "Developers & API Integrations",
    icon: Code2,
  },
  
  {
    id: "security",
    label: "Team & Security",
    icon: Shield,
  },
  
];