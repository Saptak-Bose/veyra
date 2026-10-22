import { AstroidIcon, HistoryIcon, LayoutDashboardIcon } from "lucide-react";

export const navLinks = [
  {
    id: "link_01",
    path: "/dashboard",
    label: "Dashboard",
    Icon: LayoutDashboardIcon,
  },
  {
    id: "link_02",
    path: "/sessions",
    label: "Sessions",
    Icon: HistoryIcon,
  },
  {
    id: "link_03",
    path: "/pricing",
    label: "Pricing",
    Icon: AstroidIcon,
  },
];
