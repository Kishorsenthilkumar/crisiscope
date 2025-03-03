
import React from 'react';
import { Bell, Settings, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Link to="/" className="font-semibold text-xl tracking-tight">
          <span className="text-primary">Crisis</span>
          <span>Scope</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="py-2 pl-10 pr-4 rounded-full bg-secondary text-foreground border-none w-48 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          
          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          
          <button className="w-9 h-9 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
