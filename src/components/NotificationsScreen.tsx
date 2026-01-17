import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  Tag, 
  MapPin, 
  Bell,
  CheckCircle,
  AlertTriangle,
  Gift,
  CreditCard
} from "lucide-react";

interface NotificationsScreenProps {
  onBack: () => void;
  darkMode?: boolean;
}

export function NotificationsScreen({ onBack, darkMode }: NotificationsScreenProps) {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Parking Expires Soon',
      message: 'Your parking at SM Dasmarinas expires in 15 minutes',
      time: '5 min ago',
      location: 'SM Dasmarinas - B2',
      unread: true
    },
    {
      id: 2,
      type: 'promo',
      title: '50% Off Weekend Parking',
      message: 'Special discount for all Ayala Malls this weekend',
      time: '2 hours ago',
      location: 'Ayala Malls',
      unread: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Payment Successful',
      message: 'Your parking fee of ₱85.00 has been charged',
      time: '4 hours ago',
      location: 'Mall of Asia',
      unread: false
    },
    {
      id: 4,
      type: 'info',
      title: 'RFID Order Shipped',
      message: 'Your Parket RFID sticker is on the way',
      time: '1 day ago',
      location: 'Order #PA2024001',
      unread: false
    },
    {
      id: 5,
      type: 'promo',
      title: 'Free Parking Hour',
      message: 'You\'ve earned 1 free hour for being a loyal customer',
      time: '2 days ago',
      location: 'Loyalty Reward',
      unread: false
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'promo':
        return <Gift className="w-5 h-5 text-purple-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getNotificationStyles = (type: string, unread: boolean) => {
    if (!unread) return 'bg-card border-border';
    
    switch (type) {
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 border-l-4 border-l-orange-500';
      case 'promo':
        return 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 border-l-4 border-l-purple-500';
      case 'success':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 border-l-4 border-l-green-500';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 border-l-4 border-l-blue-500';
      default:
        return 'bg-card border-border border-l-4 border-l-primary';
    }
  };

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
                <h1 className="text-xl font-bold">Notifications</h1>
                <p className="text-primary-foreground/80 text-sm">Stay updated with Parket</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              Mark all read
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 -mt-2">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md ${
              getNotificationStyles(notification.type, notification.unread)
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h3>
                      {notification.unread && (
                        <Badge className="w-2 h-2 p-0 bg-primary border-0 rounded-full" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      {notification.message}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{notification.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{notification.location}</span>
                </div>
                
                {notification.type === 'warning' && notification.unread && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-8">
                      Extend Parking
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl h-8 border-border">
                      View Details
                    </Button>
                  </div>
                )}
                
                {notification.type === 'promo' && notification.unread && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl h-8">
                      Use Promo
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-xl h-8 border-border">
                      Save for Later
                    </Button>
                  </div>
                )}

                {notification.type === 'info' && notification.unread && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-8">
                      Track Order
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State if no notifications */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-6">
            <Bell className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            You're all caught up! We'll notify you when something important happens.
          </p>
        </div>
      )}

      {/* Bottom padding for safe area */}
      <div className="h-8" />
    </div>
  );
}