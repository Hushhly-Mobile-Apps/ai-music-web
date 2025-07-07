import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Load,
  Star,
  Heart,
  Share2,
  Download,
  Upload,
  Music,
  Zap,
  Settings,
  Users,
  TrendingUp,
  Clock } from
'lucide-react';
import { toast } from 'sonner';

interface EDMPreset {
  id: string;
  name: string;
  genre: string;
  mood: string;
  bpm: number;
  keySignature: string;
  effects: string[];
  complexity: 'simple' | 'medium' | 'complex' | 'experimental';
  mixingStyle: 'clean' | 'compressed' | 'saturated' | 'vintage';
  arrangeStyle: 'intro-buildup-drop-outro' | 'verse-chorus' | 'continuous-mix' | 'experimental';
  isPublic: boolean;
  usageCount: number;
  rating?: number;
  isFavorite?: boolean;
  createdBy?: string;
  createdAt: string;
  tags: string[];
}

interface EDMPresetManagerProps {
  currentSettings?: Partial<EDMPreset>;
  onLoadPreset?: (preset: EDMPreset) => void;
  onSavePreset?: (preset: Omit<EDMPreset, 'id' | 'createdAt' | 'usageCount'>) => void;
  className?: string;
}

const EDMPresetManager = ({
  currentSettings,
  onLoadPreset,
  onSavePreset,
  className = ''
}: EDMPresetManagerProps) => {
  const [presets, setPresets] = useState<EDMPreset[]>([]);
  const [filteredPresets, setFilteredPresets] = useState<EDMPreset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'usage' | 'recent'>('recent');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetTags, setNewPresetTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const genres = [
  'progressive-house', 'future-bass', 'big-room', 'techno', 'trance',
  'dubstep', 'trap', 'hardstyle', 'deep-house', 'electro'];


  const moods = [
  'uplifting', 'dark', 'chill', 'energetic', 'ethereal', 'aggressive'];


  const defaultPresets: EDMPreset[] = [
  {
    id: 'preset-1',
    name: 'Festival Anthem',
    genre: 'big-room',
    mood: 'uplifting',
    bpm: 128,
    keySignature: 'C major',
    effects: ['reverb', 'chorus', 'delay', 'compressor'],
    complexity: 'complex',
    mixingStyle: 'compressed',
    arrangeStyle: 'intro-buildup-drop-outro',
    isPublic: true,
    usageCount: 147,
    rating: 4.8,
    isFavorite: false,
    createdBy: 'AI_SYSTEM',
    createdAt: '2024-01-15',
    tags: ['festival', 'mainstage', 'crowd-pleaser']
  },
  {
    id: 'preset-2',
    name: 'Dark Underground',
    genre: 'techno',
    mood: 'dark',
    bpm: 132,
    keySignature: 'A minor',
    effects: ['filter', 'distortion', 'delay'],
    complexity: 'medium',
    mixingStyle: 'saturated',
    arrangeStyle: 'continuous-mix',
    isPublic: true,
    usageCount: 89,
    rating: 4.5,
    isFavorite: false,
    createdBy: 'AI_SYSTEM',
    createdAt: '2024-01-10',
    tags: ['underground', 'minimal', 'driving']
  },
  {
    id: 'preset-3',
    name: 'Emotional Journey',
    genre: 'trance',
    mood: 'ethereal',
    bpm: 138,
    keySignature: 'F# major',
    effects: ['reverb', 'chorus', 'delay', 'phaser'],
    complexity: 'complex',
    mixingStyle: 'clean',
    arrangeStyle: 'verse-chorus',
    isPublic: true,
    usageCount: 203,
    rating: 4.9,
    isFavorite: true,
    createdBy: 'AI_SYSTEM',
    createdAt: '2024-01-20',
    tags: ['emotional', 'uplifting', 'melodic']
  },
  {
    id: 'preset-4',
    name: 'Bass Heavy Drop',
    genre: 'dubstep',
    mood: 'aggressive',
    bpm: 145,
    keySignature: 'D minor',
    effects: ['distortion', 'filter', 'bitcrusher'],
    complexity: 'experimental',
    mixingStyle: 'saturated',
    arrangeStyle: 'intro-buildup-drop-outro',
    isPublic: true,
    usageCount: 156,
    rating: 4.6,
    isFavorite: false,
    createdBy: 'AI_SYSTEM',
    createdAt: '2024-01-12',
    tags: ['bass', 'heavy', 'aggressive', 'dubstep']
  },
  {
    id: 'preset-5',
    name: 'Chill Vibes',
    genre: 'deep-house',
    mood: 'chill',
    bpm: 122,
    keySignature: 'Bb major',
    effects: ['reverb', 'chorus'],
    complexity: 'simple',
    mixingStyle: 'clean',
    arrangeStyle: 'continuous-mix',
    isPublic: true,
    usageCount: 92,
    rating: 4.3,
    isFavorite: false,
    createdBy: 'AI_SYSTEM',
    createdAt: '2024-01-08',
    tags: ['chill', 'relaxed', 'smooth']
  }];


  useEffect(() => {
    loadPresets();
  }, []);

  useEffect(() => {
    filterAndSortPresets();
  }, [presets, searchTerm, filterGenre, filterCategory, sortBy]);

  const loadPresets = async () => {
    setLoading(true);
    try {
      // Load user presets from database
      const { data, error } = await window.ezsite.apis.tablePage(25681, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: []
      });

      if (error) {
        console.error('Failed to load presets:', error);
        setPresets(defaultPresets);
        return;
      }

      const userPresets = data.List.map((preset: any) => ({
        id: preset.id.toString(),
        name: preset.preset_name,
        genre: preset.genre,
        mood: preset.mood,
        bpm: preset.bpm,
        keySignature: preset.key_signature,
        effects: JSON.parse(preset.effects || '[]'),
        complexity: 'medium',
        mixingStyle: 'clean',
        arrangeStyle: 'intro-buildup-drop-outro',
        isPublic: preset.is_public,
        usageCount: preset.usage_count,
        rating: 0,
        isFavorite: false,
        createdBy: preset.user_id,
        createdAt: new Date(preset.CreateTime).toISOString().split('T')[0],
        tags: []
      }));

      setPresets([...defaultPresets, ...userPresets]);
    } catch (error) {
      console.error('Error loading presets:', error);
      setPresets(defaultPresets);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPresets = () => {
    let filtered = presets.filter((preset) => {
      const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGenre = filterGenre === 'all' || preset.genre === filterGenre;
      const matchesCategory = filterCategory === 'all' ||
      filterCategory === 'favorites' && preset.isFavorite ||
      filterCategory === 'public' && preset.isPublic ||
      filterCategory === 'my-presets' && preset.createdBy !== 'AI_SYSTEM';

      return matchesSearch && matchesGenre && matchesCategory;
    });

    // Sort presets
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredPresets(filtered);
  };

  const handleLoadPreset = async (preset: EDMPreset) => {
    try {
      // Update usage count
      if (preset.createdBy !== 'AI_SYSTEM') {
        await window.ezsite.apis.tableUpdate(25681, {
          ID: parseInt(preset.id),
          usage_count: preset.usageCount + 1
        });
      }

      onLoadPreset?.(preset);
      toast.success(`Loaded preset: ${preset.name}`);
    } catch (error) {
      console.error('Error loading preset:', error);
      toast.error('Failed to load preset');
    }
  };

  const handleSavePreset = async () => {
    if (!newPresetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }

    if (!currentSettings) {
      toast.error('No current settings to save');
      return;
    }

    try {
      const newPreset = {
        name: newPresetName,
        genre: currentSettings.genre || 'progressive-house',
        mood: currentSettings.mood || 'energetic',
        bpm: currentSettings.bpm || 128,
        keySignature: currentSettings.keySignature || 'C major',
        effects: currentSettings.effects || ['reverb'],
        complexity: currentSettings.complexity || 'medium',
        mixingStyle: currentSettings.mixingStyle || 'clean',
        arrangeStyle: currentSettings.arrangeStyle || 'intro-buildup-drop-outro',
        isPublic,
        tags: newPresetTags.split(',').map((tag) => tag.trim()).filter((tag) => tag)
      };

      // Save to database
      const { error } = await window.ezsite.apis.tableCreate(25681, {
        preset_name: newPreset.name,
        genre: newPreset.genre,
        mood: newPreset.mood,
        bpm: newPreset.bpm,
        key_signature: newPreset.keySignature,
        effects: JSON.stringify(newPreset.effects),
        is_public: newPreset.isPublic,
        usage_count: 0,
        user_id: 'current_user' // This should be the actual user ID
      });

      if (error) {
        throw new Error(error);
      }

      onSavePreset?.(newPreset);
      toast.success(`Preset "${newPreset.name}" saved successfully!`);

      setShowSaveDialog(false);
      setNewPresetName('');
      setNewPresetTags('');
      setIsPublic(false);

      // Reload presets
      loadPresets();
    } catch (error) {
      console.error('Error saving preset:', error);
      toast.error('Failed to save preset');
    }
  };

  const toggleFavorite = (presetId: string) => {
    setPresets((prev) => prev.map((preset) =>
    preset.id === presetId ?
    { ...preset, isFavorite: !preset.isFavorite } :
    preset
    ));
    toast.success('Favorites updated');
  };

  const ratePreset = (presetId: string, rating: number) => {
    setPresets((prev) => prev.map((preset) =>
    preset.id === presetId ?
    { ...preset, rating } :
    preset
    ));
    toast.success(`Rated preset: ${rating} stars`);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':return 'border-blue-500 text-blue-400';
      case 'medium':return 'border-green-500 text-green-400';
      case 'complex':return 'border-orange-500 text-orange-400';
      case 'experimental':return 'border-red-500 text-red-400';
      default:return 'border-gray-500 text-gray-400';
    }
  };

  return (
    <Card className={`bg-gray-900 border-green-500/20 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">EDM Presets</h3>
            <Badge variant="outline" className="border-green-500 text-green-400">
              {filteredPresets.length} Available
            </Badge>
          </div>
          
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-semibold">
                <Save className="w-4 h-4 mr-2" />
                Save Preset
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Save New Preset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Preset Name</label>
                  <Input
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="Enter preset name..."
                    className="bg-gray-800 border-gray-700 text-white" />

                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Tags (comma separated)</label>
                  <Input
                    value={newPresetTags}
                    onChange={(e) => setNewPresetTags(e.target.value)}
                    placeholder="festival, mainstage, uplifting..."
                    className="bg-gray-800 border-gray-700 text-white" />

                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="public"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-gray-700" />

                  <label htmlFor="public" className="text-sm text-gray-400">
                    Make this preset public
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSavePreset} className="flex-1">
                    Save Preset
                  </Button>
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search presets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white" />

          
          <Select value={filterGenre} onValueChange={setFilterGenre}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white">All Genres</SelectItem>
              {genres.map((genre) =>
              <SelectItem key={genre} value={genre} className="text-white">
                  {genre.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all" className="text-white">All Presets</SelectItem>
              <SelectItem value="favorites" className="text-white">Favorites</SelectItem>
              <SelectItem value="public" className="text-white">Public</SelectItem>
              <SelectItem value="my-presets" className="text-white">My Presets</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="recent" className="text-white">Most Recent</SelectItem>
              <SelectItem value="rating" className="text-white">Highest Rated</SelectItem>
              <SelectItem value="usage" className="text-white">Most Used</SelectItem>
              <SelectItem value="name" className="text-white">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Presets Grid */}
        {loading ?
        <div className="text-center py-12">
            <motion.div
            className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>

              <Settings className="w-8 h-8 text-green-400" />
            </motion.div>
            <p className="text-green-400 font-semibold">Loading Presets...</p>
          </div> :
        filteredPresets.length === 0 ?
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400">No presets found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredPresets.map((preset, index) =>
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-green-500/50 transition-all">

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold truncate">{preset.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                          {preset.genre.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className={`${getComplexityColor(preset.complexity)} text-xs`}>
                          {preset.complexity}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavorite(preset.id)}
                    className={`h-8 w-8 p-0 ${preset.isFavorite ? 'text-red-400' : 'text-gray-400'}`}>

                        <Heart className={`w-4 h-4 ${preset.isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                      {preset.isPublic &&
                  <Share2 className="w-4 h-4 text-blue-400" />
                  }
                    </div>
                  </div>

                  {/* Preset Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">BPM:</span>
                      <span className="text-white">{preset.bpm}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Key:</span>
                      <span className="text-white">{preset.keySignature}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Mood:</span>
                      <span className="text-white">{preset.mood}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {preset.usageCount} uses
                    </div>
                    {preset.rating &&
                <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {preset.rating.toFixed(1)}
                      </div>
                }
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {preset.createdAt}
                    </div>
                  </div>

                  {/* Tags */}
                  {preset.tags.length > 0 &&
              <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {preset.tags.slice(0, 3).map((tag, index) =>
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-gray-600 text-gray-400 text-xs">

                            {tag}
                          </Badge>
                  )}
                        {preset.tags.length > 3 &&
                  <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                            +{preset.tags.length - 3}
                          </Badge>
                  }
                      </div>
                    </div>
              }

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                  size="sm"
                  onClick={() => handleLoadPreset(preset)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-black">

                      <Load className="w-3 h-3 mr-1" />
                      Load
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) =>
                  <button
                    key={star}
                    onClick={() => ratePreset(preset.id, star)}
                    className={`w-3 h-3 ${
                    star <= (preset.rating || 0) ?
                    'text-yellow-400' :
                    'text-gray-600'}`
                    }>

                          <Star
                      className={`w-3 h-3 ${
                      star <= (preset.rating || 0) ? 'fill-current' : ''}`
                      } />

                        </button>
                  )}
                    </div>
                  </div>
                </motion.div>
            )}
            </AnimatePresence>
          </div>
        }
      </CardContent>
    </Card>);

};

export default EDMPresetManager;