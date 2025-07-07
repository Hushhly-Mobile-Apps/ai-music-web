
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const response = await window.ezsite.apis.register({
        email: formData.email,
        password: formData.password
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Registration successful! Please check your email for verification.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-white rounded-full opacity-20"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full -ml-6"></div>
              <div className="w-6 h-6 bg-red-400 rounded-full -ml-4"></div>
              <div className="w-8 h-8 bg-green-400 rounded-full -ml-6"></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Create Account</h1>
            <p className="text-gray-300">
              Join thousands of artists creating amazing music with AI.
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-white mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, acceptTerms: !!checked }))
                }
                className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 mt-1"
              />
              <Label htmlFor="acceptTerms" className="text-sm text-gray-300 cursor-pointer leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
              </Label>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-3 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-gray-400">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Log In
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Right Side - Futuristic Image */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:flex flex-1 items-center justify-center p-8"
      >
        <div className="relative w-full h-full max-w-2xl max-h-2xl rounded-3xl overflow-hidden">
          <div 
            className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center relative"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=800&fit=crop)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-600/30"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            
            {/* Overlay Content */}
            <div className="relative z-10 text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <div className="w-10 h-10 bg-white rounded-full opacity-30"></div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Start Your Musical Journey
              </h2>
              <p className="text-gray-200 text-lg">
                Transform your ideas into professional-quality music with advanced AI technology.
              </p>
            </div>

            {/* Animated Elements */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
