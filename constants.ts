import { Violation, Severity, User, AppSettings, Reward } from './types';

export const APP_VERSION = "2.4.0";

export const TRANSLATIONS = {
  fa: {
    loginTitle: "ورود به سامانه پایش و پاداش",
    username: "نام کاربری",
    password: "رمز عبور",
    loginBtn: "ورود به پنل",
    dashboard: "داشبورد مدیریتی",
    violations: "تخلفات و هشدارها",
    rewards: "تشویقات و پاداش‌ها",
    approvals: "کارتابل تایید",
    committee: "کمیته انضباطی",
    reporters: "عملکرد پرسنل ایمنی",
    settings: "تنظیمات",
    logout: "خروج از حساب",
    search: "جستجوی پرسنل...",
    newViolation: "ثبت هشدار/تخلف جدید",
    newReward: "ثبت تشویق/پاداش جدید",
    users: "مدیریت کاربران",
    appearance: "ظاهر و زبان",
    companyInfo: "اطلاعات سازمانی",
    save: "ذخیره تغییرات",
    theme: "تم رنگی",
    language: "زبان",
    uploadLogo: "آپلود لوگو",
    addUser: "افزودن کاربر",
    role: "نقش سازمانی",
    actions: "عملیات",
    welcome: "خوش آمدید",
    totalViolations: "کل هشدارها",
    highRisk: "تخلفات پرخطر",
    personnel: "پرسنل خاطی",
    totalRewards: "کل تشویقات",
    exemplaryPersonnel: "پرسنل نمونه",
    honoredPersonnel: "پرسنل تقدیر شده",
    pending: "در انتظار بررسی",
    approved: "تایید نهایی",
    rejected: "رد شده",
    archives: "بایگانی",
    selectWorkerOfMonth: "انتخاب کارگر نمونه ماه",
    reasoningTitle: "استدلال هوش مصنوعی برای انتخاب",
    // Roles
    role_hse_manager: "مدیریت ایمنی (HSE)",
    role_hse_officer: "افسر ایمنی",
    role_hse_expert: "کارشناس ایمنی",
    role_admin_manager: "مدیریت اداری",
    role_hr_manager: "مدیریت منابع انسانی",
    role_plant_manager: "مدیریت کارخانه",
    // Modes
    mode_violation: "پایش تخلفات و هشدارها",
    mode_reward: "نظام انگیزشی و پاداش",
    // Reward Types
    type_SafetyPrinciples: "رعایت اصول ایمنی",
    type_PPEUsage: "استفاده صحیح از تجهیزات فردی",
    type_SafeMethod: "اجرای ایمن روش کار",
    type_Innovation: "نوآوری در ایمنی",
    type_CrisisManagement: "مدیریت و کنترل بحران"
  },
  en: {
    loginTitle: "SafeWatch AI Login",
    username: "Username",
    password: "Password",
    loginBtn: "Access Panel",
    dashboard: "HSE Dashboard",
    violations: "Violations & Warnings",
    rewards: "Rewards & Incentives",
    approvals: "Approval Workflow",
    committee: "Disciplinary Committee",
    reporters: "Safety Staff Stats",
    settings: "Settings",
    logout: "Logout",
    search: "Search...",
    newViolation: "Record Violation",
    newReward: "Record Reward",
    users: "User Management",
    appearance: "Appearance",
    companyInfo: "Organization Info",
    save: "Save Changes",
    theme: "Color Theme",
    language: "Language",
    uploadLogo: "Upload Logo",
    addUser: "Add User",
    role: "Role",
    actions: "Actions",
    welcome: "Welcome",
    totalViolations: "Total Warnings",
    highRisk: "High Risk",
    personnel: "Violating Staff",
    totalRewards: "Total Rewards",
    exemplaryPersonnel: "Exemplary Staff",
    honoredPersonnel: "Honored Staff",
    pending: "Pending Approval",
    approved: "Finalized",
    rejected: "Rejected",
    archives: "Archives",
    selectWorkerOfMonth: "Worker of Month",
    reasoningTitle: "AI Selection Reasoning",
    // Roles
    role_hse_manager: "HSE Manager",
    role_hse_officer: "Safety Officer",
    role_hse_expert: "Safety Expert",
    role_admin_manager: "Admin Manager",
    role_hr_manager: "HR Manager",
    role_plant_manager: "Plant Manager",
    // Modes
    mode_violation: "Violation Monitoring",
    mode_reward: "Incentive System",
    // Reward Types
    type_SafetyPrinciples: "Safety Principles",
    type_PPEUsage: "PPE Compliance",
    type_SafeMethod: "Safe Method",
    type_Innovation: "Safety Innovation",
    type_CrisisManagement: "Crisis Control"
  }
};

export const DEFAULT_USERS: User[] = [
  { id: 'u0', username: 'admin', password: '123', fullName: 'مدیر ارشد سیستم', role: 'HSE_MANAGER', avatar: '' },
  { id: 'u1', username: 'manager', password: '123', fullName: 'مدیر ایمنی', role: 'HSE_MANAGER', avatar: '' }
];

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'fa',
  themeColor: 'blue',
  companyLogo: null,
  companyName: 'دیده‌بان هوشمند ایمنی و پاداش (HSE)'
};

export const MOCK_VIOLATIONS: Violation[] = [
  {
    id: 'V-1001',
    employeeName: 'علی محمدی',
    personnelId: '980123',
    department: 'تاسیسات',
    reporterName: 'مهندس اکبری',
    date: '1403/02/10',
    violationType: 'عدم استفاده از کلاه ایمنی',
    description: 'در سایت ساختمانی شماره ۲ بدون کلاه ایمنی مشاهده شد.',
    severity: Severity.HIGH,
    penaltyActions: ['توبیخ کتبی'],
    violationStage: 1,
    status: 'Pending',
    isApproved: true,
    isArchived: false
  }
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: 'R-2001',
    employeeName: 'حسین جلالی',
    personnelId: '990111',
    department: 'تولید',
    reporterName: 'مهندس اکبری',
    date: '1403/02/15',
    rewardType: 'PPEUsage',
    description: 'استفاده کامل از ماسک تخصصی در محیط آلوده بدون تذکر قبلی',
    rewardsGiven: ['پاداش نقدی', 'لوح تقدیر'],
    isApproved: true,
    isArchived: false
  }
];

export const getSeverityColor = (severity: Severity): string => {
  switch (severity) {
    case Severity.LOW: return 'bg-blue-100 text-blue-800 border-blue-200';
    case Severity.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case Severity.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
    case Severity.CRITICAL: return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Paid': return 'bg-green-100 text-green-700';
    case 'Pending': return 'bg-red-50 text-red-600';
    case 'Appealed': return 'bg-gray-100 text-gray-600';
    default: return 'bg-gray-100';
  }
};

export const isOlderThanSixMonths = (dateStr: string): boolean => {
    try {
        const parts = dateStr.split('/');
        if (parts.length !== 3) return false;
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const fileDateVal = year * 12 + month;
        const currentYear = 1403;
        const currentMonth = 2; 
        const currentDateVal = currentYear * 12 + currentMonth;
        return (currentDateVal - fileDateVal) >= 6;
    } catch (e) {
        return false;
    }
};