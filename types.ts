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

// --- Refined Reward Types ---

export type RewardType = 
  | 'SafetyPrinciples'  // رعایت اصول ایمنی
  | 'PPEUsage'          // استفاده از تجهیزات ایمنی
  | 'SafeMethod'        // اجرای روش ایمن
  | 'Innovation'        // پیشنهاد خلاقانه
  | 'CrisisManagement'  // مدیریت بحران
  | 'Other';

export interface Reward {
  id: string;
  employeeName: string;
  personnelId: string;
  department: string;
  reporterName: string;
  date: string;
  rewardType: RewardType;
  description: string;
  rewardsGiven: string[];
  evidence?: string;
  isApproved: boolean;
  isArchived?: boolean;
}

export interface WorkerOfMonthResult {
  winnerId: string;
  winnerName: string;
  reasoning: string;
  period: string;
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

export type Role = 
  | 'HSE_MANAGER'   
  | 'HSE_OFFICER'   
  | 'HSE_EXPERT'    
  | 'ADMIN_MANAGER' 
  | 'HR_MANAGER'    
  | 'PLANT_MANAGER'; 

export type Language = 'fa' | 'en';
export type ThemeColor = 'red' | 'blue' | 'green' | 'violet' | 'slate';

export interface User {
  id: string;
  username: string;
  password: string;
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