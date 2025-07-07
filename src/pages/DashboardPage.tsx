import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Trash2, Download, Clock, Zap, RefreshCw } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';

interface AudioTrack {
  ID: number;
  title: string;
  prompt: string;
  genre: string;
  mood: string;
  duration: number;
  generation_type: string;
  parameters: string;
  status: string;
  CreateTime: string;
}

const DashboardPage = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await window.ezsite.apis.tablePage(25665, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "CreateTime",
        IsAsc: false,
        Filters: []
      });

      if (error) {
        throw error;
      }

      setTracks(data?.List || []);
    } catch (error) {
      console.error('Error loading tracks:', error);
      toast.error('Failed to load generated tracks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrack = async (trackId: number) => {
    try {
      const { error } = await window.ezsite.apis.tableDelete(25665, { ID: trackId });
      if (error) {
        throw error;
      }

      setTracks(tracks.filter(track => track.ID !== trackId));
      toast.success('Track deleted successfully');
    } catch (error) {
      console.error('Error deleting track:', error);
      toast.error('Failed to delete track');
    }
  };

  const handleDownloadTrack = (track: AudioTrack) => {
    // In a real implementation, this would download the actual audio file
    toast.success(`Download started for: ${track.title}`);
  };

  const getFilteredTracks = () => {
    switch (activeTab) {
      case 'remix':
        return tracks.filter(track => track.generation_type === 'remix');
      case 'text-to-audio':
        return tracks.filter(track => track.generation_type === 'text-to-audio');
      case 'completed':
        return tracks.filter(track => track.status === 'completed');
      case 'generating':
        return tracks.filter(track => track.status === 'generating');
      default:
        return tracks;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'generating':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'remix':
        return <Music className="w-4 h-4" />;
      case 'text-to-audio':
        return <Zap className="w-4 h-4" />;
      default:
        return <Music className="w-4 h-4" />;
    }
  };

  const filteredTracks = getFilteredTracks();

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
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Your Generated Tracks
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                View and manage all your AI-generated EDM tracks in one place
              </p>
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {tracks.length} Total Tracks
                </Badge>
                <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                  {tracks.filter(t => t.status === 'completed').length} Completed
                </Badge>
              </div>
              <Button
                onClick={loadTracks}
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-500/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-gray-900">
                <TabsTrigger value="all" className="data-[state=active]:bg-green-500/20">
                  All Tracks
                </TabsTrigger>
                <TabsTrigger value="remix" className="data-[state=active]:bg-green-500/20">
                  Remixes
                </TabsTrigger>
                <TabsTrigger value="text-to-audio" className="data-[state=active]:bg-green-500/20">
                  Text-to-Audio
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-green-500/20">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="generating" className="data-[state=active]:bg-green-500/20">
                  Generating
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    <span className="ml-3 text-gray-400">Loading tracks...</span>
                  </div>
                ) : filteredTracks.length === 0 ? (
                  <Card className="bg-gray-900 border-gray-700">
                    <CardContent className="text-center py-12">
                      <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">No Tracks Found</h3>
                      <p className="text-gray-500">
                        {activeTab === 'all' 
                          ? 'Start generating your first AI EDM track!' 
                          : `No ${activeTab.replace('-', ' ')} tracks found.`
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {filteredTracks.map((track) => (
                      <Card key={track.ID} className="bg-gray-900 border-gray-700 hover:border-green-500/50 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-2 text-green-400">
                                  {getTypeIcon(track.generation_type)}
                                  <h3 className="text-lg font-semibold text-white">{track.title}</h3>
                                </div>
                                <Badge className={getStatusColor(track.status)}>
                                  {track.status}
                                </Badge>
                                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                                  {track.genre}
                                </Badge>
                                <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                                  {track.mood}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-400 text-sm mb-3 max-w-2xl">
                                {track.prompt}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatDuration(track.duration)}
                                </div>
                                <span>•</span>
                                <span>{formatDate(track.CreateTime)}</span>
                                <span>•</span>
                                <span className="capitalize">{track.generation_type.replace('-', ' ')}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 ml-4">
                              {track.status === 'completed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDownloadTrack(track)}
                                  className="border-green-500 text-green-400 hover:bg-green-500/20"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteTrack(track.ID)}
                                className="border-red-500 text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
