
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Search, Users, BarChart3, CheckSquare, MessageSquare, FileText, Home, User, Settings, Calendar, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth, useOrganization, UserButton, OrganizationSwitcher } from "@clerk/clerk-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { organization } = useOrganization();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Contacts", href: "/contacts", icon: Users },
    { name: "Pipeline", href: "/pipeline", icon: BarChart3 },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Communications", href: "/communications", icon: MessageSquare },
    { name: "Meetings", href: "/meetings", icon: Calendar },
    { name: "Templates", href: "/templates", icon: FileText },
    { name: "Integration", href: "/integration", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center gap-2 px-6 border-b">
          <Building2 className="h-8 w-8 text-purple-600" />
          <div className="flex-1">
            <span className="text-xl font-bold text-gray-900">Aczen</span>
            {organization && (
              <p className="text-xs text-gray-500 truncate">{organization.name}</p>
            )}
          </div>
        </div>
        
        {/* Organization Switcher */}
        <div className="px-3 py-4 border-b">
          <OrganizationSwitcher 
            appearance={{
              elements: {
                organizationSwitcherTrigger: "w-full justify-start bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md px-3 py-2",
                organizationSwitcherTriggerIcon: "text-gray-500",
                organizationPreviewAvatarBox: "w-6 h-6",
                organizationPreviewMainIdentifier: "text-sm font-medium text-gray-900",
                organizationPreviewSecondaryIdentifier: "text-xs text-gray-500"
              }
            }}
          />
        </div>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-500"
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search contacts, leads, tasks..."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {organization && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{organization.name}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
