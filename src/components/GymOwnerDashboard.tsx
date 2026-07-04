import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  Plus, 
  Check, 
  X, 
  AlertTriangle, 
  Trash2, 
  Settings, 
  ShieldAlert, 
  Search, 
  Clock, 
  UserPlus, 
  Tag,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { 
  Gym, 
  SubscriptionPlan, 
  MembershipPlan, 
  User, 
  Trainer, 
  Member, 
  FitnessClass 
} from '../types';
import { db } from '../data/mockData';

interface GymOwnerDashboardProps {
  gym: Gym;
  saasPlan: SubscriptionPlan;
  members: Member[];
  trainers: Trainer[];
  classes: FitnessClass[];
  gymPlans: MembershipPlan[];
  onMembersUpdate: (members: Member[]) => void;
  onTrainersUpdate: (trainers: Trainer[]) => void;
  onClassesUpdate: (classes: FitnessClass[]) => void;
  onGymPlansUpdate: (plans: MembershipPlan[]) => void;
  onUsersUpdate: (users: User[]) => void;
  onLogsUpdate: (logs: any) => void;
  currentUser: User;
}

export default function GymOwnerDashboard({
  gym,
  saasPlan,
  members,
  trainers,
  classes,
  gymPlans,
  onMembersUpdate,
  onTrainersUpdate,
  onClassesUpdate,
  onGymPlansUpdate,
  onUsersUpdate,
  onLogsUpdate,
  currentUser
}: GymOwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'trainers' | 'classes' | 'plans' | 'gym_analytics'>('members');

  // Interactive Financial Simulator Mock States
  const [simMembersCount, setSimMembersCount] = useState(150);
  const [simMonthlyFee, setSimMonthlyFee] = useState(59);
  const [simTrainerCount, setSimTrainerCount] = useState(4);
  const [simOperatingCost, setSimOperatingCost] = useState(1200);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');

  // Modals / Adding forms states
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);

  // Form Field States - New Member
  const [memName, setMemName] = useState('');
  const [memEmail, setMemEmail] = useState('');
  const [memPlanId, setMemPlanId] = useState(gymPlans[0]?.id || '');
  const [memTrainerId, setMemTrainerId] = useState('');
  const [memWeight, setMemWeight] = useState(70);
  const [memHeight, setMemHeight] = useState(170);

  // Form Field States - New Trainer
  const [trainName, setTrainName] = useState('');
  const [trainEmail, setTrainEmail] = useState('');
  const [trainBio, setTrainBio] = useState('');
  const [trainSpecialtyInput, setTrainSpecialtyInput] = useState('');
  const [trainExp, setTrainExp] = useState(3);

  // Form Field States - New Class
  const [clsName, setClsName] = useState('');
  const [clsDesc, setClsDesc] = useState('');
  const [clsTrainerId, setClsTrainerId] = useState(trainers[0]?.id || '');
  const [clsDay, setClsDay] = useState('Monday');
  const [clsTime, setClsTime] = useState('10:00 AM - 11:00 AM');
  const [clsCapacity, setClsCapacity] = useState(15);

  // Form Field States - New Membership Plan
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState(49);
  const [planFeatures, setPlanFeatures] = useState('');
  const [planDuration, setPlanDuration] = useState(1);

  // 1. Filter entities for THIS gym ONLY (Multi-tenant isolation!)
  const gymMembers = members.filter(m => m.gymId === gym.id);
  const gymTrainers = trainers.filter(t => t.gymId === gym.id);
  const gymClasses = classes.filter(c => c.gymId === gym.id);
  const gymMembershipPlans = gymPlans.filter(p => p.gymId === gym.id);

  // Calculates Monthly Gym-Level Revenue = SUM of (Members * their plan prices)
  const monthlyRevenue = gymMembers.reduce((acc, mem) => {
    const plan = gymMembershipPlans.find(p => p.id === mem.membershipPlanId);
    return acc + (plan ? plan.price : 0);
  }, 0);

  // Multi-tenant SaaS Plan Limit Flags
  const isMemberLimitReached = gymMembers.length >= saasPlan.maxMembers;
  const isTrainerLimitReached = gymTrainers.length >= saasPlan.maxTrainers;

  // 2. Add Handlers

  // Member Registration
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMemberLimitReached) return;
    if (!memName || !memEmail || !memPlanId) return;

    const newUserId = `user_member_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      email: memEmail,
      name: memName,
      role: 'MEMBER',
      gymId: gym.id,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?w=150&auto=format&fit=crop&q=60`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newMember: Member = {
      id: newUserId,
      gymId: gym.id,
      name: memName,
      email: memEmail,
      membershipPlanId: memPlanId,
      membershipStatus: 'ACTIVE',
      trainerId: memTrainerId || undefined,
      joinedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days default
      weight: memWeight,
      targetWeight: memWeight - 5,
      height: memHeight
    };

    // Save
    const allUsers = [...db.users, newUser];
    db.users = allUsers;
    onUsersUpdate(allUsers);

    const updatedMembers = [...members, newMember];
    onMembersUpdate(updatedMembers);
    db.members = updatedMembers;

    db.addLog('MEMBER', `Gym Admin registered member "${memName}" for "${gym.name}"`, currentUser.name);
    onLogsUpdate(db.logs);

    // Reset
    setMemName('');
    setMemEmail('');
    setMemTrainerId('');
    setShowAddMember(false);
  };

  // Trainer Registration
  const handleAddTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTrainerLimitReached) return;
    if (!trainName || !trainEmail) return;

    const newUserId = `user_trainer_${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      email: trainEmail,
      name: trainName,
      role: 'TRAINER',
      gymId: gym.id,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?w=150&auto=format&fit=crop&q=60`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const newTrainer: Trainer = {
      id: newUserId,
      gymId: gym.id,
      name: trainName,
      email: trainEmail,
      specialties: trainSpecialtyInput.split(',').map(s => s.trim()).filter(Boolean),
      bio: trainBio || 'Professional fitness coach dedicated to athletic wellness and longevity.',
      experienceYears: trainExp,
      rating: 5.0,
      schedule: [
        { day: 'Monday', startTime: '09:00 AM', endTime: '05:00 PM' },
        { day: 'Wednesday', startTime: '09:00 AM', endTime: '05:00 PM' },
        { day: 'Friday', startTime: '09:00 AM', endTime: '05:00 PM' }
      ]
    };

    const allUsers = [...db.users, newUser];
    db.users = allUsers;
    onUsersUpdate(allUsers);

    const updatedTrainers = [...trainers, newTrainer];
    onTrainersUpdate(updatedTrainers);
    db.trainers = updatedTrainers;

    db.addLog('GYM', `Gym Admin hired trainer "${trainName}" at "${gym.name}"`, currentUser.name);
    onLogsUpdate(db.logs);

    setTrainName('');
    setTrainEmail('');
    setTrainBio('');
    setTrainSpecialtyInput('');
    setShowAddTrainer(false);
  };

  // Class Creation
  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clsName || !clsTrainerId) return;

    const selectedTrainer = trainers.find(t => t.id === clsTrainerId);

    const newClass: FitnessClass = {
      id: `class_${Date.now()}`,
      gymId: gym.id,
      name: clsName,
      description: clsDesc || 'Exciting group workout fitness session.',
      trainerId: clsTrainerId,
      trainerName: selectedTrainer ? selectedTrainer.name : 'Unassigned',
      day: clsDay,
      time: clsTime,
      capacity: clsCapacity,
      bookedCount: 0
    };

    const updatedClasses = [...classes, newClass];
    onClassesUpdate(updatedClasses);
    db.classes = updatedClasses;

    db.addLog('GYM', `Gym Admin created new class schedule "${clsName}" at "${gym.name}"`, currentUser.name);
    onLogsUpdate(db.logs);

    setClsName('');
    setClsDesc('');
    setShowAddClass(false);
  };

  // Membership Plan Creation
  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName || !planPrice) return;

    const newPlan: MembershipPlan = {
      id: `plan_gym_${Date.now()}`,
      gymId: gym.id,
      name: planName,
      price: planPrice,
      features: planFeatures.split(',').map(f => f.trim()).filter(Boolean),
      durationMonths: planDuration
    };

    const updatedPlans = [...gymPlans, newPlan];
    onGymPlansUpdate(updatedPlans);
    db.membershipPlans = updatedPlans;

    db.addLog('BILLING', `Gym Admin created customer membership plan: "${planName}" ($${planPrice}/mo)`, currentUser.name);
    onLogsUpdate(db.logs);

    setPlanName('');
    setPlanFeatures('');
    setShowAddPlan(false);
  };

  // Delete Action Handlers
  const handleDeleteMember = (memberId: string, memberName: string) => {
    const updated = members.filter(m => m.id !== memberId);
    onMembersUpdate(updated);
    db.members = updated;

    // Delete corresponding user account
    const usersUpdate = db.users.filter(u => u.id !== memberId);
    db.users = usersUpdate;
    onUsersUpdate(usersUpdate);

    db.addLog('MEMBER', `Gym Admin removed member "${memberName}" from "${gym.name}"`, currentUser.name);
    onLogsUpdate(db.logs);
  };

  const handleDeleteTrainer = (trainerId: string, trainerName: string) => {
    const updated = trainers.filter(t => t.id !== trainerId);
    onTrainersUpdate(updated);
    db.trainers = updated;

    const usersUpdate = db.users.filter(u => u.id !== trainerId);
    db.users = usersUpdate;
    onUsersUpdate(usersUpdate);

    db.addLog('GYM', `Gym Admin removed trainer "${trainerName}" from "${gym.name}"`, currentUser.name);
    onLogsUpdate(db.logs);
  };

  const handleUpdateMemberTrainer = (memberId: string, trainerId: string) => {
    const updated = members.map(m => {
      if (m.id === memberId) {
        return { ...m, trainerId: trainerId || undefined };
      }
      return m;
    });
    onMembersUpdate(updated);
    db.members = updated;

    const targetMember = members.find(m => m.id === memberId);
    const targetTrainer = trainers.find(t => t.id === trainerId);
    if (targetMember && targetTrainer) {
      db.addLog('MEMBER', `Assigned trainer "${targetTrainer.name}" to member "${targetMember.name}"`, currentUser.name);
      onLogsUpdate(db.logs);
    }
  };

  // Filtering based on search
  const filteredMembers = gymMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTrainers = gymTrainers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Gym Owner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img 
            src={gym.logoUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120"} 
            alt="Gym Logo" 
            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-xl font-display font-semibold tracking-tight text-slate-900">{gym.name} Controls</h2>
            <p className="text-slate-500 text-xs">Gym Owner Portal • Subscribed to SaaS <span className="font-semibold text-indigo-600">{saasPlan.name}</span></p>
          </div>
        </div>

        {/* Tenant Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-lg text-xs font-semibold shrink-0">
          <button 
            onClick={() => { setActiveTab('members'); setSearchQuery(''); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'members' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Members ({gymMembers.length})
          </button>
          <button 
            onClick={() => { setActiveTab('trainers'); setSearchQuery(''); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'trainers' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Trainers ({gymTrainers.length})
          </button>
          <button 
            onClick={() => { setActiveTab('classes'); setSearchQuery(''); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'classes' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Classes ({gymClasses.length})
          </button>
          <button 
            onClick={() => { setActiveTab('plans'); setSearchQuery(''); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'plans' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Pricing Tiers ({gymMembershipPlans.length})
          </button>
          <button 
            onClick={() => { setActiveTab('gym_analytics'); setSearchQuery(''); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${activeTab === 'gym_analytics' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Gym Analytics &amp; Goals
          </button>
        </div>
      </div>

      {/* SaaS Limit Warnings */}
      {(isMemberLimitReached || isTrainerLimitReached) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-slate-700 text-xs shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-800">SaaS Account Limits Approaching!</h4>
            <p>
              Your current SaaS Growth plan restricts you to {saasPlan.maxMembers} members and {saasPlan.maxTrainers} trainers. 
              {isMemberLimitReached && <span className="block font-semibold text-rose-700">• Members limit reached ({gymMembers.length}/{saasPlan.maxMembers}). Please contact the Platform Owner to upgrade!</span>}
              {isTrainerLimitReached && <span className="block font-semibold text-rose-700">• Trainers limit reached ({gymTrainers.length}/{saasPlan.maxTrainers}). Hiring has been locked.</span>}
            </p>
          </div>
        </div>
      )}

      {/* Tenant Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Estimated Gym Revenue</span>
            <div className="text-2xl font-bold font-display text-slate-900">${monthlyRevenue.toLocaleString()}/mo</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> Calculated from active tiers
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Members Capacity</span>
            <div className={`text-2xl font-bold font-display ${isMemberLimitReached ? 'text-rose-600' : 'text-slate-900'}`}>
              {gymMembers.length} <span className="text-slate-400 text-xs">/ {saasPlan.maxMembers} limit</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
              <div 
                className={`h-1.5 rounded-full ${isMemberLimitReached ? 'bg-rose-500' : 'bg-indigo-600'}`}
                style={{ width: `${Math.min(100, (gymMembers.length / saasPlan.maxMembers) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Staff (Trainers)</span>
            <div className={`text-2xl font-bold font-display ${isTrainerLimitReached ? 'text-rose-600' : 'text-slate-900'}`}>
              {gymTrainers.length} <span className="text-slate-400 text-xs">/ {saasPlan.maxTrainers} limit</span>
            </div>
            <div className="text-[11px] text-slate-500">Professional coaches hired</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Scheduled Group Classes</span>
            <div className="text-2xl font-bold font-display text-slate-900">{gymClasses.length} Classes</div>
            <div className="text-[11px] text-slate-500">Live booking sessions today</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SEARCH / FILTERS */}
      {activeTab !== 'plans' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder={`Search ${activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTab === 'members' && (
              <button 
                id="add-member-btn"
                disabled={isMemberLimitReached}
                onClick={() => setShowAddMember(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${isMemberLimitReached ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                <UserPlus className="w-4 h-4" /> Register New Member
              </button>
            )}
            {activeTab === 'trainers' && (
              <button 
                id="add-trainer-btn"
                disabled={isTrainerLimitReached}
                onClick={() => setShowAddTrainer(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ${isTrainerLimitReached ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                <Plus className="w-4 h-4" /> Recruit Trainer Staff
              </button>
            )}
            {activeTab === 'classes' && (
              <button 
                id="add-class-btn"
                onClick={() => setShowAddClass(true)}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Schedule Group Class
              </button>
            )}
          </div>
        </div>
      )}

      {/* FORM: Add Member Panel */}
      {showAddMember && (
        <div className="bg-white p-6 rounded-xl border-2 border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-150">
            <h3 className="font-display font-semibold text-slate-800 text-sm">Register New Customer</h3>
            <button onClick={() => setShowAddMember(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Full Name</label>
              <input required type="text" placeholder="e.g. Alex Jones" value={memName} onChange={(e)=>setMemName(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Email Address</label>
              <input required type="email" placeholder="e.g. alex@gmail.com" value={memEmail} onChange={(e)=>setMemEmail(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Membership Tier</label>
              <select value={memPlanId} onChange={(e)=>setMemPlanId(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white">
                <option value="">-- Choose Plan --</option>
                {gymMembershipPlans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - ${p.price}/mo</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Assign Coach (Optional)</label>
              <select value={memTrainerId} onChange={(e)=>setMemTrainerId(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white">
                <option value="">No personal trainer assigned</option>
                {gymTrainers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Starting Weight (kg)</label>
              <input type="number" value={memWeight} onChange={(e)=>setMemWeight(Number(e.target.value))} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Height (cm)</label>
              <input type="number" value={memHeight} onChange={(e)=>setMemHeight(Number(e.target.value))} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddMember(false)} className="px-3 py-1.5 text-xs border border-slate-200 rounded text-slate-600">Cancel</button>
              <button type="submit" className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700">Save Member Account</button>
            </div>
          </form>
        </div>
      )}

      {/* FORM: Add Trainer Panel */}
      {showAddTrainer && (
        <div className="bg-white p-6 rounded-xl border-2 border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-150">
            <h3 className="font-display font-semibold text-slate-800 text-sm">Recruit New Fitness Trainer</h3>
            <button onClick={() => setShowAddTrainer(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleAddTrainer} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Full Coach Name</label>
                <input required type="text" placeholder="e.g. Mike Tyson-Stone" value={trainName} onChange={(e)=>setTrainName(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Professional Email</label>
                <input required type="email" placeholder="e.g. coach@fitness.com" value={trainEmail} onChange={(e)=>setTrainEmail(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Specialty Tags (Comma separated)</label>
                <input required type="text" placeholder="e.g. Weightlifting, Fat Loss, CrossFit" value={trainSpecialtyInput} onChange={(e)=>setTrainSpecialtyInput(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Years of Experience</label>
                <input required type="number" value={trainExp} onChange={(e)=>setTrainExp(Number(e.target.value))} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Coach Short Bio</label>
              <textarea placeholder="Tell members about their qualifications or background..." value={trainBio} onChange={(e)=>setTrainBio(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs h-16" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddTrainer(false)} className="px-3 py-1.5 text-xs border border-slate-200 rounded text-slate-600">Cancel</button>
              <button type="submit" className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700">Hire Trainer</button>
            </div>
          </form>
        </div>
      )}

      {/* FORM: Add Class Panel */}
      {showAddClass && (
        <div className="bg-white p-6 rounded-xl border-2 border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-150">
            <h3 className="font-display font-semibold text-slate-800 text-sm">Schedule Group Fitness Class</h3>
            <button onClick={() => setShowAddClass(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleAddClass} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-[11px] font-bold text-slate-600">Class Title</label>
              <input required type="text" placeholder="e.g. powerlifting fundamentals" value={clsName} onChange={(e)=>setClsName(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[11px] font-bold text-slate-600">Short Description</label>
              <textarea placeholder="Enter brief details about class goals, equipment needed..." value={clsDesc} onChange={(e)=>setClsDesc(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs h-16" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Assigned Coach</label>
              <select required value={clsTrainerId} onChange={(e)=>setClsTrainerId(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white">
                <option value="">-- Select Instructor --</option>
                {gymTrainers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 font-sans">Scheduled Day</label>
              <select value={clsDay} onChange={(e)=>setClsDay(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs bg-white">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Class Hours (Time Range)</label>
              <input required type="text" placeholder="e.g. 09:00 AM - 10:15 AM" value={clsTime} onChange={(e)=>setClsTime(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Attendee Cap (Capacity)</label>
              <input required type="number" value={clsCapacity} onChange={(e)=>setClsCapacity(Number(e.target.value))} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddClass(false)} className="px-3 py-1.5 text-xs border border-slate-200 rounded text-slate-600">Cancel</button>
              <button type="submit" className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700">Add Schedule Slot</button>
            </div>
          </form>
        </div>
      )}

      {/* FORM: Add Customer Tier / Gym Pricing Plan */}
      {showAddPlan && (
        <div className="bg-white p-6 rounded-xl border-2 border-indigo-500/20 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-150">
            <h3 className="font-display font-semibold text-slate-800 text-sm">Create New Membership Tier</h3>
            <button onClick={() => setShowAddPlan(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleAddPlan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Tier Name</label>
              <input required type="text" placeholder="e.g. Platinum Unlimited" value={planName} onChange={(e)=>setPlanName(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Monthly Price ($)</label>
              <input required type="number" value={planPrice} onChange={(e)=>setPlanPrice(Number(e.target.value))} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 font-sans">Membership Duration (Months)</label>
              <input type="number" value={planDuration} onChange={(e)=>setPlanDuration(Number(e.target.value))} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[11px] font-bold text-slate-600">Core Features (Comma separated)</label>
              <input required type="text" placeholder="e.g. 24/7 Access, Sauna, Free protein, 1 Trainer Session" value={planFeatures} onChange={(e)=>setPlanFeatures(e.target.value)} className="w-full border border-slate-200 rounded p-1.5 text-xs" />
            </div>
            <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setShowAddPlan(false)} className="px-3 py-1.5 text-xs border border-slate-200 rounded text-slate-600">Cancel</button>
              <button type="submit" className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700">Publish Plan</button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Gym Member Details</th>
                  <th className="px-6 py-4">Membership Plan</th>
                  <th className="px-6 py-4">Assigned Personal Trainer</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Membership Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredMembers.map(m => {
                  const mPlan = gymMembershipPlans.find(p => p.id === m.membershipPlanId);
                  const isAssigned = m.trainerId;
                  
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={m.email === 'alex.jones@gmail.com' ? "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80" : `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt="avatar" className="w-10 h-10 rounded-full bg-slate-100 object-cover" />
                          <div>
                            <div className="font-semibold text-slate-800">{m.name}</div>
                            <div className="text-xs text-slate-500">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-xs text-slate-700 block">{mPlan ? mPlan.name : 'Unknown Tier'}</span>
                        <span className="text-[10px] text-slate-500 font-medium">${mPlan ? mPlan.price : 0}/mo</span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={m.trainerId || ''} 
                          onChange={(e) => handleUpdateMemberTrainer(m.id, e.target.value)}
                          className="border border-slate-200 rounded p-1 text-xs bg-white focus:outline-indigo-500"
                        >
                          <option value="">Unassigned</option>
                          {gymTrainers.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {m.joinedDate}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Active Pass
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteMember(m.id, m.name)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      No members registered under your gym tenant.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: Trainers Tab */}
      {activeTab === 'trainers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTrainers.map(trainer => (
            <div key={trainer.id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={trainer.id === 'user_trainer_sarah' ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" : `https://api.dicebear.com/7.x/avataaars/svg?seed=${trainer.name}`} alt="avatar" className="w-12 h-12 rounded-lg bg-slate-100 object-cover" />
                    <div>
                      <h4 className="font-display font-semibold text-slate-800 text-sm">{trainer.name}</h4>
                      <p className="text-xs text-indigo-600 font-semibold">{trainer.experienceYears} Years Coach Exp</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteTrainer(trainer.id, trainer.name)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "{trainer.bio}"
                </p>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specialties</span>
                  <div className="flex flex-wrap gap-1">
                    {trainer.specialties.map((spec, idx) => (
                      <span key={idx} className="bg-indigo-50/70 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-semibold border border-indigo-100/50">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duty Days Schedule</span>
                  <div className="text-[10px] text-slate-600 space-y-1 font-mono">
                    {trainer.schedule.map((sch, sIdx) => (
                      <div key={sIdx} className="flex justify-between">
                        <span>{sch.day}</span>
                        <span>{sch.startTime} - {sch.endTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredTrainers.length === 0 && (
            <div className="col-span-3 text-center bg-white border border-slate-100 rounded-xl p-10 text-slate-400 text-xs">
              No trainers registered at your gym. Click Recruitment to onboard staff.
            </div>
          )}
        </div>
      )}

      {/* VIEW: Group Classes */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gymClasses.map(cls => (
            <div key={cls.id} className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {cls.day}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {cls.time}
                  </div>
                </div>

                <h4 className="font-display font-semibold text-slate-800 text-sm">{cls.name}</h4>
                <p className="text-xs text-slate-500 leading-normal">{cls.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Instructor</span>
                    <span className="font-bold text-slate-700">{cls.trainerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Attendance Booking</span>
                    <span className="font-bold text-slate-800">{cls.bookedCount} / {cls.capacity} seats</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {gymClasses.length === 0 && (
            <div className="col-span-3 text-center bg-white border border-slate-100 rounded-xl p-10 text-slate-400 text-xs">
              No group classes scheduled yet.
            </div>
          )}
        </div>
      )}

      {/* VIEW: Membership pricing levels */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-sm">Customer Membership Offers</h3>
              <p className="text-slate-400 text-[10px]">Publish plans your gym members purchase to gain entry permission</p>
            </div>
            <button 
              id="add-membership-tier-btn"
              onClick={() => setShowAddPlan(true)}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Publish New Pass Tier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gymMembershipPlans.map(plan => (
              <div key={plan.id} className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-bold text-slate-800 text-sm">{plan.name}</h4>
                      <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">{plan.durationMonths} Mo Pass</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-slate-900">${plan.price}</span>
                      <span className="text-[10px] text-slate-400 block">/month</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Access Permissions</span>
                    <ul className="space-y-1.5">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Gym Analytics & Goals */}
      {activeTab === 'gym_analytics' && (
        <div className="space-y-6">
          {/* Interactive Financial bottom-line simulator */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-50 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1 font-display">Target Revenue Profit Simulator</h3>
                <p className="text-xs text-slate-400 font-medium">Simulate membership expansion targets, pricing adjustments, and operational overheads dynamically.</p>
              </div>
              <div className="bg-indigo-50/60 border border-indigo-100/50 px-4 py-3 rounded-xl text-right shrink-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500 block font-mono">Simulated Net Profit</span>
                <span className={`text-xl font-extrabold font-mono ${((simMembersCount * simMonthlyFee) - (simTrainerCount * 2500) - simOperatingCost) >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                  ${((simMembersCount * simMonthlyFee) - (simTrainerCount * 2500) - simOperatingCost).toLocaleString()}/mo
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sliders */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Target Members</span>
                  <span className="text-indigo-600 font-bold font-mono">{simMembersCount} Members</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="400" 
                  value={simMembersCount} 
                  onChange={(e) => setSimMembersCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 bg-slate-100 rounded-lg cursor-pointer h-1.5"
                />
                <span className="text-[10px] text-slate-400 block font-mono">Min: 30 • Max: 400</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Average Monthly Fee</span>
                  <span className="text-indigo-600 font-bold font-mono">${simMonthlyFee}/mo</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="199" 
                  value={simMonthlyFee} 
                  onChange={(e) => setSimMonthlyFee(Number(e.target.value))}
                  className="w-full accent-indigo-600 bg-slate-100 rounded-lg cursor-pointer h-1.5"
                />
                <span className="text-[10px] text-slate-400 block font-mono">Min: $20 • Max: $199</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Active Trainers payroll</span>
                  <span className="text-indigo-600 font-bold font-mono">{simTrainerCount} Coach(es)</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  value={simTrainerCount} 
                  onChange={(e) => setSimTrainerCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 bg-slate-100 rounded-lg cursor-pointer h-1.5"
                />
                <span className="text-[10px] text-slate-400 block font-mono">Avg Salary: $2,500/mo each</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Operating Costs</span>
                  <span className="text-indigo-600 font-bold font-mono">${simOperatingCost}/mo</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="5000" 
                  step="100"
                  value={simOperatingCost} 
                  onChange={(e) => setSimOperatingCost(Number(e.target.value))}
                  className="w-full accent-indigo-600 bg-slate-100 rounded-lg cursor-pointer h-1.5"
                />
                <span className="text-[10px] text-slate-400 block font-mono">Rent, power, SaaS platform fees</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 bg-slate-50/50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block font-mono">Simulated Gross Income</span>
                <span className="text-base font-extrabold text-slate-800 font-mono">${(simMembersCount * simMonthlyFee).toLocaleString()}/mo</span>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block font-mono">Trainer Payroll Cost</span>
                <span className="text-base font-extrabold text-rose-600 font-mono">${(simTrainerCount * 2500).toLocaleString()}/mo</span>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block font-mono">Fixed Overheads</span>
                <span className="text-base font-extrabold text-slate-800 font-mono">${simOperatingCost.toLocaleString()}/mo</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Elegant SVG Check-ins & Attendance density line chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-800 font-display">6-Month Attendance Density &amp; Peak Hours</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Daily swipe density trends indicating facility load capacity levels</p>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-md font-semibold font-mono">
                  +18.4% Peak Load Increase
                </span>
              </div>

              {/* Handcrafted Beautiful SVG Area/Path Chart */}
              <div className="h-56 w-full flex flex-col justify-between pt-4 select-none">
                <div className="flex-1 flex items-end justify-between px-1 relative h-[160px] border-b border-slate-100">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="w-full border-t border-slate-100 h-0"></div>
                    <div className="w-full border-t border-slate-100 h-0"></div>
                    <div className="w-full border-t border-slate-100 h-0"></div>
                    <div className="w-full border-t border-slate-100 h-0"></div>
                  </div>

                  {[
                    { month: 'Jan', checks: 450, peakHours: '06:00 PM' },
                    { month: 'Feb', checks: 520, peakHours: '06:30 PM' },
                    { month: 'Mar', checks: 680, peakHours: '07:00 PM' },
                    { month: 'Apr', checks: 620, peakHours: '06:00 PM' },
                    { month: 'May', checks: 790, peakHours: '05:30 PM' },
                    { month: 'Jun', checks: 910, peakHours: '06:30 PM' }
                  ].map((item, index) => {
                    const maxChecks = 1000;
                    const heightPercent = Math.max(15, (item.checks / maxChecks) * 100);
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30 animate-fade-in whitespace-nowrap">
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg text-[10px] font-bold shadow-md border border-slate-800 text-left">
                            <p className="font-bold text-slate-300">{item.month} Logs</p>
                            <p className="text-indigo-400 font-mono">Total Swipes: {item.checks} visits</p>
                            <p className="text-amber-400">Peak Hour: {item.peakHours}</p>
                          </div>
                          <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1 border-r border-b border-slate-800"></div>
                        </div>

                        {/* Visual Pill/Bar Representing Daily visits */}
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className="w-12 bg-gradient-to-t from-indigo-50 to-indigo-500/10 group-hover:from-indigo-100 group-hover:to-indigo-500/20 transition-all rounded-t-lg relative border-t border-indigo-200"
                        >
                          {/* Anchor Circle Indicator */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-600 border border-white group-hover:scale-125 transition-transform"></div>
                        </div>

                        {/* Label */}
                        <span className="text-[10px] font-bold text-slate-400 mt-2 font-mono">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Class distribution progress lists */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-display mb-1">Class Enrollment Split</h3>
                <p className="text-[10px] text-slate-400 font-medium mb-4">Percentage of members registered per class type</p>

                <div className="space-y-4 pt-2">
                  {[
                    { name: 'Strength &amp; Barbell Conditioning', percent: 45, color: 'bg-indigo-600' },
                    { name: 'CrossFit &amp; High Intensity HIIT', percent: 30, color: 'bg-emerald-500' },
                    { name: 'Vinyasa Flow Yoga &amp; Pilates', percent: 15, color: 'bg-amber-500' },
                    { name: 'Spinning &amp; Cardio Endurance', percent: 10, color: 'bg-sky-500' }
                  ].map((cls, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-700" dangerouslySetInnerHTML={{ __html: cls.name }}></span>
                        <span className="text-slate-500 font-mono">{cls.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${cls.color} rounded-full`} style={{ width: `${cls.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-slate-50 pt-4">
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/40 flex items-start gap-2.5">
                  <span className="p-1 bg-amber-500 text-white rounded text-[10px] font-bold font-mono shrink-0">DATA</span>
                  <p className="text-[10px] text-amber-700 leading-normal">
                    <strong>Barbell classes</strong> remain highly filled. Adjust trainer allocations to HIIT and yoga slots to balanced weekly load.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
