/**
 * Lucide icons imported from direct module paths to avoid production minification
 * "X is not a constructor" / "X is not defined" errors. Use getIcon() or named exports.
 */
import React from 'react';

// Direct imports from lucide-react/icons/* (Vite alias)
import MenuIcon from 'lucide-react/icons/menu';
import SearchIcon from 'lucide-react/icons/search';
import ZapIcon from 'lucide-react/icons/zap';
import ChevronDownIcon from 'lucide-react/icons/chevron-down';
import ChevronRightIcon from 'lucide-react/icons/chevron-right';
import BriefcaseIcon from 'lucide-react/icons/briefcase';
import PlusIcon from 'lucide-react/icons/plus';
import SettingsIcon from 'lucide-react/icons/settings';
import BellIcon from 'lucide-react/icons/bell';
import PanelLeftIcon from 'lucide-react/icons/panel-left';
import HistoryIcon from 'lucide-react/icons/history';
import BotIcon from 'lucide-react/icons/bot';
import LogOutIcon from 'lucide-react/icons/log-out';
import StarIcon from 'lucide-react/icons/star';
import CrownIcon from 'lucide-react/icons/crown';
import GemIcon from 'lucide-react/icons/gem';
import PlayCircleIcon from 'lucide-react/icons/play-circle';
import BarChart2Icon from 'lucide-react/icons/bar-chart-2';
import LockIcon from 'lucide-react/icons/lock';
import ArrowRightIcon from 'lucide-react/icons/arrow-right';
import LayoutGridIcon from 'lucide-react/icons/layout-grid';
import PaletteIcon from 'lucide-react/icons/palette';
import BoxIcon from 'lucide-react/icons/box';
import SwordsIcon from 'lucide-react/icons/swords';
import TargetIcon from 'lucide-react/icons/target';
import DollarSignIcon from 'lucide-react/icons/dollar-sign';
import EyeIcon from 'lucide-react/icons/eye';
import ShoppingCartIcon from 'lucide-react/icons/shopping-cart';
import MailIcon from 'lucide-react/icons/mail';
import GlobeIcon from 'lucide-react/icons/globe';
import SparklesIcon from 'lucide-react/icons/sparkles';
import PenToolIcon from 'lucide-react/icons/pen-tool';
import ShoppingBagIcon from 'lucide-react/icons/shopping-bag';
import VideoIcon from 'lucide-react/icons/video';
import ImageIcon from 'lucide-react/icons/image';
import UsersIcon from 'lucide-react/icons/users';
import RepeatIcon from 'lucide-react/icons/repeat';
import MegaphoneIcon from 'lucide-react/icons/megaphone';
import ShieldIcon from 'lucide-react/icons/shield';
import HeartIcon from 'lucide-react/icons/heart';
import CodeIcon from 'lucide-react/icons/code';
import StoreIcon from 'lucide-react/icons/store';
import TruckIcon from 'lucide-react/icons/truck';
import TagIcon from 'lucide-react/icons/tag';
import MapPinIcon from 'lucide-react/icons/map-pin';
import FacebookIcon from 'lucide-react/icons/facebook';
import MusicIcon from 'lucide-react/icons/music';
import CameraIcon from 'lucide-react/icons/camera';
import ShirtIcon from 'lucide-react/icons/shirt';
import DiscIcon from 'lucide-react/icons/disc';
import FilmIcon from 'lucide-react/icons/film';
import Edit3Icon from 'lucide-react/icons/edit-3';
import MessageSquareIcon from 'lucide-react/icons/message-square';
import GiftIcon from 'lucide-react/icons/gift';
import BookIcon from 'lucide-react/icons/book';
import ClipboardIcon from 'lucide-react/icons/clipboard';
import HashIcon from 'lucide-react/icons/hash';
import LayersIcon from 'lucide-react/icons/layers';
import GitMergeIcon from 'lucide-react/icons/git-merge';
import GridIcon from 'lucide-react/icons/grid';
import MapIcon from 'lucide-react/icons/map';
import StickerIcon from 'lucide-react/icons/sticker';
import LayoutIcon from 'lucide-react/icons/layout';
import TrendingUpIcon from 'lucide-react/icons/trending-up';
import TrendingDownIcon from 'lucide-react/icons/trending-down';
import BrainCircuitIcon from 'lucide-react/icons/brain-circuit';
import MousePointerClickIcon from 'lucide-react/icons/mouse-pointer-click';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Menu: MenuIcon,
  Search: SearchIcon,
  Zap: ZapIcon,
  ChevronDown: ChevronDownIcon,
  ChevronRight: ChevronRightIcon,
  Briefcase: BriefcaseIcon,
  Plus: PlusIcon,
  Settings: SettingsIcon,
  Bell: BellIcon,
  PanelLeft: PanelLeftIcon,
  History: HistoryIcon,
  Bot: BotIcon,
  LogOut: LogOutIcon,
  Star: StarIcon,
  Crown: CrownIcon,
  Gem: GemIcon,
  PlayCircle: PlayCircleIcon,
  BarChart2: BarChart2Icon,
  BarChart3: BarChart2Icon,
  Lock: LockIcon,
  ArrowRight: ArrowRightIcon,
  LayoutGrid: LayoutGridIcon,
  Palette: PaletteIcon,
  Box: BoxIcon,
  Swords: SwordsIcon,
  Target: TargetIcon,
  DollarSign: DollarSignIcon,
  Eye: EyeIcon,
  ShoppingCart: ShoppingCartIcon,
  Mail: MailIcon,
  Globe: GlobeIcon,
  Sparkles: SparklesIcon,
  PenTool: PenToolIcon,
  ShoppingBag: ShoppingBagIcon,
  Video: VideoIcon,
  Image: ImageIcon,
  Users: UsersIcon,
  Repeat: RepeatIcon,
  Megaphone: MegaphoneIcon,
  Shield: ShieldIcon,
  Heart: HeartIcon,
  Code: CodeIcon,
  Store: StoreIcon,
  Truck: TruckIcon,
  Tag: TagIcon,
  MapPin: MapPinIcon,
  Facebook: FacebookIcon,
  Music: MusicIcon,
  Camera: CameraIcon,
  Shirt: ShirtIcon,
  Disc: DiscIcon,
  Film: FilmIcon,
  Edit3: Edit3Icon,
  MessageSquare: MessageSquareIcon,
  Gift: GiftIcon,
  Book: BookIcon,
  Clipboard: ClipboardIcon,
  Hash: HashIcon,
  Layers: LayersIcon,
  GitMerge: GitMergeIcon,
  Grid: GridIcon,
  Map: MapIcon,
  Sticker: StickerIcon,
  Layout: LayoutIcon,
  TrendingUp: TrendingUpIcon,
  TrendingDown: TrendingDownIcon,
  BrainCircuit: BrainCircuitIcon,
  MousePointerClick: MousePointerClickIcon,
};

export function getIcon(name: string, className?: string) {
  const Icon = ICON_MAP[name] ?? LayoutGridIcon;
  const props = { className: className || 'w-4 h-4' };
  return React.createElement(Icon, props);
}

// Named exports for direct use in JSX (Header, Sidebar, etc.)
export const Menu = MenuIcon;
export const Search = SearchIcon;
export const Zap = ZapIcon;
export const ChevronDown = ChevronDownIcon;
export const ChevronRight = ChevronRightIcon;
export const Briefcase = BriefcaseIcon;
export const Plus = PlusIcon;
export const Settings = SettingsIcon;
export const Bell = BellIcon;
export const PanelLeft = PanelLeftIcon;
export const History = HistoryIcon;
export const Bot = BotIcon;
export const LogOut = LogOutIcon;
export const Star = StarIcon;
export const Crown = CrownIcon;
export const Gem = GemIcon;
export const PlayCircle = PlayCircleIcon;
export const BarChart2 = BarChart2Icon;
export const BarChart3 = BarChart2Icon;
export const Lock = LockIcon;
export const ArrowRight = ArrowRightIcon;
export const LayoutGrid = LayoutGridIcon;
export const Target = TargetIcon;
