import React from 'react';

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Violation {
  id: string;
  employeeName: string;
  personnelId: string;
  department: string; 
  reporterName: string;
  date: string;
  violationType: string;
  description: string;
  severity: Severity;
  penaltyActions: string[]; 
  violationStage: number; 
  evidence?: string; 
  isArchived?: boolean; 
  committeeVerdict?: string; 
  status: 'Pending' | 'Paid' | 'Appealed';
  isApproved: boolean;
  rejectionReason?: string;
}

// --- New Reward Types ---

export type RewardType = 
  | 'Exemplary'   // پرسنل نمونه
  | 'SafetyWatch' // رعایت اصول ایمنی
  | 'Innovation'  // پیشنهاد خلاقانه ایمنی
  | 'Cooperation' // همکاری در شرایط بحران
  | 'Other';

export interface Reward {
  id: string;
  employeeName: string;
  personnelId: string;
  department: string;
  reporterName: string; // Who recommended the reward
  date: string;
  rewardType: RewardType;
  description: string;
  rewardsGiven: string[]; // e.g., Cash, Certificate, Leave
  evidence?: string;
  isApproved: boolean;
}

export type SystemMode = 'VIOLATION' | 'REWARD';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export interface ReporterStat {
  name: string;
  totalReports: number;
  approvedReports: number;
  lastReportDate: string;
}

// --- New Types for Auth & Settings ---

export type Role = 
  | 'HSE_MANAGER'   // مدیریت ایمنی
  | 'HSE_OFFICER'   // افسر ایمنی
  | 'HSE_EXPERT'    // کارشناس ایمنی
  | 'ADMIN_MANAGER' // مدیریت اداری
  | 'HR_MANAGER'    // مدیریت منابع انسانی
  | 'PLANT_MANAGER'; // مدیریت کارخانه

export type Language = 'fa' | 'en';
export type ThemeColor = 'red' | 'blue' | 'green' | 'violet' | 'slate';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should be hashed
  fullName: string;
  role: Role;
  avatar?: string;
}

export interface AppSettings {
  language: Language;
  themeColor: ThemeColor;
  companyLogo: string | null;
  companyName: string;
}