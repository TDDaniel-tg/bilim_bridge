import { z } from "zod"

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Profile Schemas
export const studentProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  
  // Academic
  gpa: z.number().min(0).max(4.0).optional(),
  satTotal: z.number().min(400).max(1600).optional(),
  satMath: z.number().min(200).max(800).optional(),
  satEBRW: z.number().min(200).max(800).optional(),
  actScore: z.number().min(1).max(36).optional(),
  ieltsTotal: z.number().min(0).max(9).optional(),
  toeflTotal: z.number().min(0).max(120).optional(),
  graduationYear: z.number().min(2000).max(2030).optional(),
  
  // Financial
  maxBudget: z.number().min(0).optional(),
  needFinancialAid: z.boolean().optional(),
})

// University Filter Schema
export const universityFilterSchema = z.object({
  country: z.string().optional(),
  major: z.string().optional(),
  minGpa: z.number().optional(),
  maxGpa: z.number().optional(),
  minSat: z.number().optional(),
  maxSat: z.number().optional(),
  minIelts: z.number().optional(),
  minToefl: z.number().optional(),
  hasScholarships: z.boolean().optional(),
  qsRankingMax: z.number().optional(),
  minCost: z.number().optional(),
  maxCost: z.number().optional(),
  acceptanceRateMin: z.number().optional(),
  acceptanceRateMax: z.number().optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  type: z.enum(["public", "private"]).optional(),
})

// Consultation Request Schema
export const consultationRequestSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  preferredFormat: z.enum(["office", "online"]),
  preferredDate: z.string().optional(),
})

// Checklist Item Schema
export const checklistItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["DOCUMENTS", "ESSAYS", "APPLICATION", "FINANCIAL_AID", "POST_SUBMISSION"]),
  deadline: z.string().optional(),
})

// AI Chat Schema
export const chatMessageSchema = z.object({
  message: z.string().min(1).max(2000, "Message too long (max 2000 characters)"),
  chatSessionId: z.string().optional(),
})

// Success Story Schema
export const successStorySchema = z.object({
  universityId: z.string(),
  studentName: z.string().min(1),
  major: z.string().min(1),
  admissionYear: z.number().min(2000).max(2030),
  originCountry: z.string().min(1),
  gpa: z.number().min(0).max(4.0).optional(),
  satScore: z.number().optional(),
  actScore: z.number().optional(),
  commonAppEssay: z.string().optional(),
})

// Program Schema
export const programSchema = z.object({
  name: z.string().min(1),
  organizer: z.string().min(1),
  type: z.enum(["SUMMER_SCHOOL", "HACKATHON", "RESEARCH", "INTERNSHIP"]),
  description: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  format: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
  startDate: z.string(),
  endDate: z.string(),
  deadline: z.string(),
  cost: z.number().optional(),
  website: z.string().url().optional(),
})

// Guide Schema
export const guideSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
})

