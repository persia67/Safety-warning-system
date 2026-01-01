import React, { useState } from 'react';
import { Reward, User, RewardType } from '../types';
import { X, Camera, CheckSquare, Square, UserCheck, Medal, Star, Gift } from 'lucide-react';

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
  "درج در پرونده",
  "معرفی در برد"
];

const RewardForm: React.FC<RewardFormProps> = ({ onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState<Partial<Reward>>({
    rewardType: 'SafetyWatch',
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
    if (!formData.employeeName || !formData.personnelId || !formData.department || !formData.reporterName) {
        alert("لطفاً تمام فیلدهای ستاره‌دار را تکمیل کنید.");
        return;
    }

    const newReward: Reward = {
      id: `R-${Math.floor(Math.random() * 10000)}`,
      employeeName: formData.employeeName,
      personnelId: formData.personnelId,
      department: formData.department,
      reporterName: formData.reporterName, 
      date: formData.date || '1403/01/01',
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto border-t-4 border-emerald-500">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-emerald-50/50">
          <div>
              <h2 className="text-xl font-bold text-emerald-800 flex items-center gap-2">
                <Medal className="w-6 h-6" />
                ثبت تشویق و پرسنل نمونه
              </h2>
              <p className="text-xs text-emerald-600 mt-1">اطلاعات جهت بررسی و تایید مدیریت ثبت می‌شود.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Reporter Info Section */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
             <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <label className="text-sm font-bold text-emerald-800">پیشنهاد دهنده</label>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="مثال: 980112"
                onChange={e => setFormData({...formData, personnelId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="مثال: علی رضایی"
                onChange={e => setFormData({...formData, employeeName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">واحد کاری *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="مثال: تاسیسات / انبار"
                onChange={e => setFormData({...formData, department: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="1402/12/20"
                defaultValue={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-3">نوع تشویق</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.rewardType === 'Exemplary' ? 'bg-yellow-50 border-yellow-400 ring-1 ring-yellow-400' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                        type="radio" 
                        name="rewardType" 
                        className="hidden" 
                        checked={formData.rewardType === 'Exemplary'}
                        onChange={() => setFormData({...formData, rewardType: 'Exemplary'})}
                    />
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${formData.rewardType === 'Exemplary' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-400'}`}>
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">پرسنل نمونه (Exemplary)</div>
                            <div className="text-xs text-gray-500">انتخاب به عنوان کارمند نمونه ماه/سال</div>
                        </div>
                    </div>
                </label>

                <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.rewardType === 'SafetyWatch' ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                        type="radio" 
                        name="rewardType" 
                        className="hidden" 
                        checked={formData.rewardType === 'SafetyWatch'}
                        onChange={() => setFormData({...formData, rewardType: 'SafetyWatch'})}
                    />
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${formData.rewardType === 'SafetyWatch' ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-400'}`}>
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">رعایت اصول ایمنی</div>
                            <div className="text-xs text-gray-500">رفتار ایمن و گزارش شرایط ناایمن</div>
                        </div>
                    </div>
                </label>

                 <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.rewardType === 'Innovation' ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                        type="radio" 
                        name="rewardType" 
                        className="hidden" 
                        checked={formData.rewardType === 'Innovation'}
                        onChange={() => setFormData({...formData, rewardType: 'Innovation'})}
                    />
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${formData.rewardType === 'Innovation' ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                            <Gift className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">پیشنهاد خلاقانه</div>
                            <div className="text-xs text-gray-500">ارائه راهکار برای بهبود ایمنی</div>
                        </div>
                    </div>
                </label>
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">مستندات (عکس)</label>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all overflow-hidden relative">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">آپلود تصویر</span></p>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-3">جوایز پیشنهادی</label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
               {REWARD_OPTIONS.map((option) => (
                 <label key={option} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${formData.rewardsGiven?.includes(option) ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                   <input
                     type="checkbox"
                     checked={formData.rewardsGiven?.includes(option)}
                     onChange={() => handleRewardChange(option)}
                     className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 ml-2"
                   />
                   <span className="text-sm select-none">{option}</span>
                 </label>
               ))}
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">علت تشویق (توضیحات)</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all h-24 resize-none"
              placeholder="شرح دلیل انتخاب..."
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors">
              انصراف
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-200 transition-all">
              ثبت تشویق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RewardForm;