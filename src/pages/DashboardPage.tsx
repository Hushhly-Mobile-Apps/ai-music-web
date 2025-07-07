import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Music, Play, Calendar, Trash2, Settings, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import AudioPlayer from '@/components/AudioPlayer';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('remixes');

  const remixHistory = [
    {
      id: 1,
      title: 'Summer Vibes Remix',
      originalTitle: 'Summer Vibes',
      genre: 'Future Bass',
      createdAt: '2024-01-15',
      duration: '3:45',
      status: 'completed',
      audioUrl: 'demo-track.mp3'
    },
    {
      id: 2,
      title: 'Neon Dreams EDM',
      originalTitle: 'Original Upload',
      genre: 'Progressive House',
      createdAt: '2024-01-14',
      duration: '4:12',
      status: 'completed',
      audioUrl: 'demo-track.mp3'
    },
    {
      id: 3,
      title: 'Dark Techno Anthem',
      originalTitle: 'AI Generated',
      genre: 'Techno',
      createdAt: '2024-01-13',
      duration: '5:23',
      status: 'completed',
      audioUrl: 'demo-track.mp3'
    }
  ];

  const accountStats = {
    totalRemixes: 23,
    creditsUsed: 15,
    creditsRemaining: 10,
    totalDownloads: 18,
    memberSince: 'January 2024'
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xl text-gray-300">
                Manage your remixes, downloads, and account settings
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-900 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Remixes</p>
                      <p className="text-2xl font-bold text-green-400">{accountStats.totalRemixes}</p>
                    </div>
                    <Music className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Credits Left</p>
                      <p className="text-2xl font-bold text-yellow-400">{accountStats.creditsRemaining}</p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Downloads</p>
                      <p className="text-2xl font-bold text-cyan-400">{accountStats.totalDownloads}</p>
                    </div>
                    <Download className="w-8 h-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Member Since</p>
                      <p className="text-lg font-bold text-white">{accountStats.memberSince}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-gray-900 border border-green-500/20">
                <TabsTrigger 
                  value="remixes"
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                >
                  My Remixes
                </TabsTrigger>
                <TabsTrigger 
                  value="settings"
                  className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="remixes" className="space-y-6">
                <div className="grid gap-6">
                  {remixHistory.map((remix) => (
                    <Card key={remix.id} className="bg-gray-900 border-green-500/20">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-white">{remix.title}</h3>
                              <Badge variant="outline" className="border-green-500/50 text-green-400">
                                {remix.genre}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>From: {remix.originalTitle}</span>
                              <span>•</span>
                              <span>{remix.duration}</span>
                              <span>•</span>
                              <span>{remix.createdAt}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="grid gap-6">
                  <Card className="bg-gray-900 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Settings className="w-5 h-5" />
                        <span>Account Settings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Email</label>
                          <p className="text-white">user@example.com</p>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Plan</label>
                          <p className="text-white">Free Trial</p>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          className="border-green-500 text-green-400 hover:bg-green-500/20"
                        >
                          Update Profile
                        </Button>
                        <Button
                          className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold"
                        >
                          Upgrade to Pro
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Usage & Billing</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Credits Used</label>
                          <p className="text-white">{accountStats.creditsUsed} / 25</p>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Next Reset</label>
                          <p className="text-white">January 31, 2024</p>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Free Plan</span>
                          <span className="text-green-400 font-semibold">$0/month</span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: `${(accountStats.creditsUsed / 25) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {accountStats.creditsRemaining} credits remaining
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;