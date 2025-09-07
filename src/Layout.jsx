
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { 
  Home, 
  BookOpen, 
  Stars, 
  User as UserIcon, 
  Crown,
  Music, 
  LogOut,
  Gem
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Mystic Hub",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Dream Journal", 
    url: createPageUrl("Dreams"),
    icon: BookOpen,
  },
  {
    title: "Divination Arts",
    url: createPageUrl("DivinationHub"),
    icon: Gem,
  },
  {
    title: "Cosmic Wisdom",
    url: createPageUrl("AstrologyHub"),
    icon: Stars,
  },
  {
    title: "The Sanctuary",
    url: createPageUrl("SonicAlchemy"),
    icon: Music,
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const showSidebar = location.pathname !== createPageUrl("Home");

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.href = createPageUrl("Home");
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = createPageUrl("Home");
    }
  };
  
  if (!showSidebar) {
    return <div style={{background: '#191970'}} className="min-h-screen">{children}</div>;
  }

  return (
    <SidebarProvider>
      <style jsx>{`
        .lumenia-bg {
          background: #191970;
          min-height: 100vh;
        }
        .lumenia-sidebar {
          background: #191970;
          border-right: 2px solid #C0C0C0;
        }
        .nav-item {
          transition: all 0.3s ease;
          color: #C0C0C0;
          border-radius: 12px;
          padding: 12px;
        }
        .nav-item:hover {
          transform: translateX(8px);
          background: rgba(183, 110, 121, 0.2);
          color: #8A2BE2;
          border: 2px solid #B76E79;
          box-shadow: 0 0 15px rgba(183, 110, 121, 0.5);
        }
        .nav-item.active {
          background: rgba(138, 43, 226, 0.3);
          color: #8A2BE2;
          border-right: 4px solid #B76E79;
        }
        .lumenia-logo {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .crescent-container {
          width: 52px;
          height: 52px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .crescent-shape {
          width: 46px;
          height: 46px;
          background: #8A2BE2;
          position: relative;
          border-radius: 50%;
          overflow: hidden;
        }
        .crescent-shape::before {
          content: '';
          position: absolute;
          top: 0;
          right: -12px;
          width: 46px;
          height: 46px;
          background: #191970;
          border-radius: 50%;
        }
        .crescent-l {
          position: absolute;
          top: 50%;
          left: 42%;
          transform: translate(-50%, -50%);
          color: #191970;
          font-size: 28px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          line-height: 1;
          z-index: 10;
        }
        .wordmark {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: #8A2BE2;
          letter-spacing: -0.02em;
        }
        .tagline {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 11px;
          color: #C0C0C0;
          margin-top: 3px;
        }
        .profile-section {
          color: #C0C0C0;
          transition: all 0.3s ease;
          border-radius: 12px;
          padding: 12px;
        }
        .profile-section:hover {
          background: rgba(183, 110, 121, 0.2);
          color: #8A2BE2;
          border: 2px solid #B76E79;
          box-shadow: 0 0 15px rgba(183, 110, 121, 0.5);
        }
        .logout-btn {
          background: transparent;
          border: 2px solid #C0C0C0;
          color: #C0C0C0;
          transition: all 0.3s ease;
        }
        .logout-btn:hover {
          border-color: #B76E79;
          color: #B76E79;
          box-shadow: 0 0 10px rgba(183, 110, 121, 0.3);
        }
      `}</style>
      
      <div className="lumenia-bg flex w-full">
        <Sidebar className="lumenia-sidebar border-none">
          <SidebarHeader className="p-6" style={{borderBottom: '2px solid #C0C0C0'}}>
            <div className="lumenia-logo">
              <div className="crescent-container">
                <div className="crescent-shape"></div>
                <span className="crescent-l">L</span>
              </div>
              <div>
                <h1 className="wordmark">Lumenia</h1>
                <p className="tagline">Mystical Journey Awaits</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-3">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`nav-item ${
                          location.pathname === item.url ? 'active' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4" style={{borderTop: '2px solid #C0C0C0'}}>
            <Link to={createPageUrl("Profile")} className="profile-section flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: '#B76E79'}}>
                <UserIcon className="w-4 h-4" style={{color: '#C0C0C0'}} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Profile & Subscription</p>
                <p className="text-xs flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Free Tier
                </p>
              </div>
            </Link>
            
            <Button 
              onClick={handleLogout}
              className="logout-btn w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="px-6 py-4 md:hidden" style={{background: '#191970', borderBottom: '2px solid #C0C0C0'}}>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 rounded-lg transition-colors" 
                style={{color: '#C0C0C0'}}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(183, 110, 121, 0.2)';
                  e.target.style.color = '#8A2BE2';
                  e.target.style.border = '2px solid #B76E79';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#C0C0C0';
                  e.target.style.border = 'none';
                }} />
              <h1 className="text-xl font-semibold wordmark">Lumenia</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto" style={{background: '#191970'}}>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
