import api from './api';
import type { Profile, Project, Education, Skill, Certificate, SocialMedia, Message, DashboardStats, Experience } from '../types';

// Auth

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  me: () => api.get('/auth/me'),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

// Profile
export const profileService = {
  get: () => api.get<Profile>('/profile'),
  
  update: (data: Partial<Profile>) => api.put('/profile', data),
  
  updateImage: (formData: FormData) =>
    api.put('/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateCV: (formData: FormData) =>
    api.put('/profile/cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Projects
export const projectService = {
  getAll: (params?: { category?: string; featured?: boolean }) =>
    api.get<Project[]>('/projects', { params }),
  
  getBySlug: (slug: string) => api.get<Project>(`/projects/${slug}`),
  
  create: (formData: FormData) =>
    api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, formData: FormData) =>
    api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Education
export const educationService = {
  getAll: () => api.get<Education[]>('/education'),
  
  create: (formData: FormData) =>
    api.post('/education', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, formData: FormData) =>
    api.put(`/education/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: string) => api.delete(`/education/${id}`),
};

// Skills
export const skillService = {
  getAll: (category?: string) =>
    api.get('/skills', { params: category ? { category } : {} }),
  
  create: (data: Partial<Skill>) => api.post('/skills', data),
  
  update: (id: string, data: Partial<Skill>) => api.put(`/skills/${id}`, data),
  
  delete: (id: string) => api.delete(`/skills/${id}`),
};

// Certificates
export const certificateService = {
  getAll: () => api.get<Certificate[]>('/certificates'),
  
  create: (formData: FormData) =>
    api.post('/certificates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, formData: FormData) =>
    api.put(`/certificates/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: string) => api.delete(`/certificates/${id}`),
};

// Messages
export const messageService = {
  getAll: (status?: string) =>
    api.get('/messages', { params: status ? { status } : {} }),
  
  getUnreadCount: () =>
    api.get<{ count: number }>('/messages/unread-count'),

  send: (data: { name: string; email: string; message: string }) =>
    api.post('/messages', data),
  
  updateStatus: (id: string, status: 'read' | 'unread') =>
    api.put(`/messages/${id}/status`, { status }),
  
  delete: (id: string) => api.delete(`/messages/${id}`),
};

// Social Media
export const socialService = {
  getAll: () => api.get<SocialMedia[]>('/social'),
  
  upsert: (data: { platform: string; url: string; icon?: string }) =>
    api.post('/social', data),
  
  delete: (id: string) => api.delete(`/social/${id}`),
};

// Visitors & Stats
export const visitorService = {
  track: (page: string) => api.post('/visitors/track', { page }),
  
  getStats: () => api.get<DashboardStats>('/visitors/stats'),
};

// Experiences
export const experienceService = {
  getAll: (type?: string) =>
    api.get<Experience[]>('/experiences', { params: type ? { type } : {} }),
  
  create: (formData: FormData) =>
    api.post('/experiences', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  update: (id: string, formData: FormData) =>
    api.put(`/experiences/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  delete: (id: string) => api.delete(`/experiences/${id}`),
};

