import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Database, FileText, Upload, BarChart3, Info, User, Shield, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const navigationItems = [
  { name: "首页", name_en: "Home", href: "/", icon: BarChart3 },
  { name: "数据集", name_en: "Datasets", href: "/datasets", icon: Database },
  { name: "申请", name_en: "Apply", href: "/apply", icon: FileText },
  { name: "成果", name_en: "Outputs", href: "/outputs", icon: Upload },
  { name: "关于", name_en: "About", href: "/about", icon: Info },
  { name: "个人中心", name_en: "My Center", href: "/profile", icon: User },
  { name: "管理", name_en: "Admin", href: "/admin", icon: Shield, adminOnly: true },
];

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "登出失败",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "已登出",
          description: "您已成功登出。",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "登出过程中发生错误。",
        variant: "destructive",
      });
    }
  };

  const NavItems = ({ mobile = false }) => (
    <>
      {navigationItems
        .filter((item) => !item.adminOnly || user) // Show admin link only if user is logged in
        .map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => mobile && setIsOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            } ${mobile ? "justify-start" : ""}`}
          >
            <Icon className="h-4 w-4" />
            <span className={mobile ? "block" : "hidden md:block"}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Database className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Nabotix Platform
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 flex-1">
          <NavItems />
        </nav>

        <div className="flex items-center space-x-2">
          {/* Auth Section */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  个人资料
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">登录</Link>
            </Button>
          )}
          
          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link
                to="/"
                className="flex items-center space-x-2 mb-6"
                onClick={() => setIsOpen(false)}
              >
                <Database className="h-6 w-6 text-primary" />
                <span className="font-bold">Nabotix Platform</span>
              </Link>
              <nav className="flex flex-col space-y-1">
                <NavItems mobile />
              </nav>
              
              {/* Mobile Auth Section */}
              <div className="mt-6 pt-6 border-t">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground px-3">{user.email}</div>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      登出
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/auth" onClick={() => setIsOpen(false)}>登录</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}