
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BarChart3, AlertCircle, Map, Bell, FileText, Settings } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active = false }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'text-foreground hover:bg-secondary'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-border/60 h-screen py-6 flex flex-col bg-background/80 backdrop-blur-md">
      <div className="px-6 mb-8">
        <h1 className="font-bold text-2xl tracking-tight">
          <span className="text-primary">Crisis</span>
          <span>Scope</span>
        </h1>
      </div>
      
      <nav className="px-2 flex-1 space-y-1">
        <NavItem icon={<Home size={20} />} label="Overview" to="/dashboard" active />
        <NavItem icon={<Map size={20} />} label="Crisis Map" to="/map" />
        <NavItem icon={<BarChart3 size={20} />} label="Analytics" to="/analytics" />
        <NavItem icon={<AlertCircle size={20} />} label="Alerts" to="/alerts" />
        <NavItem icon={<Bell size={20} />} label="Notifications" to="/notifications" />
        <NavItem icon={<FileText size={20} />} label="Reports" to="/reports" />
      </nav>
      
      <div className="px-2 mt-auto">
        <NavItem icon={<Settings size={20} />} label="Settings" to="/settings" />
      </div>
    </aside>
  );
};
