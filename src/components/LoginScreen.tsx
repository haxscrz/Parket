import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Apple, Mail, Facebook, Eye, EyeOff } from "lucide-react";
import parketLogo from '../assets/parketlogo.png';
import { useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
  darkMode?: boolean;
}

export function LoginScreen({ onLogin, darkMode }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8">
            <img 
              src={parketLogo} 
              alt="Parket Logo" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 shadow-xl">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
              <p className="text-muted-foreground">Sign in to continue to Parket</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-input-background border-border rounded-2xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-2 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-input-background border-border rounded-2xl py-3 px-4 pr-12 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-right">
              <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </button>
            </div>

            <Button
              onClick={onLogin}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl py-3 h-12 shadow-lg hover:shadow-xl transition-all"
            >
              Sign In
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-4 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={onLogin}
                variant="outline"
                className="border-border/50 text-foreground hover:bg-accent rounded-2xl py-3 h-12 transition-all"
              >
                <Apple className="w-5 h-5" />
              </Button>
              <Button
                onClick={onLogin}
                variant="outline"
                className="border-border/50 text-foreground hover:bg-accent rounded-2xl py-3 h-12 transition-all"
              >
                <Mail className="w-5 h-5" />
              </Button>
              <Button
                onClick={onLogin}
                variant="outline"
                className="border-border/50 text-foreground hover:bg-accent rounded-2xl py-3 h-12 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button className="text-primary font-medium hover:text-primary/80 transition-colors">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}