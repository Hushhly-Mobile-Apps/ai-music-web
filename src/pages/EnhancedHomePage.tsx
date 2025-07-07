
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Waveform, 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Plus,
  Headphones,
  Sparkles,
  User,
  PlayCircle,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import EDMVariationService from '@/services/EDMVariationService';

interface RemixCard {
  id: number;
  remix_title: string;
  genre: string;
  user_id: number;
  cover_image_id: number | null;
  likes_count: number;
  plays_count: number;
  created_at: string;
  audio_file_id: number;
  prompt_text: string;
  duration: number;
}

const EnhancedHomePage: React.FC = () => {
  const [recentRemixes, setRecentRemixes] = useState<RemixCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const mockRemixes: RemixCard[] = [
    {
      id: 1,
      remix_title: "Neon Dreams",
      genre: "Pop",
      user_id: 1,
      cover_image_id: null,
      likes_count: 42,
      plays_count: 156,
      created_at: new Date().toISOString(),
      audio_file_id: 1,
      prompt_text: "Uplifting pop track with neon vibes",
      duration: 185
    },
    {
      id: 2,
      remix_title: "Bass Overdrive",
      genre: "EDM Remix",
      user_id: 2,
      cover_image_id: null,
      likes_count: 89,
      plays_count: 234,
      created_at: new Date().toISOString(),
      audio_file_id: 2,
      prompt_text: "Heavy bass EDM with driving beats",
      duration: 210
    },
    {
      id: 3,
      remix_title: "Midnight Cypher",
      genre: "Hip-Hop",
      user_id: 3,
      cover_image_id: null,
      likes_count: 67,
      plays_count: 189,
      created_at: new Date().toISOString(),
      audio_file_id: 3,
      prompt_text: "Late night hip-hop vibes",
      duration: 195
    },
    {
      id: 4,
      remix_title: "Echoes of Tomorrow",
      genre: "Synthwave",
      user_id: 4,
      cover_image_id: null,
      likes_count: 123,
      plays_count: 345,
      created_at: new Date().toISOString(),
      audio_file_id: 4,
      prompt_text: "Futuristic synthwave journey",
      duration: 220
    },
    {
      id: 5,
      remix_title: "Glitch Harmony",
      genre: "Electronic Rock",
      user_id: 5,
      cover_image_id: null,
      likes_count: 78,
      plays_count: 167,
      created_at: new Date().toISOString(),
      audio_file_id: 5,
      prompt_text: "Electronic rock with glitch elements",
      duration: 180
    },
    {
      id: 6,
      remix_title: "Lo-Fi Serenity",
      genre: "Chill Lo-Fi",
      user_id: 6,
      cover_image_id: null,
      likes_count: 156,
      plays_count: 423,
      created_at: new Date().toISOString(),
      audio_file_id: 6,
      prompt_text: "Peaceful lo-fi for relaxation",
      duration: 165
    }
  ];

  const coverImages = [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1690650025133-f25598a4de68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxBJTIwcGhvdG9ncmFwaCUyMG9mJTIwYSUyMHNlcmVuZSUyMGFuZCUyMHBpY3R1cmVzcXVlJTIwbmF0dXJhbCUyMGxhbmRzY2FwZSUyQyUyMHNob3djYXNpbmclMjBhJTIwdHJhbnF1aWwlMjBlbnZpcm9ubWVudCUyMHdpdGglMjB2aWJyYW50JTIwY29sb3JzJTIwYW5kJTIwYSUyMHBlYWNlZnVsJTIwYXRtb3NwaGVyZS58ZW58MHx8fHwxNzUxODcyMTI3fDA&ixlib=rb-4.1.0&q=80&w=200$w=400",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1701015107824-b01799e77873?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxBJTIwc2VyZW5lJTIwYW5kJTIwcGljdHVyZXNxdWUlMjBuYXR1cmFsJTIwbGFuZHNjYXBlJTIwc2hvd2Nhc2luZyUyMHZpYnJhbnQlMjBjb2xvcnMlMjBhbmQlMjBhJTIwdHJhbnF1aWwlMjBhdG1vc3BoZXJlLnxlbnwwfHx8fDE3NTE4NzIxMjh8MA&ixlib=rb-4.1.0&q=80&w=200$w=400",
    "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
  ];

  useEffect(() => {
    loadRecentRemixes();
  }, []);

  const loadRecentRemixes = async () => {
    try {
      const edmService = EDMVariationService.getInstance();
      const remixes = await edmService.getRecentRemixes(undefined, 12);
      
      if (remixes.length > 0) {
        setRecentRemixes(remixes);
      } else {
        // Use mock data if no real remixes
        setRecentRemixes(mockRemixes);
      }
    } catch (error) {
      console.error('Error loading remixes:', error);
      setRecentRemixes(mockRemixes);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (trackId: number) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  const handleLike = (trackId: number) => {
    const newLikedTracks = new Set(likedTracks);
    if (likedTracks.has(trackId)) {
      newLikedTracks.delete(trackId);
      toast.success('Removed from favorites');
    } else {
      newLikedTracks.add(trackId);
      toast.success('Added to favorites');
    }
    setLikedTracks(newLikedTracks);
  };

  const handleShare = (track: RemixCard) => {
    navigator.clipboard.writeText(`Check out "${track.remix_title}" - ${track.genre}`);
    toast.success('Link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white">Loading remixes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            AI-Powered Music Creation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Remix songs into EDM beats or generate unique audio from text using Composition converter.
          </p>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {/* Remix Song AI */}
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/20 overflow-hidden group hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Remix Song AI</h3>
                  <p className="text-gray-300">
                    Transform any song into an EDM remix with AI-powered creativity. Upload, remix, and enjoy!
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Music className="w-8 h-8 text-white" />
                </div>
              </div>
              <Button 
                onClick={() => navigate('/studio')}
                className="bg-slate-800 hover:bg-slate-700 text-white border-none"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Create remix
              </Button>
            </CardContent>
          </Card>

          {/* Text-to-Audio */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20 overflow-hidden group hover:scale-105 transition-transform duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Text-to-Audio</h3>
                  <p className="text-gray-300">
                    Convert your text into AI-generated music or vocals. Simply enter text and let AI create the sound!
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Waveform className="w-8 h-8 text-white" />
                </div>
              </div>
              <Button 
                onClick={() => navigate('/text-to-remix')}
                className="bg-slate-800 hover:bg-slate-700 text-white border-none"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Audio
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Remixes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Recent Remixes</h2>
              <p className="text-gray-400">Here is the list of your recent remixes</p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-slate-800 hover:bg-slate-700 text-white"
            >
              View All
            </Button>
          </div>

          {/* Remixes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentRemixes.map((remix, index) => (
              <motion.div
                key={remix.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300">
                  <div className="relative">
                    <div 
                      className="w-full h-48 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center relative overflow-hidden"
                      style={{
                        backgroundImage: `url(${coverImages[index % coverImages.length]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative flex items-center gap-4">
                        <Button
                          size="icon"
                          onClick={() => handlePlayPause(remix.id)}
                          className={`w-12 h-12 rounded-full ${
                            playingTrack === remix.id
                              ? 'bg-cyan-500 hover:bg-cyan-600'
                              : 'bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          {playingTrack === remix.id ? 
                            <Pause className="w-6 h-6" /> : 
                            <Play className="w-6 h-6" />
                          }
                        </Button>
                      </div>
                      
                      {/* Top-right actions */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleLike(remix.id)}
                          className={`w-8 h-8 ${
                            likedTracks.has(remix.id) 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-white/70 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedTracks.has(remix.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{remix.remix_title}</h3>
                          <p className="text-gray-400 text-sm">{remix.genre}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleShare(remix)}
                            className="w-8 h-8 text-gray-400 hover:text-white"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <User className="w-3 h-3 mr-1" />
                        <span className="mr-4">Wade Warren</span>
                        <span>{remix.likes_count} likes • {remix.plays_count} plays</span>
                      </div>

                      {/* Action Menu */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-2 text-sm">
                          <div className="flex items-center gap-3">
                            <button className="text-gray-300 hover:text-white flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              Generate remix
                            </button>
                            <button className="text-gray-300 hover:text-white flex items-center gap-1">
                              <Plus className="w-4 h-4" />
                              Add to Playlist
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="text-gray-300 hover:text-white">
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleShare(remix)}
                              className="text-gray-300 hover:text-white"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Show second row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {recentRemixes.map((remix, index) => (
              <motion.div
                key={`row2-${remix.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (0.1 * index) }}
                className="group"
              >
                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden hover:bg-slate-800/70 transition-all duration-300">
                  <div className="relative">
                    <div 
                      className="w-full h-48 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center relative overflow-hidden"
                      style={{
                        backgroundImage: `url(${coverImages[(index + 3) % coverImages.length]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative flex items-center gap-4">
                        <Button
                          size="icon"
                          onClick={() => handlePlayPause(remix.id + 100)}
                          className={`w-12 h-12 rounded-full ${
                            playingTrack === remix.id + 100
                              ? 'bg-cyan-500 hover:bg-cyan-600'
                              : 'bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          {playingTrack === remix.id + 100 ? 
                            <Pause className="w-6 h-6" /> : 
                            <Play className="w-6 h-6" />
                          }
                        </Button>
                      </div>
                      
                      <div className="absolute top-3 right-3 flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleLike(remix.id + 100)}
                          className={`w-8 h-8 ${
                            likedTracks.has(remix.id + 100) 
                              ? 'text-red-500 hover:text-red-600' 
                              : 'text-white/70 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedTracks.has(remix.id + 100) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{remix.remix_title}</h3>
                          <p className="text-gray-400 text-sm">{remix.genre}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleShare(remix)}
                            className="w-8 h-8 text-gray-400 hover:text-white"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <User className="w-3 h-3 mr-1" />
                        <span className="mr-4">Wade Warren</span>
                        <span>{remix.likes_count} likes • {remix.plays_count} plays</span>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex items-center justify-between bg-slate-700/50 rounded-lg p-2 text-sm">
                          <div className="flex items-center gap-3">
                            <button className="text-gray-300 hover:text-white flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              Generate remix
                            </button>
                            <button className="text-gray-300 hover:text-white flex items-center gap-1">
                              <Plus className="w-4 h-4" />
                              Add to Playlist
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="text-gray-300 hover:text-white">
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleShare(remix)}
                              className="text-gray-300 hover:text-white"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 mb-8"
        >
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <Headphones className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Ready to create your next hit?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of artists creating amazing music with AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/studio')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3"
              >
                Start Creating
              </Button>
              <Button 
                onClick={() => navigate('/subscription')}
                variant="outline" 
                className="border-slate-600 text-white hover:bg-slate-800 px-8 py-3"
              >
                View Plans
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnhancedHomePage;
