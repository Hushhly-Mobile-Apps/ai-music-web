import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Music, Zap, User, Home } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/studio', label: 'EDM Studio', icon: Music },
  { path: '/text-to-remix', label: 'Text-to-Remix', icon: Zap },
  { path: '/dashboard', label: 'Dashboard', icon: User }];


  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-green-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              AI Music Web
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path) ?
                  'bg-green-500/20 text-green-400 shadow-lg shadow-green-500/25' :
                  'text-gray-300 hover:text-white hover:bg-gray-800/50'}`
                  }>

                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>);

            })}
          </div>

          {/* Credits Display */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-800 rounded-full">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">10 credits</span>
            </div>
            <Button
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/20">

              Upgrade
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>

            {isMenuOpen ?
            <X className="h-6 w-6" /> :

            <Menu className="h-6 w-6" />
            }
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen &&
        <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.path) ?
                'bg-green-500/20 text-green-400' :
                'text-gray-300 hover:text-white hover:bg-gray-800/50'}`
                }
                onClick={() => setIsMenuOpen(false)}>

                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>);

          })}
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-300">10 credits</span>
              </div>
              <Button
              variant="outline"
              size="sm"
              className="border-green-500 text-green-400 hover:bg-green-500/20">

                Upgrade
              </Button>
            </div>
          </div>
        }
      </div>
    </nav>);

};

export default Navigation;