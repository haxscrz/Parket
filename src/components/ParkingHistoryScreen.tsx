import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CreditCard, 
  Receipt,
  Download
} from "lucide-react";

interface ParkingHistoryScreenProps {
  onBack: () => void;
  darkMode: boolean;
}

export function ParkingHistoryScreen({ onBack, darkMode }: ParkingHistoryScreenProps) {
  const parkingHistory = [
    {
      id: 'PA2024-001',
      location: 'SM Dasmarinas',
      zone: 'Level B2 - Zone A',
      date: 'Today, 2:30 PM',
      duration: '2h 15m',
      amount: '₱85.00',
      status: 'completed',
      paymentMethod: 'GCash'
    },
    {
      id: 'PA2024-002',
      location: 'Mall of Asia',
      zone: 'Level 3 - Zone C',
      date: 'Yesterday, 6:45 PM',
      duration: '3h 20m',
      amount: '₱120.00',
      status: 'completed',
      paymentMethod: 'Maya'
    },
    {
      id: 'PA2024-003',
      location: 'Glorietta 3',
      zone: 'Level 4 - Zone B',
      date: 'Dec 18, 11:20 AM',
      duration: '1h 45m',
      amount: '₱65.00',
      status: 'completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'PA2024-004',
      location: 'Ayala Malls Pasay',
      zone: 'Level 2 - Zone A',
      date: 'Dec 17, 3:15 PM',
      duration: '4h 10m',
      amount: '₱150.00',
      status: 'completed',
      paymentMethod: 'E-Wallet'
    },
    {
      id: 'PA2024-005',
      location: 'St. Luke\'s Hospital',
      zone: 'Visitor Parking',
      date: 'Dec 16, 9:30 AM',
      duration: '2h 55m',
      amount: '₱95.00',
      status: 'completed',
      paymentMethod: 'GCash'
    },
    {
      id: 'PA2024-006',
      location: 'Waltermart',
      zone: 'Ground Floor',
      date: 'Dec 15, 1:20 PM',
      duration: '1h 30m',
      amount: '₱45.00',
      status: 'completed',
      paymentMethod: 'Maya'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return darkMode ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return darkMode ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return darkMode ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-100 text-red-800 border-red-200';
      default:
        return darkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalSpent = parkingHistory.reduce((sum, session) => 
    sum + parseFloat(session.amount.replace('₱', '').replace(',', '')), 0
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-sm border-b ${darkMode ? 'border-slate-700' : 'border-blue-100'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className={`${darkMode ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-100'} rounded-xl`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Parking History</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>View all parking sessions</p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className={darkMode ? 'text-white hover:bg-slate-700' : ''}>
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Summary Stats */}
        <Card className={`rounded-3xl p-6 shadow-xl ${darkMode ? 'bg-slate-800 border-slate-700' : 'shadow-blue-500/10 border-2 border-blue-100 bg-gradient-to-br from-white to-blue-50'}`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className={`text-2xl font-black ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>{parkingHistory.length}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sessions</p>
            </div>
            <div>
              <p className={`text-2xl font-black ${darkMode ? 'text-green-400' : 'text-green-600'}`}>₱{totalSpent.toFixed(2)}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Spent</p>
            </div>
            <div>
              <p className={`text-2xl font-black ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>16h 15m</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Time</p>
            </div>
          </div>
        </Card>

        {/* History List */}
        <div className="space-y-3">
          {parkingHistory.map((session) => (
            <Card 
              key={session.id} 
              className={`rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'shadow-gray-200/50 hover:bg-gray-50'}`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                      <MapPin className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{session.location}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{session.zone}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{session.date}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-black text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{session.amount}</p>
                    <Badge className={`${getStatusColor(session.status)} border text-xs`}>
                      {session.status}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{session.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{session.paymentMethod}</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className={`${darkMode ? 'text-gray-400 hover:text-white hover:bg-slate-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Receipt className="w-4 h-4 mr-1" />
                    Receipt
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center pt-4">
          <Button variant="outline" className={`rounded-xl ${darkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            Load More History
          </Button>
        </div>
      </div>
    </div>
  );
}