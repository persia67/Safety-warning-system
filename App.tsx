import React, { useState, useEffect } from 'react';
import { MOCK_VIOLATIONS, MOCK_REWARDS, getSeverityColor, getStatusColor, isOlderThanSixMonths, APP_VERSION, DEFAULT_USERS, DEFAULT_SETTINGS, TRANSLATIONS } from './constants';
import { Violation, Reward, ReporterStat, User, AppSettings, SystemMode } from './types';
import DashboardStats from './components/DashboardStats';
import ViolationForm from './components/ViolationForm';
import RewardForm from './components/RewardForm';
import GeminiReport from './components/GeminiReport';
import DeleteModal from './components/DeleteModal';
import VerdictModal from './components/VerdictModal';
import LoginPage from './components/LoginPage';
import SettingsModal from './components/SettingsModal';
import { Shield, Plus, Search, Filter, Trash2, Edit2, AlertCircle, UserCog, Briefcase, Lock, FileSpreadsheet, Archive, Calendar, ImageIcon, LayoutList, Gavel, CheckCircle2, UserCheck, BarChart3, Check, XCircle, LogOut, Settings, Award, Medal, Star, ThumbsUp } from 'lucide-react';

type Tab = 'VIOLATIONS' | 'APPROVALS' | 'COMMITTEE' | 'REPORTERS';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [loginError, setLoginError] = useState<string>('');

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Data State
  const [violations, setViolations] = useState<Violation[]>(MOCK_VIOLATIONS);
  const [rewards, setRewards] = useState<Reward[]>(MOCK_REWARDS);
  
  // UI State
  const [systemMode, setSystemMode] = useState<SystemMode>('VIOLATION');
  const [activeTab, setActiveTab] = useState<Tab>('VIOLATIONS');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false); // For Violation Form
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false); // For Reward Form
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean; id: string | null; type: 'VIOLATION' | 'REWARD'}>({ isOpen: false, id: null, type: 'VIOLATION' });
  const [verdictModal, setVerdictModal] = useState<{isOpen: boolean; id: string | null; name: string}>({ isOpen: false, id: null, name: '' });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  
  // Load persisted data
  useEffect(() => {
    const savedUsers = localStorage.getItem('sg_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedSettings = localStorage.getItem('sg_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedRewards = localStorage.getItem('sg_rewards');
    if (savedRewards) setRewards(JSON.parse(savedRewards));
    else setRewards(MOCK_REWARDS); // Default if empty

    setViolations(prev => prev.map(v => ({
      ...v,
      isArchived: isOlderThanSixMonths(v.date)
    })));
  }, []);

  // Save changes
  useEffect(() => {
    localStorage.setItem('sg_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sg_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sg_rewards', JSON.stringify(rewards));
  }, [rewards]);

  const handleLogin = (u: string, p: string) => {
    const foundUser = users.find(user => user.username === u && user.password === p);
    if (foundUser) {
      setUser(foundUser);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('VIOLATIONS');
    setSystemMode('VIOLATION');
  };

  // Helper for translations
  const t = TRANSLATIONS[settings.language];

  // Helper for Theme Colors
  const getThemeColor = (type: 'bg' | 'text' | 'border' | 'ring' | 'hover') => {
    if (systemMode === 'REWARD') {
       // Green Theme for Reward Mode
       const green = { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', ring: 'focus:ring-emerald-500', hover: 'hover:bg-emerald-700', lightBg: 'bg-emerald-50', lightText: 'text-emerald-700' };
       return green;
    }
    const c = settings.themeColor;
    const colors = {
      red: { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600', ring: 'focus:ring-red-500', hover: 'hover:bg-red-700', lightBg: 'bg-red-50', lightText: 'text-red-700' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', ring: 'focus:ring-blue-500', hover: 'hover:bg-blue-700', lightBg: 'bg-blue-50', lightText: 'text-blue-700' },
      green: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', ring: 'focus:ring-emerald-500', hover: 'hover:bg-emerald-700', lightBg: 'bg-emerald-50', lightText: 'text-emerald-700' },
      violet: { bg: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-600', ring: 'focus:ring-violet-500', hover: 'hover:bg-violet-700', lightBg: 'bg-violet-50', lightText: 'text-violet-700' },
      slate: { bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-600', ring: 'focus:ring-slate-500', hover: 'hover:bg-slate-700', lightBg: 'bg-slate-50', lightText: 'text-slate-700' },
    };
    return colors[c] || colors.red;
  };

  const themeStyles = getThemeColor('bg');

  // --- Logic Methods (Violations & Rewards) ---
  const handleAddViolation = (newViolation: Violation) => {
    setViolations([newViolation, ...violations]);
    alert("گزارش تخلف ثبت شد.");
  };

  const handleAddReward = (newReward: Reward) => {
    setRewards([newReward, ...rewards]);
    alert("گزارش تشویق ثبت شد.");
  };

  const confirmDelete = (id: string, type: 'VIOLATION' | 'REWARD') => {
    setDeleteModal({ isOpen: true, id, type });
  };

  const handleDelete = () => {
    if (deleteModal.id) {
      if (deleteModal.type === 'VIOLATION') {
         setViolations(violations.filter(v => v.id !== deleteModal.id));
      } else {
         setRewards(rewards.filter(r => r.id !== deleteModal.id));
      }
      setDeleteModal({ isOpen: false, id: null, type: 'VIOLATION' });
    }
  };

  const handleVerdictSubmit = (verdict: string) => {
    if (verdictModal.id) {
      setViolations(prev => prev.map(v => 
        v.id === verdictModal.id ? { ...v, committeeVerdict: verdict } : v
      ));
    }
  };

  const openVerdictModal = (id: string, name: string) => {
    setVerdictModal({ isOpen: true, id, name });
  };

  const handleApprove = (id: string, type: 'VIOLATION' | 'REWARD' = 'VIOLATION') => {
      if (type === 'VIOLATION') {
          setViolations(prev => prev.map(v => v.id === id ? { ...v, isApproved: true } : v));
      } else {
          setRewards(prev => prev.map(r => r.id === id ? { ...r, isApproved: true } : r));
      }
  };

  const handleReject = (id: string, type: 'VIOLATION' | 'REWARD' = 'VIOLATION') => {
      if(confirm("آیا از رد کردن این گزارش اطمینان دارید؟")) {
         if (type === 'VIOLATION') {
            setViolations(prev => prev.filter(v => v.id !== id));
         } else {
            setRewards(prev => prev.filter(r => r.id !== id));
         }
      }
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`File ${file.name} uploaded.`);
    }
  };

  // --- Render ---

  if (!user) {
    return <LoginPage onLogin={handleLogin} settings={settings} error={loginError} />;
  }

  // --- Permissions Logic ---
  const canViewAllReports = ['HSE_MANAGER', 'PLANT_MANAGER', 'HR_MANAGER', 'ADMIN_MANAGER'].includes(user.role);
  const canApprove = user.role === 'HSE_MANAGER';
  const canCreate = ['HSE_MANAGER', 'HSE_OFFICER', 'HSE_EXPERT', 'HR_MANAGER'].includes(user.role);

  // Filtering Logic
  let filteredData: any[] = [];
  if (systemMode === 'VIOLATION') {
    filteredData = violations.filter(v => {
        const matchesRole = canViewAllReports || v.reporterName === user.fullName;
        const matchesSearch = v.employeeName.includes(searchTerm) || v.personnelId.includes(searchTerm);
        const matchesSeverity = severityFilter === 'All' || v.severity === severityFilter;
        return matchesRole && matchesSearch && matchesSeverity;
    });
  } else {
    // REWARD MODE
    filteredData = rewards.filter(r => {
        const matchesRole = canViewAllReports || r.reporterName === user.fullName;
        const matchesSearch = r.employeeName.includes(searchTerm) || r.personnelId.includes(searchTerm);
        return matchesRole && matchesSearch;
    });
  }

  // Derived Data
  const approvedItems = filteredData.filter(i => i.isApproved);
  const pendingItems = filteredData.filter(i => !i.isApproved);
  const committeeViolations = approvedItems.filter(item => {
    if (systemMode !== 'VIOLATION') return false;
    const v = item as Violation;
    return v.severity === 'Critical' || v.severity === 'High' || v.penaltyActions?.includes('معرفی به کمیته انضباطی');
  });
  
  // Stats
  const reporterStatsMap = violations.reduce<Record<string, ReporterStat>>((acc, v) => {
    const name = v.reporterName || 'Unknown';
    if (!acc[name]) acc[name] = { name, totalReports: 0, approvedReports: 0, lastReportDate: v.date };
    acc[name].totalReports++;
    if (v.isApproved) acc[name].approvedReports++;
    if (v.date > acc[name].lastReportDate) acc[name].lastReportDate = v.date;
    return acc;
  }, {});
  const reporterStats: ReporterStat[] = (Object.values(reporterStatsMap) as ReporterStat[]).sort((a, b) => b.approvedReports - a.approvedReports);

  return (
    <div className="min-h-screen pb-12 bg-gray-50 flex flex-col font-sans transition-colors duration-300" dir={settings.language === 'fa' ? 'rtl' : 'ltr'}>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shadow-lg transition-colors ${themeStyles.bg} shadow-${settings.themeColor}-200`}>
              {settings.companyLogo ? (
                  <img src={settings.companyLogo} alt="Logo" className="w-7 h-7 object-contain bg-white rounded-full p-0.5" />
              ) : (
                  <Shield className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">{settings.companyName}</h1>
              <p className="text-xs text-gray-500 font-medium">Safety Management System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* System Mode Switcher */}
             <div className="hidden md:flex bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => { setSystemMode('VIOLATION'); setActiveTab('VIOLATIONS'); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${systemMode === 'VIOLATION' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                   <AlertCircle className="w-4 h-4" />
                   {t.mode_violation}
                </button>
                <button 
                  onClick={() => { setSystemMode('REWARD'); setActiveTab('VIOLATIONS'); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${systemMode === 'REWARD' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                   <Medal className="w-4 h-4" />
                   {t.mode_reward}
                </button>
             </div>

             {/* User Info & Settings */}
             <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${themeStyles.bg}`}>
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:flex flex-col px-2">
                    <span className="text-xs font-bold text-gray-700">{user.fullName}</span>
                    <span className="text-[10px] text-gray-400 uppercase">
                      {(t as any)[`role_${user.role.toLowerCase()}`] || user.role}
                    </span>
                </div>
                
                <div className="h-6 w-px bg-gray-300 mx-1"></div>

                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1.5 rounded-full hover:bg-white text-gray-500 hover:text-gray-700 transition-colors"
                  title={t.settings}
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 rounded-full hover:bg-white text-red-500 hover:text-red-700 transition-colors"
                  title={t.logout}
                >
                    <LogOut className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Mobile Mode Switcher */}
        <div className="md:hidden flex bg-gray-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => { setSystemMode('VIOLATION'); setActiveTab('VIOLATIONS'); }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${systemMode === 'VIOLATION' ? 'bg-white shadow text-red-600' : 'text-gray-500'}`}
            >
                <AlertCircle className="w-4 h-4" />
                {t.mode_violation}
            </button>
            <button 
              onClick={() => { setSystemMode('REWARD'); setActiveTab('VIOLATIONS'); }}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${systemMode === 'REWARD' ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}
            >
                <Medal className="w-4 h-4" />
                {t.mode_reward}
            </button>
        </div>

        <DashboardStats 
            violations={violations} 
            rewards={rewards} 
            mode={systemMode} 
            language={settings.language} 
        />
        
        {systemMode === 'VIOLATION' && activeTab === 'VIOLATIONS' && (
             <GeminiReport violations={approvedItems} />
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
             <button 
                onClick={() => setActiveTab('VIOLATIONS')}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'VIOLATIONS' ? `${themeStyles.border} ${themeStyles.text}` : 'border-transparent text-gray-500 hover:text-gray-700'}`}
             >
                <LayoutList className="w-4 h-4" />
                {systemMode === 'VIOLATION' ? t.violations : t.rewards}
             </button>
             
             {(canApprove || canCreate) && (
             <button 
                onClick={() => setActiveTab('APPROVALS')}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'APPROVALS' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
             >
                <UserCheck className="w-4 h-4" />
                {t.approvals}
                {pendingItems.length > 0 && (
                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse mx-1">
                    {pendingItems.length}
                </span>
                )}
             </button>
             )}

             {systemMode === 'VIOLATION' && (
             <button 
                onClick={() => setActiveTab('COMMITTEE')}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'COMMITTEE' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
             >
                <Gavel className="w-4 h-4" />
                {t.committee}
             </button>
             )}

             {(user.role === 'HSE_MANAGER' || user.role === 'PLANT_MANAGER') && systemMode === 'VIOLATION' && (
                <button 
                    onClick={() => setActiveTab('REPORTERS')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'REPORTERS' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <BarChart3 className="w-4 h-4" />
                    {t.reporters}
                </button>
             )}
        </div>

        {/* Action Bar */}
        {activeTab !== 'REPORTERS' && (
        <div className="flex flex-col xl:flex-row justify-between items-end xl:items-center gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full xl:w-auto flex-1">
             <div className="relative group">
                <div className={`absolute inset-y-0 ${settings.language === 'fa' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t.search}
                  className={`block w-full py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 ${themeStyles.ring} sm:text-sm shadow-sm transition-all ${settings.language === 'fa' ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             
             {systemMode === 'VIOLATION' && (
              <div className="relative">
                <select 
                    className={`appearance-none bg-white border border-gray-200 text-gray-700 py-3 rounded-xl leading-tight focus:outline-none focus:ring-2 ${themeStyles.ring} w-full shadow-sm cursor-pointer ${settings.language === 'fa' ? 'pr-4 pl-10' : 'pl-4 pr-10'}`}
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                >
                    <option value="All">All Severity</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>
                <div className={`pointer-events-none absolute inset-y-0 ${settings.language === 'fa' ? 'left-0' : 'right-0'} flex items-center px-2 text-gray-700`}>
                    <Filter className="h-4 w-4" />
                </div>
             </div>
             )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {canApprove && (
                <label className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer">
                    <FileSpreadsheet className="w-5 h-5" />
                    <span>Import Excel</span>
                    <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleExcelImport} />
                </label>
            )}

            {canCreate && (
            <button
                onClick={() => systemMode === 'VIOLATION' ? setIsModalOpen(true) : setIsRewardModalOpen(true)}
                className={`flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all active:scale-95 ${themeStyles.bg} ${themeStyles.hover}`}
              >
                <Plus className="w-5 h-5" />
                <span>{systemMode === 'VIOLATION' ? t.newViolation : t.newReward}</span>
            </button>
            )}
          </div>
        </div>
        )}

        {/* --- Data Table Section --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'REPORTERS' ? (
                // Reporters Stats Table
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className={`px-6 py-4 text-xs font-bold text-blue-800 uppercase ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>Reporter</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-blue-800 uppercase">Total</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-blue-800 uppercase">Approved</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-blue-800 uppercase">Rate</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {reporterStats.map((stat, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{stat.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{stat.totalReports}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-green-600 font-bold">{stat.approvedReports}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-2 py-1 rounded text-xs ${stat.approvedReports/stat.totalReports > 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {Math.round((stat.approvedReports / stat.totalReports) * 100)}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : activeTab === 'APPROVALS' ? (
                 // Approvals Table
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-orange-50">
                        <tr>
                            <th className={`px-6 py-4 text-xs font-bold text-orange-800 uppercase ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>Reporter</th>
                            <th className={`px-6 py-4 text-xs font-bold text-orange-800 uppercase ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>Employee</th>
                            <th className={`px-6 py-4 text-xs font-bold text-orange-800 uppercase ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>Details</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-orange-800 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {pendingItems.length > 0 ? (
                            pendingItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.reporterName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{item.employeeName}</td>
                                <td className="px-6 py-4 text-sm">{systemMode === 'VIOLATION' ? (item as Violation).violationType : (item as Reward).rewardType}</td>
                                <td className="px-6 py-4 text-center flex justify-center gap-2">
                                    {canApprove ? (
                                        <>
                                            <button onClick={() => handleApprove(item.id, systemMode)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm text-xs transition-colors">Approve</button>
                                            <button onClick={() => handleReject(item.id, systemMode)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm text-xs transition-colors">Reject</button>
                                        </>
                                    ) : (
                                        <span className="text-xs text-orange-500 bg-orange-100 px-2 py-1 rounded">Pending Approval</span>
                                    )}
                                </td>
                            </tr>
                        ))
                        ) : (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-500">No pending reports found.</td></tr>
                        )}
                    </tbody>
                 </table>
            ) : (
                // MAIN DATA TABLE (Violations or Rewards)
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th scope="col" className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>Personnel</th>
                    <th scope="col" className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>{systemMode === 'VIOLATION' ? 'Violation' : 'Reward Type'}</th>
                    <th scope="col" className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>{systemMode === 'VIOLATION' ? 'Severity' : 'Details'}</th>
                    {systemMode === 'VIOLATION' && <th scope="col" className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>Status</th>}
                    {activeTab === 'VIOLATIONS' && <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{t.actions}</th>}
                    {activeTab === 'COMMITTEE' && <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Verdict</th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {(activeTab === 'VIOLATIONS' ? approvedItems : committeeViolations).length > 0 ? (
                    (activeTab === 'VIOLATIONS' ? approvedItems : committeeViolations).map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-bold ${themeStyles.lightBg} ${themeStyles.lightText} ${systemMode === 'REWARD' && (item as Reward).rewardType === 'Exemplary' ? 'ring-2 ring-yellow-400 bg-yellow-100 text-yellow-700' : ''}`}>
                                    {systemMode === 'REWARD' && (item as Reward).rewardType === 'Exemplary' ? <Star className="w-5 h-5" /> : item.employeeName.charAt(0)}
                                </div>
                                <div className={`${settings.language === 'fa' ? 'mr-4' : 'ml-4'}`}>
                                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                      {item.employeeName}
                                      {systemMode === 'REWARD' && (item as Reward).rewardType === 'Exemplary' && (
                                        <Medal className="w-4 h-4 text-yellow-500" />
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">{item.department}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium">
                                {systemMode === 'VIOLATION' ? (item as Violation).violationType : (item as Reward).rewardType}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{item.date}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">Reported by: {item.reporterName}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                             {systemMode === 'VIOLATION' ? (
                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full w-fit items-center gap-1 ${getSeverityColor((item as Violation).severity)}`}>
                                    {(item as Violation).severity}
                                </span>
                             ) : (
                                <div className="flex flex-wrap gap-1">
                                    {(item as Reward).rewardsGiven?.map((r, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full">{r}</span>
                                    ))}
                                </div>
                             )}
                        </td>
                        
                        {systemMode === 'VIOLATION' && activeTab === 'VIOLATIONS' && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${getStatusColor((item as Violation).status)}`}>
                                    {(item as Violation).status}
                                    </span>
                                </td>
                        )}

                        {activeTab === 'VIOLATIONS' && (
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    {canApprove ? (
                                    <div className="flex justify-center gap-2">
                                        <button 
                                            onClick={() => confirmDelete(item.id, systemMode)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    ) : (
                                        <Lock className="w-4 h-4 text-gray-300 mx-auto" />
                                    )}
                                </td>
                        )}

                        {activeTab === 'COMMITTEE' && systemMode === 'VIOLATION' && (
                            <>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {(item as Violation).committeeVerdict ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Verdict Issued
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {canApprove && (
                                        <button 
                                            onClick={() => openVerdictModal(item.id, item.employeeName)}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium text-xs border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                        >
                                            {(item as Violation).committeeVerdict ? 'Edit' : 'Issue Verdict'}
                                        </button>
                                    )}
                                </td>
                            </>
                        )}
                        </tr>
                    ))
                    ) : (
                        <tr><td colSpan={systemMode === 'VIOLATION' ? 6 : 4} className="text-center py-8 text-gray-500">No records found.</td></tr>
                    )}
                </tbody>
                </table>
            )}
          </div>
           <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500">v{APP_VERSION}</span>
          </div>
        </div>
      </main>

      {isModalOpen && canCreate && (
        <ViolationForm 
          currentUser={user}
          existingViolations={violations}
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddViolation} 
        />
      )}

      {isRewardModalOpen && canCreate && (
        <RewardForm 
            currentUser={user}
            onClose={() => setIsRewardModalOpen(false)}
            onSubmit={handleAddReward}
        />
      )}

      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, id: null, type: 'VIOLATION' })} 
        onConfirm={handleDelete} 
      />

      <VerdictModal 
        isOpen={verdictModal.isOpen}
        onClose={() => setVerdictModal({ isOpen: false, id: null, name: '' })}
        onSubmit={handleVerdictSubmit}
        employeeName={verdictModal.name}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        users={users}
        onUpdateUsers={setUsers}
        currentUser={user}
      />
    </div>
  );
};

export default App;