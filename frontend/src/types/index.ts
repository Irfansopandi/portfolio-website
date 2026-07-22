export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Profile {
  id: string;
  name: string;
  profession: string;
  professionEn?: string;
  bio: string;
  bioEn?: string;
  aboutText: string;
  aboutTextEn?: string;
  profileImage?: string;
  aboutImage?: string;
  cvUrl?: string;
  email?: string;
  phone?: string;
  location?: string;
  socialMedia?: SocialMedia[];
}

export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  image?: string;
  category: string;
  description: string;
  descriptionEn?: string;
  features?: string;
  featuresEn?: string;
  challenge?: string;
  challengeEn?: string;
  solution?: string;
  solutionEn?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  createdAt: string;
  technologies: ProjectTechnology[];
}


export interface ProjectTechnology {
  id: string;
  projectId: string;
  technology: string;
}

export interface Education {
  id: string;
  institution: string;
  institutionEn?: string;
  degree: string;
  degreeEn?: string;
  startDate: string;
  startDateEn?: string;
  endDate?: string;
  endDateEn?: string;
  description?: string;
  descriptionEn?: string;
  logo?: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  percentage: number;
  icon?: string;
  order: number;
}

export interface Certificate {
  id: string;
  title: string;
  titleEn?: string;
  issuer: string;
  issuerEn?: string;
  image?: string;
  date: string;
  dateEn?: string;
  credentialUrl?: string;
}

export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalCertificates: number;
  totalMessages: number;
  totalVisitors: number;
  unreadMessages: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export type ProjectCategory = 'Web Application' | 'Mobile Application' | 'Machine Learning' | 'Other';
export type SkillCategory = 'Programming' | 'Framework' | 'Tools' | 'Database';

export interface ExperiencePhoto {
  id: string;
  experienceId: string;
  url: string;
  caption?: string;
  captionEn?: string;
}

export interface Experience {
  id: string;
  type: 'work' | 'organization';
  organization: string;
  organizationEn?: string;
  institution?: string;
  institutionEn?: string;
  role: string;
  roleEn?: string;
  startDate: string;
  startDateEn?: string;
  endDate?: string;
  endDateEn?: string;
  description?: string;
  descriptionEn?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  photos: ExperiencePhoto[];
}

