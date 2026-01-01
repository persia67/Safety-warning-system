import { GoogleGenAI } from "@google/genai";
import { Violation } from "../types";

export const generateSafetyReport = async (violations: Violation[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare the data for the prompt
    const dataString = JSON.stringify(violations.map(v => ({
      type: v.violationType,
      severity: v.severity,
      penalties: v.penaltyActions, // Included penalties in prompt
      date: v.date
    })));

    const prompt = `
      به عنوان یک متخصص ارشد HSE (ایمنی، بهداشت و محیط زیست)، داده های زیر را که مربوط به تخلفات ایمنی اخیر در شرکت است تحلیل کن.
      توجه کن که تخلفات شامل اقدامات تنبیهی مانند ممنوعیت اضافه کاری، عدم دریافت پاداش یا معرفی به کمیته انضباطی هستند.
      
      داده ها:
      ${dataString}

      لطفاً یک گزارش مدیریتی کوتاه و حرفه ای به زبان فارسی بنویس که شامل موارد زیر باشد:
      1. خلاصه ای از وضعیت ایمنی و تنوع تنبیهات اعمال شده.
      2. شناسایی الگوهای خطرناک یا تکرار شونده.
      3. پیشنهادات مشخص برای کاهش این تخلفات.
      
      پاسخ باید با فرمت Markdown باشد. لحن باید رسمی و جدی باشد.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "خطا در تولید گزارش.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "متاسفانه در حال حاضر امکان برقراری ارتباط با هوش مصنوعی وجود ندارد.";
  }
};