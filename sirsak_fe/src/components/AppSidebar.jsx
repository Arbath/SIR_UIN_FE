import { Fragment, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BerandaIcon,
  UserIcon,
  DoorIcon,
  CheckIcon,
  MessageIcon,
  SettingsIcon,
  SearchIcon,
  LogoutIcon,
  DocsSingle
} from "./icons/general.jsx";

import {
  BookOpen
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = {
  user: [
    {
      label: "",
      items: [
        { title: "Dashboard", url: "/user/dashboard", icon: BerandaIcon }
      ],
    },
    {
      label: "Reservasi",
      items: [
        { title: "Cari Ruangan", url: "/user/search", icon: SearchIcon },
        { title: "Ajukan Reservasi", url: "/user/reserve", icon: DocsSingle },
        { title: "Status Reservasi", url: "/user/status", icon: CheckIcon }
      ],
    },
    {
      label: "Laporan",
      items: [
        { title: "Feedback", url: "/user/feedback", icon: MessageIcon },
        { title: "Pengaturan", url: "/user/settings", icon: SettingsIcon }
      ],
    },
  ],

  admin: [
    {
      label: "",
      items: [{ title: "Dashboard", url: "/admin/dashboard", icon: BerandaIcon }],
    },
    {
      label: "Manajemen",
      items: [
        { title: "Kelola Pengguna", url: "/admin/management/users", icon: UserIcon },
        { title: "Kelola Ruangan", url: "/admin/management/rooms", icon: DoorIcon },
        { title: "Ajukan Reservasi", url: "/admin/reserve", icon: DocsSingle },
        { title: "Persetujuan Akhir", url: "/admin/approvals", icon: CheckIcon },
      ],
    },
    {
      label: "Laporan",
      items: [
        { title: "Feedback Pengguna", url: "/admin/management/feedback", icon: MessageIcon },
        { title: "Pengaturan", url: "/admin/settings", icon: SettingsIcon },
      ],
    },
  ],
};

const SidebarSection = ({ collapsed, label, children }) => (
  <Fragment>
    {!collapsed && (
      <div className="px-3 py-2 text-xs font-bold text-muted-foreground">
        {label}
      </div>
    )}
    {children}
  </Fragment>
);

const SidebarItem = ({ item, collapsed }) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <NavLink
        to={item.url}
        end
        className={({ isActive }) =>
          `${
            isActive
              ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
              : "hover:bg-muted/50 hover:text-foreground"
          } flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group`
        }
      >
        <item.icon className="w-6 h-6"/>

        {!collapsed && (
          <div className="flex items-center justify-between flex-1 min-w-0">
            <span className="truncate">{item.title}</span>

            {item.badge && (
              <Badge className="ml-2 text-xs px-1.5 py-0 bg-yellow-500 text-black">
                {item.badge}
              </Badge>
            )}
          </div>
        )}
      </NavLink>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export function AppSidebar() {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    setUserRole(localStorage.getItem("role") || "user");
  }, []);

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      const access = localStorage.getItem("access_token");

      await fetch("https://sirsakapi.teknohole.com/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ refresh }),
      });

      localStorage.clear();
      alert("Logout berhasil.");
      navigate("/");
    } catch (err) {
      console.error(err);
      localStorage.clear();
      navigate("/");
    }
  };

  const items = menuItems[userRole] || [];

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r bg-card transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <img
                  src="/sirsak.png"
                  alt="Sirsak"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h2 className="font-semibold text-[19px] text-foreground">
                SIRSAK
              </h2>
            </div>

            <SidebarTrigger className="h-7 w-7 hover:bg-primary/10" />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <SidebarTrigger className="h-6 w-6 hover:bg-primary/10" />
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((section, index) => (
                <SidebarSection key={index} label={section.label} collapsed={collapsed}>
                  {section.items.map((item) => (
                    <SidebarItem key={item.title} item={item} collapsed={collapsed} />
                  ))}
                </SidebarSection>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        {!collapsed ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start hover:bg-[#D03838]/10 hover:text-[#D03838] hover:border-[#D03838]/20 text-[#D03838]"
            onClick={handleLogout}
          >
            <LogoutIcon className="h-6 w-6" /> Keluar
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full p-2 hover:bg-[#D03838]/10 hover:text-[#D03838] text-[#D03838]"
            onClick={handleLogout}
          >
            <LogoutIcon className="h-6 w-6" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
