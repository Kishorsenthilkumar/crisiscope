
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Globe2, FileBarChart, Settings, MapPin } from 'lucide-react';
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const location = useLocation();
  
  const links = [
    { to: '/dashboard', icon: <BarChart3 size={18} />, label: 'Dashboard' },
    { to: '/india-map', icon: <MapPin size={18} />, label: 'India Economic Map' },
    { to: '/reports', icon: <FileBarChart size={18} />, label: 'Reports' },
    { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
  ];
  
  return (
    <div className="w-16 md:w-56 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 flex items-center justify-center md:justify-start">
        <Globe2 className="h-8 w-8 text-primary" />
        <span className="ml-2 font-semibold text-xl hidden md:inline">Crisis Watch</span>
      </div>
      
      <div className="mt-8 px-2 space-y-1 flex-1">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              location.pathname === link.to
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            {link.icon}
            <span className="ml-3 hidden md:inline">{link.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="p-4 mt-auto">
        <Link
          to="/"
          className="flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <span className="hidden md:inline">Back to Home</span>
        </Link>
      </div>
    </div>
  );
};
