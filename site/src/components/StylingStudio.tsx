import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Bookmark,
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Footprints,
  Heart,
  LayoutGrid,
  Library,
  Moon,
  MoreHorizontal,
  PartyPopper,
  Pencil,
  PersonStanding,
  Plus,
  Redo2,
  RefreshCw,
  RotateCcw,
  Settings,
  Share2,
  Shirt,
  ShoppingCart,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Undo2,
  X,
} from 'lucide-react';

type Tab = 'DNA' | 'BODY' | 'STYLE' | 'PERSONALITY' | 'STORY';
type StyleKey =
  | 'outfits'
  | 'body'
  | 'face'
  | 'hair'
  | 'makeup'
  | 'accessories'
  | 'tattoos'
  | 'details';
type TuneKey = Exclude<StyleKey, 'outfits' | 'body'>;
type Framing = 'Full' | 'Mid' | 'Portrait';
type FilterName =
  | 'Daylight'
  | 'Soft Film'
  | 'Cool Studio'
  | 'Blue Hour'
  | 'Mono'
  | 'Golden Hour';
type PieceGroup = 'tops' | 'bottoms' | 'full' | 'shoes' | 'acc';

interface Piece {
  name: string;
  colour: string;
  price: number;
}

interface Look {
  id: number;
  name: string;
  slug: string;
  src: string;
  category: string;
  swatch: string;
  pieces: Record<PieceGroup, Piece[]>;
}

interface Identity {
  name: string;
  age: number;
  city: string;
  temp: string;
  heritage: string;
  eye: string;
  hair: string;
  seed: string;
}

interface Snapshot {
  look: number;
  filter: FilterName;
  realism: number;
  height: number;
  build: number;
  framing: Framing;
}

interface SavedLook {
  id: number;
  snapshot: Snapshot;
}

interface HistoryState {
  states: Snapshot[];
  index: number;
}

type HistoryAction =
  | { type: 'commit'; patch: Partial<Snapshot> }
  | { type: 'undo' }
  | { type: 'redo' };

type TuneValue = number | string;
type TuneState = Record<string, Record<string, TuneValue | string[]>>;

interface TuneSlider {
  key: string;
  label: string;
  min: number;
  max: number;
  value: number;
}

interface TuneConfig {
  title: string;
  note: string;
  swatches?: string[];
  presets: string[];
  sliders: TuneSlider[];
  multi?: string[];
}

const LOOKS: Look[] = [
  {
    id: 0,
    name: 'Ember Mini',
    slug: 'ember',
    src: '/editorial/mannequin-ember.webp',
    category: 'Everyday',
    swatch: '#B9534F',
    pieces: {
      tops: [],
      bottoms: [],
      full: [{ name: 'Bias-cut mini dress', colour: 'Ember', price: 180 }],
      shoes: [{ name: 'Leather sandals', colour: 'Black', price: 120 }],
      acc: [
        { name: 'Gold hoops', colour: '14k', price: 64 },
        { name: 'Leather belt', colour: 'Black', price: 42 },
      ],
    },
  },
  {
    id: 1,
    name: 'Ink Column',
    slug: 'ink',
    src: '/editorial/mannequin-ink.webp',
    category: 'Formal',
    swatch: '#171414',
    pieces: {
      tops: [],
      bottoms: [],
      full: [{ name: 'Satin column dress', colour: 'Ink', price: 220 }],
      shoes: [{ name: 'Pointed heels', colour: 'Black', price: 190 }],
      acc: [{ name: 'Gold hoops', colour: '14k', price: 64 }],
    },
  },
  {
    id: 2,
    name: 'Bone Slip',
    slug: 'bone',
    src: '/editorial/mannequin-bone.webp',
    category: 'Evening',
    swatch: '#E9D9D1',
    pieces: {
      tops: [],
      bottoms: [],
      full: [{ name: 'Bias slip dress', colour: 'Bone', price: 160 }],
      shoes: [{ name: 'Strappy sandals', colour: 'Ivory', price: 130 }],
      acc: [{ name: 'Fine chain necklace', colour: 'Silver', price: 56 }],
    },
  },
  {
    id: 3,
    name: 'Olive Drape',
    slug: 'olive',
    src: '/editorial/mannequin-olive.webp',
    category: 'Street',
    swatch: '#6B6A4F',
    pieces: {
      tops: [],
      bottoms: [],
      full: [{ name: 'Draped jersey dress', colour: 'Olive', price: 170 }],
      shoes: [{ name: 'Platform sneakers', colour: 'Black', price: 150 }],
      acc: [{ name: 'Leather belt', colour: 'Black', price: 42 }],
    },
  },
  {
    id: 4,
    name: 'Clay Study',
    slug: 'clay',
    src: '/editorial/mannequin-clay.webp',
    category: 'Everyday',
    swatch: '#B77B62',
    pieces: {
      tops: [],
      bottoms: [],
      full: [{ name: 'Linen halter dress', colour: 'Clay', price: 180 }],
      shoes: [{ name: 'Leather sandals', colour: 'Tan', price: 120 }],
      acc: [{ name: 'Gold hoops', colour: '14k', price: 64 }],
    },
  },
  {
    id: 5,
    name: 'Rose Wash',
    slug: 'rose',
    src: '/editorial/mannequin-rose.webp',
    category: 'Party',
    swatch: '#C98C88',
    pieces: {
      tops: [],
      bottoms: [],
      full: [{ name: 'Washed satin dress', colour: 'Rose', price: 190 }],
      shoes: [{ name: 'Satin mules', colour: 'Rose', price: 140 }],
      acc: [{ name: 'Fine chain necklace', colour: 'Silver', price: 56 }],
    },
  },
  {
    id: 6,
    name: 'Midnight Silk',
    slug: 'midnight',
    src: '/editorial/mannequin-midnight.webp',
    category: 'Formal',
    swatch: '#2E3A4F',
    pieces: {
      tops: [],
      bottoms: [],
      full: [{ name: 'Silk bias dress', colour: 'Midnight', price: 240 }],
      shoes: [{ name: 'Pointed heels', colour: 'Black', price: 190 }],
      acc: [{ name: 'Gold hoops', colour: '14k', price: 64 }],
    },
  },
  {
    id: 7,
    name: 'Sand Halter',
    slug: 'sand',
    src: '/editorial/mannequin-sand.webp',
    category: 'Studio',
    swatch: '#C6B39A',
    pieces: {
      tops: [],
      bottoms: [],
      full: [{ name: 'Sandwashed halter dress', colour: 'Sand', price: 175 }],
      shoes: [{ name: 'Woven flats', colour: 'Natural', price: 110 }],
      acc: [{ name: 'Leather belt', colour: 'Black', price: 42 }],
    },
  },
];

const CATEGORIES = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Everyday', icon: Shirt },
  { name: 'Formal', icon: Briefcase },
  { name: 'Party', icon: PartyPopper },
  { name: 'Street', icon: Footprints },
  { name: 'Evening', icon: Moon },
  { name: 'Studio', icon: Camera },
];

const PIECE_GROUPS: { key: PieceGroup; label: string }[] = [
  { key: 'tops', label: 'Tops' },
  { key: 'bottoms', label: 'Bottoms' },
  { key: 'full', label: 'Full body' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'acc', label: 'Accessories' },
];

const HOTSPOTS: { key: PieceGroup; x: number; y: number }[] = [
  { key: 'tops', x: 60, y: 24 },
  { key: 'full', x: 60, y: 38 },
  { key: 'bottoms', x: 38, y: 47 },
  { key: 'shoes', x: 40, y: 95 },
  { key: 'acc', x: 56, y: 14 },
];

const FILTERS: {
  name: FilterName;
  grade: string;
  tint: string;
}[] = [
  { name: 'Daylight', grade: 'none', tint: 'transparent' },
  {
    name: 'Soft Film',
    grade: 'contrast(.92) saturate(.85) brightness(1.06)',
    tint: 'linear-gradient(180deg, rgba(255,226,214,.35), rgba(180,200,220,.35))',
  },
  {
    name: 'Cool Studio',
    grade: 'saturate(.9) brightness(1.06) contrast(1.04)',
    tint: 'linear-gradient(180deg, rgba(150,190,255,.55), rgba(200,220,255,.3))',
  },
  {
    name: 'Blue Hour',
    grade: 'brightness(.82) contrast(1.1) saturate(1.1)',
    tint: 'linear-gradient(180deg, rgba(58,82,170,.75), rgba(96,140,190,.55))',
  },
  {
    name: 'Mono',
    grade: 'grayscale(1) contrast(1.12) brightness(1.03)',
    tint: 'transparent',
  },
  {
    name: 'Golden Hour',
    grade: 'saturate(1.1) brightness(1.02)',
    tint: 'linear-gradient(180deg, rgba(255,180,90,.6), rgba(255,140,80,.4))',
  },
];

const IDENTITIES: Identity[] = [
  {
    name: 'Amara Cole',
    age: 26,
    city: 'Brooklyn, US',
    temp: '18°C',
    heritage: 'African American',
    eye: 'Dark brown',
    hair: 'Natural coil · low bun',
    seed: 'VL-0423-US',
  },
  {
    name: 'Nia Brooks',
    age: 24,
    city: 'Atlanta, US',
    temp: '24°C',
    heritage: 'African American',
    eye: 'Hazel',
    hair: 'Braids · centre part',
    seed: 'VL-0460-US',
  },
  {
    name: 'Zuri Bennett',
    age: 28,
    city: 'London, UK',
    temp: '13°C',
    heritage: 'African Caribbean',
    eye: 'Deep brown',
    hair: 'Cloud afro',
    seed: 'VL-0497-UK',
  },
  {
    name: 'Imani Reed',
    age: 23,
    city: 'Paris, FR',
    temp: '15°C',
    heritage: 'African American',
    eye: 'Dark brown',
    hair: 'Sleek bun',
    seed: 'VL-0534-FR',
  },
  {
    name: 'Sade Okoro',
    age: 27,
    city: 'Lagos, NG',
    temp: '29°C',
    heritage: 'Nigerian',
    eye: 'Warm brown',
    hair: 'Curls · pinned back',
    seed: 'VL-0571-NG',
  },
];

const TRAITS = [
  'Curious',
  'Bold',
  'Calm',
  'Witty',
  'Romantic',
  'Driven',
  'Playful',
  'Gentle',
  'Creative',
  'Loyal',
];

const TUNE_CONFIG: Record<TuneKey, TuneConfig> = {
  face: {
    title: 'Face',
    note: 'changes re-render the model',
    presets: ['Soft', 'Defined', 'Natural', 'Sculpted'],
    sliders: [
      { key: 'smile', label: 'Smile', min: 0, max: 100, value: 35 },
      { key: 'jawline', label: 'Jawline', min: 0, max: 100, value: 0 },
      { key: 'freckles', label: 'Freckles', min: 0, max: 100, value: 0 },
    ],
  },
  hair: {
    title: 'Hair',
    note: 'changes re-render the model',
    swatches: ['#14110f', '#3b2a20', '#6b4a35', '#a07c5a', '#d9c3a1'],
    presets: ['High bun', 'Low bun', 'Long straight', 'Bob', 'Ponytail'],
    sliders: [
      { key: 'volume', label: 'Volume', min: 0, max: 100, value: 0 },
      { key: 'shine', label: 'Shine', min: 0, max: 100, value: 0 },
    ],
  },
  makeup: {
    title: 'Makeup',
    note: 'changes re-render the model',
    swatches: ['#e8b4a8', '#d98c8c', '#b5525e', '#8e3c4a'],
    presets: ['No-makeup', 'Glass skin', 'Soft glam', 'Editorial'],
    sliders: [
      { key: 'blush', label: 'Blush', min: 0, max: 100, value: 0 },
      { key: 'lip', label: 'Lip tint', min: 0, max: 100, value: 45 },
      { key: 'glow', label: 'Glow', min: 0, max: 100, value: 0 },
    ],
  },
  accessories: {
    title: 'Accessories',
    note: 'add pieces to the look',
    presets: [],
    sliders: [],
    multi: ['Gold hoops', 'Silver chain', 'Shoulder bag', 'Sunglasses', 'Watch', 'Hair clip'],
  },
  tattoos: {
    title: 'Tattoos',
    note: 'changes re-render the model',
    presets: ['None', 'Fine line', 'Floral', 'Script', 'Minimal dots'],
    sliders: [{ key: 'opacity', label: 'Opacity', min: 0, max: 100, value: 0 }],
  },
  details: {
    title: 'Details',
    note: 'changes re-render the model',
    presets: ['Studio', 'Natural', 'Cinematic'],
    sliders: [
      { key: 'skin', label: 'Skin texture', min: 0, max: 100, value: 70 },
      { key: 'fabric', label: 'Fabric detail', min: 0, max: 100, value: 0 },
      { key: 'lighting', label: 'Lighting softness', min: 0, max: 100, value: 0 },
    ],
  },
};

const STYLE_MENU: { key: StyleKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'face', label: 'Face', icon: SlidersHorizontal },
  { key: 'hair', label: 'Hair', icon: Sparkles },
  { key: 'makeup', label: 'Makeup', icon: Sparkles },
  { key: 'body', label: 'Body', icon: PersonStanding },
  { key: 'outfits', label: 'Outfits', icon: Shirt },
  { key: 'accessories', label: 'Accessories', icon: Bookmark },
  { key: 'tattoos', label: 'Tattoos', icon: PenIcon },
  { key: 'details', label: 'Details', icon: Camera },
];

const DEFAULT_STATE: Snapshot = {
  look: 0,
  filter: 'Daylight',
  realism: 80,
  height: 168,
  build: 50,
  framing: 'Portrait',
};

const INITIAL_TUNE: TuneState = Object.fromEntries(
  Object.entries(TUNE_CONFIG).map(([key, config]) => [
    key,
    {
      swatch: config.swatches?.[0] ?? '',
      preset: config.presets[0] ?? '',
      selected: [],
      ...Object.fromEntries(config.sliders.map((slider) => [slider.key, slider.value])),
    },
  ])
);

function PenIcon({ className }: { className?: string }) {
  return <Pencil className={className} />;
}

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  if (action.type === 'undo') {
    return state.index > 0 ? { ...state, index: state.index - 1 } : state;
  }
  if (action.type === 'redo') {
    return state.index < state.states.length - 1
      ? { ...state, index: state.index + 1 }
      : state;
  }

  const current = state.states[state.index];
  const next = { ...current, ...action.patch };
  if (JSON.stringify(current) === JSON.stringify(next)) return state;
  const states = [...state.states.slice(0, state.index + 1), next];
  return { states, index: states.length - 1 };
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function traitScore(traits: string[], axis: number) {
  if (traits.length === 0) return 42 + axis * 7;
  const seed = traits
    .join('')
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 30 + ((seed * (axis + 3)) % 65);
}

function radarValues(traits: string[], openness: number, energy: number) {
  return [
    clamp(openness + traitScore(traits, 0) / 4 - 12, 30, 94),
    clamp(energy + traitScore(traits, 1) / 4 - 12, 30, 94),
    traitScore(traits, 2),
    traitScore(traits, 3),
    traitScore(traits, 4),
  ];
}

interface StudioApi {
  reduceMotion: boolean;
  tab: Tab;
  setTab: (tab: Tab) => void;
  styleView: StyleKey;
  setStyleView: (view: StyleKey) => void;
  selectStyle: (key: StyleKey) => void;
  category: string;
  setCategory: (category: string) => void;
  openRow: PieceGroup | null;
  setOpenRow: (row: PieceGroup | null) => void;
  looks: Look[];
  look: Look;
  lookIndex: number;
  baseLookIndex: number;
  incoming: number | null;
  scanKey: number;
  pickLook: (index: number) => void;
  cart: Set<string>;
  toggleCart: (key: string) => void;
  favourites: Set<number>;
  toggleFavourite: (index: number) => void;
  saved: SavedLook[];
  saveLook: () => void;
  applySaved: (snapshot: Snapshot) => void;
  libraryOpen: boolean;
  setLibraryOpen: (open: boolean) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filterOffset: number;
  setFilterOffset: React.Dispatch<React.SetStateAction<number>>;
  moreOpen: boolean;
  setMoreOpen: (open: boolean) => void;
  toast: { id: number; message: string } | null;
  showToast: (message: string) => void;
  identity: Identity;
  displayName: string;
  scrambleText: string;
  scrambling: boolean;
  shuffleTick: number;
  shuffleIdentity: () => void;
  editingName: boolean;
  setEditingName: (editing: boolean) => void;
  nameDraft: string;
  setNameDraft: (name: string) => void;
  saveName: () => void;
  tune: TuneState;
  setTuneValue: (item: TuneKey, key: string, value: TuneValue) => void;
  setTunePreset: (item: TuneKey, preset: string) => void;
  setTuneSwatch: (item: TuneKey, swatch: string) => void;
  toggleAccessory: (item: string) => void;
  traits: string[];
  toggleTrait: (trait: string) => void;
  radarEnergy: number;
  setRadarEnergy: (value: number) => void;
  radarOpenness: number;
  setRadarOpenness: (value: number) => void;
  scores: number[];
  posture: string;
  setPosture: (posture: string) => void;
  view: Snapshot;
  activeFilter: (typeof FILTERS)[number];
  setFilter: (filter: FilterName) => void;
  setFraming: (framing: Framing) => void;
  setRealism: (value: number, commit?: boolean) => void;
  setHeight: (value: number, commit?: boolean) => void;
  setBuild: (value: number, commit?: boolean) => void;
  heightFactor: number;
  buildFactor: number;
  modelFilter: string;
  backgroundFilter: string;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  pose: () => void;
  rescan: () => void;
  storyKey: number;
  rewriteStory: () => void;
  goToPanel: () => void;
}

const StudioContext = createContext<StudioApi | null>(null);

function useStudio() {
  const studio = useContext(StudioContext);
  if (!studio) throw new Error('Studio context missing');
  return studio;
}

const StudioProvider: React.FC<{ value: StudioApi; children: ReactNode }> = ({
  value,
  children,
}) => <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;

export const StylingStudio: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const reduceMotion = Boolean(useReducedMotion());
  const [history, dispatch] = useReducer(historyReducer, {
    states: [DEFAULT_STATE],
    index: 0,
  });
  const base = history.states[history.index];
  const [preview, setPreview] = useState<Partial<Snapshot> | null>(null);
  const view = useMemo(() => ({ ...base, ...preview }), [base, preview]);

  const [selectedLook, setSelectedLook] = useState(DEFAULT_STATE.look);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [scanKey, setScanKey] = useState(0);
  const transition = useRef<{ timer: number | null; token: number }>({
    timer: null,
    token: 0,
  });

  const [tab, setTab] = useState<Tab>('STYLE');
  const [styleView, setStyleView] = useState<StyleKey>('outfits');
  const [category, setCategory] = useState('All');
  const [openRow, setOpenRow] = useState<PieceGroup | null>('full');
  const [cart, setCart] = useState<Set<string>>(new Set());
  const [favourites, setFavourites] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<SavedLook[]>([]);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOffset, setFilterOffset] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const toastTimer = useRef<number | null>(null);

  const [identityIndex, setIdentityIndex] = useState(0);
  const [customName, setCustomName] = useState<string | null>(null);
  const [scrambling, setScrambling] = useState(false);
  const [scrambleText, setScrambleText] = useState(IDENTITIES[0].name);
  const [shuffleTick, setShuffleTick] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  const [tune, setTune] = useState<TuneState>(INITIAL_TUNE);
  const [traits, setTraits] = useState(['Curious', 'Creative', 'Gentle']);
  const [radarEnergy, setRadarEnergy] = useState(58);
  const [radarOpenness, setRadarOpenness] = useState(64);
  const [posture, setPosture] = useState('Relaxed');
  const [storyKey, setStoryKey] = useState(0);

  const identity = IDENTITIES[identityIndex];
  const look = LOOKS[selectedLook];
  const activeFilter = FILTERS.find((filter) => filter.name === view.filter) ?? FILTERS[0];

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    const id = Date.now();
    setToast({ id, message });
    toastTimer.current = window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 1800);
  }, []);

  const rescan = useCallback(() => setScanKey((key) => key + 1), []);

  const commit = useCallback((patch: Partial<Snapshot>) => {
    dispatch({ type: 'commit', patch });
    setPreview(null);
  }, []);

  const startLook = useCallback(
    (nextLook: number, after: () => void) => {
      if (transition.current.timer) {
        window.clearTimeout(transition.current.timer);
        transition.current.timer = null;
      }

      setSelectedLook(nextLook);

      if (nextLook === base.look) {
        setIncoming(null);
        after();
        setScanKey((key) => key + 1);
        return;
      }

      if (reduceMotion) {
        setIncoming(null);
        after();
        return;
      }

      setIncoming(nextLook);
      setScanKey((key) => key + 1);
      const token = ++transition.current.token;
      transition.current.timer = window.setTimeout(() => {
        if (token !== transition.current.token) return;
        setIncoming(null);
        transition.current.timer = null;
        after();
      }, 1050);
    },
    [base.look, reduceMotion]
  );

  const pickLook = useCallback(
    (index: number) => {
      if (index === selectedLook) return;
      startLook(index, () => dispatch({ type: 'commit', patch: { look: index } }));
    },
    [selectedLook, startLook]
  );

  const undo = useCallback(() => {
    if (history.index === 0) return;
    const target = history.states[history.index - 1];
    startLook(target.look, () => dispatch({ type: 'undo' }));
  }, [history, startLook]);

  const redo = useCallback(() => {
    if (history.index >= history.states.length - 1) return;
    const target = history.states[history.index + 1];
    startLook(target.look, () => dispatch({ type: 'redo' }));
  }, [history, startLook]);

  const reset = useCallback(() => {
    setPreview(null);
    startLook(DEFAULT_STATE.look, () => {
      dispatch({ type: 'commit', patch: DEFAULT_STATE });
      showToast('Reset to default');
    });
  }, [showToast, startLook]);

  const pose = useCallback(() => {
    const next: Framing =
      view.framing === 'Full' ? 'Mid' : view.framing === 'Mid' ? 'Portrait' : 'Full';
    commit({ framing: next });
  }, [commit, view.framing]);

  const setFilter = useCallback(
    (filter: FilterName) => {
      commit({ filter });
      setFilterOpen(false);
    },
    [commit]
  );

  const setFraming = useCallback((framing: Framing) => commit({ framing }), [commit]);

  const setRealism = useCallback(
    (value: number, shouldCommit = false) => {
      if (shouldCommit) commit({ realism: value });
      else setPreview((current) => ({ ...current, realism: value }));
      rescan();
    },
    [commit, rescan]
  );

  const setHeight = useCallback(
    (value: number, shouldCommit = false) => {
      if (shouldCommit) commit({ height: value });
      else setPreview((current) => ({ ...current, height: value }));
      rescan();
    },
    [commit, rescan]
  );

  const setBuild = useCallback(
    (value: number, shouldCommit = false) => {
      if (shouldCommit) commit({ build: value });
      else setPreview((current) => ({ ...current, build: value }));
      rescan();
    },
    [commit, rescan]
  );

  const toggleCart = useCallback(
    (key: string) => {
      setCart((current) => {
        const next = new Set(current);
        if (next.has(key)) {
          next.delete(key);
          showToast('Removed from cart');
        } else {
          next.add(key);
          showToast('Added to cart');
        }
        return next;
      });
    },
    [showToast]
  );

  const toggleFavourite = useCallback(
    (index: number) => {
      setFavourites((current) => {
        const next = new Set(current);
        if (next.has(index)) {
          next.delete(index);
          showToast('Removed from favourites');
        } else {
          next.add(index);
          showToast('Added to favourites');
        }
        return next;
      });
    },
    [showToast]
  );

  const saveLook = useCallback(() => {
    const snapshot: Snapshot = { ...view, look: selectedLook };
    setSaved((current) => [{ id: Date.now(), snapshot }, ...current].slice(0, 8));
    setLibraryOpen(true);
    showToast('Saved to library');
  }, [selectedLook, showToast, view]);

  const applySaved = useCallback(
    (snapshot: Snapshot) => {
      setLibraryOpen(false);
      startLook(snapshot.look, () => dispatch({ type: 'commit', patch: snapshot }));
      showToast('Look loaded');
    },
    [showToast, startLook]
  );

  const shuffleIdentity = useCallback(() => {
    const next = (identityIndex + 1) % IDENTITIES.length;
    setIdentityIndex(next);
    setCustomName(null);
    setScrambling(true);
    setScrambleText(IDENTITIES[next].name);
    setShuffleTick((tick) => tick + 1);
    rescan();
    showToast('Identity re-seeded');
  }, [identityIndex, rescan, showToast]);

  useEffect(() => {
    if (!scrambling) return;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const target = IDENTITIES[identityIndex].name;
    let frame = 0;
    const timer = window.setInterval(() => {
      frame += 1;
      if (frame > 13) {
        setScrambleText(target);
        setScrambling(false);
        window.clearInterval(timer);
        return;
      }
      setScrambleText(
        target
          .split('')
          .map((char) =>
            char === ' '
              ? ' '
              : alphabet[Math.floor(Math.random() * alphabet.length)]
          )
          .join('')
      );
    }, 40);
    return () => window.clearInterval(timer);
  }, [identityIndex, scrambling]);

  const displayName = customName ?? (scrambling ? scrambleText : identity.name);

  const saveName = useCallback(() => {
    const next = nameDraft.trim() || identity.name;
    setCustomName(next);
    setEditingName(false);
    showToast('Name updated');
  }, [identity.name, nameDraft, showToast]);

  const setTuneValue = useCallback(
    (item: TuneKey, key: string, value: TuneValue) => {
      setTune((current) => ({
        ...current,
        [item]: { ...current[item], [key]: value },
      }));
      rescan();
    },
    [rescan]
  );

  const setTunePreset = useCallback(
    (item: TuneKey, preset: string) => {
      setTune((current) => ({
        ...current,
        [item]: { ...current[item], preset },
      }));
      rescan();
      showToast(`${TUNE_CONFIG[item].title}: ${preset}`);
    },
    [rescan, showToast]
  );

  const setTuneSwatch = useCallback(
    (item: TuneKey, swatch: string) => {
      setTune((current) => ({
        ...current,
        [item]: { ...current[item], swatch },
      }));
      rescan();
    },
    [rescan]
  );

  const toggleAccessory = useCallback(
    (item: string) => {
      setTune((current) => {
        const currentSelected = (current.accessories.selected as string[]) ?? [];
        const selected = currentSelected.includes(item)
          ? currentSelected.filter((piece) => piece !== item)
          : [...currentSelected, item];
        return {
          ...current,
          accessories: { ...current.accessories, selected },
        };
      });
      rescan();
    },
    [rescan]
  );

  const toggleTrait = useCallback(
    (trait: string) => {
      setTraits((current) => {
        if (current.includes(trait)) return current.filter((item) => item !== trait);
        if (current.length >= 3) return [...current.slice(1), trait];
        return [...current, trait];
      });
      rescan();
    },
    [rescan]
  );

  const goToPanel = useCallback(() => {
    if (isDesktop) return;
    document.getElementById('studio-panel')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center',
    });
  }, [isDesktop, reduceMotion]);

  const selectStyle = useCallback(
    (key: StyleKey) => {
      if (key === 'outfits') {
        setTab('STYLE');
        setStyleView('outfits');
        return;
      }
      if (key === 'body') {
        setStyleView('body');
        setTab('BODY');
        return;
      }
      setStyleView(key);
      setTab('STYLE');
    },
    []
  );

  const heightFactor = 1 + ((view.height - 168) / 168) * 0.9;
  const buildFactor = 1 + ((view.build - 50) / 50) * 0.07;
  const realismAmount = Math.max(0, (80 - view.realism) / 80);
  const realismFilter = `saturate(${1 + realismAmount * 0.9}) contrast(${
    1 + realismAmount * 0.25
  }) blur(${realismAmount * 1.4}px) brightness(${1 + realismAmount * 0.05})`;
  const backgroundFilter = `blur(${realismAmount * 5}px) saturate(${
    1 + realismAmount * 0.5
  }) brightness(.62)`;

  const tuneValue = (item: TuneKey, key: string, fallback: number) => {
    const value = tune[item]?.[key];
    return typeof value === 'number' ? value : fallback;
  };

  const tuneGlow = tuneValue('makeup', 'glow', 0);
  const tuneBlush = tuneValue('makeup', 'blush', 0);
  const tuneLip = tuneValue('makeup', 'lip', 45);
  const tuneShine = tuneValue('hair', 'shine', 0);
  const tuneVolume = tuneValue('hair', 'volume', 0);
  const tuneFreckles = tuneValue('face', 'freckles', 0);
  const tuneJaw = tuneValue('face', 'jawline', 0);
  const tuneFabric = tuneValue('details', 'fabric', 0);
  const tuneLighting = tuneValue('details', 'lighting', 0);
  const tuneTattoo = tuneValue('tattoos', 'opacity', 0);
  const tuneFilter = `saturate(${
    1 + tuneGlow / 500 + tuneBlush / 1600 + tuneVolume / 2400 - tuneTattoo / 3200
  }) contrast(${1 + tuneFabric / 800 + tuneJaw / 1800 + tuneFreckles / 2200}) brightness(${
    1 + tuneLighting / 1000 + tuneShine / 1400
  }) hue-rotate(${((tuneLip - 45) / 45) * 1.5}deg)`;
  const tuneActive =
    tuneGlow !== 0 ||
    tuneBlush !== 0 ||
    tuneLip !== 45 ||
    tuneShine !== 0 ||
    tuneVolume !== 0 ||
    tuneFreckles !== 0 ||
    tuneJaw !== 0 ||
    tuneFabric !== 0 ||
    tuneLighting !== 0 ||
    tuneTattoo !== 0;
  const modelFilter = realismAmount === 0 && !tuneActive ? 'none' : `${realismFilter} ${tuneFilter}`;

  const scores = useMemo(
    () => radarValues(traits, radarOpenness, radarEnergy),
    [traits, radarOpenness, radarEnergy]
  );

  useEffect(() => {
    LOOKS.forEach((item) => {
      const image = new Image();
      image.src = item.src;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (transition.current.timer) window.clearTimeout(transition.current.timer);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        pickLook((selectedLook - 1 + LOOKS.length) % LOOKS.length);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        pickLook((selectedLook + 1) % LOOKS.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pickLook, redo, selectedLook, undo]);

  const api: StudioApi = {
    reduceMotion,
    tab,
    setTab,
    styleView,
    setStyleView,
    selectStyle,
    category,
    setCategory,
    openRow,
    setOpenRow,
    looks: LOOKS,
    look,
    lookIndex: selectedLook,
    baseLookIndex: base.look,
    incoming,
    scanKey,
    pickLook,
    cart,
    toggleCart,
    favourites,
    toggleFavourite,
    saved,
    saveLook,
    applySaved,
    libraryOpen,
    setLibraryOpen,
    filterOpen,
    setFilterOpen,
    filterOffset,
    setFilterOffset,
    moreOpen,
    setMoreOpen,
    toast,
    showToast,
    identity,
    displayName,
    scrambleText,
    scrambling,
    shuffleTick,
    shuffleIdentity,
    editingName,
    setEditingName,
    nameDraft,
    setNameDraft,
    saveName,
    tune,
    setTuneValue,
    setTunePreset,
    setTuneSwatch,
    toggleAccessory,
    traits,
    toggleTrait,
    radarEnergy,
    setRadarEnergy,
    radarOpenness,
    setRadarOpenness,
    scores,
    posture,
    setPosture,
    view,
    activeFilter,
    setFilter,
    setFraming,
    setRealism,
    setHeight,
    setBuild,
    heightFactor,
    buildFactor,
    modelFilter,
    backgroundFilter,
    canUndo: history.index > 0,
    canRedo: history.index < history.states.length - 1,
    undo,
    redo,
    reset,
    pose,
    rescan,
    storyKey,
    rewriteStory: () => {
      const shuffled = [...TRAITS].sort(() => Math.random() - 0.5).slice(0, 3);
      setTraits(shuffled);
      setStoryKey((key) => key + 1);
      rescan();
    },
    goToPanel,
  };

  return (
    <StudioProvider value={api}>
      <div className="studio-ui relative">
        {isDesktop ? <DesktopStudio /> : <StackedStudio />}
        <Toast />
      </div>
    </StudioProvider>
  );
};

const DesktopStudio: React.FC = () => {
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const update = () => setScale(shell.clientWidth / 1600);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={shellRef}
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '16 / 9' }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 1600,
          height: 900,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <Scene />
        <DesktopTopBar />
        <ProfileCard desktop />
        <StyleMenu desktop />
        <RandomizeButton desktop />
        <ModelStage />
        <RightPanel desktop />
        <ControlBar desktop />
        <RealismPanel desktop />
        <FilterPanel desktop />
        <SavePanel desktop />
        <LibraryDrawer desktop />
        <MoreMenu />
      </div>
    </div>
  );
};

const StackedStudio: React.FC = () => {
  return (
    <div className="space-y-4">
      <StackedTopBar />
      <div className="relative aspect-[9/16] overflow-hidden rounded-3xl border border-white/20 bg-[#171414] sm:aspect-[3/4]">
        <Scene>
          <MobileModelStage />
        </Scene>
      </div>
      <ProfileCard />
      <StyleMenu />
      <div id="studio-panel">
        <RightPanel />
      </div>
      <ControlBar />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <RealismPanel />
        <FilterPanel />
      </div>
      <SavePanel />
      <LibraryDrawer />
      <MoreMenu />
      <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/65">
        Full-body cut-out study / 08 looks
      </p>
    </div>
  );
};

const Scene: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const { activeFilter, backgroundFilter, reduceMotion } = useStudio();
  const sceneRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const x = event.clientX / rect.width - 0.5;
    const y = event.clientY / rect.height - 0.5;
    scene.style.setProperty('--bx', `${-x * 22}px`);
    scene.style.setProperty('--by', `${-y * 12}px`);
    scene.style.setProperty('--mx', `${x * 10}px`);
  };

  return (
    <div
      ref={sceneRef}
      onPointerMove={onPointerMove}
      className="absolute inset-0 overflow-hidden bg-[#171414]"
    >
      <div
        className="absolute -inset-[3%] transition-[filter] duration-700"
        style={{ filter: activeFilter.grade }}
      >
        <img
          src="/editorial/atelier-wide.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700"
          style={{
            filter: backgroundFilter,
            transform: 'translate3d(var(--bx, 0px), var(--by, 0px), 0) scale(1.04)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-colors duration-700"
          style={{
            background: activeFilter.tint,
            mixBlendMode: 'soft-light',
          }}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(20,18,22,.38) 100%), linear-gradient(180deg, rgba(20,20,24,.22), transparent 18%, transparent 70%, rgba(20,20,24,.35))',
        }}
      />
      {children}
    </div>
  );
};

const DesktopTopBar: React.FC = () => {
  return (
    <>
      <div className="absolute left-[30px] top-[22px] flex items-baseline gap-[18px]">
        <span className="font-['Syne'] text-[46px] font-extrabold leading-none tracking-[-0.02em] text-white">
          MUSE
        </span>
        <span className="text-[15px] font-normal tracking-[0.06em] text-white/70">
          STYLING STUDIO
        </span>
      </div>
      <div className="absolute left-[410px] top-[22px]">
        <StudioTabs width={720} />
      </div>
      <div className="absolute right-[28px] top-[24px]">
        <TopIcons />
      </div>
    </>
  );
};

const StackedTopBar: React.FC = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <span className="font-['Syne'] text-3xl font-extrabold leading-none tracking-[-0.02em] text-white">
          MUSE
        </span>
        <span className="hidden text-[11px] font-normal tracking-[0.12em] text-white/65 sm:inline">
          STYLING STUDIO
        </span>
      </div>
      <TopIcons compact />
    </div>
    <div className="overflow-x-auto pb-1 studio-no-scrollbar">
      <StudioTabs compact />
    </div>
  </div>
);

const StudioTabs: React.FC<{ width?: number; compact?: boolean }> = ({
  width,
  compact = false,
}) => {
  const { tab, setTab } = useStudio();
  const tabs: Tab[] = ['DNA', 'BODY', 'STYLE', 'PERSONALITY', 'STORY'];

  return (
    <div
      role="tablist"
      aria-label="Studio sections"
      className={`studio-glass flex rounded-[30px] p-1 ${
        compact ? 'min-w-[520px]' : ''
      }`}
      style={width ? { width } : undefined}
    >
      {tabs.map((item) => {
        const active = tab === item;
        return (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setTab(item)}
            className={`relative h-11 flex-1 rounded-3xl px-2 text-[13px] tracking-[0.05em] transition-colors sm:text-[15px] ${
              active ? 'text-white' : 'text-white/65 hover:text-white'
            }`}
          >
            {active && (
              <motion.span
                layoutId="studio-tab-indicator"
                className="studio-pill-on absolute inset-0 rounded-3xl"
                transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
              />
            )}
            <span className="relative z-10">{item}</span>
          </button>
        );
      })}
    </div>
  );
};

const TopIcons: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    cart,
    favourites,
    saved,
    lookIndex,
    toggleFavourite,
    setLibraryOpen,
    libraryOpen,
    showToast,
    moreOpen,
    setMoreOpen,
  } = useStudio();
  const isFavourite = favourites.has(lookIndex);

  return (
    <div className={`flex shrink-0 items-center ${compact ? 'gap-1.5 sm:gap-2' : 'gap-3'}`}>
      <IconButton
        label={`Cart, ${cart.size} pieces`}
        compact={compact}
        onClick={() => showToast(cart.size ? `${cart.size} pieces in cart` : 'Cart is empty')}
      >
        <ShoppingCart className="h-5 w-5" />
        <Badge count={cart.size} />
      </IconButton>
      <IconButton
        label={isFavourite ? 'Remove current look from favourites' : 'Add current look to favourites'}
        compact={compact}
        onClick={() => toggleFavourite(lookIndex)}
      >
        <Heart className={`h-5 w-5 ${isFavourite ? 'fill-white' : ''}`} />
        <Badge count={favourites.size} />
      </IconButton>
      <IconButton
        label="Open saved look library"
        compact={compact}
        onClick={() => setLibraryOpen(!libraryOpen)}
      >
        <Library className="h-5 w-5" />
        <Badge count={saved.length} />
      </IconButton>
      <IconButton
        label="More studio actions"
        compact={compact}
        onClick={() => setMoreOpen(!moreOpen)}
      >
        <MoreHorizontal className="h-5 w-5" />
      </IconButton>
    </div>
  );
};

const IconButton: React.FC<{
  label: string;
  onClick: () => void;
  children: ReactNode;
  compact?: boolean;
}> = ({ label, onClick, children, compact = false }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className={`studio-glass relative flex items-center justify-center rounded-full text-white transition-transform hover:scale-105 ${
      compact ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-[50px] w-[50px]'
    }`}
  >
    {children}
  </button>
);

const Badge: React.FC<{ count: number }> = ({ count }) => (
  <span
    className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-semibold text-[#171414] transition-transform duration-300 ${
      count > 0 ? 'scale-100' : 'scale-0'
    }`}
  >
    {count}
  </span>
);

const MoreMenu: React.FC = () => {
  const { moreOpen, setMoreOpen, showToast } = useStudio();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;
      setMoreOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [moreOpen, setMoreOpen]);

  const items = [
    { label: 'Share look', message: 'Share link copied', icon: Share2 },
    { label: 'Export render', message: 'Exported 4K render', icon: Download },
    { label: 'Duplicate', message: 'Duplicated as new VELL', icon: Copy },
    { label: 'Settings', message: 'Settings saved', icon: Settings },
  ];

  return (
    <AnimatePresence>
      {moreOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.92, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -4 }}
          transition={{ duration: 0.18 }}
          className="studio-glass fixed right-4 top-20 z-[70] w-[210px] origin-top-right rounded-2xl p-1.5 min-[1200px]:absolute min-[1200px]:right-[28px] min-[1200px]:top-[84px] min-[1200px]:z-40"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setMoreOpen(false);
                showToast(item.message);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProfileCard: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
  const {
    identity,
    displayName,
    look,
    shuffleTick,
    shuffleIdentity,
    editingName,
    setEditingName,
    nameDraft,
    setNameDraft,
    saveName,
  } = useStudio();

  return (
    <div
      className={`studio-glass flex items-center gap-4 rounded-[22px] px-4 ${
        desktop
          ? 'absolute left-[24px] top-[96px] h-[124px] w-[476px]'
          : 'w-full py-4'
      }`}
    >
      <div className="shrink-0 rounded-[18px] border-[1.5px] border-white/85 shadow-[0_0_18px_rgba(255,255,255,.35)]">
        <FaceCrop look={look} size={desktop ? 98 : 72} radius={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {editingName ? (
            <input
              autoFocus
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              onBlur={saveName}
              onKeyDown={(event) => {
                if (event.key === 'Enter') saveName();
                if (event.key === 'Escape') setEditingName(false);
              }}
              aria-label="Character name"
              className="min-w-0 flex-1 rounded-lg border border-white/70 bg-white/15 px-2 py-1 text-lg font-normal text-white outline-none ring-1 ring-white/70 sm:text-[22px]"
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setNameDraft(displayName);
                setEditingName(true);
              }}
              className="truncate text-left text-[22px] font-normal text-white sm:text-[26px]"
            >
              {displayName}
            </button>
          )}
          <button
            type="button"
            aria-label="Edit name"
            onClick={() => {
              setNameDraft(displayName);
              setEditingName(true);
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            key={shuffleTick}
            aria-label="Shuffle identity"
            onClick={shuffleIdentity}
            className="studio-shuffle flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <Shuffle className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/85 sm:text-sm">
          <span>{identity.age}</span>
          <span className="h-4 w-px bg-white/25" />
          <span>{identity.city}</span>
          <span className="h-4 w-px bg-white/25" />
          <span>{identity.temp}</span>
        </div>
      </div>
    </div>
  );
};

const FaceCrop: React.FC<{
  look: Look;
  size: number;
  radius?: number;
  filter?: string;
  className?: string;
}> = ({ look, size, radius = 0, filter, className = '' }) => {
  const crop = 240;
  const sourceX = 212;
  const sourceY = 82;
  const k = size / crop;
  const style: CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    backgroundImage: `url(${look.src})`,
    backgroundSize: `${633 * k}px ${1600 * k}px`,
    backgroundPosition: `${-sourceX * k}px ${-sourceY * k}px`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#C9ADA3',
    filter,
  };
  return <div aria-hidden="true" className={`overflow-hidden ${className}`} style={style} />;
};

const StyleMenu: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
  const { tab, styleView, selectStyle } = useStudio();
  const hidden = tab !== 'STYLE';

  if (!desktop) {
    return (
      <div className="studio-no-scrollbar overflow-x-auto">
        <div className="flex min-w-max items-center gap-1 rounded-2xl studio-glass p-1.5">
          {STYLE_MENU.map((item) => {
            const active =
              item.key === 'body' ? tab === 'BODY' : styleView === item.key && tab === 'STYLE';
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => selectStyle(item.key)}
                className={`flex h-11 items-center gap-2 rounded-xl px-3 text-sm transition-colors ${
                  active ? 'bg-white/15 text-white' : 'text-white/65 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className="studio-glass absolute left-[24px] top-[236px] flex w-[172px] flex-col gap-0.5 rounded-[22px] p-2.5 transition-transform duration-[600ms]"
      style={{
        transform: hidden ? 'translateX(-240px)' : 'translateX(0)',
        transitionTimingFunction: 'cubic-bezier(.7,0,.2,1)',
      }}
      aria-hidden={hidden}
    >
      {STYLE_MENU.map((item) => {
        const active =
              item.key === 'body' ? tab === 'BODY' : styleView === item.key && tab === 'STYLE';
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => selectStyle(item.key)}
            className={`relative flex h-[54px] items-center gap-3.5 rounded-2xl px-3 text-left text-[15px] transition-colors ${
              active ? 'text-white' : 'text-white/65 hover:text-white'
            }`}
          >
            {active && (
              <motion.span
                layoutId="studio-style-indicator"
                className="studio-pill-on absolute inset-0 rounded-2xl"
                transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
              />
            )}
            <item.icon className="relative z-10 h-5 w-5" />
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const RandomizeButton: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
  const { tab, pickLook, setFilter, setRealism, showToast, reduceMotion } = useStudio();
  const hidden = tab !== 'STYLE';

  const randomize = () => {
    const next = Math.floor(Math.random() * LOOKS.length);
    pickLook(next);
    setFilter(FILTERS[Math.floor(Math.random() * 4)].name);
    setRealism(55 + Math.floor(Math.random() * 45), true);
    showToast('Randomized look');
  };

  if (!desktop) {
    return (
      <button
        type="button"
        onClick={randomize}
        className="studio-glass flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3 text-sm text-white"
      >
        <RefreshCw className={`h-4 w-4 ${reduceMotion ? '' : 'studio-spin-once'}`} />
        Randomize VELL
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={randomize}
      className="studio-glass absolute left-[24px] top-[722px] flex h-[52px] w-[220px] items-center gap-3 rounded-2xl px-4 text-sm text-white transition-transform duration-[600ms] hover:bg-white/10"
      style={{
        transform: hidden ? 'translateX(-280px)' : 'translateX(0)',
        transitionTimingFunction: 'cubic-bezier(.7,0,.2,1)',
      }}
      aria-hidden={hidden}
    >
      <RefreshCw className={`h-4 w-4 ${reduceMotion ? '' : 'studio-spin-once'}`} />
      Randomize VELL
    </button>
  );
};

const ModelStage: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => {
  const {
    look,
    baseLookIndex,
    incoming,
    scanKey,
    view,
    heightFactor,
    buildFactor,
    modelFilter,
    posture,
    openRow,
    setOpenRow,
    goToPanel,
  } = useStudio();
  const baseLook = LOOKS[baseLookIndex];
  const framingTransform =
    view.framing === 'Mid'
      ? 'translateY(59%) scale(1.5)'
      : view.framing === 'Portrait'
        ? 'translateY(162%) scale(2.4)'
        : 'translateY(0) scale(1)';
  const postureRotate =
    posture === 'Relaxed' ? '-0.8deg' : posture === 'Editorial' ? '1.4deg' : '0deg';

  return (
    <div
      className={
        mobile
          ? 'absolute bottom-[4%] left-1/2 top-[4%] w-[78%] -translate-x-1/2'
          : 'absolute left-1/2 top-[20px] h-[715px] w-[440px] -translate-x-1/2'
      }
      style={{ transformOrigin: '50% 100%' }}
    >
      <div
        role="group"
        aria-label="Mannequin preview"
        className="absolute inset-0 transition-transform duration-1000"
        style={{
          transform: framingTransform,
          transformOrigin: '50% 100%',
          transitionTimingFunction: 'cubic-bezier(.65,0,.2,1)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate3d(var(--mx, 0px), 0, 0) scaleX(${buildFactor}) scaleY(${heightFactor}) rotate(${postureRotate})`,
            transformOrigin: 'bottom center',
            transition: 'transform .7s cubic-bezier(.2,.7,.2,1)',
          }}
        >
          <div className="studio-breath absolute inset-0">
            <img
              src={baseLook.src}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-bottom"
              style={{
                filter: 'blur(12px)',
                opacity: 0.55,
                maskImage:
                  'linear-gradient(to bottom, black 0%, black 20%, transparent 34%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, black 0%, black 20%, transparent 34%)',
              }}
            />
            <img
              src={baseLook.src}
              alt={`Full-body African American model in the ${baseLook.name} look`}
              width={633}
              height={1600}
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
              style={{ filter: modelFilter, transition: 'filter .45s ease' }}
            />
            {incoming !== null && (
              <img
                key={`${incoming}-${scanKey}`}
                src={LOOKS[incoming].src}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="studio-wipe absolute inset-0 h-full w-full select-none object-contain object-bottom"
                style={{ filter: modelFilter }}
              />
            )}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-[-6px] left-1/2 h-[34px] w-[300px] -translate-x-1/2 rounded-full blur-[4px]"
          style={{
            background:
              'radial-gradient(closest-side, rgba(30,28,26,.55), rgba(30,28,26,0))',
          }}
        />

        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            view.framing === 'Full' ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={view.framing !== 'Full'}
        >
          {HOTSPOTS.map((spot) => {
            const pieces = look.pieces[spot.key];
            if (pieces.length === 0) return null;
            const piece = pieces[0];
            return (
              <button
                key={spot.key}
                type="button"
                onClick={() => {
                  setOpenRow(spot.key);
                  goToPanel();
                }}
                className="group absolute z-20 flex h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white/25 backdrop-blur-[6px] transition-transform hover:scale-[1.18]"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                aria-label={`Open ${PIECE_GROUPS.find((group) => group.key === spot.key)?.label}: ${piece.name}`}
              >
                <span className="studio-ping absolute inset-0 rounded-full border border-white" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
                <span className="pointer-events-none absolute left-[34px] z-30 w-max max-w-[220px] translate-x-[-6px] rounded-full bg-[rgba(30,30,34,.55)] px-3 py-1.5 text-left text-[11px] text-white opacity-0 backdrop-blur-[14px] transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                  <strong>{piece.name}</strong> · {piece.colour} · ${piece.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {scanKey > 0 && (
        <span
          key={scanKey}
          aria-hidden="true"
          className="studio-scan pointer-events-none absolute left-[-10%] right-[-10%] top-0 z-30 h-[2px]"
        />
      )}

      <span className="sr-only" aria-live="polite">
        Look: {look.name}. Framing: {view.framing}. {openRow ? `Open ${openRow} details.` : ''}
      </span>
    </div>
  );
};

const MobileModelStage: React.FC = () => <ModelStage mobile />;

const RightPanel: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
  const { tab, styleView } = useStudio();
  const viewKey = tab === 'STYLE' ? `STYLE-${styleView}` : tab;

  return (
    <div
      className={`studio-glass rounded-[22px] p-[22px_18px_18px] ${
        desktop
          ? 'absolute left-[1112px] top-[96px] h-[680px] w-[464px] overflow-hidden'
          : 'w-full'
      }`}
    >
      <div className="h-full overflow-y-auto studio-no-scrollbar">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={viewKey}
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.35, ease: [0.7, 0, 0.2, 1] }}
            className="flex min-h-full flex-col"
          >
            {tab === 'STYLE' &&
              (styleView === 'outfits' ? (
                <OutfitsView />
              ) : styleView === 'body' ? (
                <BodyView />
              ) : (
                <TuneView item={styleView} />
              ))}
            {tab === 'DNA' && <DnaView />}
            {tab === 'BODY' && <BodyView />}
            {tab === 'PERSONALITY' && <PersonalityView />}
            {tab === 'STORY' && <StoryView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const ViewHeader: React.FC<{ title: string; note: string }> = ({ title, note }) => (
  <div className="flex items-baseline justify-between gap-3">
    <h3 className="text-[17px] font-normal uppercase tracking-[0.06em] text-white">
      {title}
    </h3>
    <span className="text-right text-xs font-normal normal-case text-white/65">{note}</span>
  </div>
);

const OutfitsView: React.FC = () => {
  const {
    looks,
    category,
    setCategory,
    lookIndex,
    pickLook,
    favourites,
    toggleFavourite,
    cart,
    toggleCart,
    openRow,
    setOpenRow,
  } = useStudio();
  const visible = looks.filter((item) => category === 'All' || item.category === category);

  return (
    <div className="flex min-h-full flex-col">
      <ViewHeader title="Outfits" note={`${looks.length} looks`} />

      <div className="studio-no-scrollbar mt-4 flex items-start gap-1 overflow-x-auto sm:justify-between sm:gap-0">
        {CATEGORIES.map((item) => {
          const active = category === item.name;
          return (
            <button
              key={item.name}
              type="button"
              aria-pressed={active}
              onClick={() => setCategory(item.name)}
              className="flex w-[52px] shrink-0 flex-col items-center gap-1.5 sm:w-[58px]"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-[14px] border border-white/30 bg-white/10 text-white transition-colors sm:h-12 sm:w-12 ${
                  active ? 'studio-pill-on bg-white/15' : 'hover:bg-white/15'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] leading-tight text-white/65">{item.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid min-h-[296px] grid-cols-2 gap-2.5 sm:grid-cols-4">
        <AnimatePresence initial={false}>
          {visible.map((item, index) => {
            const active = item.id === lookIndex;
            const favourite = favourites.has(item.id);
            return (
              <motion.button
                key={item.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35, delay: index * 0.045 }}
                onClick={() => pickLook(item.id)}
                onDoubleClick={() => toggleFavourite(item.id)}
                aria-label={`${item.name}, ${item.category}`}
                aria-pressed={active}
                className={`studio-card group relative h-[142px] overflow-hidden rounded-[14px] border border-white/30 text-left transition-transform hover:-translate-y-[3px] ${
                  active ? 'studio-pill-on bg-white/15' : ''
                }`}
              >
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.22),rgba(255,255,255,.06))]" />
                <img
                  src={item.src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-x-0 bottom-0 top-1 mx-auto h-[104%] w-auto max-w-none object-contain transition-transform duration-300 group-hover:scale-[1.06]"
                />
                <span className="absolute inset-x-1.5 bottom-1.5 translate-y-2 rounded-full bg-[rgba(30,30,34,.55)] px-2 py-1 text-center text-[10px] text-white opacity-0 backdrop-blur-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.name}
                </span>
                <span
                  className={`absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(30,30,34,.45)] text-white transition-all ${
                    favourite ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                >
                  <Heart className="h-3 w-3 fill-white" />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full border border-white/80"
                  style={{ backgroundColor: item.swatch }}
                />
                {active && (
                  <span className="pointer-events-none absolute inset-0 rounded-[14px] ring-[3px] ring-white/25" />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-auto space-y-1.5 pt-4">
        {PIECE_GROUPS.map((group) => {
          const pieces = LOOKS[lookIndex].pieces[group.key];
          const open = openRow === group.key;
          return (
            <div key={group.key} className="border-t border-white/20 first:border-t-0">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenRow(open ? null : group.key)}
                className="flex h-[42px] w-full items-center justify-between gap-3 px-3 text-left text-[13px] uppercase tracking-[0.04em] text-white"
              >
                <span>
                  {group.label}
                  <span className="ml-1 text-white/65">· {pieces.length}</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-white/65 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1 px-2 pb-2">
                    {pieces.length === 0 ? (
                      <p className="px-1 py-2 text-xs text-white/65">Nothing in this look</p>
                    ) : (
                      pieces.map((piece, index) => {
                        const key = `${lookIndex}-${group.key}-${index}`;
                        const inCart = cart.has(key);
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-2 border-t border-white/10 px-1 py-2 first:border-t-0"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs text-white">{piece.name}</p>
                              <p className="text-[11px] text-white/70">{piece.colour}</p>
                            </div>
                            <span className="text-xs font-semibold text-white">${piece.price}</span>
                            <button
                              type="button"
                              aria-label={
                                inCart ? `Remove ${piece.name} from cart` : `Add ${piece.name} to cart`
                              }
                              aria-pressed={inCart}
                              onClick={() => toggleCart(key)}
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                inCart
                                  ? 'border-white bg-white text-[#171414]'
                                  : 'border-white/40 text-white hover:bg-white/15'
                              }`}
                            >
                              {inCart ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TuneView: React.FC<{ item: TuneKey }> = ({ item }) => {
  const {
    tune,
    setTuneValue,
    setTunePreset,
    setTuneSwatch,
    toggleAccessory,
    look,
  } = useStudio();
  const config = TUNE_CONFIG[item];
  const values = tune[item] ?? {};
  const selectedAccessories = (values.selected as string[]) ?? [];
  const swatch = typeof values.swatch === 'string' ? values.swatch : '';

  return (
    <div className="flex min-h-full flex-col">
      <ViewHeader title={config.title} note={config.note} />

      {config.swatches && config.swatches.length > 0 && (
        <div className="mt-5 flex items-center gap-2">
          {config.swatches.map((colour) => (
            <button
              key={colour}
              type="button"
              aria-label={`Set ${config.title.toLowerCase()} colour ${colour}`}
              aria-pressed={swatch === colour}
              onClick={() => setTuneSwatch(item, colour)}
              className={`h-8 w-8 rounded-full border transition-transform hover:scale-105 ${
                swatch === colour ? 'border-white ring-2 ring-white/80' : 'border-white/30'
              }`}
              style={{ backgroundColor: colour }}
            />
          ))}
          <div className="ml-auto flex items-center gap-2">
            <FaceCrop look={look} size={44} radius={10} />
            <span
              className="h-8 w-8 rounded-full border border-white/30"
              style={{ backgroundColor: swatch, opacity: 0.7 }}
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {config.presets.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {config.presets.map((preset) => {
            const active = values.preset === preset;
            return (
              <button
                key={preset}
                type="button"
                aria-pressed={active}
                onClick={() => setTunePreset(item, preset)}
                className={`rounded-xl px-3.5 py-2 text-[13px] transition-colors ${
                  active
                    ? 'studio-pill-on bg-white/15 text-white'
                    : 'border border-white/25 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      )}

      {config.multi && (
        <div className="mt-5 flex flex-wrap gap-2">
          {config.multi.map((piece) => {
            const active = selectedAccessories.includes(piece);
            return (
              <button
                key={piece}
                type="button"
                aria-pressed={active}
                onClick={() => toggleAccessory(piece)}
                className={`rounded-xl px-3.5 py-2 text-[13px] transition-colors ${
                  active
                    ? 'studio-pill-on bg-white/15 text-white'
                    : 'border border-white/25 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                {piece}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 space-y-5">
        {config.sliders.map((slider) => {
          const value = Number(values[slider.key] ?? slider.value);
          return (
            <RangeRow
              key={slider.key}
              label={slider.label}
              value={value}
              min={slider.min}
              max={slider.max}
              onChange={(next) => setTuneValue(item, slider.key, next)}
            />
          );
        })}
      </div>

      <p className="mt-auto pt-6 text-[11px] leading-relaxed text-white/60">
        Tune controls are applied to the live render and replayed with the scan line.
      </p>
    </div>
  );
};

const DnaView: React.FC = () => {
  const { identity, shuffleIdentity, displayName } = useStudio();

  return (
    <div className="flex min-h-full flex-col">
      <ViewHeader title="DNA" note="identity seed" />

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/25 bg-white/5 p-2">
        <svg viewBox="0 0 300 120" role="img" aria-label="Animated DNA helix" className="w-full">
          <g className="studio-dna">
            {Array.from({ length: 26 }).map((_, index) => {
              const x = 28 + index * 9.8;
              const phase = index * 0.42;
              const y1 = 60 + Math.sin(phase) * 38;
              const y2 = 60 + Math.sin(phase + Math.PI) * 38;
              const depth = (Math.sin(phase) + 1) / 2;
              return (
                <g key={index}>
                  <line
                    x1={x}
                    y1={y1}
                    x2={x}
                    y2={y2}
                    stroke="white"
                    strokeWidth="1"
                    opacity={0.15 + depth * 0.25}
                  />
                  <circle cx={x} cy={y1} r={2 + depth * 2.4} fill="white" opacity={0.4 + depth * 0.6} />
                  <circle cx={x} cy={y2} r={2 + (1 - depth) * 2.4} fill="white" opacity={0.4 + (1 - depth) * 0.6} />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <dl className="mt-5 divide-y divide-white/15 text-sm">
        {[
          ['Seed', identity.seed],
          ['Heritage', identity.heritage],
          ['Age', String(identity.age)],
          ['Eye colour', identity.eye],
          ['Hair', identity.hair],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-white/55">{label}</dt>
            <dd className="text-right text-white">{value}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        onClick={shuffleIdentity}
        className="mt-auto flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-white text-sm text-white transition-colors hover:bg-white hover:text-[#171414]"
      >
        <RefreshCw className="h-4 w-4" />
        Re-seed identity
      </button>
      <p className="mt-3 text-center text-[11px] text-white/60">Current name: {displayName}</p>
    </div>
  );
};

const BodyView: React.FC = () => {
  const {
    view,
    setHeight,
    setBuild,
    posture,
    setPosture,
    setFraming,
  } = useStudio();

  return (
    <div className="flex min-h-full flex-col">
      <ViewHeader title="Body" note="live proportions" />

      <div className="mt-6 space-y-6">
        <RangeRow
          label="Height"
          value={view.height}
          min={150}
          max={185}
          suffix="cm"
          onChange={(value) => setHeight(value)}
          onCommit={(value) => setHeight(value, true)}
        />
        <RangeRow
          label="Build"
          value={view.build}
          min={0}
          max={100}
          onChange={(value) => setBuild(value)}
          onCommit={(value) => setBuild(value, true)}
        />
      </div>

      <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45">
        Posture
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {['Relaxed', 'Confident', 'Editorial'].map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={posture === item}
            onClick={() => setPosture(item)}
            className={`rounded-xl px-3.5 py-2 text-[13px] transition-colors ${
              posture === item
                ? 'studio-pill-on bg-white/15 text-white'
                : 'border border-white/25 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45">
        Framing
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(['Full', 'Mid', 'Portrait'] as Framing[]).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={view.framing === item}
            onClick={() => setFraming(item)}
            className={`rounded-xl px-3.5 py-2 text-[13px] transition-colors ${
              view.framing === item
                ? 'studio-pill-on bg-white/15 text-white'
                : 'border border-white/25 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item === 'Full' ? 'Full body' : item === 'Mid' ? 'Mid shot' : 'Portrait'}
          </button>
        ))}
      </div>

      <p className="mt-auto pt-6 text-[11px] leading-relaxed text-white/60">
        Height and build commit to history on release. Framing stays in sync with the Pose button.
      </p>
    </div>
  );
};

const PersonalityView: React.FC = () => {
  const {
    traits,
    toggleTrait,
    radarEnergy,
    setRadarEnergy,
    radarOpenness,
    setRadarOpenness,
    scores,
  } = useStudio();

  return (
    <div className="flex min-h-full flex-col">
      <ViewHeader title="Personality" note="pick up to 3" />

      <div className="mt-4 flex flex-wrap gap-2">
        {TRAITS.map((trait) => {
          const active = traits.includes(trait);
          return (
            <button
              key={trait}
              type="button"
              aria-pressed={active}
              onClick={() => toggleTrait(trait)}
              className={`rounded-xl px-3 py-1.5 text-[13px] transition-colors ${
                active
                  ? 'studio-pill-on bg-white/15 text-white'
                  : 'border border-white/25 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white'
              }`}
            >
              {trait}
            </button>
          );
        })}
      </div>

      <Radar scores={scores} />

      <div className="mt-4 space-y-5">
        <RangeRow
          label="Openness"
          value={radarOpenness}
          min={30}
          max={94}
          onChange={setRadarOpenness}
        />
        <RangeRow
          label="Energy"
          value={radarEnergy}
          min={30}
          max={94}
          onChange={setRadarEnergy}
        />
      </div>
    </div>
  );
};

const Radar: React.FC<{ scores: number[] }> = ({ scores }) => {
  const cx = 125;
  const cy = 105;
  const radius = 78;
  const axes = ['Openness', 'Energy', 'Warmth', 'Focus', 'Humour'];
  const point = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const distance = (value / 100) * radius;
    return [cx + Math.cos(angle) * distance, cy + Math.sin(angle) * distance];
  };
  const polygon = scores
    .map((value, index) => point(index, value).join(','))
    .join(' ');

  return (
    <div className="mt-5 rounded-2xl border border-white/20 bg-white/5 p-2">
      <svg viewBox="0 0 250 230" role="img" aria-label="Personality radar" className="w-full">
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon
            key={scale}
            points={axes
              .map((_, index) => {
                const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
                return `${cx + Math.cos(angle) * radius * scale},${cy + Math.sin(angle) * radius * scale}`;
              })
              .join(' ')}
            fill="none"
            stroke="white"
            strokeWidth="0.8"
            opacity="0.18"
          />
        ))}
        {axes.map((_, index) => {
          const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
          return (
            <line
              key={index}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(angle) * radius}
              y2={cy + Math.sin(angle) * radius}
              stroke="white"
              strokeWidth="0.8"
              opacity="0.18"
            />
          );
        })}
        <polygon
          points={polygon}
          fill="rgba(255,255,255,.28)"
          stroke="white"
          strokeWidth="1.5"
        />
        {axes.map((label, index) => {
          const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
          const x = cx + Math.cos(angle) * (radius + 18);
          const y = cy + Math.sin(angle) * (radius + 18);
          return (
            <text
              key={label}
              x={x}
              y={y}
              fill="white"
              opacity="0.7"
              fontSize="10"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const StoryView: React.FC = () => {
  const {
    displayName,
    view,
    identity,
    look,
    traits,
    storyKey,
    rewriteStory,
    reduceMotion,
  } = useStudio();
  const [typed, setTyped] = useState('');

  const bio = `${displayName} is ${view.height} cm of ${traits[0]?.toLowerCase() ?? 'quiet'} energy from ${identity.city}. Mornings start with a long walk along the river in her ${look.name.toLowerCase()} look; friends call her ${traits[1]?.toLowerCase() ?? 'warm'} and a little ${traits[2]?.toLowerCase() ?? 'curious'}. She collects film cameras, keeps a sketchbook of strangers' outfits, and is saving for a studio of her own.`;

  useEffect(() => {
    if (reduceMotion) {
      setTyped(bio);
      return;
    }
    setTyped('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setTyped(bio.slice(0, index));
      if (index >= bio.length) window.clearInterval(timer);
    }, 22);
    return () => window.clearInterval(timer);
  }, [bio, reduceMotion, storyKey]);

  return (
    <div className="flex min-h-full flex-col">
      <ViewHeader title="Story" note="auto-written from your choices" />
      <div className="mt-4 min-h-[260px] rounded-2xl border border-white/25 bg-white/5 p-4 text-[15px] leading-relaxed text-white/80">
        {typed}
        <span className="studio-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-white align-baseline" />
      </div>
      <button
        type="button"
        onClick={rewriteStory}
        className="mt-auto flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-white text-sm text-white transition-colors hover:bg-white hover:text-[#171414]"
      >
        <RefreshCw className="h-4 w-4" />
        Rewrite story
      </button>
    </div>
  );
};

const ControlBar: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
  const { canUndo, canRedo, undo, redo, pose, reset, view } = useStudio();
  const items = [
    { label: 'Undo', icon: Undo2, onClick: undo, disabled: !canUndo },
    { label: 'Redo', icon: Redo2, onClick: redo, disabled: !canRedo },
    { label: `Pose: ${view.framing}`, icon: PersonStanding, onClick: pose, disabled: false },
    { label: 'Reset', icon: RotateCcw, onClick: reset, disabled: false },
  ];

  return (
    <div
      className={`studio-glass flex items-center rounded-[18px] ${
        desktop
          ? 'absolute left-[504px] top-[742px] h-[54px] w-[592px]'
          : 'w-full p-1'
      }`}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          disabled={item.disabled}
          aria-label={item.label}
          className={`flex h-11 flex-1 items-center justify-center gap-2 text-[14px] text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 sm:text-[16px] ${
            item.label.startsWith('Pose') ? 'studio-pill-on rounded-[14px]' : ''
          }`}
        >
          <item.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{item.label}</span>
          <span className="sm:hidden">{item.label.split(':')[0]}</span>
        </button>
      ))}
    </div>
  );
};

const RealismPanel: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
  const { view, setRealism } = useStudio();

  return (
    <div
      className={`studio-glass rounded-[18px] p-4 ${
        desktop ? 'absolute left-[24px] top-[796px] h-[88px] w-[452px]' : 'w-full'
      }`}
    >
      <RangeRow
        label="Realism"
        value={view.realism}
        min={0}
        max={100}
        suffix="%"
        onChange={(value) => setRealism(value)}
        onCommit={(value) => setRealism(value, true)}
        endLabels={['Stylized', 'Hyper Realistic']}
      />
    </div>
  );
};

const FilterPanel: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
  const {
    view,
    activeFilter,
    filterOpen,
    setFilterOpen,
    filterOffset,
    setFilterOffset,
    setFilter,
    look,
  } = useStudio();
  const windowFilters = Array.from({ length: 5 }, (_, index) => FILTERS[(filterOffset + index) % FILTERS.length]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (event: PointerEvent) => {
      if (filterRef.current?.contains(event.target as Node)) return;
      setFilterOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [filterOpen, setFilterOpen]);

  return (
    <div
      ref={filterRef}
      className={`studio-glass flex flex-col gap-3 rounded-[18px] p-4 sm:flex-row sm:items-center sm:gap-4 ${
        desktop ? 'absolute left-[494px] top-[796px] h-[88px] w-[640px]' : 'w-full'
      }`}
    >
      <div className="relative shrink-0">
        <p className="text-sm text-white">Filter</p>
        <button
          type="button"
          onClick={() => setFilterOpen(!filterOpen)}
          aria-expanded={filterOpen}
          aria-haspopup="listbox"
          className="mt-1 flex h-[38px] w-[156px] items-center justify-between gap-2 rounded-xl border border-white/30 bg-white/10 px-3 text-xs text-white"
        >
          {activeFilter.name}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${filterOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {filterOpen && (
            <motion.ul
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              role="listbox"
              aria-label="Filter"
              className="studio-glass absolute bottom-[46px] left-0 z-40 w-[156px] rounded-xl p-1"
            >
              {FILTERS.map((filter) => (
                <li key={filter.name}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={view.filter === filter.name}
                    onClick={() => setFilter(filter.name)}
                    className={`w-full rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                      view.filter === filter.name
                        ? 'bg-white/15 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {filter.name}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="studio-no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1">
          {windowFilters.map((filter) => {
            const active = filter.name === view.filter;
            return (
              <button
                key={filter.name}
                type="button"
                aria-label={`Apply ${filter.name} filter`}
                aria-pressed={active}
                onClick={() => setFilter(filter.name)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-transform hover:-translate-y-[3px] ${
                  active ? 'studio-pill-on border-white' : 'border-white/25'
                }`}
              >
                <FaceCrop
                  look={look}
                  size={64}
                  filter={filter.grade === 'none' ? undefined : filter.grade}
                  className="rounded-xl"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 mix-blend-soft-light"
                  style={{ background: filter.tint }}
                />
                <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1 py-0.5 text-center text-[11px] text-white">
                  {filter.name}
                </span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Show next filters"
          onClick={() => setFilterOffset((offset) => (offset + 1) % FILTERS.length)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/10"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const SavePanel: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
  const { saveLook, libraryOpen } = useStudio();
  return (
    <div
      className={`studio-glass rounded-[18px] p-3.5 ${
        desktop ? 'absolute left-[1302px] top-[796px] h-[88px] w-[274px]' : 'w-full'
      }`}
    >
      <button
        type="button"
        onClick={saveLook}
        aria-haspopup={libraryOpen ? 'dialog' : undefined}
        className="studio-save group relative flex h-full min-h-[58px] w-full items-center justify-center overflow-hidden rounded-2xl border-[1.5px] border-white text-[15px] tracking-[0.06em] text-white transition-colors hover:bg-white hover:text-[#171414] sm:text-[17px]"
      >
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 group-active:left-[120%] group-active:opacity-100" />
        SAVE TO LIBRARY
      </button>
    </div>
  );
};

const LibraryDrawer: React.FC<{ desktop?: boolean }> = ({ desktop = false }) => {
  const {
    saved,
    libraryOpen,
    setLibraryOpen,
    applySaved,
  } = useStudio();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!libraryOpen) return;
    const onDown = (event: PointerEvent) => {
      if (drawerRef.current?.contains(event.target as Node)) return;
      setLibraryOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [libraryOpen, setLibraryOpen]);

  return (
    <AnimatePresence>
      {libraryOpen && (
        <motion.div
          ref={drawerRef}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className={
            desktop
              ? 'studio-glass absolute left-[504px] top-[560px] z-40 h-[170px] w-[592px] rounded-[22px] p-4'
              : 'fixed inset-x-4 bottom-4 z-[70] max-h-[70vh] overflow-y-auto rounded-[22px] p-4 studio-glass'
          }
          role="dialog"
          aria-label="Saved look library"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm uppercase tracking-[0.06em] text-white">Library</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">{saved.length} saved</span>
              <button
                type="button"
                aria-label="Close library"
                onClick={() => setLibraryOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {saved.length === 0 ? (
            <p className="mt-6 text-sm text-white/65">Save a look to start your library.</p>
          ) : (
            <div className="studio-no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
              {saved.map((item) => {
                const savedLook = LOOKS[item.snapshot.look];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => applySaved(item.snapshot)}
                    className="group relative h-[104px] w-[72px] shrink-0 overflow-hidden rounded-xl border border-white/30 bg-white/10"
                    aria-label={`Load saved ${savedLook.name} look`}
                  >
                    <img
                      src={savedLook.src}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-contain object-bottom p-1"
                    />
                    <span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-1 py-0.5 text-center text-[9px] text-white">
                      {savedLook.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const RangeRow: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  endLabels?: [string, string];
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
}> = ({ label, value, min, max, suffix = '', endLabels, onChange, onCommit }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const inputId = useId();
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="text-white/75" htmlFor={inputId}>
          {label}
        </label>
        <span className="font-semibold text-white">
          {Math.round(value)}
          {suffix}
        </span>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onPointerUp={(event) => onCommit?.(Number(event.currentTarget.value))}
        onKeyUp={(event) => onCommit?.(Number(event.currentTarget.value))}
        className="studio-range mt-2 w-full"
        style={{ '--p': `${percentage}%` } as CSSProperties}
      />
      {endLabels && (
        <div className="mt-1 flex items-center justify-between text-[11px] text-white/65">
          <span>{endLabels[0]}</span>
          <span>{endLabels[1]}</span>
        </div>
      )}
    </div>
  );
};

const Toast: React.FC = () => {
  const { toast, reduceMotion } = useStudio();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={reduceMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 240, damping: 20 }}
          role="status"
          className="studio-glass fixed left-1/2 top-24 z-[80] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm text-white"
        >
          <Check className="h-4 w-4" />
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StylingStudio;
