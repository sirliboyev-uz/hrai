import axios from 'axios';
import type {
  AuthResponse,
  User,
  Job,
  JobPublic,
  JobListResponse,
  ApplicationListResponse,
  Application,
  ApplicationDetail,
  LoginForm,
  RegisterForm,
  JobForm
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginForm): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterForm): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// Jobs API
export const jobsApi = {
  list: async (status?: string): Promise<JobListResponse> => {
    const params = status ? { status } : {};
    const response = await api.get<JobListResponse>('/jobs', { params });
    return response.data;
  },

  get: async (id: string): Promise<Job> => {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  create: async (data: JobForm): Promise<Job> => {
    const response = await api.post<Job>('/jobs', data);
    return response.data;
  },

  update: async (id: string, data: Partial<JobForm>): Promise<Job> => {
    const response = await api.patch<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },
};

// Public API (no auth required)
export const publicApi = {
  getJob: async (publicLink: string): Promise<JobPublic> => {
    const response = await api.get<JobPublic>(`/public/jobs/${publicLink}`);
    return response.data;
  },

  submitApplication: async (publicLink: string, formData: FormData): Promise<{ message: string; application_id: string }> => {
    const response = await api.post(`/public/apply/${publicLink}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Applications API
export const applicationsApi = {
  list: async (jobId: string, status?: string, sortBy: string = 'score'): Promise<ApplicationListResponse> => {
    const params: Record<string, string> = { sort_by: sortBy };
    if (status) params.status = status;
    const response = await api.get<ApplicationListResponse>(`/jobs/${jobId}/applications`, { params });
    return response.data;
  },

  get: async (id: string): Promise<ApplicationDetail> => {
    const response = await api.get<ApplicationDetail>(`/applications/${id}`);
    return response.data;
  },

  action: async (id: string, action: string): Promise<{ message: string }> => {
    const response = await api.post(`/applications/${id}/action`, { action });
    return response.data;
  },

  updateNotes: async (id: string, note: string): Promise<{ message: string }> => {
    const response = await api.put(`/applications/${id}/notes`, { note });
    return response.data;
  },

  downloadResume: async (id: string): Promise<void> => {
    const response = await api.get(`/applications/${id}/resume`, {
      responseType: 'blob',
    });
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'resume.pdf';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match) filename = match[1];
    }
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default api;
