import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Briefcase, 
  UserCheck, 
  Users, 
  LayoutDashboard, 
  RefreshCw, 
  Menu, 
  X, 
  Pencil,
  CreditCard,
  Flame,
  MessageSquare,
  TrendingUp,
  Compass,
  HelpCircle,
  Settings,
  Search,
  Bell,
  Calendar,
  Trophy,
  Sparkles,
  Plus,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { User, Gym } from '../types';

interface DashboardLayoutProps {
  currentUser: User;
  activeGym?: Gym;
  children: React.ReactNode;
  onResetDb: () => void;
  activePage: 'member' | 'trainer' | 'gym_admin' | 'super_admin' | 'guide' | 'pass';
  onPageChange: (page: 'member' | 'trainer' | 'gym_admin' | 'super_admin' | 'guide' | 'pass') => void;
  onUserUpdate?: (user: User) => void;
}

export default function DashboardLayout({
  currentUser,
  activeGym,
  children,
  onResetDb,
  activePage,
  onPageChange,
  onUserUpdate
}: DashboardLayoutProps) {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('');

  const handleOpenEditProfile = () => {
    setEditedName(currentUser.name);
    setEditedEmail(currentUser.email);
    setEditedAvatar(currentUser.avatarUrl || '');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedName.trim() && editedEmail.trim()) {
      onUserUpdate?.({
        ...currentUser,
        name: editedName,
        email: editedEmail,
        avatarUrl: editedAvatar || undefined,
      });
      setIsEditProfileOpen(false);
    }
  };

  // Custom role style triggers
  const roleMeta = {
    'SUPER_ADMIN': {
      title: 'Platform Owner',
      themeColor: 'red',
      badgeBg: 'bg-red-50 text-red-700 border-red-100',
      dotBg: 'bg-red-500',
      icon: Shield,
      headerTitle: 'Super Admin Command Center',
      headerSub: 'Real-time multi-tenant platform overview and tier matrices'
    },
    'GYM_ADMIN': {
      title: 'Gym Administrator',
      themeColor: 'indigo',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      dotBg: 'bg-indigo-600',
      icon: Briefcase,
      headerTitle: activeGym ? `${activeGym.name} Control HQ` : 'Gym Administration HQ',
      headerSub: `Managing operations, classes and trainers for ${activeGym?.name || 'your gym'}`
    },
    'TRAINER': {
      title: 'Fitness Coach',
      themeColor: 'emerald',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      dotBg: 'bg-emerald-500',
      icon: UserCheck,
      headerTitle: 'Trainer Coaching Hub',
      headerSub: 'Prescribe compound strength workouts, diets, and record class attendances'
    },
    'MEMBER': {
      title: 'Gym Member',
      themeColor: 'amber',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-100',
      dotBg: 'bg-amber-500',
      icon: Users,
      headerTitle: `Member Portal • Welcome, ${(currentUser?.name || 'Guest').split(' ')[0]}`,
      headerSub: 'Track exercise routine completion, calorie intakes, and schedule training classes'
    }
  };

  const currentMeta = roleMeta[currentUser?.role || 'MEMBER'] || roleMeta['MEMBER'];
  const isPassPage = activePage === 'pass';
  
  const HeaderIcon = isPassPage ? CreditCard : (currentMeta?.icon || Users);
  const headerTitle = isPassPage ? "Digital Membership Pass" : (currentMeta?.headerTitle || "Portal");
  const headerSub = isPassPage ? "Verify your Apex Unlimited Gold Pass, check in, and view exclusive elite rewards" : (currentMeta?.headerSub || "Dashboard");
  const iconColorClass = isPassPage 
    ? "text-amber-500" 
    : (currentUser?.role === 'SUPER_ADMIN' 
        ? 'text-red-500' 
        : currentUser?.role === 'GYM_ADMIN' 
          ? 'text-indigo-600' 
          : currentUser?.role === 'TRAINER' 
            ? 'text-emerald-500' 
            : 'text-amber-500');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] font-sans text-slate-900 antialiased relative overflow-x-hidden">
      
      {/* 1. PERSISTENT LEFT SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-100 z-30 shrink-0">
        {/* Brand Header with Flame Icon */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-50 mb-4 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/25 text-white font-black text-base shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-black text-slate-800 tracking-tight leading-none font-display">Fireup</h1>
            <span className="text-[10px] text-slate-400 font-medium block mt-1 uppercase tracking-wider">Workspace</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <div className="space-y-1">
            <span className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block mb-2">
              Menu
            </span>
            {[
              { label: 'Member Portal (/)', icon: LayoutDashboard, page: 'member' as const, color: 'text-indigo-600' },
              { label: 'Trainer Dashboard (/trainer)', icon: UserCheck, page: 'trainer' as const, color: 'text-emerald-500' },
              { label: 'Gym Owner Admin (/admin)', icon: Briefcase, page: 'gym_admin' as const, color: 'text-indigo-600' },
              { label: 'Pro Platform Admin (/proadmin)', icon: Shield, page: 'super_admin' as const, color: 'text-rose-500' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => onPageChange(item.page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-50 text-indigo-600 font-bold border border-slate-100 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Classes Filters / Extras */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono block mb-2">
              Classes
            </span>
            {[
              { label: 'CrossFit', color: 'bg-emerald-400' },
              { label: 'HIIT', color: 'bg-orange-400' },
              { label: 'Yoga', color: 'bg-amber-400' },
            ].map((cl) => (
              <button
                key={cl.label}
                onClick={() => {
                  onPageChange('member');
                  alert(`${cl.label} training category selected. Dynamic schedule timeline sorted.`);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50/45 text-left cursor-pointer"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cl.color}`}></span>
                <span>{cl.label}</span>
              </button>
            ))}

            <div className="pt-2">
              <button
                onClick={() => onPageChange('pass')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activePage === 'pass'
                    ? 'bg-amber-50 text-amber-800 border border-amber-100 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                }`}
              >
                <CreditCard className={`w-4 h-4 shrink-0 ${activePage === 'pass' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>Membership Pass</span>
                {activePage === 'pass' && (
                  <span className="ml-auto bg-amber-500 text-[8px] font-bold text-white px-1.5 py-0.5 rounded uppercase">Gold</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-50 shrink-0 space-y-2">
          <button
            onClick={() => onPageChange('guide')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activePage === 'guide'
                ? 'bg-slate-50 text-indigo-600 font-bold border border-slate-100'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Help & Docs</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all mock records to default database seeds? This clears custom gyms, plans, and workout dispatches.")) {
                onResetDb();
              }
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Reset Database</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE TOP NAVBAR (Only shown on < md screens) */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-40 w-full shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-sm">
            <Flame className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-sm font-black text-slate-800 tracking-tight font-display">Fireup</span>
        </div>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 cursor-pointer hover:bg-slate-100 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* 3. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        
        {/* Layout Split Screen: Content and optional Right Sidebar */}
        <div className="flex-1 flex flex-col xl:flex-row">
          
          {/* CENTER PANEL CONTENT */}
          <main className="flex-1 p-6 md:p-8 min-w-0">
            {children}
          </main>

          {/* 4. PERSISTENT RIGHT SIDEBAR (Only visible on XL screens for Member/Pass views) */}
          {(activePage === 'member' || activePage === 'pass') && (
            <aside className="hidden xl:flex flex-col w-80 shrink-0 bg-white border-l border-slate-100 p-6 space-y-8 min-h-screen sticky top-0 overflow-y-auto">
              
              {/* Profile Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-800 tracking-tight font-display">Profile</h3>
                  <button
                    onClick={handleOpenEditProfile}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                {/* Profile Card Mockup */}
                <div className="flex flex-col items-center text-center p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <div className="relative">
                    <img 
                      src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'Guest'}`}
                      alt="Profile" 
                      className="w-16 h-16 rounded-full border border-white shadow-sm object-cover bg-white shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"></span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-800 mt-3 tracking-wide">{currentUser?.name || 'Guest'}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
                    {currentUser?.role === 'MEMBER' ? 'VIP Gym Member' : 'Gym Manager'}
                  </p>

                  {/* Profile mini info grid - mirroring the mock stats perfectly */}
                  <div className="grid grid-cols-3 gap-2 w-full mt-4 border-t border-slate-100/60 pt-4">
                    <div className="bg-white border border-slate-100 rounded-xl py-2 px-1 text-center shadow-3xs">
                      <span className="text-[8px] text-slate-400 uppercase font-mono block">Age</span>
                      <span className="font-mono text-[11px] font-extrabold text-slate-800 block mt-0.5">32</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl py-2 px-1 text-center shadow-3xs">
                      <span className="text-[8px] text-slate-400 uppercase font-mono block">Exp</span>
                      <span className="font-mono text-[11px] font-extrabold text-slate-800 block mt-0.5">10 yrs</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl py-2 px-1 text-center shadow-3xs">
                      <span className="text-[8px] text-slate-400 uppercase font-mono block">Rank</span>
                      <span className="font-mono text-[11px] font-extrabold text-slate-800 block mt-0.5">Manager</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Miniature Beautiful Calendar Widget */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-800 tracking-tight font-display">Calendar</h3>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">July 2026</span>
                </div>

                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  {/* Days header */}
                  <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] text-slate-400 uppercase tracking-widest font-mono mb-2">
                    <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                  </div>
                  {/* July 2026 Grid (July 1 is Wednesday) */}
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono">
                    {/* Empty slots for Sun, Mon, Tue */}
                    <span className="text-slate-300 py-1">-</span>
                    <span className="text-slate-300 py-1">-</span>
                    <span className="text-slate-300 py-1">-</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">1</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">2</span>
                    {/* Highlighted Today's date July 3 */}
                    <span className="bg-indigo-600 text-white font-black py-1 rounded shadow-xs relative">
                      3
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                    </span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">4</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">5</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">6</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">7</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">8</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">9</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">10</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">11</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">12</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">13</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">14</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">15</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">16</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">17</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">18</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">19</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">20</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">21</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">22</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">23</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">24</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">25</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">26</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">27</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">28</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">29</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">30</span>
                    <span className="text-slate-600 py-1 hover:bg-white rounded cursor-pointer">31</span>
                  </div>
                </div>
              </div>

              {/* Challenges Progress Widgets */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-800 tracking-tight font-display">Challenges</h3>
                
                <div className="space-y-3">
                  {/* Challenge 1 */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                    <div className="space-y-1">
                      <strong className="text-xs font-extrabold text-slate-800 block">Food Challenge</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">Streak: 21 days</span>
                    </div>
                    {/* SVG circular progress */}
                    <div className="relative w-10 h-10">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-indigo-600" strokeWidth="2.5" strokeDasharray="75, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[9px] text-slate-700">75%</span>
                    </div>
                  </div>

                  {/* Challenge 2 */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                    <div className="space-y-1">
                      <strong className="text-xs font-extrabold text-slate-800 block">Lose weight to 12kg</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">Completed: 6.2 / 12kg</span>
                    </div>
                    {/* SVG circular progress */}
                    <div className="relative w-10 h-10">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-amber-500" strokeWidth="2.5" strokeDasharray="52, 100" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[9px] text-slate-700">52%</span>
                    </div>
                  </div>
                </div>
              </div>

            </aside>
          )}

        </div>

      </div>

      {/* 5. SLIDE-OUT MOBILE DRAWER MENU */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
            {/* Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs cursor-pointer"
            ></motion.div>

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                className="w-screen max-w-xs bg-white text-slate-800 flex flex-col shadow-2xl relative h-full pointer-events-auto overflow-hidden rounded-l-2xl"
              >
                {/* Mobile Drawer Header */}
                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-extrabold text-sm">
                      <Flame className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm tracking-tight leading-none block">Fireup</span>
                      <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Workspace</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer Menu Navigation */}
                <nav className="p-5 space-y-6 flex-1 overflow-y-auto bg-white">
                  <div className="space-y-1">
                    <span className="px-3 text-[9px] uppercase font-bold tracking-widest text-slate-400 font-mono block mb-2">
                      Menu
                    </span>
                    {[
                      { label: 'Member Portal (/)', icon: LayoutDashboard, page: 'member' as const },
                      { label: 'Trainer Dashboard (/trainer)', icon: UserCheck, page: 'trainer' as const },
                      { label: 'Gym Owner Admin (/admin)', icon: Briefcase, page: 'gym_admin' as const },
                      { label: 'Pro Platform Admin (/proadmin)', icon: Shield, page: 'super_admin' as const },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = activePage === item.page;
                      return (
                        <button
                          key={item.page}
                          onClick={() => {
                            onPageChange(item.page);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                            isActive
                              ? 'bg-slate-50 text-indigo-600 font-bold border border-slate-100'
                              : 'text-slate-600 hover:bg-slate-50/50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1">
                    <span className="px-3 text-[9px] uppercase font-bold tracking-widest text-slate-400 font-mono block mb-2">
                      Classes
                    </span>
                    {[
                      { label: 'CrossFit', color: 'bg-emerald-400' },
                      { label: 'HIIT', color: 'bg-orange-400' },
                      { label: 'Yoga', color: 'bg-amber-400' },
                    ].map((cl) => (
                      <button
                        key={cl.label}
                        onClick={() => {
                          onPageChange('member');
                          setIsSidebarOpen(false);
                          alert(`${cl.label} category enabled!`);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-500 hover:bg-slate-50/50 text-left cursor-pointer"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cl.color}`}></span>
                        <span>{cl.label}</span>
                      </button>
                    ))}

                    <div className="pt-3">
                      <button
                        onClick={() => {
                          onPageChange('pass');
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                          activePage === 'pass'
                            ? 'bg-amber-50 text-amber-800 font-bold border border-amber-100'
                            : 'text-slate-600'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Membership Pass</span>
                      </button>
                    </div>
                  </div>
                </nav>

                {/* Mobile Drawer Account Footer */}
                <div className="p-5 bg-slate-50 border-t border-slate-100 shrink-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'Guest'}`} 
                      alt="Avatar" 
                      className="w-9 h-9 rounded-full border border-slate-200 object-cover bg-white shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left min-w-0 flex-1">
                      <span className="font-bold text-slate-800 text-xs block leading-tight truncate">{currentUser?.name || 'Guest'}</span>
                      <span className="text-[9px] text-slate-400 block truncate mt-0.5">{currentUser?.email || ''}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsSidebarOpen(false);
                        handleOpenEditProfile();
                      }}
                      className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsSidebarOpen(false);
                        if (window.confirm("Reset Simulation state?")) {
                          onResetDb();
                        }
                      }}
                      className="py-1.5 px-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs cursor-pointer"
            ></motion.div>

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white border border-slate-100 rounded-2xl shadow-2xl max-w-md w-full relative z-10 overflow-hidden text-slate-800 flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight font-display">Edit Profile Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono mb-1.5">
                    Profile Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-hidden transition-all bg-white"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-hidden transition-all bg-white"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono mb-1.5">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={editedAvatar}
                    onChange={(e) => setEditedAvatar(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 outline-hidden transition-all bg-white font-mono"
                    placeholder="https://example.com/avatar.png (Optional)"
                  />
                  <p className="mt-1.5 text-[9px] text-slate-400 leading-normal">
                    Leave blank to automatically use a modern generative vector avatar based on your name.
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-100 hover:bg-slate-50 transition-all cursor-pointer text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

