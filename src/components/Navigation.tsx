import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Database, FileText, Upload, BarChart3, Info, User, Shield } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = ({ mobile = false }) => (
    <>
      {navigationItems
        .filter((item) => !item.adminOnly) // For now, hide admin link until auth is implemented
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
          {/* Login/Profile Button - will be implemented later */}
          <Button variant="ghost" size="sm">
            登录
          </Button>
          
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}