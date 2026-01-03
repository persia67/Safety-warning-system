import React, { useState } from 'react';
import { Reward, User, RewardType } from '../types';
import { X, Camera, UserCheck, Medal, Star, Gift, ShieldCheck, HardHat, Zap } from 'lucide-react';

interface RewardFormProps {
  onClose: () => void;
  onSubmit: (reward: Reward) => void;
  currentUser: User;
}

const REWARD_OPTIONS = [
  "پاداش نقدی",
  "مرخصی تشویقی",
  "لوح تقدیر",
  "کارت هدیه",
  "معرفی در برد"
];

const RewardForm: React.FC<RewardFormProps> = ({ onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState<Partial<Reward>>({
    rewardType: 'SafetyPrinciples',
    date: new Date().toLocaleDateString('fa-IR'),
    rewardsGiven: [],
    isApproved: false, 
    reporterName: currentUser.fullName
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, evidence: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.personnelId || !formData.department) {
        alert("لطفاً تمام فیلدهای ستاره‌دار را تکمیل کنید.");
        return;
    }

    const newReward: Reward = {
      id: `R-${Math.floor(Math.random() * 10000)}`,
      employeeName: formData.employeeName!,
      personnelId: formData.personnelId!,
      department: formData.department!,
      reporterName: formData.reporterName!, 
      date: formData.date || '1403/02/01',
      rewardType: formData.rewardType as RewardType,
      description: formData.description || '',
      rewardsGiven: formData.rewardsGiven || [],
      evidence: formData.evidence,
      isApproved: false 
    };

    onSubmit(newReward);
    onClose();
  };

  const handleRewardChange = (option: string) => {
    const current = formData.rewardsGiven || [];
    if (current.includes(option)) {
      setFormData({ ...formData, rewardsGiven: current.filter(p => p !== option) });
    } else {
      setFormData({ ...formData, rewardsGiven: [...current, option] });
    }
  };

  const typeDetails = {
    SafetyPrinciples: { label: "رعایت اصول ایمنی", icon: <ShieldCheck className="w-5 h-5" />, color: "bg-blue-100 text-blue-800" },
    PPEUsage: { label: "استفاده از تجهیزات (PPE)", icon: <HardHat className="w-5 h-5" />, color: "bg-orange-100 text-orange-800" },
    SafeMethod: { label: "اجرای روش ایمن", icon: <Zap className="w-5 h-5" />, color: "bg-emerald-100 text-emerald-800" },
    Innovation: { label: "نوآوری و پیشنهاد", icon: <Star className="w-5 h-5" />, color: "bg-yellow-100 text-yellow-800" },
    CrisisManagement: { label: "مدیریت بحران", icon: <Medal className="w-5 h-5" />, color: "bg-red-100 text-red-800" }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto border-t-4 border-emerald-500">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-emerald-50/50">
          <div>
              <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                <Medal className="w-6 h-6" />
                ثبت تشویق و پیشنهاد پاداش
              </h2>
              <p className="text-xs text-emerald-600 mt-1">تشویقات بر اساس اصول ایمنی و عملکردهای مثبت ثبت می‌شوند.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
             <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <label className="text-sm font-bold text-emerald-800">ثبت کننده گزارش</label>
             </div>
             <input
                required
                readOnly
                type="text"
                value={formData.reporterName}
                className="w-full px-4 py-2 border border-emerald-200 rounded-lg bg-white text-gray-600 outline-none"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">کد پرسنلی *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="مثال: 990112"
                onChange={e => setFormData({...formData, personnelId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="مثال: رضا محمدی"
                onChange={e => setFormData({...formData, employeeName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">واحد / بخش *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="مثال: کارگاه جوشکاری"
                onChange={e => setFormData({...formData, department: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                defaultValue={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-3">دلیل اصلی تشویق</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(Object.keys(typeDetails) as Array<keyof typeof typeDetails>).map((type) => (
                  <label key={type} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${formData.rewardType === type ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                        type="radio" 
                        name="rewardType" 
                        className="hidden" 
                        checked={formData.rewardType === type}
                        onChange={() => setFormData({...formData, rewardType: type})}
                    />
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${formData.rewardType === type ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-400'}`}>
                            {typeDetails[type].icon}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{typeDetails[type].label}</span>
                    </div>
                  </label>
                ))}
             </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-3">جوایز پیشنهادی</label>
             <div className="flex flex-wrap gap-2">
               {REWARD_OPTIONS.map((option) => (
                 <label key={option} className={`flex items-center px-4 py-2 rounded-full border cursor-pointer transition-all ${formData.rewardsGiven?.includes(option) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                   <input
                     type="checkbox"
                     className="hidden"
                     checked={formData.rewardsGiven?.includes(option)}
                     onChange={() => handleRewardChange(option)}
                   />
                   <span className="text-xs font-medium">{option}</span>
                 </label>
               ))}
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">شرح جزئیات عملکرد مثبت</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none text-sm"
              placeholder="توضیح دهید که فرد دقیقاً چه کار مثبتی انجام داده است..."
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium">
              انصراف
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-200">
              ثبت تشویق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RewardForm;