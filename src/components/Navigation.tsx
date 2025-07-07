
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Music, 
  Mic, 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  CreditCard,
  Menu,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface UserInfo {
  ID: number;
  Name: string;
  Email: string;
  CreateTime: string;
}

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/studio', label: 'Studio', icon: Music },
    { path: '/text-to-remix', label: 'Text to Remix', icon: Mic },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await window.ezsite.apis.getUserInfo();
      if (response.data && !response.error) {
        setUser(response.data);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await window.ezsite.apis.logout();
      if (response.error) {
        toast.error('Logout failed');
      } else {
        setUser(null);
        toast.success('Logged out successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const handleSubscription = () => {
    navigate('/subscription');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AI Studio</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Auth Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-b-2 border-cyan-500"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-slate-800 rounded-full">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">50 credits</span>
                </div>
                <Button
                  onClick={handleSubscription}
                  variant="ghost"
                  className="text-gray-300 hover:text-white flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Subscription
                </Button>
                <div className="relative group">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    {user.Name || user.Email.split('@')[0]}
                  </Button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-md shadow-lg border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-400 border-b border-slate-700">
                        {user.Email}
                      </div>
                      <button
                        onClick={handleSubscription}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Button
                  onClick={handleLogin}
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  Log In
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 rounded-b-lg mt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-slate-700 pt-3 mt-3">
                {user ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm text-gray-400">
                      Signed in as {user.Email}
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">50 credits</span>
                    </div>
                    <button
                      onClick={() => {
                        handleSubscription();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Subscription
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        handleLogin();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        handleSignUp();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-base font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-md"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
