
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  Star, 
  Check, 
  Music, 
  Headphones, 
  Sparkles,
  Calendar,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  remixes: number;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
}

interface UserSubscription {
  id: number;
  user_id: number;
  plan_type: string;
  credits_remaining: number;
  subscription_status: string;
  billing_cycle: string;
  next_billing_date: string;
  created_at: string;
  updated_at: string;
}

const SubscriptionManager: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: billingCycle === 'monthly' ? 0 : 0,
      credits: 50,
      remixes: 50,
      features: [
        '50 credits/month',
        '50 remixes conversions',
        'Basic AI Remixing Features',
        'Limited Editing Options'
      ],
      icon: <Music className="w-6 h-6" />,
      gradient: 'from-slate-500 to-slate-700'
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: billingCycle === 'monthly' ? 80 : 800,
      credits: 400,
      remixes: 400,
      features: [
        '400 credits/month',
        '400 remixes conversions',
        'Advanced AI Remixing Features',
        'Enhanced Editing Options',
        'Custom BPM Settings',
        'Genre Customization'
      ],
      popular: true,
      icon: <Headphones className="w-6 h-6" />,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: billingCycle === 'monthly' ? 200 : 2000,
      credits: 1000,
      remixes: 1000,
      features: [
        '1000 credits/month',
        '1000 remixes conversions',
        'Professional AI Remixing Features',
        'Unlimited Editing Options',
        'Advanced Sound Design',
        'Collaboration Tools',
        'Priority Support',
        'Commercial License'
      ],
      icon: <Crown className="w-6 h-6" />,
      gradient: 'from-purple-500 to-pink-600'
    }
  ];

  useEffect(() => {
    loadUserSubscription();
  }, []);

  const loadUserSubscription = async () => {
    try {
      const userInfo = await window.ezsite.apis.getUserInfo();
      if (userInfo.error || !userInfo.data) {
        setLoading(false);
        return;
      }

      const response = await window.ezsite.apis.tablePage(25685, {
        PageNo: 1,
        PageSize: 1,
        OrderByField: "created_at",
        IsAsc: false,
        Filters: [{ name: "user_id", op: "Equal", value: userInfo.data.ID }]
      });

      if (response.error) {
        console.error('Error loading subscription:', response.error);
      } else if (response.data.List.length > 0) {
        setCurrentPlan(response.data.List[0]);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId);
    
    try {
      const userInfo = await window.ezsite.apis.getUserInfo();
      if (userInfo.error || !userInfo.data) {
        toast.error('Please log in to upgrade your plan');
        return;
      }

      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      const subscriptionData = {
        user_id: userInfo.data.ID,
        plan_type: plan.name,
        credits_remaining: plan.credits,
        subscription_status: 'Active',
        billing_cycle: billingCycle === 'monthly' ? 'Monthly' : 'Yearly',
        next_billing_date: new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let response;
      if (currentPlan) {
        response = await window.ezsite.apis.tableUpdate(25685, {
          ID: currentPlan.id,
          ...subscriptionData
        });
      } else {
        response = await window.ezsite.apis.tableCreate(25685, subscriptionData);
      }

      if (response.error) {
        toast.error('Failed to upgrade plan: ' + response.error);
      } else {
        toast.success('Successfully upgraded to ' + plan.name);
        await loadUserSubscription();
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast.error('Failed to upgrade plan');
    } finally {
      setUpgrading(null);
    }
  };

  const getCurrentPlanType = () => {
    if (!currentPlan) return 'basic';
    return currentPlan.plan_type.toLowerCase().replace(' plan', '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upgrade Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Manage your plan, payments & credits in one place.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-slate-800 rounded-lg p-1 flex">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-2 rounded-md ${
                billingCycle === 'monthly' 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly Plan
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-2 rounded-md ${
                billingCycle === 'yearly' 
                  ? 'bg-cyan-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly Plan
            </Button>
          </div>
        </motion.div>

        {/* Current Plan Status */}
        {currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Current Plan Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-gray-400">Plan</p>
                    <p className="text-white font-semibold">{currentPlan.plan_type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Credits Remaining</p>
                    <p className="text-cyan-400 font-semibold">{currentPlan.credits_remaining}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status</p>
                    <Badge className={`${
                      currentPlan.subscription_status === 'Active' 
                        ? 'bg-green-500' 
                        : 'bg-red-500'
                    }`}>
                      {currentPlan.subscription_status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-400">Next Billing</p>
                    <p className="text-white font-semibold">
                      {new Date(currentPlan.next_billing_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const isCurrentPlan = getCurrentPlanType() === plan.id;
            const isUpgrading = upgrading === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`bg-slate-800 border-slate-700 h-full relative overflow-hidden ${
                  isCurrentPlan ? 'ring-2 ring-cyan-500' : ''
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5`} />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}>
                          {plan.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                          <p className="text-gray-400">{plan.credits} credits /Month</p>
                        </div>
                      </div>
                      {isCurrentPlan && (
                        <Badge className="bg-cyan-500 text-white">Active</Badge>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">
                          ${plan.price}
                        </span>
                        <span className="text-gray-400">/ Month</span>
                      </div>
                      {billingCycle === 'yearly' && plan.price > 0 && (
                        <p className="text-sm text-green-400 mt-1">
                          Save ${(plan.price * 12) - (plan.price * 10)} annually
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <div className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isCurrentPlan || isUpgrading}
                        className={`w-full ${
                          isCurrentPlan
                            ? 'bg-slate-600 text-gray-400 cursor-not-allowed'
                            : plan.popular
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        {isUpgrading ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Upgrading...
                          </div>
                        ) : isCurrentPlan ? (
                          'Active'
                        ) : (
                          plan.id === 'basic' ? 'Current Plan' : 'Upgrade Plan'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center bg-slate-800 rounded-2xl p-8 border border-slate-700"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Go Premium & Remix Like a Pro!
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get unlimited AI-powered remixes with high-quality EDM effects & exclusive sound packs!
          </p>
          <Button 
            onClick={() => handleUpgrade('pro')}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
          >
            Upgrade Now
          </Button>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400">
            Need help? Contact <span className="text-cyan-400 cursor-pointer hover:underline">[Support]</span> for any billing-related queries.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
