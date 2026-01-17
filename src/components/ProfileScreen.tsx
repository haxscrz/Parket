import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { 
  ArrowLeft, 
  User, 
  Car, 
  CreditCard, 
  Bell, 
  Shield, 
  HelpCircle, 
  Moon,
  ChevronRight,
  Settings,
  History,
  LogOut,
  Star,
  Trophy,
  Zap
} from "lucide-react";

interface ProfileScreenProps {
  onBack: () => void;
  onNavigateToHistory: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function ProfileScreen({ 
  onBack, 
  onNavigateToHistory, 
  darkMode, 
  onToggleDarkMode 
}: ProfileScreenProps) {
  const menuItems = [
    {
      icon: History,
      title: 'Parking History',
      subtitle: 'View past parking sessions',
      action: onNavigateToHistory,
      color: 'text-blue-500'
    },
    {
      icon: Car,
      title: 'My Vehicles',
      subtitle: '2 vehicles registered',
      color: 'text-green-500'
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      subtitle: 'Manage cards and wallets',
      color: 'text-purple-500'
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Push and email preferences',
      color: 'text-orange-500'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Account security settings',
      color: 'text-red-500'
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'FAQs and contact support',
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="hover:bg-primary-foreground/10 rounded-xl text-primary-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Profile</h1>
                <p className="text-primary-foreground/80 text-sm">Manage your account</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-2">
        {/* Profile Info */}
        <Card className="rounded-3xl p-6 shadow-lg bg-gradient-to-br from-card to-card/80 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Hans Cruz</h2>
              <p className="text-muted-foreground">hans.cruz@email.com</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-foreground">Premium Member</span>
                </div>
                <span className="text-muted-foreground text-sm">• Since 2023</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl border-border text-foreground hover:bg-accent"
            >
              Edit
            </Button>
          </div>
        </Card>

        {/* Account Stats */}
        <Card className="rounded-2xl p-6 shadow-sm bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Account Summary
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">47</p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Parking Sessions</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-950/30">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">₱2,350</p>
              <p className="text-xs text-green-600/80 dark:text-green-400/80">Total Spent</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">8h 32m</p>
              <p className="text-xs text-purple-600/80 dark:text-purple-400/80">Time Saved</p>
            </div>
          </div>
        </Card>

        {/* Dark Mode Toggle */}
        <Card className="rounded-2xl p-4 shadow-sm bg-card border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center">
                <Moon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">Switch to dark theme</p>
              </div>
            </div>
            <Switch 
              checked={darkMode} 
              onCheckedChange={onToggleDarkMode}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide text-muted-foreground">
            Settings
          </h3>
          {menuItems.map((item, index) => (
            <Card 
              key={index} 
              className="rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer bg-card border border-border hover:bg-accent/50"
              onClick={item.action}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>

        {/* Premium Benefits */}
        <Card className="rounded-2xl p-6 shadow-sm bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Premium Benefits</h3>
              <p className="text-sm text-muted-foreground">Enjoy exclusive perks</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Priority parking slots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">10% discount on all bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">24/7 customer support</span>
            </div>
          </div>
        </Card>

        {/* Logout Button */}
        <Card className="rounded-2xl p-4 shadow-sm cursor-pointer bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all duration-200">
          <div className="flex items-center justify-center gap-3">
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-red-500">Sign Out</span>
          </div>
        </Card>

        {/* Bottom padding for safe area */}
        <div className="h-8" />
      </div>
    </div>
  );
}