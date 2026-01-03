import React, { useState } from 'react';
import { AppSettings, User, ThemeColor, Language, Role } from '../types';
import { TRANSLATIONS } from '../constants';
import { X, Upload, UserPlus, Trash2, Check, Palette, Globe, Building2, Users as UsersIcon, Database, Download, FileJson } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  users: User[];
  onUpdateUsers: (newUsers: User[]) => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, settings, onUpdateSettings, users, onUpdateUsers, currentUser 
}) => {
  const [activeTab, setActiveTab] = useState<'APPEARANCE' | 'USERS' | 'DATA'>('APPEARANCE');
  const [newUser, setNewUser] = useState<Partial<User>>({ username: '', password: '', fullName: '', role: 'HSE_OFFICER' });
  
  const t = TRANSLATIONS[settings.language];

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateSettings({ ...settings, companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(newUser.username && newUser.password && newUser.fullName) {
        const u: User = {
            id: Date.now().toString(),
            username: newUser.username!,
            password: newUser.password!,
            fullName: newUser.fullName!,
            role: newUser.role as Role
        };
        onUpdateUsers([...users, u]);
        setNewUser({ username: '', password: '', fullName: '', role: 'HSE_OFFICER' });
    }
  };

  const handleDeleteUser = (id: string) => {
      if(window.confirm('Are you sure?')) {
          onUpdateUsers(users.filter(u => u.id !== id));
      }
  };

  // --- Backup & Restore Logic ---
  const handleExportBackup = () => {
    // Collect all data from localStorage
    const dataToExport = {
      sg_users: localStorage.getItem('sg_users'),
      sg_settings: localStorage.getItem('sg_settings'),
      sg_violations: localStorage.getItem('sg_violations'),
      sg_rewards: localStorage.getItem('sg_rewards'),
      version: "2.5.0",
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SafeWatch_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          
          // Basic validation
          if (!json.version) {
             throw new Error("Invalid backup file format");
          }

          if (confirm(t.restoreDesc)) {
             if (json.sg_users) localStorage.setItem('sg_users', json.sg_users);
             if (json.sg_settings) localStorage.setItem('sg_settings', json.sg_settings);
             if (json.sg_violations) localStorage.setItem('sg_violations', json.sg_violations);
             if (json.sg_rewards) localStorage.setItem('sg_rewards', json.sg_rewards);
             
             alert(t.restoreSuccess);
             window.location.reload(); // Reload to reflect changes
          }

        } catch (error) {
          console.error(error);
          alert(t.restoreError);
        }
      };
      reader.readAsText(file);
    }
  };

  const colors: {id: ThemeColor, color: string}[] = [
      {id: 'red', color: 'bg-red-600'},
      {id: 'blue', color: 'bg-blue-600'},
      {id: 'green', color: 'bg-emerald-600'},
      {id: 'violet', color: 'bg-violet-600'},
      {id: 'slate', color: 'bg-slate-600'},
  ];

  // Map roles to translation keys
  const roleOptions: Role[] = ['HSE_MANAGER', 'HSE_OFFICER', 'HSE_EXPERT', 'PLANT_MANAGER', 'HR_MANAGER', 'ADMIN_MANAGER'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4" dir={settings.language === 'fa' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[95vh] md:h-[600px]">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4 md:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-0 md:mb-4 px-2 hidden md:block">{t.settings}</h2>
            
            <button 
                onClick={() => setActiveTab('APPEARANCE')}
                className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'APPEARANCE' ? 'bg-white shadow-md text-indigo-600 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <Palette className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm">{t.appearance}</span>
            </button>

            {currentUser.role === 'HSE_MANAGER' && (
                <>
                  <button 
                      onClick={() => setActiveTab('USERS')}
                      className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'USERS' ? 'bg-white shadow-md text-indigo-600 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                      <UsersIcon className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm">{t.users}</span>
                  </button>
                  <button 
                      onClick={() => setActiveTab('DATA')}
                      className={`flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl transition-all whitespace-nowrap ${activeTab === 'DATA' ? 'bg-white shadow-md text-indigo-600 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                      <Database className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-xs md:text-sm">{t.dataManagement}</span>
                  </button>
                </>
            )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">
                    {activeTab === 'APPEARANCE' && t.appearance}
                    {activeTab === 'USERS' && t.users}
                    {activeTab === 'DATA' && t.dataManagement}
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                </button>
            </div>

            {activeTab === 'APPEARANCE' && (
                <div className="space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Theme Color */}
                    <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-3 md:mb-4 text-gray-700 font-medium text-sm md:text-base">
                            <Palette className="w-4 h-4 md:w-5 md:h-5" />
                            {t.theme}
                        </div>
                        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2">
                            {colors.map(c => (
                                <button 
                                    key={c.id}
                                    onClick={() => onUpdateSettings({...settings, themeColor: c.id})}
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${c.color} flex items-center justify-center transition-transform hover:scale-110 shrink-0 ${settings.themeColor === c.id ? 'ring-4 ring-offset-2 ring-gray-200' : ''}`}
                                >
                                    {settings.themeColor === c.id && <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Language */}
                    <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2 mb-3 md:mb-4 text-gray-700 font-medium text-sm md:text-base">
                            <Globe className="w-4 h-4 md:w-5 md:h-5" />
                            {t.language}
                        </div>
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                            <button 
                                onClick={() => onUpdateSettings({...settings, language: 'fa'})}
                                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${settings.language === 'fa' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                            >
                                فارسی
                            </button>
                            <button 
                                onClick={() => onUpdateSettings({...settings, language: 'en'})}
                                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${settings.language === 'en' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
                            >
                                English
                            </button>
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className="bg-white border border-gray-100 p-4 md:p-5 rounded-2xl shadow-sm">
                         <div className="flex items-center gap-2 mb-3 md:mb-4 text-gray-700 font-medium text-sm md:text-base">
                            <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                            {t.companyInfo}
                        </div>
                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                            <div className="relative group cursor-pointer w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden shrink-0">
                                {settings.companyLogo ? (
                                    <img src={settings.companyLogo} className="w-full h-full object-contain p-2" alt="Logo"/>
                                ) : (
                                    <Upload className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs">{t.uploadLogo}</span>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-xs md:text-sm text-gray-500 mb-1">Company Name</label>
                                <input 
                                    type="text" 
                                    value={settings.companyName}
                                    onChange={(e) => onUpdateSettings({...settings, companyName: e.target.value})}
                                    className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'USERS' && (
                <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <form onSubmit={handleAddUser} className="bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <input 
                            placeholder={t.username}
                            value={newUser.username} 
                            onChange={e => setNewUser({...newUser, username: e.target.value})}
                            className="px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            required
                        />
                         <input 
                            placeholder={t.password}
                            value={newUser.password} 
                            onChange={e => setNewUser({...newUser, password: e.target.value})}
                            className="px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            required
                        />
                         <input 
                            placeholder="Full Name"
                            value={newUser.fullName} 
                            onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                            className="px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            required
                        />
                        <select 
                            value={newUser.role}
                            onChange={e => setNewUser({...newUser, role: e.target.value as Role})}
                            className="px-3 py-2 md:px-4 md:py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            {roleOptions.map(r => (
                                <option key={r} value={r}>{(t as any)[`role_${r.toLowerCase()}`] || r}</option>
                            ))}
                        </select>
                        <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm">
                            <UserPlus className="w-4 h-4" />
                            {t.addUser}
                        </button>
                    </form>

                    <div className="border border-gray-100 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                        <table className="w-full text-xs md:text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                <tr>
                                    <th className={`px-3 py-2 md:px-4 md:py-3 ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>{t.username}</th>
                                    <th className={`px-3 py-2 md:px-4 md:py-3 ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>Name</th>
                                    <th className={`px-3 py-2 md:px-4 md:py-3 ${settings.language === 'fa' ? 'text-right' : 'text-left'}`}>{t.role}</th>
                                    <th className="px-3 py-2 md:px-4 md:py-3 text-center">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 md:px-4 md:py-3">{u.username}</td>
                                        <td className="px-3 py-2 md:px-4 md:py-3">{u.fullName}</td>
                                        <td className="px-3 py-2 md:px-4 md:py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs ${u.role === 'HSE_MANAGER' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {(t as any)[`role_${u.role.toLowerCase()}`] || u.role}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 md:px-4 md:py-3 text-center">
                                            {u.username !== currentUser.username && (
                                                <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'DATA' && (
                <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 md:p-5">
                        <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2 text-sm md:text-base">
                            <Database className="w-4 h-4 md:w-5 md:h-5" />
                            {t.dataManagement}
                        </h4>
                        <p className="text-xs md:text-sm text-blue-700 mb-4 leading-relaxed">
                            {t.backupDesc}
                            <br/>
                            از این فایل می‌توانید برای انتقال اطلاعات به سایر دستگاه‌ها (موبایل، تبلت، کامپیوتر دیگر) استفاده کنید.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {/* EXPORT */}
                            <button 
                                onClick={handleExportBackup}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2.5 md:px-4 md:py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 text-xs md:text-sm"
                            >
                                <Download className="w-4 h-4 md:w-5 md:h-5" />
                                {t.downloadBackup}
                            </button>

                            {/* IMPORT */}
                            <label className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 px-3 py-2.5 md:px-4 md:py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer active:scale-95 text-xs md:text-sm">
                                <Upload className="w-4 h-4 md:w-5 md:h-5" />
                                <span>{t.uploadBackup}</span>
                                <input type="file" accept=".json" className="hidden" onChange={handleImportBackup} />
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;