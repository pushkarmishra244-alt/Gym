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
  ChevronDown,
  Dumbbell,
  Apple
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
  memberTab?: 'dashboard' | 'schedule' | 'workouts' | 'nutrition' | 'progress' | 'messages' | 'pass';
  onMemberTabChange?: (tab: 'dashboard' | 'schedule' | 'workouts' | 'nutrition' | 'progress' | 'messages' | 'pass') => void;
  trainerTab?: 'clients' | 'attendance' | 'trainer_analytics';
  onTrainerTabChange?: (tab: 'clients' | 'attendance' | 'trainer_analytics') => void;
  gymAdminTab?: 'members' | 'trainers' | 'classes' | 'plans' | 'gym_analytics' | 'billing';
  onGymAdminTabChange?: (tab: 'members' | 'trainers' | 'classes' | 'plans' | 'gym_analytics' | 'billing') => void;
  superAdminTab?: 'gyms' | 'plans' | 'logs' | 'analytics';
  onSuperAdminTabChange?: (tab: 'gyms' | 'plans' | 'logs' | 'analytics') => void;
}

export default function DashboardLayout({
  currentUser,
  activeGym,
  children,
  onResetDb,
  activePage,
  onPageChange,
  onUserUpdate,
  memberTab,
  onMemberTabChange,
  trainerTab,
  onTrainerTabChange,
  gymAdminTab,
  onGymAdminTabChange,
  superAdminTab,
  onSuperAdminTabChange
}: DashboardLayoutProps) {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('');

  const getMenuLabel = () => {
    if (activePage === 'member' || activePage === 'pass') return 'Member Portal';
    if (activePage === 'trainer') return 'Trainer Hub';
    if (activePage === 'gym_admin') return 'Gym Admin';
    if (activePage === 'super_admin') return 'Platform Admin';
    return 'Menu';
  };

  const getNavItems = () => {
    if (activePage === 'member' || activePage === 'pass') {
      return [
        { label: 'Book Classes', icon: Calendar, active: activePage === 'member' && memberTab === 'schedule', onClick: () => { onPageChange('member'); onMemberTabChange?.('schedule'); } },
        { label: 'My Exercises', icon: Dumbbell, active: activePage === 'member' && memberTab === 'workouts', onClick: () => { onPageChange('member'); onMemberTabChange?.('workouts'); } },
        { label: 'Diet Tracker', icon: Apple, active: activePage === 'member' && memberTab === 'nutrition', onClick: () => { onPageChange('member'); onMemberTabChange?.('nutrition'); } },
        { label: 'Weight Log', icon: TrendingUp, active: activePage === 'member' && memberTab === 'progress', onClick: () => { onPageChange('member'); onMemberTabChange?.('progress'); } },
        { label: 'Chat Coach', icon: MessageSquare, active: activePage === 'member' && memberTab === 'messages', onClick: () => { onPageChange('member'); onMemberTabChange?.('messages'); } },
        { label: 'Membership Pass', icon: CreditCard, active: activePage === 'pass', onClick: () => { onPageChange('pass'); } },
      ];
    } else if (activePage === 'trainer') {
      return [
        { label: 'Client Roster', icon: Users, active: trainerTab === 'clients', onClick: () => onTrainerTabChange?.('clients') },
        { label: 'Session Log', icon: UserCheck, active: trainerTab === 'attendance', onClick: () => onTrainerTabChange?.('attendance') },
        { label: 'Performance', icon: TrendingUp, active: trainerTab === 'trainer_analytics', onClick: () => onTrainerTabChange?.('trainer_analytics') },
      ];
    } else if (activePage === 'gym_admin') {
      return [
        { label: 'Members', icon: Users, active: gymAdminTab === 'members', onClick: () => onGymAdminTabChange?.('members') },
        { label: 'Trainers', icon: UserCheck, active: gymAdminTab === 'trainers', onClick: () => onGymAdminTabChange?.('trainers') },
        { label: 'Classes', icon: Calendar, active: gymAdminTab === 'classes', onClick: () => onGymAdminTabChange?.('classes') },
        { label: 'Membership Plans', icon: CreditCard, active: gymAdminTab === 'plans', onClick: () => onGymAdminTabChange?.('plans') },
        { label: 'Billing & Invoices', icon: Briefcase, active: gymAdminTab === 'billing', onClick: () => onGymAdminTabChange?.('billing') },
        { label: 'Revenue Analytics', icon: TrendingUp, active: gymAdminTab === 'gym_analytics', onClick: () => onGymAdminTabChange?.('gym_analytics') },
      ];
    } else if (activePage === 'super_admin') {
      return [
        { label: 'Gyms', icon: Briefcase, active: superAdminTab === 'gyms', onClick: () => onSuperAdminTabChange?.('gyms') },
        { label: 'Subscriptions', icon: CreditCard, active: superAdminTab === 'plans', onClick: () => onSuperAdminTabChange?.('plans') },
        { label: 'Platform Revenue', icon: TrendingUp, active: superAdminTab === 'analytics', onClick: () => onSuperAdminTabChange?.('analytics') },
        { label: 'Logs', icon: Shield, active: superAdminTab === 'logs', onClick: () => onSuperAdminTabChange?.('logs') },
      ];
    }
    return [];
  };

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
              {getMenuLabel()}
            </span>
            {getNavItems().map((item, idx) => {
              const Icon = item.icon;
              const isActive = item.active;
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
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
        </div>

        {/* Compact Main Sidebar Profile Section (All Roles) */}
        <div className="px-4 py-3 border-t border-slate-50 shrink-0">
          <div className="flex items-center justify-between p-2 bg-slate-50 hover:bg-slate-100/70 rounded-xl border border-slate-100/50 transition-all group">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'Guest'}`}
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-white shadow-3xs object-cover bg-white shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-800 truncate leading-tight">{currentUser?.name || 'Guest'}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate leading-none">
                  {currentUser?.role === 'SUPER_ADMIN' 
                    ? 'Pro Owner' 
                    : currentUser?.role === 'GYM_ADMIN' 
                      ? 'Gym Owner' 
                      : currentUser?.role === 'TRAINER' 
                        ? 'Trainer Coach' 
                        : 'Member'}
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenEditProfile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100 shadow-3xs cursor-pointer transition-all shrink-0"
              title="Edit Profile"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
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
          <main className="flex-1 p-6 md:p-8 min-w-0 flex flex-col justify-between">
            <div className="flex-1">
              {children}
            </div>

            {/* Expanded Showcase & Role-Switching Footer */}
            <footer className="mt-12 pt-8 border-t border-slate-100/80 text-[10px] text-slate-400 font-mono tracking-wider uppercase shrink-0 space-y-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                
                {/* Left Panel: Copyright, Tagline & Disclaimer */}
                <div className="text-center lg:text-left space-y-1.5 max-w-md">
                  <div className="font-black text-slate-600 tracking-tight flex items-center justify-center lg:justify-start gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                    <span>© 2026 GYMFLOW WORKSPACE</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-normal leading-normal">
                    GYMFLOW — FULL-STACK GYM & FITNESS SAAS DEMO
                  </p>
                  <p className="text-[8px] text-slate-400/70 font-normal normal-case leading-normal">
                    All data shown is simulated mock data for demonstration purposes. Personal details, weights, or schedules do not correspond to real individuals.
                  </p>
                </div>

                {/* Middle Panel: Showcase Badge & Icons */}
                <div className="flex flex-col items-center gap-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200/50 text-[9px] font-bold">
                    <span>SHOWCASE / PORTFOLIO PROJECT</span>
                  </div>
                  {/* Social Icons (GitHub, LinkedIn, Email) */}
                  <div className="flex items-center gap-3">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="p-1 text-slate-400 hover:text-slate-600 transition-colors" title="GitHub">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-1 text-slate-400 hover:text-slate-600 transition-colors" title="LinkedIn">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="mailto:demo@gymflow.com" className="p-1 text-slate-400 hover:text-slate-600 transition-colors" title="Email Support">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Right Panel: Active Page Swappers */}
                <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-4 gap-y-2">
                  <button 
                    type="button"
                    onClick={() => onPageChange('member')}
                    className={`hover:text-indigo-600 transition-colors cursor-pointer ${activePage === 'member' || activePage === 'pass' ? 'text-indigo-500 font-bold' : ''}`}
                  >
                    Member Portal
                  </button>
                  <span className="text-slate-200 shrink-0">•</span>
                  <button 
                    type="button"
                    onClick={() => onPageChange('trainer')}
                    className={`hover:text-emerald-600 transition-colors cursor-pointer ${activePage === 'trainer' ? 'text-emerald-500 font-bold' : ''}`}
                  >
                    Trainer Hub
                  </button>
                  <span className="text-slate-200 shrink-0">•</span>
                  <button 
                    type="button"
                    onClick={() => onPageChange('gym_admin')}
                    className={`hover:text-indigo-600 transition-colors cursor-pointer ${activePage === 'gym_admin' ? 'text-indigo-600 font-bold' : ''}`}
                  >
                    Gym Owner Admin
                  </button>
                  <span className="text-slate-200 shrink-0">•</span>
                  <button 
                    type="button"
                    onClick={() => onPageChange('super_admin')}
                    className={`hover:text-rose-600 transition-colors cursor-pointer ${activePage === 'super_admin' ? 'text-rose-500 font-bold' : ''}`}
                  >
                    Pro Platform Admin
                  </button>
                </div>

              </div>
            </footer>
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
                      {getMenuLabel()}
                    </span>
                    {getNavItems().map((item, idx) => {
                      const Icon = item.icon;
                      const isActive = item.active;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            item.onClick();
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

