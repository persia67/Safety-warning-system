import React, { useState, useEffect } from 'react';
import { Violation, Severity, User } from '../types';
import { X, Upload, Camera, AlertOctagon, CheckSquare, Square, UserCheck } from 'lucide-react';

interface ViolationFormProps {
  existingViolations: Violation[];
  onClose: () => void;
  onSubmit: (violation: Violation) => void;
  currentUser: User;
}

const PENALTY_OPTIONS = [
  "ممنوعیت اضافه کاری",
  "عدم دریافت پاداش",
  "عدم دریافت بهره‌وری",
  "توبیخ کتبی",
  "تعلیق موقت",
  "معرفی به کمیته انضباطی"
];

const COMMON_VIOLATIONS = [
  "عدم استفاده از کلاه ایمنی",
  "عدم استفاده از کفش ایمنی",
  "عدم استفاده از عینک ایمنی",
  "عدم استفاده از دستکش مناسب",
  "کار در ارتفاع بدون کمربند ایمنی",
  "سیگار کشیدن در منطقه ممنوعه",
  "سرعت غیرمجاز با خودرو/لیفتراک",
  "شوخی و درگیری در محیط کار",
  "عدم رعایت نظم و آراستگی (5S)",
  "دستکاری و غیرفعال کردن تجهیزات ایمنی",
  "ورود غیرمجاز به مناطق خطرناک",
  "عدم توجه به علائم هشدار دهنده"
];

const ViolationForm: React.FC<ViolationFormProps> = ({ existingViolations, onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState<Partial<Violation>>({
    severity: Severity.MEDIUM,
    status: 'Pending',
    date: new Date().toLocaleDateString('fa-IR'),
    penaltyActions: [],
    violationStage: 1,
    isApproved: false, // Default to unapproved
    reporterName: currentUser.fullName // Auto-fill reporter name
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherViolationText, setOtherViolationText] = useState('');

  // Calculate stage when personnel ID changes
  useEffect(() => {
    if (formData.personnelId && formData.personnelId.length >= 3) {
      const historyCount = existingViolations.filter(v => v.personnelId === formData.personnelId && v.isApproved).length;
      const newStage = Math.min(historyCount + 1, 3);
      setFormData(prev => ({ ...prev, violationStage: newStage }));
    }
  }, [formData.personnelId, existingViolations]);

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

  const toggleViolation = (violation: string) => {
    if (selectedViolations.includes(violation)) {
      setSelectedViolations(selectedViolations.filter(v => v !== violation));
    } else {
      setSelectedViolations([...selectedViolations, violation]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName || !formData.personnelId || !formData.department || !formData.reporterName) {
        alert("لطفاً تمام فیلدهای ستاره‌دار را تکمیل کنید.");
        return;
    }

    let finalViolationType = [...selectedViolations];
    if (isOtherSelected && otherViolationText.trim()) {
      finalViolationType.push(otherViolationText.trim());
    }

    if (finalViolationType.length === 0) {
      alert("لطفاً حداقل یک مورد تخلف را انتخاب کنید.");
      return;
    }

    const newViolation: Violation = {
      id: `V-${Math.floor(Math.random() * 10000)}`,
      employeeName: formData.employeeName,
      personnelId: formData.personnelId,
      department: formData.department,
      reporterName: formData.reporterName, 
      date: formData.date || '1402/01/01',
      violationType: finalViolationType.join(' + '),
      description: formData.description || '',
      severity: formData.severity as Severity,
      penaltyActions: formData.penaltyActions || [],
      violationStage: formData.violationStage || 1,
      evidence: formData.evidence,
      status: 'Pending',
      isApproved: false // Explicitly false
    };

    onSubmit(newViolation);
    onClose();
  };

  const handlePenaltyChange = (option: string) => {
    const current = formData.penaltyActions || [];
    if (current.includes(option)) {
      setFormData({ ...formData, penaltyActions: current.filter(p => p !== option) });
    } else {
      setFormData({ ...formData, penaltyActions: [...current, option] });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
              <h2 className="text-xl font-bold text-gray-800">ثبت گزارش تخلف</h2>
              <p className="text-xs text-orange-600 mt-1">گزارش پس از تایید مدیریت ایمنی ثبت نهایی می‌شود.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formData.violationStage && formData.violationStage > 1 && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${formData.violationStage === 3 ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-orange-50 text-orange-800 border border-orange-200'}`}>
              <AlertOctagon className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">هشدار: تخلف مرحله {formData.violationStage}</h4>
                <p className="text-xs mt-1">این پرسنل دارای سابقه تخلف می‌باشد.</p>
              </div>
            </div>
          )}

          {/* Reporter Info Section */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
             <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <label className="text-sm font-bold text-blue-800">اطلاعات کارشناس ثبت کننده</label>
             </div>
             <input
                required
                readOnly
                type="text"
                value={formData.reporterName}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">کد پرسنلی متخلف *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="مثال: 980112"
                onChange={e => setFormData({...formData, personnelId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام و نام خانوادگی متخلف *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="مثال: علی رضایی"
                onChange={e => setFormData({...formData, employeeName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">واحد کاری *</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="مثال: تاسیسات / انبار"
                onChange={e => setFormData({...formData, department: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ وقوع</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                placeholder="1402/12/20"
                defaultValue={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">سطح خطر</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                onChange={e => setFormData({...formData, severity: e.target.value as Severity})}
                defaultValue={Severity.MEDIUM}
              >
                <option value={Severity.LOW}>کم خطر (Low)</option>
                <option value={Severity.MEDIUM}>متوسط (Medium)</option>
                <option value={Severity.HIGH}>پرخطر (High)</option>
                <option value={Severity.CRITICAL}>بحرانی (Critical)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">نوع تخلف *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {COMMON_VIOLATIONS.map((violation) => (
                <div 
                  key={violation} 
                  onClick={() => toggleViolation(violation)}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all select-none ${selectedViolations.includes(violation) ? 'bg-indigo-50 border-indigo-300 text-indigo-900' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                   {selectedViolations.includes(violation) ? 
                      <CheckSquare className="w-5 h-5 text-indigo-600 ml-2 shrink-0" /> : 
                      <Square className="w-5 h-5 text-gray-300 ml-2 shrink-0" />
                   }
                   <span className="text-sm">{violation}</span>
                </div>
              ))}
              
              <div 
                  onClick={() => setIsOtherSelected(!isOtherSelected)}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all select-none ${isOtherSelected ? 'bg-indigo-50 border-indigo-300 text-indigo-900' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                >
                   {isOtherSelected ? 
                      <CheckSquare className="w-5 h-5 text-indigo-600 ml-2 shrink-0" /> : 
                      <Square className="w-5 h-5 text-gray-300 ml-2 shrink-0" />
                   }
                   <span className="text-sm">سایر موارد</span>
                </div>
            </div>

            {isOtherSelected && (
               <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-indigo-50/50"
                    placeholder="شرح کوتاه تخلف را بنویسید..."
                    value={otherViolationText}
                    onChange={(e) => setOtherViolationText(e.target.value)}
                  />
               </div>
            )}
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
             <label className="block text-sm font-medium text-gray-700 mb-3">اقدامات تنبیهی پیشنهادی</label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
               {PENALTY_OPTIONS.map((option) => (
                 <label key={option} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${formData.penaltyActions?.includes(option) ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                   <input
                     type="checkbox"
                     checked={formData.penaltyActions?.includes(option)}
                     onChange={() => handlePenaltyChange(option)}
                     className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 ml-2"
                   />
                   <span className="text-sm select-none">{option}</span>
                 </label>
               ))}
             </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات تکمیلی</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all h-24 resize-none"
              placeholder="شرح جزئیات..."
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors">
              انصراف
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg shadow-red-200 transition-all">
              ارسال جهت تایید
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViolationForm;