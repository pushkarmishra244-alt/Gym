import React, { useState, useEffect } from 'react';
import { db } from './data/mockData';
import { 
  User, 
  Gym, 
  SubscriptionPlan, 
  MembershipPlan, 
  Trainer, 
  Member, 
  FitnessClass, 
  Booking, 
  Attendance, 
  WorkoutPlan, 
  NutritionPlan, 
  MemberProgress, 
  PlatformLog 
} from './types';
import DashboardLayout from './components/DashboardLayout';
import IntegrationGuide from './components/IntegrationGuide';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import GymOwnerDashboard from './components/GymOwnerDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import MemberPortal from './components/MemberPortal';
import MembershipPassPage from './components/MembershipPassPage';

export default function App() {
  // 1. Core database state hooks loaded from persistent localStorage DB
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [progressHistory, setProgressHistory] = useState<MemberProgress[]>([]);
  const [logs, setLogs] = useState<PlatformLog[]>([]);

  // 2. Active Session States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activePage, setActivePage] = useState<'member' | 'trainer' | 'gym_admin' | 'super_admin' | 'guide' | 'pass'>('member');

  // Load state from localStorage on Mount
  useEffect(() => {
    // Self-healing database check: if users or gyms are empty or corrupt, reset to default seeds
    let loadedUsers = db.users;
    let loadedGyms = db.gyms;
    if (!loadedUsers || loadedUsers.length === 0 || !loadedGyms || loadedGyms.length === 0) {
      db.resetAll();
    }

    const initialUsers = db.users.length > 0 ? db.users : loadedUsers;
    setGyms(db.gyms);
    setPlans(db.subscriptionPlans);
    setMembershipPlans(db.membershipPlans);
    setUsers(initialUsers);
    setTrainers(db.trainers);
    setMembers(db.members);
    setClasses(db.classes);
    setBookings(db.bookings);
    setAttendance(db.attendance);
    setWorkoutPlans(db.workoutPlans);
    setNutritionPlans(db.nutritionPlans);
    setProgressHistory(db.progress);
    setLogs(db.logs);

    // Initial Path Matching to activePage
    const path = window.location.pathname;
    let initialPage: 'member' | 'trainer' | 'gym_admin' | 'super_admin' | 'guide' | 'pass' = 'member';
    if (path === '/admin') {
      initialPage = 'gym_admin';
    } else if (path === '/trainer') {
      initialPage = 'trainer';
    } else if (path === '/proadmin') {
      initialPage = 'super_admin';
    } else if (path === '/pass') {
      initialPage = 'pass';
    } else if (path === '/guide') {
      initialPage = 'guide';
    }
    setActivePage(initialPage);

    // Set correct active user on initial mount corresponding to the selected page
    let defaultUser: User | null = null;
    if (initialPage === 'gym_admin') {
      defaultUser = initialUsers.find(u => u?.role === 'GYM_ADMIN') || null;
    } else if (initialPage === 'trainer') {
      defaultUser = initialUsers.find(u => u?.role === 'TRAINER') || null;
    } else if (initialPage === 'super_admin') {
      defaultUser = initialUsers.find(u => u?.role === 'SUPER_ADMIN') || null;
    }
    
    if (!defaultUser) {
      defaultUser = initialUsers.find(u => u?.id === 'user_member_alex') || initialUsers.find(u => u?.role === 'MEMBER') || initialUsers[0];
    }
    setCurrentUser(defaultUser);
  }, []);

  // Listen for browser popstate back/forward navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      let targetPage: 'member' | 'trainer' | 'gym_admin' | 'super_admin' | 'guide' | 'pass' = 'member';
      if (path === '/admin') {
        targetPage = 'gym_admin';
      } else if (path === '/trainer') {
        targetPage = 'trainer';
      } else if (path === '/proadmin') {
        targetPage = 'super_admin';
      } else if (path === '/pass') {
        targetPage = 'pass';
      } else if (path === '/guide') {
        targetPage = 'guide';
      }
      
      setActivePage(targetPage);
      
      const allUsers = users.length > 0 ? users : db.users;
      let targetUser: User | null = null;
      if (targetPage === 'gym_admin') {
        targetUser = allUsers.find(u => u?.role === 'GYM_ADMIN') || null;
      } else if (targetPage === 'trainer') {
        targetUser = allUsers.find(u => u?.role === 'TRAINER') || null;
      } else if (targetPage === 'super_admin') {
        targetUser = allUsers.find(u => u?.role === 'SUPER_ADMIN') || null;
      }
      
      if (!targetUser) {
        targetUser = allUsers.find(u => u?.id === 'user_member_alex') || allUsers.find(u => u?.role === 'MEMBER') || allUsers[0];
      }
      setCurrentUser(targetUser);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [users]);

  // Sync state functions that write both to state and to localStorage
  const handleGymsUpdate = (updatedGyms: Gym[]) => {
    setGyms(updatedGyms);
    db.gyms = updatedGyms;
  };

  const handlePlansUpdate = (updatedPlans: SubscriptionPlan[]) => {
    setPlans(updatedPlans);
    db.subscriptionPlans = updatedPlans;
  };

  const handleMembershipPlansUpdate = (updatedPlans: MembershipPlan[]) => {
    setMembershipPlans(updatedPlans);
    db.membershipPlans = updatedPlans;
  };

  const handleUsersUpdate = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    db.users = updatedUsers;
  };

  const handleTrainersUpdate = (updatedTrainers: Trainer[]) => {
    setTrainers(updatedTrainers);
    db.trainers = updatedTrainers;
  };

  const handleMembersUpdate = (updatedMembers: Member[]) => {
    setMembers(updatedMembers);
    db.members = updatedMembers;
  };

  const handleClassesUpdate = (updatedClasses: FitnessClass[]) => {
    setClasses(updatedClasses);
    db.classes = updatedClasses;
  };

  const handleBookingsUpdate = (updatedBookings: Booking[]) => {
    setBookings(updatedBookings);
    db.bookings = updatedBookings;
  };

  const handleAttendanceUpdate = (updatedAttendance: Attendance[]) => {
    setAttendance(updatedAttendance);
    db.attendance = updatedAttendance;
  };

  const handleWorkoutPlansUpdate = (updatedWorkoutPlans: WorkoutPlan[]) => {
    setWorkoutPlans(updatedWorkoutPlans);
    db.workoutPlans = updatedWorkoutPlans;
  };

  const handleNutritionPlansUpdate = (updatedNutritionPlans: NutritionPlan[]) => {
    setNutritionPlans(updatedNutritionPlans);
    db.nutritionPlans = updatedNutritionPlans;
  };

  const handleProgressHistoryUpdate = (updatedProgressHistory: MemberProgress[]) => {
    setProgressHistory(updatedProgressHistory);
    db.progress = updatedProgressHistory;
  };

  const handleLogsUpdate = (updatedLogs: PlatformLog[]) => {
    setLogs(updatedLogs);
  };

  // Restores all records to pristine seed defaults
  const handleResetDb = () => {
    db.resetAll();
    window.location.reload();
  };

  // Safe sidebar page change handler that keeps currentUser in sync with active portal and updates URL
  const handlePageChange = (page: 'member' | 'trainer' | 'gym_admin' | 'super_admin' | 'guide' | 'pass') => {
    setActivePage(page);
    
    // Update URL to match
    let path = '/';
    if (page === 'gym_admin') path = '/admin';
    else if (page === 'trainer') path = '/trainer';
    else if (page === 'super_admin') path = '/proadmin';
    else if (page === 'pass') path = '/pass';
    else if (page === 'guide') path = '/guide';
    else if (page === 'member') path = '/';
    
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    
    if (page === 'member' || page === 'pass') {
      const u = users.find(x => x.id === 'user_member_alex') || users.find(x => x.role === 'MEMBER');
      if (u) setCurrentUser(u);
    } else if (page === 'trainer') {
      const u = users.find(x => x.id === 'user_trainer_sarah') || users.find(x => x.role === 'TRAINER');
      if (u) setCurrentUser(u);
    } else if (page === 'gym_admin') {
      const u = users.find(x => x.id === 'user_gym_admin_apex') || users.find(x => x.role === 'GYM_ADMIN');
      if (u) setCurrentUser(u);
    } else if (page === 'super_admin') {
      const u = users.find(x => x.id === 'user_super_admin') || users.find(x => x.role === 'SUPER_ADMIN');
      if (u) setCurrentUser(u);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    
    // Update users in global state
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    handleUsersUpdate(updatedUsers);

    // Update trainers if applicable
    if (updatedUser.role === 'TRAINER') {
      const updatedTrainers = trainers.map(t => t.id === updatedUser.id ? { ...t, name: updatedUser.name, email: updatedUser.email } : t);
      handleTrainersUpdate(updatedTrainers);
    }

    // Update members if applicable
    if (updatedUser.role === 'MEMBER') {
      const updatedMembers = members.map(m => m.id === updatedUser.id ? { ...m, name: updatedUser.name, email: updatedUser.email } : m);
      handleMembersUpdate(updatedMembers);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Derive active tenant gym context for non-super admins with fallbacks
  const activeGym = (currentUser?.gymId ? gyms.find(g => g?.id === currentUser.gymId) : null) || gyms[0] || {
    id: 'gym_apex',
    name: 'Apex Fitness Club',
    address: '102 Wellness Parkway, Suite A, San Francisco, CA',
    phone: '(555) 123-4567',
    email: 'contact@apexfitness.com',
    status: 'ACTIVE',
    subscriptionPlanId: 'sub_growth',
    createdAt: '2026-01-15'
  };

  // Derive trainer details for active trainers with fallbacks
  const activeTrainerDetails = trainers.find(t => t?.id === currentUser?.id) || trainers[0] || {
    id: 'user_trainer_sarah',
    gymId: 'gym_apex',
    name: 'Sarah Jenkins',
    email: 'sarah.j@apexfitness.com',
    specialties: ['HIIT Training', 'Yoga Flow', 'Fat Loss Coaching'],
    bio: 'Certified personal trainer with 6+ years of experience.',
    experienceYears: 6,
    rating: 4.9,
    schedule: []
  };

  const fallbackMember: Member = {
    id: 'user_member_alex',
    gymId: 'gym_apex',
    name: currentUser?.name || 'Alex Jones',
    email: currentUser?.email || 'alex.jones@gmail.com',
    membershipPlanId: 'plan_apex_premium',
    membershipStatus: 'ACTIVE',
    trainerId: 'user_trainer_sarah',
    joinedDate: '2026-02-01',
    expiryDate: '2026-08-01',
    weight: 78.5,
    targetWeight: 72.0,
    height: 175
  };

  // Derive member details for active members with fallbacks
  const activeMemberDetails = members.find(m => m?.id === currentUser?.id) || members[0] || fallbackMember;
  const assignedTrainer = activeMemberDetails ? trainers.find(t => t?.id === activeMemberDetails.trainerId) : undefined;
  const assignedWorkoutPlan = activeMemberDetails ? workoutPlans.find(wp => wp?.memberId === activeMemberDetails.id) : undefined;
  const assignedNutritionPlan = activeMemberDetails ? nutritionPlans.find(np => np?.memberId === activeMemberDetails.id) : undefined;

  // Get active SaaS pricing limits of current gym with fallbacks
  const activeSaaSPlan = activeGym ? plans.find(p => p?.id === activeGym.subscriptionPlanId) : plans[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Core Dashboard Layout with dynamic content panels */}
      <DashboardLayout 
        currentUser={currentUser} 
        activeGym={activeGym}
        onResetDb={handleResetDb}
        activePage={activePage}
        onPageChange={handlePageChange}
        onUserUpdate={handleUserUpdate}
      >
        {activePage === 'guide' && <IntegrationGuide />}

        {activePage === 'super_admin' && (
          <SuperAdminDashboard 
            gyms={gyms}
            plans={plans}
            logs={logs}
            onGymsUpdate={handleGymsUpdate}
            onPlansUpdate={handlePlansUpdate}
            onLogsUpdate={handleLogsUpdate}
            currentUser={currentUser}
          />
        )}

        {activePage === 'gym_admin' && activeGym && activeSaaSPlan && (
          <GymOwnerDashboard 
            gym={activeGym}
            saasPlan={activeSaaSPlan}
            members={members}
            trainers={trainers}
            classes={classes}
            gymPlans={membershipPlans}
            onMembersUpdate={handleMembersUpdate}
            onTrainersUpdate={handleTrainersUpdate}
            onClassesUpdate={handleClassesUpdate}
            onGymPlansUpdate={handleMembershipPlansUpdate}
            onUsersUpdate={handleUsersUpdate}
            onLogsUpdate={handleLogsUpdate}
            currentUser={currentUser}
          />
        )}

        {activePage === 'trainer' && activeTrainerDetails && (
          <TrainerDashboard 
            trainer={activeTrainerDetails}
            clients={members}
            classes={classes}
            bookings={bookings}
            attendance={attendance}
            workoutPlans={workoutPlans}
            nutritionPlans={nutritionPlans}
            onWorkoutPlansUpdate={handleWorkoutPlansUpdate}
            onNutritionPlansUpdate={handleNutritionPlansUpdate}
            onAttendanceUpdate={handleAttendanceUpdate}
            onLogsUpdate={handleLogsUpdate}
            currentUser={currentUser}
          />
        )}

        {activePage === 'member' && activeMemberDetails && (
          <MemberPortal 
            member={activeMemberDetails}
            trainer={assignedTrainer}
            classes={classes}
            bookings={bookings}
            attendance={attendance}
            workoutPlan={assignedWorkoutPlan}
            nutritionPlan={assignedNutritionPlan}
            progressHistory={progressHistory}
            onBookingsUpdate={handleBookingsUpdate}
            onClassesUpdate={handleClassesUpdate}
            onProgressUpdate={handleProgressHistoryUpdate}
            onAttendanceUpdate={handleAttendanceUpdate}
            onLogsUpdate={handleLogsUpdate}
            currentUser={currentUser}
          />
        )}

        {activePage === 'pass' && activeMemberDetails && (
          <MembershipPassPage 
            member={activeMemberDetails}
            attendance={attendance}
            onAttendanceUpdate={handleAttendanceUpdate}
            onLogsUpdate={handleLogsUpdate}
            currentUser={currentUser}
          />
        )}
      </DashboardLayout>
    </div>
  );
}
