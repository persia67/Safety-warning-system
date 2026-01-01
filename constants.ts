import { Violation, Severity, User, AppSettings, Reward } from './types';

export const APP_VERSION = "2.2.0";

// --- Translations ---
export const TRANSLATIONS = {
  fa: {
    loginTitle: "ورود به سامانه",
    username: "نام کاربری",
    password: "رمز عبور",
    loginBtn: "ورود",
    dashboard: "داشبورد",
    violations: "تخلفات",
    rewards: "تشویقات",
    approvals: "کارتابل تایید",
    committee: "کمیته انضباطی",
    reporters: "عملکرد پرسنل ایمنی",
    settings: "تنظیمات",
    logout: "خروج",
    search: "جستجو...",
    newViolation: "ثبت تخلف جدید",
    newReward: "ثبت تشویق جدید",
    users: "مدیریت کاربران",
    appearance: "ظاهر و زبان",
    companyInfo: "اطلاعات شرکت",
    save: "ذخیره تغییرات",
    theme: "تم رنگی",
    language: "زبان",
    uploadLogo: "آپلود لوگو",
    addUser: "افزودن کاربر",
    role: "نقش سازمانی",
    actions: "عملیات",
    welcome: "خوش آمدید",
    totalViolations: "تعداد کل تخلفات",
    highRisk: "تخلفات پرخطر",
    personnel: "پرسنل خاطی",
    totalRewards: "تعداد کل تشویقات",
    exemplaryPersonnel: "پرسنل نمونه",
    honoredPersonnel: "پرسنل تقدیر شده",
    pending: "در انتظار",
    approved: "تایید شده",
    rejected: "رد شده",
    // Roles
    role_hse_manager: "مدیریت ایمنی (HSE)",
    role_hse_officer: "افسر ایمنی",
    role_hse_expert: "کارشناس ایمنی",
    role_admin_manager: "مدیریت اداری",
    role_hr_manager: "مدیریت منابع انسانی",
    role_plant_manager: "مدیریت کارخانه",
    // Modes
    mode_violation: "مدیریت تخلفات",
    mode_reward: "نظام انگیزشی و تشویق"
  },
  en: {
    loginTitle: "System Login",
    username: "Username",
    password: "Password",
    loginBtn: "Login",
    dashboard: "Dashboard",
    violations: "Violations",
    rewards: "Rewards",
    approvals: "Approvals",
    committee: "Disciplinary Committee",
    reporters: "Safety Staff Stats",
    settings: "Settings",
    logout: "Logout",
    search: "Search...",
    newViolation: "New Violation",
    newReward: "New Reward",
    users: "User Management",
    appearance: "Appearance",
    companyInfo: "Company Info",
    save: "Save Changes",
    theme: "Color Theme",
    language: "Language",
    uploadLogo: "Upload Logo",
    addUser: "Add User",
    role: "Role",
    actions: "Actions",
    welcome: "Welcome",
    totalViolations: "Total Violations",
    highRisk: "High Risk",
    personnel: "Offending Personnel",
    totalRewards: "Total Rewards",
    exemplaryPersonnel: "Exemplary Staff",
    honoredPersonnel: "Honored Staff",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    // Roles
    role_hse_manager: "HSE Manager",
    role_hse_officer: "Safety Officer",
    role_hse_expert: "Safety Expert",
    role_admin_manager: "Admin Manager",
    role_hr_manager: "HR Manager",
    role_plant_manager: "Plant Manager",
    // Modes
    mode_violation: "Violation Management",
    mode_reward: "Incentive System"
  }
};

export const DEFAULT_USERS: User[] = [
  {
    id: 'u0',
    username: 'admin',
    password: '123',
    fullName: 'مدیر ارشد سیستم',
    role: 'HSE_MANAGER',
    avatar: ''
  },
  {
    id: 'u1',
    username: 'manager',
    password: '123',
    fullName: 'مدیر ایمنی',
    role: 'HSE_MANAGER',
    avatar: ''
  },
  {
    id: 'u2',
    username: 'akbari',
    password: '123',
    fullName: 'مهندس اکبری',
    role: 'HSE_OFFICER',
    avatar: ''
  },
  {
    id: 'u3',
    username: 'rezaei',
    password: '123',
    fullName: 'خانم رضایی',
    role: 'HSE_EXPERT',
    avatar: ''
  },
  {
    id: 'u4',
    username: 'plant',
    password: '123',
    fullName: 'مدیریت کارخانه',
    role: 'PLANT_MANAGER',
    avatar: ''
  },
  {
    id: 'u5',
    username: 'hr',
    password: '123',
    fullName: 'مدیر منابع انسانی',
    role: 'HR_MANAGER',
    avatar: ''
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'fa',
  themeColor: 'red',
  companyLogo: null,
  companyName: 'SafetyGuard System'
};

export const MOCK_VIOLATIONS: Violation[] = [
  {
    id: 'V-1001',
    employeeName: 'علی محمدی',
    personnelId: '980123',
    department: 'تاسیسات',
    reporterName: 'مهندس اکبری',
    date: '1402/12/10',
    violationType: 'عدم استفاده از کلاه ایمنی',
    description: 'در سایت ساختمانی شماره ۲ بدون کلاه ایمنی مشاهده شد.',
    severity: Severity.HIGH,
    penaltyActions: ['توبیخ کتبی'],
    violationStage: 1,
    status: 'Pending',
    isApproved: true
  },
  {
    id: 'V-1002',
    employeeName: 'سارا احمدی',
    personnelId: '990456',
    department: 'آزمایشگاه',
    reporterName: 'خانم رضایی',
    date: '1402/12/12',
    violationType: 'سیگار کشیدن در منطقه ممنوعه',
    description: 'در انبار مواد شیمیایی اقدام به استعمال دخانیات کرد.',
    severity: Severity.CRITICAL,
    penaltyActions: ['ممنوعیت اضافه کاری', 'عدم دریافت پاداش'],
    violationStage: 2,
    status: 'Paid',
    isApproved: true
  },
  {
    id: 'V-1003',
    employeeName: 'رضا کریمی',
    personnelId: '970789',
    department: 'تراشکاری',
    reporterName: 'مهندس اکبری',
    date: '1402/05/15', 
    violationType: 'عدم پوشیدن کفش ایمنی',
    description: 'ورود به کارگاه تراشکاری با کفش نامناسب.',
    severity: Severity.MEDIUM,
    penaltyActions: ['تذکر شفاهی'],
    violationStage: 1,
    status: 'Pending',
    isApproved: true
  },
  {
    id: 'V-1004',
    employeeName: 'محسن رضایی',
    personnelId: '950112',
    department: 'انبار مرکزی',
    reporterName: 'آقای حسینی',
    date: '1402/12/18',
    violationType: 'سرعت غیرمجاز با لیفتراک',
    description: 'رانندگی با سرعت بالا در راهروهای باریک انبار.',
    severity: Severity.HIGH,
    penaltyActions: ['ممنوعیت اضافه کاری', 'عدم دریافت بهره‌وری'],
    violationStage: 3,
    status: 'Appealed',
    isApproved: true
  },
  {
    id: 'V-1005',
    employeeName: 'نازنین ایزدی',
    personnelId: '000334',
    department: 'کنترل کیفیت',
    reporterName: 'خانم رضایی',
    date: '1402/12/20',
    violationType: 'عدم استفاده از دستکش',
    description: 'کار با مواد اسیدی بدون دستکش محافظ.',
    severity: Severity.MEDIUM,
    penaltyActions: ['توبیخ کتبی'],
    violationStage: 1,
    status: 'Paid',
    isApproved: true
  },
  {
    id: 'V-1006',
    employeeName: 'کاظم اسدی',
    personnelId: '010222',
    department: 'خدمات',
    reporterName: 'مهندس اکبری',
    date: '1403/01/05',
    violationType: 'عدم توجه به علائم هشدار دهنده',
    description: 'عبور از نوار خطر زرد رنگ.',
    severity: Severity.LOW,
    penaltyActions: ['تذکر شفاهی'],
    violationStage: 1,
    status: 'Pending',
    isApproved: false 
  }
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: 'R-2001',
    employeeName: 'حسین جلالی',
    personnelId: '990111',
    department: 'تولید',
    reporterName: 'مهندس اکبری',
    date: '1402/12/25',
    rewardType: 'Exemplary',
    description: 'رعایت کامل اصول ایمنی و نظم در محیط کار به مدت یک سال متوالی',
    rewardsGiven: ['پاداش نقدی', 'لوح تقدیر', 'معرفی در برد'],
    isApproved: true
  },
  {
    id: 'R-2002',
    employeeName: 'مریم حسینی',
    personnelId: '000444',
    department: 'اداری',
    reporterName: 'خانم رضایی',
    date: '1403/01/10',
    rewardType: 'Innovation',
    description: 'ارائه پیشنهاد جهت بهبود سیستم تهویه انبار',
    rewardsGiven: ['پاداش نقدی'],
    isApproved: true
  },
  {
    id: 'R-2003',
    employeeName: 'امیر رستمی',
    personnelId: '980333',
    department: 'تاسیسات',
    reporterName: 'مهندس اکبری',
    date: '1403/01/15',
    rewardType: 'SafetyWatch',
    description: 'گزارش به موقع نشتی گاز و پیشگیری از حادثه',
    rewardsGiven: ['مرخصی تشویقی'],
    isApproved: false
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