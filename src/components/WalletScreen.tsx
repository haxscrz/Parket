import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  Building
} from "lucide-react";

interface WalletScreenProps {
  onBack: () => void;
  darkMode: boolean;
}

export function WalletScreen({ onBack, darkMode }: WalletScreenProps) {
  const transactions = [
    {
      id: 1,
      type: 'parking',
      title: 'Parking Fee - SM Dasmarinas',
      amount: '-₱85.00',
      date: 'Today, 4:45 PM',
      status: 'completed'
    },
    {
      id: 2,
      type: 'topup',
      title: 'Top-up via GCash',
      amount: '+₱500.00',
      date: 'Today, 2:30 PM',
      status: 'completed'
    },
    {
      id: 3,
      type: 'parking',
      title: 'Parking Fee - Mall of Asia',
      amount: '-₱120.00',
      date: 'Yesterday, 8:45 PM',
      status: 'completed'
    },
    {
      id: 4,
      type: 'reward',
      title: 'Loyalty Reward',
      amount: '+₱25.00',
      date: 'Dec 18, 11:20 AM',
      status: 'completed'
    },
    {
      id: 5,
      type: 'parking',
      title: 'Parking Fee - Glorietta 3',
      amount: '-₱65.00',
      date: 'Dec 18, 1:15 PM',
      status: 'completed'
    }
  ];

  const paymentMethods = [
    {
      name: 'GCash',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-500',
      connected: true
    },
    {
      name: 'Maya',
      icon: CreditCard,
      color: 'from-green-500 to-emerald-500',
      connected: true
    },
    {
      name: 'GoTyme',
      icon: Building,
      color: 'from-purple-500 to-pink-500',
      connected: false
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'parking':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'topup':
      case 'reward':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-gray-500" />;
    }
  };

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
              <h1 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>E-Wallet</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Manage your balance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <Card className={`bg-gradient-to-r ${darkMode ? 'from-blue-800 to-cyan-700' : 'from-blue-600 to-cyan-500'} text-white rounded-3xl p-6 shadow-xl shadow-blue-500/20`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100 mb-1">Current Balance</p>
              <h2 className="text-4xl font-black">₱2,350.50</h2>
            </div>
            <Wallet className="w-10 h-10 text-blue-200" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-white/20 text-white border-white/30 hover:bg-white/30 rounded-2xl py-3">
              <Plus className="w-4 h-4 mr-2" />
              Top Up
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 rounded-2xl py-3"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className={`rounded-2xl p-4 shadow-lg ${darkMode ? 'bg-slate-800 border-slate-700' : 'shadow-gray-200/50'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Payment Methods</h3>
            <Button variant="ghost" size="sm" className={`text-blue-600 ${darkMode ? 'hover:bg-slate-700' : ''}`}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center`}>
                  <method.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{method.name}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {method.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
                <Badge 
                  className={`${method.connected 
                    ? (darkMode ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-800 border-green-200')
                    : (darkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-200')
                  } border text-xs`}
                >
                  {method.connected ? 'Active' : 'Setup'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className={`rounded-2xl p-4 shadow-lg ${darkMode ? 'bg-slate-800 border-slate-700' : 'shadow-gray-200/50'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h3>
            <Button variant="ghost" size="sm" className={`${darkMode ? 'text-gray-400 hover:text-white hover:bg-slate-700' : 'text-gray-600'}`}>
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'} transition-colors cursor-pointer`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{transaction.title}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.amount.startsWith('+') 
                      ? 'text-green-500' 
                      : (darkMode ? 'text-red-400' : 'text-red-500')
                  }`}>
                    {transaction.amount}
                  </p>
                  <Badge className={`${darkMode ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-green-100 text-green-800 border-green-200'} border text-xs mt-1`}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className={`rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'shadow-gray-200/50 hover:bg-gray-50'}`}>
            <div className="text-center space-y-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <Plus className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top Up</h4>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add funds</p>
              </div>
            </div>
          </Card>

          <Card className={`rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'shadow-gray-200/50 hover:bg-gray-50'}`}>
            <div className="text-center space-y-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                <CreditCard className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <div>
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Auto Top-up</h4>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Set up auto reload</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}