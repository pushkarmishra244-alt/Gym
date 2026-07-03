import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  DollarSign, 
  Users, 
  Plus, 
  Check, 
  X, 
  TrendingUp, 
  Search, 
  Sliders, 
  Settings, 
  AlertCircle, 
  Eye, 
  Trash2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Gym, SubscriptionPlan, PlatformLog, User } from '../types';
import { db } from '../data/mockData';

interface SuperAdminDashboardProps {
  gyms: Gym[];
  plans: SubscriptionPlan[];
  logs: PlatformLog[];
  onGymsUpdate: (gyms: Gym[]) => void;
  onPlansUpdate: (plans: SubscriptionPlan[]) => void;
  onLogsUpdate: (logs: PlatformLog[]) => void;
  currentUser: User;
}

export default function SuperAdminDashboard({
  gyms,
  plans,
  logs,
  onGymsUpdate,
  onPlansUpdate,
  onLogsUpdate,
  currentUser
}: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'gyms' | 'plans' | 'logs'>('gyms');
  
  // Gym Management State
  const [showAddGym, setShowAddGym] = useState(false);
  const [newGymName, setNewGymName] = useState('');
  const [newGymEmail, setNewGymEmail] = useState('');
  const [newGymPhone, setNewGymPhone] = useState('');
  const [newGymAddress, setNewGymAddress] = useState('');
  const [newGymPlanId, setNewGymPlanId] = useState(plans[0]?.id || 'sub_basic');

  // Plan Management State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPlanPrice, setEditPlanPrice] = useState<number>(0);
  const [editPlanMembers, setEditPlanMembers] = useState<number>(0);
  const [editPlanTrainers, setEditPlanTrainers] = useState<number>(0);

  // Search/Filters State
  const [gymSearch, setGymSearch] = useState('');
  const [logCategory, setLogCategory] = useState<string>('ALL');
  const [logSearch, setLogSearch] = useState('');

  // 1. Calculations for Platform Owner stats
  const totalGyms = gyms.length;
  const pendingGyms = gyms.filter(g => g.status === 'PENDING').length;
  
  // Platform MRR = Sum of subscription plans of all ACTIVE gyms
  const activeGyms = gyms.filter(g => g.status === 'ACTIVE');
  const platformMRR = activeGyms.reduce((acc, gym) => {
    const plan = plans.find(p => p.id === gym.subscriptionPlanId);
    return acc + (plan ? plan.price : 0);
  }, 0);

  // Total members across all gyms (calculated mock-wise)
  const totalMembersOnPlatform = db.members.length;

  // 2. Action Handlers
  const handleApproveGym = (gymId: string) => {
    const updatedGyms = gyms.map(g => {
      if (g.id === gymId) {
        db.addLog('GYM', `Approved registration for Gym: "${g.name}"`, currentUser.name);
        return { ...g, status: 'ACTIVE' as const };
      }
      return g;
    });
    onGymsUpdate(updatedGyms);
    onLogsUpdate(db.logs);
  };

  const handleSuspendGym = (gymId: string) => {
    const updatedGyms = gyms.map(g => {
      if (g.id === gymId) {
        db.addLog('GYM', `Suspended tenant access for Gym: "${g.name}"`, currentUser.name);
        return { ...g, status: 'SUSPENDED' as const };
      }
      return g;
    });
    onGymsUpdate(updatedGyms);
    onLogsUpdate(db.logs);
  };

  const handleReactivateGym = (gymId: string) => {
    const updatedGyms = gyms.map(g => {
      if (g.id === gymId) {
        db.addLog('GYM', `Reactivated suspended access for Gym: "${g.name}"`, currentUser.name);
        return { ...g, status: 'ACTIVE' as const };
      }
      return g;
    });
    onGymsUpdate(updatedGyms);
    onLogsUpdate(db.logs);
  };

  const handleCreateGym = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGymName || !newGymEmail || !newGymPhone || !newGymAddress) return;

    const newGym: Gym = {
      id: `gym_${Date.now()}`,
      name: newGymName,
      address: newGymAddress,
      phone: newGymPhone,
      email: newGymEmail,
      status: 'PENDING',
      subscriptionPlanId: newGymPlanId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updatedGyms = [...gyms, newGym];
    onGymsUpdate(updatedGyms);
    db.addLog('GYM', `Registered new gym tenant: "${newGymName}" (Pending Approval)`, currentUser.name);
    onLogsUpdate(db.logs);

    // Reset Form
    setNewGymName('');
    setNewGymEmail('');
    setNewGymPhone('');
    setNewGymAddress('');
    setShowAddGym(false);
  };

  const handleStartEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setEditPlanPrice(plan.price);
    setEditPlanMembers(plan.maxMembers);
    setEditPlanTrainers(plan.maxTrainers);
  };

  const handleSavePlan = (planId: string) => {
    const updatedPlans = plans.map(p => {
      if (p.id === planId) {
        db.addLog('BILLING', `Updated SaaS subscription plan details for: "${p.name}"`, currentUser.name);
        return {
          ...p,
          price: editPlanPrice,
          maxMembers: editPlanMembers,
          maxTrainers: editPlanTrainers
        };
      }
      return p;
    });
    onPlansUpdate(updatedPlans);
    setEditingPlanId(null);
    onLogsUpdate(db.logs);
  };

  // Filter lists
  const filteredGyms = gyms.filter(g => 
    g.name.toLowerCase().includes(gymSearch.toLowerCase()) ||
    g.email.toLowerCase().includes(gymSearch.toLowerCase())
  );

  const filteredLogs = logs.filter(l => {
    const matchesCat = logCategory === 'ALL' || l.category === logCategory;
    const matchesSearch = l.message.toLowerCase().includes(logSearch.toLowerCase()) || 
                          l.user.toLowerCase().includes(logSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* SaaS Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold tracking-tight text-slate-900">SaaS Platform Cockpit</h2>
          <p className="text-slate-500 text-sm">Welcome back, {currentUser.name}. Monitor multi-tenant operations, billing tiers, and system activity logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('gyms')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'gyms' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            Tenant Gyms
          </button>
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'plans' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            SaaS Plan Matrix
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'logs' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            SaaS Audit Logs
          </button>
        </div>
      </div>

      {/* Platform Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active SaaS MRR</span>
            <div className="text-2xl font-bold font-display text-slate-900">${platformMRR.toLocaleString()}/mo</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4% this month
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tenants</span>
            <div className="text-2xl font-bold font-display text-slate-900">{totalGyms} Gyms</div>
            <div className="flex items-center gap-1 text-[11px] text-indigo-600">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> {activeGyms.length} active clients
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Registrations</span>
            <div className="text-2xl font-bold font-display text-amber-600">{pendingGyms} Requests</div>
            <div className="text-[11px] text-slate-500">Requires manual manual review</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Members</span>
            <div className="text-2xl font-bold font-display text-slate-900">{totalMembersOnPlatform} Users</div>
            <div className="text-[11px] text-slate-500">Total cross-gym member volume</div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tab: Gyms Management */}
      {activeTab === 'gyms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search gyms by name or email..." 
                value={gymSearch}
                onChange={(e) => setGymSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <button 
              id="add-gym-btn"
              onClick={() => setShowAddGym(true)}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Register New Tenant
            </button>
          </div>

          {/* Add Gym Modal / Form Panel */}
          {showAddGym && (
            <div className="bg-white p-6 rounded-xl border-2 border-indigo-500/20 shadow-md animate-in fade-in slide-in-from-top-4 duration-250">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="font-display font-semibold text-slate-800 text-base">Register New Gym Tenant</h3>
                <button 
                  onClick={() => setShowAddGym(false)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGym} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Gym Name</label>
                  <input 
                    type="text" 
                    required
                    value={newGymName} 
                    onChange={(e) => setNewGymName(e.target.value)}
                    placeholder="e.g. Iron &amp; Grace Strength Club"
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Contact Email</label>
                  <input 
                    type="email" 
                    required
                    value={newGymEmail} 
                    onChange={(e) => setNewGymEmail(e.target.value)}
                    placeholder="e.g. contact@irongrace.com"
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Contact Phone</label>
                  <input 
                    type="text" 
                    required
                    value={newGymPhone} 
                    onChange={(e) => setNewGymPhone(e.target.value)}
                    placeholder="e.g. (555) 302-9900"
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">SaaS Plan Tier</label>
                  <select 
                    value={newGymPlanId} 
                    onChange={(e) => setNewGymPlanId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - ${p.price}/mo</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Physical Address</label>
                  <input 
                    type="text" 
                    required
                    value={newGymAddress} 
                    onChange={(e) => setNewGymAddress(e.target.value)}
                    placeholder="e.g. 100 Powerhouse Lane, Austin, TX 78701"
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-indigo-500"
                  />
                </div>

                <div className="md:col-span-2 pt-2 flex items-center justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddGym(false)}
                    className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    id="submit-new-gym"
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm cursor-pointer"
                  >
                    Create Gym Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Gyms Table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">Gym Tenant Details</th>
                    <th className="px-6 py-4">Physical Address</th>
                    <th className="px-6 py-4">Tier Plan</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Subscribed Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150">
                  {filteredGyms.map((gym) => {
                    const plan = plans.find(p => p.id === gym.subscriptionPlanId);
                    
                    return (
                      <tr key={gym.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={gym.logoUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=80&auto=format&fit=crop&q=60"} 
                              alt="logo" 
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-semibold text-slate-800">{gym.name}</div>
                              <div className="text-xs text-slate-500">{gym.email} • {gym.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                          {gym.address}
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center gap-1">
                            <span className="font-semibold text-slate-800 text-xs bg-slate-100 px-2 py-1 rounded">
                              {plan ? plan.name : 'Unknown Tier'}
                            </span>
                            <span className="text-xs text-slate-500">${plan ? plan.price : 0}/mo</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {gym.status === 'ACTIVE' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                            </span>
                          )}
                          {gym.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
                            </span>
                          )}
                          {gym.status === 'SUSPENDED' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Suspended
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {gym.createdAt}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {gym.status === 'PENDING' && (
                              <button
                                onClick={() => handleApproveGym(gym.id)}
                                className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                            )}
                            {gym.status === 'ACTIVE' && (
                              <button
                                onClick={() => handleSuspendGym(gym.id)}
                                className="px-2.5 py-1 text-xs font-medium text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" /> Suspend
                              </button>
                            )}
                            {gym.status === 'SUSPENDED' && (
                              <button
                                onClick={() => handleReactivateGym(gym.id)}
                                className="px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                Reactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredGyms.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                        No registered gym tenants found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: SaaS Plans */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs">
            <h3 className="font-display font-semibold text-slate-800 text-base mb-1">Standard SaaS Tiers Pricing Matrix</h3>
            <p className="text-slate-500 text-xs">Adjust basic limits and licensing rates. Any changes update calculations for existing tenants immediately.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isEditing = editingPlanId === plan.id;
              
              return (
                <div key={plan.id} className={`bg-white rounded-xl border p-6 flex flex-col justify-between transition-all ${isEditing ? 'border-indigo-500 ring-1 ring-indigo-500/10 shadow-md scale-[1.01]' : 'border-slate-100 shadow-xs'}`}>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display font-bold text-slate-800 text-lg">{plan.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">{plan.id}</span>
                      </div>
                      {!isEditing && (
                        <button 
                          onClick={() => handleStartEditPlan(plan)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold cursor-pointer"
                        >
                          Modify Matrix
                        </button>
                      )}
                    </div>

                    <div className="py-2">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase">Monthly Price ($)</label>
                            <input 
                              type="number" 
                              value={editPlanPrice}
                              onChange={(e) => setEditPlanPrice(Number(e.target.value))}
                              className="w-full border border-slate-200 rounded p-1.5 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase">Max Members Allowed</label>
                            <input 
                              type="number" 
                              value={editPlanMembers}
                              onChange={(e) => setEditPlanMembers(Number(e.target.value))}
                              className="w-full border border-slate-200 rounded p-1.5 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase">Max Trainers Allowed</label>
                            <input 
                              type="number" 
                              value={editPlanTrainers}
                              onChange={(e) => setEditPlanTrainers(Number(e.target.value))}
                              className="w-full border border-slate-200 rounded p-1.5 text-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-slate-900">${plan.price}</span>
                            <span className="text-slate-500 text-xs">/month</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2.5 my-2">
                            <div>
                              <span className="text-slate-400 block uppercase text-[9px] font-mono">Members Limit</span>
                              <span className="font-bold text-slate-800">{plan.maxMembers.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block uppercase text-[9px] font-mono">Trainers Limit</span>
                              <span className="font-bold text-slate-800">{plan.maxTrainers.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Included Features</span>
                      <ul className="space-y-1.5">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button 
                        onClick={() => setEditingPlanId(null)}
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSavePlan(plan.id)}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer"
                      >
                        Save Tier Changes
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: SaaS Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  placeholder="Filter by log details or user..." 
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none transition-all"
                />
              </div>
              
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-150 text-xs">
                {['ALL', 'GYM', 'BILLING', 'SECURITY', 'MEMBER'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLogCategory(cat)}
                    className={`px-2 py-1 rounded-md font-semibold transition-colors ${logCategory === cat ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                db.logs = [];
                onLogsUpdate([]);
              }}
              className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Clear Log History
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Security &amp; Subscription Action Audit Stream</span>
              <span>Total recorded events: {filteredLogs.length}</span>
            </div>
            
            <div className="divide-y divide-slate-100 font-mono text-[11px] max-h-[480px] overflow-y-auto">
              {filteredLogs.map((log) => {
                let badgeClass = 'bg-slate-100 text-slate-600';
                if (log.category === 'SECURITY') badgeClass = 'bg-rose-50 text-rose-600';
                if (log.category === 'BILLING') badgeClass = 'bg-emerald-50 text-emerald-600';
                if (log.category === 'GYM') badgeClass = 'bg-indigo-50 text-indigo-600';
                if (log.category === 'MEMBER') badgeClass = 'bg-amber-50 text-amber-600';

                return (
                  <div key={log.id} className="p-3.5 hover:bg-slate-50/50 flex items-start gap-4 transition-colors">
                    <span className="text-slate-400 shrink-0 select-none w-28">{log.timestamp}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 text-center w-16 ${badgeClass}`}>
                      {log.category}
                    </span>
                    <span className="text-slate-700 font-sans text-xs flex-1">{log.message}</span>
                    <span className="text-slate-400 font-sans text-xs shrink-0 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> {log.user}
                    </span>
                  </div>
                );
              })}
              {filteredLogs.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs font-sans">
                  No system logs found matching the selected filters.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
