import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IdeaSubmission, CategoryType, AgeGroup } from '../types';
import { 
  MapPin, 
  ThumbsUp, 
  ThumbsDown, 
  Filter, 
  Sparkles, 
  Building, 
  CheckCircle2, 
  ChevronRight,
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Map as MapIcon,
  Navigation2,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveTownMapProps {
  submissions?: IdeaSubmission[];
  onVote?: (id: string, type: 'up' | 'down') => void;
  onSelectSubmissionForDetails?: (submission: IdeaSubmission) => void;
  onSelectSubmission?: (submission: IdeaSubmission) => void;
  onOpenSubmitWithCoords?: (lat: number, lng: number, locationName: string) => void;
  onAddNewLocationIdea?: () => void;
}

// Yanai City Center Coordinates (Between Shirakabe Street & JR Yanai Station)
const YANAI_CENTER: [number, number] = [33.9665, 132.1055];
const DEFAULT_ZOOM = 16;

// Key Landmarks in Yanai City Center with Real Coordinates
const YANAI_LANDMARKS = [
  { 
    id: 'lm-1', 
    name: '白壁の町並み（重要伝統的建造物群保存地区）', 
    lat: 33.9682, 
    lng: 132.1078, 
    type: 'heritage', 
    desc: '江戸時代の商家の町並み・金魚ちょうちん発祥の地・国選定重伝建地区' 
  },
  { 
    id: 'lm-2', 
    name: 'JR柳井駅・駅前広場', 
    lat: 33.9626, 
    lng: 132.1025, 
    type: 'station', 
    desc: 'JR山陽本線・商業ターミナル・路線バスターミナル' 
  },
  { 
    id: 'lm-3', 
    name: '柳井川・親水水辺空間', 
    lat: 33.9655, 
    lng: 132.1050, 
    type: 'river', 
    desc: '水辺プロムナード・散策路・桜並木' 
  },
  { 
    id: 'lm-4', 
    name: 'やない西蔵（伝統工芸体験施設）', 
    lat: 33.9676, 
    lng: 132.1070, 
    type: 'facility', 
    desc: '金魚ちょうちん製作体験・柳井縞機織り・甘露醤油蔵' 
  },
  { 
    id: 'lm-5', 
    name: '柳井学園高等学校 / 山口県立柳井高校', 
    lat: 33.9715, 
    lng: 132.1040, 
    type: 'school', 
    desc: '生徒たちの通学拠点・地域探究活動連携' 
  },
  { 
    id: 'lm-6', 
    name: '柳井港（防予フェリー乗り場）', 
    lat: 33.9535, 
    lng: 132.1280, 
    type: 'port', 
    desc: '四国松山航路フェリー・周防大島連絡口' 
  }
];

// Available Map Tile Providers (100% Free, Official GSI & OpenStreetMap)
type MapTileLayer = 'gsi_std' | 'gsi_pale' | 'gsi_photo' | 'osm';

export const InteractiveTownMap: React.FC<InteractiveTownMapProps> = ({
  submissions = [],
  onVote,
  onSelectSubmissionForDetails,
  onSelectSubmission,
  onOpenSubmitWithCoords,
  onAddNewLocationIdea
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgeFilter, setSelectedAgeFilter] = useState<string>('all');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<MapTileLayer>('gsi_std');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM);
  const [clickedCoord, setClickedCoord] = useState<{ lat: number; lng: number } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const cardListRef = useRef<HTMLDivElement | null>(null);

  const safeSubmissions = submissions || [];

  // Filter submissions based on category and demographic
  const filteredSubmissions = useMemo(() => {
    return safeSubmissions.filter(sub => {
      if (selectedCategory !== 'all' && sub.category !== selectedCategory) return false;
      if (selectedAgeFilter === 'teens' && sub.ageGroup !== 'teens') return false;
      if (selectedAgeFilter === 'young' && sub.ageGroup !== 'twenties_thirties') return false;
      if (selectedAgeFilter === 'senior' && sub.ageGroup !== 'sixties_plus') return false;
      return true;
    });
  }, [safeSubmissions, selectedCategory, selectedAgeFilter]);

  const selectedItem = safeSubmissions.find(s => s.id === selectedPinId) || filteredSubmissions[0];

  const handleSelectDetails = (sub: IdeaSubmission) => {
    if (onSelectSubmissionForDetails) {
      onSelectSubmissionForDetails(sub);
    } else if (onSelectSubmission) {
      onSelectSubmission(sub);
    }
  };

  const handleVoteClick = (id: string, type: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVote) {
      onVote(id, type);
    }
    if (type === 'up') {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 }
      });
    }
  };

  const getCategoryBadge = (category: CategoryType) => {
    switch (category) {
      case 'value_creation':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">価値創造</span>;
      case 'improvement':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">改善点</span>;
      case 'youth_student':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">若者・高校生</span>;
      case 'traffic_walk':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">交通・回遊</span>;
      case 'downtown_buzz':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">まちなか賑わい</span>;
      case 'shirakabe_view':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">白壁・景観</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">地域提案</span>;
    }
  };

  const getPinColorHex = (category: CategoryType) => {
    switch (category) {
      case 'value_creation': return '#2563eb'; // blue-600
      case 'improvement': return '#d97706'; // amber-600
      case 'youth_student': return '#059669'; // emerald-600
      case 'traffic_walk': return '#7c3aed'; // purple-600
      case 'downtown_buzz': return '#e11d48'; // rose-600
      case 'shirakabe_view': return '#4338ca'; // indigo-700
      default: return '#0284c7'; // sky-600
    }
  };

  const getCategoryEmoji = (category: CategoryType) => {
    switch (category) {
      case 'youth_student': return '🏫';
      case 'value_creation': return '✨';
      case 'improvement': return '🛠';
      case 'traffic_walk': return '🚲';
      case 'downtown_buzz': return '🏮';
      case 'shirakabe_view': return '🏯';
      default: return '💡';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map if not created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: YANAI_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 13,
        maxZoom: 18,
        zoomControl: false // custom controls
      });

      // Layer group for markers
      const markerGroup = L.layerGroup().addTo(map);
      markersLayerGroupRef.current = markerGroup;

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      // Map Click Handler to plot ideas
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setClickedCoord({ lat, lng });
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup handled when unmounted
    };
  }, []);

  // Update Tile Layer when activeTileLayer changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = '';
    let attribution = '';
    let maxNativeZoom = 18;

    switch (activeTileLayer) {
      case 'gsi_std':
        // GSI Standard Map (Best with clear Japanese street / aza / chome names)
        url = 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png';
        attribution = '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noreferrer">国土地理院</a> (標準住宅・町字地図)';
        maxNativeZoom = 18;
        break;
      case 'gsi_pale':
        // GSI Pale Map (Light, high visibility for markers)
        url = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
        attribution = '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noreferrer">国土地理院</a> (淡色地図)';
        maxNativeZoom = 18;
        break;
      case 'gsi_photo':
        // GSI Seamless Aerial Photography
        url = 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg';
        attribution = '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noreferrer">国土地理院</a> (オルソ航空写真)';
        maxNativeZoom = 18;
        break;
      case 'osm':
        // OpenStreetMap
        url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';
        maxNativeZoom = 19;
        break;
    }

    const tileLayer = L.tileLayer(url, {
      attribution,
      maxZoom: 18,
      maxNativeZoom
    });

    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;
  }, [activeTileLayer]);

  // Update Markers whenever filteredSubmissions or selectedPinId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerGroup = markersLayerGroupRef.current;
    if (!map || !markerGroup) return;

    markerGroup.clearLayers();

    // 1. Add Yanai Key Landmarks
    YANAI_LANDMARKS.forEach(lm => {
      const isHeritage = lm.type === 'heritage';
      const isStation = lm.type === 'station';
      const isSchool = lm.type === 'school';
      
      const badgeBg = isHeritage ? '#312e81' : isStation ? '#1e293b' : isSchool ? '#065f46' : '#334155';
      const labelText = lm.name.split('（')[0].split('・')[0];

      const landmarkIcon = L.divIcon({
        className: 'custom-landmark-icon',
        html: `
          <div style="transform: translate(-50%, -100%); cursor: pointer;" class="group">
            <div style="background-color: ${badgeBg}; color: white; border: 1.5px solid rgba(255,255,255,0.85); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);" class="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
              <span>${labelText}</span>
            </div>
            <div style="width: 2px; height: 8px; background-color: ${badgeBg}; margin: 0 auto;"></div>
            <div style="width: 6px; height: 6px; border-radius: 9999px; background-color: #0f172a; border: 1.5px solid white; margin: 0 auto;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const lmMarker = L.marker([lm.lat, lm.lng], { icon: landmarkIcon });
      lmMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
          <div style="font-weight: bold; color: #0f172a; font-size: 13px; margin-bottom: 3px;">${lm.name}</div>
          <div style="font-size: 11px; color: #64748b; line-height: 1.4;">${lm.desc}</div>
        </div>
      `);
      markerGroup.addLayer(lmMarker);
    });

    // 2. Add Idea Submission Markers
    filteredSubmissions.forEach(sub => {
      const isSelected = selectedPinId === sub.id;
      const color = getPinColorHex(sub.category);
      const emoji = getCategoryEmoji(sub.category);

      const ideaIcon = L.divIcon({
        className: 'custom-idea-marker',
        html: `
          <div style="transform: translate(-50%, -100%); cursor: pointer; position: relative;" class="transition-transform duration-200 ${isSelected ? 'scale-125 z-40' : 'hover:scale-110 z-20'}">
            ${isSelected ? '<span style="position: absolute; inset: -4px; border-radius: 9999px; background-color: #fbbf24; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>' : ''}
            <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 9999px; border: 2.5px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: flex; items-center; justify-content: center; font-size: 14px; position: relative;">
              <span style="display: flex; align-items: center; justify-content: center; height: 100%;">${emoji}</span>
              <div style="position: absolute; bottom: -4px; right: -4px; background-color: #0f172a; color: white; font-size: 9px; font-weight: 800; padding: 0 4px; border-radius: 9999px; border: 1.5px solid white; line-height: 1.3;">
                ${sub.upvotes}
              </div>
            </div>
            <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${color}; margin: 0 auto;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const marker = L.marker([sub.lat, sub.lng], { icon: ideaIcon });

      marker.on('click', () => {
        setSelectedPinId(sub.id);
        // Scroll card into view
        const targetCard = document.getElementById(`idea-card-${sub.id}`);
        if (targetCard && cardListRef.current) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      // Bind popup with idea details
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 2px; max-width: 250px;">
          <div style="font-size: 10px; color: ${color}; font-weight: bold; margin-bottom: 2px;">
            ${sub.locationName}
          </div>
          <div style="font-weight: bold; color: #0f172a; font-size: 13px; margin-bottom: 4px; line-height: 1.3;">
            ${sub.title}
          </div>
          <div style="font-size: 11px; color: #475569; line-height: 1.4; margin-bottom: 8px; max-height: 60px; overflow: hidden; text-overflow: ellipsis;">
            ${sub.description}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 11px;">
            <span style="color: #64748b;">共感: <strong style="color: #2563eb;">${sub.upvotes}件</strong></span>
            <span style="color: #4f46e5; font-weight: bold; cursor: pointer;">詳細を見る &rarr;</span>
          </div>
        </div>
      `);

      markerGroup.addLayer(marker);
    });
  }, [filteredSubmissions, selectedPinId]);

  // Quick Area Jump
  const handleJumpTo = (lat: number, lng: number, zoomLevel: number = 17) => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([lat, lng], zoomLevel, { duration: 1.2 });
    }
  };

  // Reset View to Yanai Center
  const handleResetView = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(YANAI_CENTER, DEFAULT_ZOOM, { duration: 1 });
      setSelectedPinId(null);
    }
  };

  // Zoom in / Zoom out handlers
  const handleZoomIn = () => {
    const map = mapInstanceRef.current;
    if (map) map.zoomIn();
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current;
    if (map) map.zoomOut();
  };

  // Invalidate map size when fullscreen mode toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  return (
    <section id="town-map-section" className="space-y-6">
      
      {/* Section Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold mb-2 border border-blue-200">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>柳井市まちなか アイデアプロットマップ</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            柳井市まちなか アイデアプロットマップ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            国土地理院の住宅・町字地図上に町名・字名（白壁の町並み、柳井駅前、柳井津、天神、姫田、古開作など）を正確に表示。地図を拡大・縮小して場所を特定できます。
          </p>
        </div>

        {/* Action Button: Add Pin / Idea */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onOpenSubmitWithCoords) {
                onOpenSubmitWithCoords(33.9680, 132.1075, '柳井市白壁の町並み周辺');
              } else if (onAddNewLocationIdea) {
                onAddNewLocationIdea();
              }
            }}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>地図上に意見を投稿</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>絞り込み:</span>
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            すべて ({submissions.length})
          </button>
          <button
            onClick={() => setSelectedCategory('youth_student')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'youth_student'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            🏫 若者・高校生
          </button>
          <button
            onClick={() => setSelectedCategory('value_creation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'value_creation'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            ✨ 価値創造
          </button>
          <button
            onClick={() => setSelectedCategory('improvement')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'improvement'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            🛠 改善点・課題
          </button>
          <button
            onClick={() => setSelectedCategory('traffic_walk')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'traffic_walk'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            🚲 交通・回遊
          </button>
          <button
            onClick={() => setSelectedCategory('downtown_buzz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'downtown_buzz'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            🏮 まちなか賑わい
          </button>
        </div>

        {/* Demographic Quick Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">属性:</span>
          <select
            value={selectedAgeFilter}
            onChange={(e) => setSelectedAgeFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">全年代・全居住地</option>
            <option value="teens">🎓 高校生（柳井学園・柳井高）</option>
            <option value="young">👶 20〜30代（若手・子育て）</option>
            <option value="senior">🍵 60代以上（シニア・役員）</option>
          </select>
        </div>
      </div>

      {/* Main Map & Cards Container */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 h-screen overflow-hidden' : ''}`}>
        
        {/* Left Column: Interactive Real Map (国土地理院 住宅・町字地図) */}
        <div className={`${isFullscreen ? 'lg:col-span-8 h-full flex flex-col' : 'lg:col-span-7 flex flex-col'} bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 shadow-sm relative overflow-hidden`}>
          
          {/* Map Header & Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <MapIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>柳井市中心市街地 実地住宅地図</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    国土地理院・町字名表示
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  ズームで小字・番地・建物まで特定可能 / 地図内クリックで位置指定
                </p>
              </div>
            </div>

            {/* Map Layer Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTileLayer('gsi_std')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTileLayer === 'gsi_std' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="国土地理院 標準地図（町字名・住宅地盤が最も詳細）"
              >
                標準（町字名）
              </button>
              <button
                onClick={() => setActiveTileLayer('gsi_pale')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTileLayer === 'gsi_pale' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="国土地理院 淡色地図（ピンが見やすい）"
              >
                淡色
              </button>
              <button
                onClick={() => setActiveTileLayer('gsi_photo')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTileLayer === 'gsi_photo' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="国土地理院 航空写真"
              >
                航空写真
              </button>
              <button
                onClick={() => setActiveTileLayer('osm')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTileLayer === 'osm' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="OpenStreetMap"
              >
                OSM
              </button>
            </div>
          </div>

          {/* Quick Area Focus Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap mr-1">
              注目エリア:
            </span>
            <button
              onClick={() => handleJumpTo(33.9682, 132.1078, 17)}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold border border-indigo-200 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>🏮 白壁の町並み</span>
            </button>
            <button
              onClick={() => handleJumpTo(33.9626, 132.1025, 17)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>🚆 JR柳井駅前</span>
            </button>
            <button
              onClick={() => handleJumpTo(33.9655, 132.1050, 17)}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold border border-blue-200 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>🌊 柳井川水辺</span>
            </button>
            <button
              onClick={() => handleJumpTo(33.9715, 132.1040, 16)}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>🎓 柳井学園・柳井高</span>
            </button>
            <button
              onClick={() => handleJumpTo(33.9535, 132.1280, 16)}
              className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold border border-cyan-200 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>🚢 柳井港・松山航路</span>
            </button>
          </div>

          {/* Map Viewport Container with Leaflet */}
          <div className="relative w-full flex-1 min-h-[380px] sm:min-h-[440px] md:min-h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            
            {/* The Actual Leaflet Map Element */}
            <div ref={mapContainerRef} className="w-full h-full min-h-[380px] sm:min-h-[440px] md:min-h-[500px] z-10" />

            {/* Custom Interactive Zoom & Control Overlay on Top Right */}
            <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 shadow-md bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200">
              
              {/* Zoom In Button */}
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="地図を拡大する"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Zoom Out Button */}
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="地図を縮小する"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <div className="h-px bg-slate-200 my-0.5"></div>

              {/* Reset to Yanai Center */}
              <button
                onClick={handleResetView}
                className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="初期位置（柳井市中心部）に戻る"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-800 hover:text-indigo-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title={isFullscreen ? '通常表示に戻す' : '地図を全画面拡大する'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Current Zoom & Town Marker Indicator at Top Left */}
            <div className="absolute top-3 left-3 z-30 bg-slate-900/90 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 shadow-md">
              <Navigation2 className="w-3.5 h-3.5 text-amber-400" />
              <span>山口県柳井市まちなかエリア (ズーム: {currentZoom})</span>
            </div>

            {/* Clicked Location Notification Popup Toast */}
            {clickedCoord && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-30 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-blue-300 shadow-xl text-slate-900 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>指定した地点: {clickedCoord.lat.toFixed(4)}, {clickedCoord.lng.toFixed(4)}</span>
                  </div>
                  <button 
                    onClick={() => setClickedCoord(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 mb-2.5">
                  この指定場所に新しいアイデア・要望をプロットしますか？
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onOpenSubmitWithCoords) {
                        onOpenSubmitWithCoords(clickedCoord.lat, clickedCoord.lng, `柳井市指定地点 (${clickedCoord.lat.toFixed(4)}, ${clickedCoord.lng.toFixed(4)})`);
                      } else if (onAddNewLocationIdea) {
                        onAddNewLocationIdea();
                      }
                      setClickedCoord(null);
                    }}
                    className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-xs"
                  >
                    ここにアイデアを投稿
                  </button>
                  <button
                    onClick={() => setClickedCoord(null)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            )}

            {/* Map Legend Overlay at Bottom Left */}
            <div className="hidden sm:block absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 text-[10px] space-y-1 shadow-md z-30 pointer-events-auto">
              <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between gap-3">
                <span>地図の凡例</span>
                <span className="text-[9px] text-slate-400 font-normal">ピンをクリックで詳細</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>若者・高校生提案</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>価値創造アイデア</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  <span>改善点・課題</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <span>交通・回遊</span>
                </div>
              </div>
            </div>

          </div>

          {/* Selected Pin Quick Preview Box */}
          {selectedItem && (
            <div className="mt-3 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 transition-all">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(selectedItem.category)}
                  <span className="text-xs text-slate-600 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {selectedItem.locationName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-lg border border-emerald-200">
                    期待度: {selectedItem.expectationScore}点
                  </span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-lg border border-blue-200">
                    実現性: {selectedItem.feasibilityScore}点
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                {selectedItem.title}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                {selectedItem.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-blue-200/60">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>投稿者: <strong className="text-slate-800">{selectedItem.authorName}</strong></span>
                  <span>({selectedItem.organization || '市民有志'})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleVoteClick(selectedItem.id, 'up', e)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-white hover:bg-blue-100 text-blue-700 border border-blue-300 shadow-2xs cursor-pointer transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>共感 ({selectedItem.upvotes})</span>
                  </button>
                  <button
                    onClick={() => handleSelectDetails(selectedItem)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-indigo-900 hover:bg-indigo-950 text-white shadow-2xs cursor-pointer transition-colors"
                  >
                    <span>詳細</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Citizen Cards Feed */}
        <div className={`${isFullscreen ? 'lg:col-span-4 h-full flex flex-col' : 'lg:col-span-5 flex flex-col'} space-y-3`}>
          
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>プロット済みアイデア ({filteredSubmissions.length}件)</span>
            </h3>
            <span className="text-[11px] text-slate-500">カード選択で地図フォーカス</span>
          </div>

          {/* Cards Scroll Container */}
          <div 
            ref={cardListRef}
            className={`space-y-3 overflow-y-auto pr-1 ${isFullscreen ? 'flex-1 max-h-none' : 'max-h-[640px]'}`}
          >
            {filteredSubmissions.map(sub => {
              const isSelected = selectedPinId === sub.id;

              return (
                <div
                  key={sub.id}
                  id={`idea-card-${sub.id}`}
                  onClick={() => {
                    setSelectedPinId(sub.id);
                    handleJumpTo(sub.lat, sub.lng, 17);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      {getCategoryBadge(sub.category)}
                      {sub.status === 'reflected' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          計画反映済
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{sub.createdAt}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1.5">
                    {sub.title}
                  </h4>
                  
                  <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{sub.locationName}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                    {sub.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {sub.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                    <div className="text-[11px] text-slate-500">
                      <span className="font-bold text-slate-800">{sub.authorName}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleVoteClick(sub.id, 'up', e)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3 h-3 text-blue-600" />
                        <span>{sub.upvotes}</span>
                      </button>
                      <button
                        onClick={(e) => handleVoteClick(sub.id, 'down', e)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 transition-colors cursor-pointer"
                        title="慎重・要検討"
                      >
                        <ThumbsDown className="w-3 h-3 text-slate-400" />
                        <span>{sub.downvotes}</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDetails(sub);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="詳細モーダルを開く"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
};
