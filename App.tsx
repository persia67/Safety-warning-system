import React, { useState, useEffect } from 'react';
import { MOCK_VIOLATIONS, MOCK_REWARDS, getSeverityColor, getStatusColor, isOlderThanSixMonths, APP_VERSION, DEFAULT_USERS, DEFAULT_SETTINGS, TRANSLATIONS } from './constants';
import { Violation, Reward, ReporterStat, User, AppSettings, SystemMode, WorkerOfMonthResult } from './types';
import DashboardStats from './components/DashboardStats';
import ViolationForm from './components/ViolationForm';
import RewardForm from './components/RewardForm';
import GeminiReport from './components/GeminiReport';
import DeleteModal from './components/DeleteModal';
import VerdictModal from './components/VerdictModal';
import LoginPage from './components/LoginPage';
import SettingsModal from './components/SettingsModal';
import { selectWorkerOfMonth } from './services/geminiService';
import { Shield, Plus, Search, Filter, Trash2, Edit2, AlertCircle, UserCog, Briefcase, Lock, FileSpreadsheet, Archive, Calendar, ImageIcon, LayoutList, Gavel, CheckCircle2, UserCheck, BarChart3, Check, XCircle, LogOut, Settings, Award, Medal, Star, ThumbsUp, Sparkles, Loader2 } from 'lucide-react';

type Tab = 'VIOLATIONS' | 'APPROVALS' | 'COMMITTEE' | 'REPORTERS' | 'ARCHIVE';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [loginError, setLoginError] = useState<string>('');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [violations, setViolations] = useState<Violation[]>(MOCK_VIOLATIONS);
  const [rewards, setRewards] = useState<Reward[]>(MOCK_REWARDS);
  const [systemMode, setSystemMode] = useState<SystemMode>('VIOLATION');
  const [activeTab, setActiveTab] = useState<Tab>('VIOLATIONS');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false); 
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean; id: string | null; type: 'VIOLATION' | 'REWARD'}>({ isOpen: false, id: null, type: 'VIOLATION' });
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  
  // Worker of Month State
  const [workerOfMonth, setWorkerOfMonth] = useState<WorkerOfMonthResult | null>(null);
  const [selectingWorker, setSelectingWorker] = useState(false);
  
  // Load data and Auto-Archive Logic
  useEffect(() => {
    const savedUsers = localStorage.getItem('sg_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    const savedSettings = localStorage.getItem('sg_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    
    // Load and Process Rewards for Archiving
    const savedRewards = localStorage.getItem('sg_rewards');
    let loadedRewards: Reward[] = savedRewards ? JSON.parse(savedRewards) : MOCK_REWARDS;
    
    const processedRewards = loadedRewards.map(r => {
      // If approved, not yet archived, and older than 6 months -> Archive it
      if (r.isApproved && !r.isArchived && isOlderThanSixMonths(r.date)) {
        return { ...r, isArchived: true };
      }
      return r;
    });
    setRewards(processedRewards);

    // Load and Process Violations for Archiving (optional, but good for consistency)
    const savedViolations = localStorage.getItem('sg_violations');
    let loadedViolations: Violation[] = savedViolations ? JSON.parse(savedViolations) : MOCK_VIOLATIONS;

    const processedViolations = loadedViolations.map(v => {
      if (v.isApproved && !v.isArchived && isOlderThanSixMonths(v.date)) {
        return { ...v, isArchived: true };
      }
      return v;
    });
    setViolations(processedViolations);

  }, []);

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

  const t = TRANSLATIONS[settings.language];

  const getThemeColor = () => {
    if (systemMode === 'REWARD') {
       return { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', ring: 'focus:ring-emerald-500', hover: 'hover:bg-emerald-700', lightBg: 'bg-emerald-50', lightText: 'text-emerald-700' };
    }
    const colors = {
      red: { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-600', ring: 'focus:ring-red-500', hover: 'hover:bg-red-700', lightBg: 'bg-red-50', lightText: 'text-red-700' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', ring: 'focus:ring-blue-500', hover: 'hover:bg-blue-700', lightBg: 'bg-blue-50', lightText: 'text-blue-700' },
      green: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', ring: 'focus:ring-emerald-500', hover: 'hover:bg-emerald-700', lightBg: 'bg-emerald-50', lightText: 'text-emerald-700' },
      violet: { bg: 'bg-violet-600', text: 'text-violet-600', border: 'border-violet-600', ring: 'focus:ring-violet-500', hover: 'hover:bg-violet-700', lightBg: 'bg-violet-50', lightText: 'text-violet-700' },
      slate: { bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-600', ring: 'focus:ring-slate-500', hover: 'hover:bg-slate-700', lightBg: 'bg-slate-50', lightText: 'text-slate-700' },
    };
    return colors[settings.themeColor] || colors.red;
  };

  const themeStyles = getThemeColor();

  const handlePickWorkerOfMonth = async () => {
    if (rewards.length === 0) return;
    setSelectingWorker(true);
    try {
      const result = await selectWorkerOfMonth(rewards, violations);
      setWorkerOfMonth(result);
    } catch (e) {
      alert("خطا در تحلیل هوشمند.");
    } finally {
      setSelectingWorker(false);
    }
  };

  const handleAddViolation = (newViolation: Violation) => {
    setViolations([newViolation, ...violations]);
  };

  const handleAddReward = (newReward: Reward) => {
    setRewards([newReward, ...rewards]);
  };

  const confirmDelete = (id: string, type: 'VIOLATION' | 'REWARD') => {
    setDeleteModal({ isOpen: true, id, type });
  };

  const handleDelete = () => {
    if (deleteModal.id) {
      if (deleteModal.type === 'VIOLATION') setViolations(violations.filter(v => v.id !== deleteModal.id));
      else setRewards(rewards.filter(r => r.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null, type: 'VIOLATION' });
    }
  };

  const handleApprove = (id: string, type: 'VIOLATION' | 'REWARD' = 'VIOLATION') => {
      if (type === 'VIOLATION') setViolations(prev => prev.map(v => v.id === id ? { ...v, isApproved: true } : v));
      else setRewards(prev => prev.map(r => r.id === id ? { ...r, isApproved: true } : r));
  };

  if (!user) return <LoginPage onLogin={handleLogin} settings={settings} error={loginError} />;

  const canViewAllReports = ['HSE_MANAGER', 'PLANT_MANAGER', 'HR_MANAGER'].includes(user.role);
  const canApprove = user.role === 'HSE_MANAGER';

  let filteredData = systemMode === 'VIOLATION' 
    ? violations.filter(v => (canViewAllReports || v.reporterName === user.fullName) && (v.employeeName.includes(searchTerm) || v.personnelId.includes(searchTerm)) && (severityFilter === 'All' || v.severity === severityFilter))
    : rewards.filter(r => (canViewAllReports || r.reporterName === user.fullName) && (r.employeeName.includes(searchTerm) || r.personnelId.includes(searchTerm)));

  // Separate data based on tabs
  const archivedItems = filteredData.filter(i => i.isArchived);
  const pendingItems = filteredData.filter(i => !i.isApproved && !i.isArchived); // Pending items should not be archived
  const approvedItems = filteredData.filter(i => i.isApproved && !i.isArchived); // Active Approved items

  let itemsToDisplay;
  if (activeTab === 'ARCHIVE') {
    itemsToDisplay = archivedItems;
  } else if (activeTab === 'APPROVALS') {
    itemsToDisplay = pendingItems;
  } else {
    // VIOLATIONS or main list
    itemsToDisplay = approvedItems;
  }

  const handleExportCSV = () => {
    if (!itemsToDisplay.length) {
      alert(settings.language === 'fa' ? "داده‌ای برای خروجی وجود ندارد" : "No data to export");
      return;
    }

    const isViolation = systemMode === 'VIOLATION';
    // Add BOM for Excel UTF-8 compatibility
    const BOM = "\uFEFF"; 
    let csvContent = BOM;

    if (isViolation) {
        const headers = ["ID", "نام پرسنل", "کد پرسنلی", "واحد", "تاریخ", "نوع تخلف", "سطح ریسک", "وضعیت", "توضیحات"];
        csvContent += headers.join(",") + "\n";
        
        (itemsToDisplay as Violation[]).forEach(item => {
            const row = [
                item.id,
                `"${item.employeeName}"`,
                `"${item.personnelId}"`,
                `"${item.department}"`,
                item.date,
                `"${item.violationType}"`,
                item.severity,
                item.status,
                `"${item.description.replace(/"/g, '""')}"` // Escape quotes
            ];
            csvContent += row.join(",") + "\n";
        });
    } else {
         const headers = ["ID", "نام پرسنل", "کد پرسنلی", "واحد", "تاریخ", "نوع پاداش", "جوایز", "توضیحات"];
        csvContent += headers.join(",") + "\n";
        
        (itemsToDisplay as Reward[]).forEach(item => {
             const row = [
                item.id,
                `"${item.employeeName}"`,
                `"${item.personnelId}"`,
                `"${item.department}"`,
                item.date,
                (t as any)[`type_${item.rewardType}`] || item.rewardType,
                `"${item.rewardsGiven.join(' - ')}"`,
                `"${item.description.replace(/"/g, '""')}"`
            ];
            csvContent += row.join(",") + "\n";
        });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `SafeWatch_Export_${systemMode}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-12 bg-gray-50 flex flex-col font-sans transition-all duration-300" dir={settings.language === 'fa' ? 'rtl' : 'ltr'}>
      {/* Header - Optimized height for mobile */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`p-1.5 md:p-2 rounded-xl shadow-lg transition-all ${themeStyles.bg}`}>
              {settings.companyLogo ? <img src={settings.companyLogo} className="w-5 h-5 md:w-6 md:h-6 object-contain bg-white rounded-lg p-0.5" /> : <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />}
            </div>
            <div>
              <h1 className="text-sm md:text-xl font-black text-gray-800 tracking-tight leading-tight truncate max-w-[120px] md:max-w-none">{settings.companyName}</h1>
              <p className="hidden md:block text-[10px] text-gray-500 font-medium uppercase tracking-wider">HSE Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-4">
             {/* Mode Switcher - Optimized for all screens */}
             <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 scale-90 md:scale-100 origin-right rtl:origin-left">
                <button 
                  onClick={() => { setSystemMode('VIOLATION'); setActiveTab('VIOLATIONS'); }} 
                  className={`px-2 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 ${systemMode === 'VIOLATION' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title={t.mode_violation}
                >
                   <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                   <span className="hidden sm:inline">{t.mode_violation}</span>
                </button>
                <button 
                  onClick={() => { setSystemMode('REWARD'); setActiveTab('VIOLATIONS'); }} 
                  className={`px-2 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-1.5 ${systemMode === 'REWARD' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                  title={t.mode_reward}
                >
                   <Medal className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                   <span className="hidden sm:inline">{t.mode_reward}</span>
                </button>
             </div>

             <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-full border border-gray-200">
                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm ${themeStyles.bg}`}>{user.username.charAt(0).toUpperCase()}</div>
                <button onClick={() => setIsSettingsOpen(true)} className="p-1.5 rounded-full hover:bg-white text-gray-500" title={t.settings}><Settings className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                <button onClick={handleLogout} className="p-1.5 rounded-full hover:bg-white text-red-500" title={t.logout}><LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8 flex-grow">
        <DashboardStats violations={violations} rewards={rewards} mode={systemMode} language={settings.language} />
        
        {/* Worker of Month Banner - Mobile Optimized */}
        {systemMode === 'REWARD' && activeTab === 'VIOLATIONS' && (
             <div className="mb-6 md:mb-8 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-300" />
                            {t.selectWorkerOfMonth}
                        </h2>
                        <p className="text-emerald-100 mt-1 text-xs md:text-sm">تحلیل هوشمند بر اساس رعایت اصول ایمنی و استفاده از PPE.</p>
                    </div>
                    <button 
                        onClick={handlePickWorkerOfMonth} 
                        disabled={selectingWorker}
                        className="w-full md:w-auto bg-white text-emerald-900 px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                        {selectingWorker ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Award className="w-4 h-4 md:w-5 md:h-5" />}
                        {selectingWorker ? "درحال تحلیل..." : "انتخاب توسط هوش مصنوعی"}
                    </button>
                </div>
                
                {workerOfMonth && (
                    <div className="mt-4 md:mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6 animate-in fade-in slide-in-from-top-4">
                        <div className="flex flex-col md:flex-row items-start gap-4">
                            <div className="bg-yellow-400 p-3 md:p-4 rounded-full shadow-lg self-center md:self-start">
                                <Medal className="w-6 h-6 md:w-8 md:h-8 text-emerald-900" />
                            </div>
                            <div className="flex-1 w-full">
                                <h3 className="text-xl md:text-2xl font-black text-white text-center md:text-right">{workerOfMonth.winnerName}</h3>
                                <p className="text-yellow-200 text-xs md:text-sm font-bold mt-1 text-center md:text-right">منتخب دوره {workerOfMonth.period}</p>
                                <div className="mt-4 bg-emerald-900/30 p-3 md:p-4 rounded-lg border border-white/10">
                                    <p className="text-xs md:text-sm font-bold mb-1 flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        {t.reasoningTitle}:
                                    </p>
                                    <p className="text-[11px] md:text-xs text-emerald-50 leading-relaxed text-justify">{workerOfMonth.reasoning}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
             </div>
        )}

        {/* Tab Navigation - Scrollable on mobile */}
        <div className="flex gap-2 md:gap-4 mb-4 md:mb-6 border-b border-gray-200 overflow-x-auto pb-1 no-scrollbar">
             <button onClick={() => setActiveTab('VIOLATIONS')} className={`px-4 py-2 md:px-6 md:py-3 font-medium text-xs md:text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'VIOLATIONS' ? `${themeStyles.border} ${themeStyles.text}` : 'border-transparent text-gray-500'}`}>
                {systemMode === 'VIOLATION' ? t.violations : t.rewards}
             </button>
             {canApprove && (
                <button onClick={() => setActiveTab('APPROVALS')} className={`px-4 py-2 md:px-6 md:py-3 font-medium text-xs md:text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === 'APPROVALS' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500'}`}>
                    {t.approvals} {pendingItems.length > 0 && <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full mx-1">{pendingItems.length}</span>}
                </button>
             )}
             <button onClick={() => setActiveTab('ARCHIVE')} className={`px-4 py-2 md:px-6 md:py-3 font-medium text-xs md:text-sm transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'ARCHIVE' ? 'border-gray-500 text-gray-700' : 'border-transparent text-gray-500'}`}>
                <Archive className="w-3.5 h-3.5 md:w-4 md:h-4" /> {t.archives} {archivedItems.length > 0 && <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{archivedItems.length}</span>}
             </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-end gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full xl:w-auto flex-1">
             <div className="relative">
                <Search className="absolute right-3 top-2.5 md:top-3.5 h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400" />
                <input type="text" placeholder={t.search} className="w-full py-2 md:py-2.5 pr-9 pl-4 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 ring-gray-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
          </div>
          <div className="flex gap-2 w-full xl:w-auto">
             <button onClick={handleExportCSV} className={`flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium text-sm shadow-sm hover:bg-gray-50 transition-all w-full md:w-auto justify-center`}>
                <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5" />
                <span>{t.exportData}</span>
             </button>
             {activeTab !== 'ARCHIVE' && (
                <button onClick={() => systemMode === 'VIOLATION' ? setIsModalOpen(true) : setIsRewardModalOpen(true)} className={`flex items-center gap-2 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all w-full md:w-auto justify-center ${themeStyles.bg}`}>
                    <Plus className="w-4 h-4 md:w-5 md:h-5" /> <span>{systemMode === 'VIOLATION' ? t.newViolation : t.newReward}</span>
                </button>
             )}
          </div>
        </div>

        {/* Table - Optimized padding for mobile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-xs font-bold text-gray-500 text-right">پرسنل</th>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-xs font-bold text-gray-500 text-right">نوع گزارش</th>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-xs font-bold text-gray-500 text-right">جزئیات</th>
                    <th className="px-4 py-3 md:px-6 md:py-4 text-center text-[11px] md:text-xs font-bold text-gray-500 uppercase">{t.actions}</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
                {itemsToDisplay.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm ${themeStyles.lightBg} ${themeStyles.lightText} ${item.isArchived ? 'opacity-50 grayscale' : ''}`}>
                                    {item.employeeName.charAt(0)}
                                </div>
                                <div>
                                    <div className={`text-xs md:text-sm font-bold text-gray-900 ${item.isArchived ? 'text-gray-500' : ''}`}>{item.employeeName}</div>
                                    <div className="text-[10px] md:text-xs text-gray-500">{item.personnelId}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                            <div className="text-xs md:text-sm text-gray-900 font-medium max-w-[140px] md:max-w-[200px] truncate">
                                {systemMode === 'VIOLATION' ? (item as Violation).violationType : (t as any)[`type_${(item as Reward).rewardType}`]}
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500">{item.date}</div>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                             {systemMode === 'VIOLATION' ? (
                                <span className={`px-2 py-0.5 md:py-1 rounded-full text-[10px] ${getSeverityColor((item as Violation).severity)}`}>{(item as Violation).severity}</span>
                             ) : (
                                <div className="flex flex-wrap gap-1">
                                    {(item as Reward).rewardsGiven.map((r, i) => <span key={i} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full">{r}</span>)}
                                </div>
                             )}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-center">
                            {activeTab === 'APPROVALS' ? (
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => handleApprove(item.id, systemMode)} className="bg-green-500 text-white p-1 md:p-1.5 rounded-lg hover:bg-green-600 transition-colors"><Check className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                                    <button className="bg-red-500 text-white p-1 md:p-1.5 rounded-lg hover:bg-red-600 transition-colors"><XCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                                </div>
                            ) : activeTab === 'ARCHIVE' ? (
                                <span className="text-[10px] md:text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">بایگانی</span>
                            ) : (
                                <button onClick={() => confirmDelete(item.id, systemMode)} className="text-red-600 bg-red-50 p-1.5 md:p-2 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                            )}
                        </td>
                    </tr>
                ))}
                {itemsToDisplay.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                      موردی یافت نشد.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && <ViolationForm currentUser={user} existingViolations={violations} onClose={() => setIsModalOpen(false)} onSubmit={handleAddViolation} />}
      {isRewardModalOpen && <RewardForm currentUser={user} onClose={() => setIsRewardModalOpen(false)} onSubmit={handleAddReward} />}
      <DeleteModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null, type: 'VIOLATION' })} onConfirm={handleDelete} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onUpdateSettings={setSettings} users={users} onUpdateUsers={setUsers} currentUser={user} />
    </div>
  );
};

export default App;

const ShieldCheck = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);