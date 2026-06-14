import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import axios from 'axios';
import { normalizeContentSection } from '../lib/contentSections';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ''
});

// Attach JWT to all requests
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      // Only redirect if we are inside the admin panel and not already on the login page
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

const initialState = {
  services: [],
  blogs: [],
  testimonials: [],
  enquiries: [],
  heroSlides: [],
  founders: [],
  contentSections: [],
  faqs: [],
  loading: true,
  error: null
};

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ALL: 'SET_ALL',
  SET_SERVICES: 'SET_SERVICES',
  SET_BLOGS: 'SET_BLOGS',
  SET_TESTIMONIALS: 'SET_TESTIMONIALS',
  SET_ENQUIRIES: 'SET_ENQUIRIES',
  SET_HERO_SLIDES: 'SET_HERO_SLIDES',
  SET_FOUNDERS: 'SET_FOUNDERS',
  SET_CONTENT_SECTIONS: 'SET_CONTENT_SECTIONS',
  SET_FAQS: 'SET_FAQS'
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING: return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR: return { ...state, error: action.payload };
    case ACTIONS.SET_ALL: return { ...state, ...action.payload, loading: false, error: null };
    case ACTIONS.SET_SERVICES: return { ...state, services: action.payload };
    case ACTIONS.SET_BLOGS: return { ...state, blogs: action.payload };
    case ACTIONS.SET_TESTIMONIALS: return { ...state, testimonials: action.payload };
    case ACTIONS.SET_ENQUIRIES: return { ...state, enquiries: action.payload };
    case ACTIONS.SET_HERO_SLIDES: return { ...state, heroSlides: action.payload };
    case ACTIONS.SET_FOUNDERS: return { ...state, founders: action.payload };
    case ACTIONS.SET_CONTENT_SECTIONS: return { ...state, contentSections: action.payload };
    case ACTIONS.SET_FAQS: return { ...state, faqs: action.payload };
    default: return state;
  }
}

const AdminContext = createContext(null);

async function loadPublicData() {
  const [services, blogs, testimonials, heroSlides, founders, contentSections, faqs] = await Promise.all([
    http.get('/api/services'),
    http.get('/api/blogs'),
    http.get('/api/testimonials'),
    http.get('/api/hero'),
    http.get('/api/founders'),
    http.get('/api/content'),
    http.get('/api/faqs')
  ]);
  return {
    services: Array.isArray(services.data) ? services.data : [],
    blogs: Array.isArray(blogs.data) ? blogs.data : [],
    testimonials: Array.isArray(testimonials.data) ? testimonials.data : [],
    heroSlides: Array.isArray(heroSlides.data) ? heroSlides.data : [],
    founders: Array.isArray(founders.data) ? founders.data : [],
    contentSections: (Array.isArray(contentSections.data) ? contentSections.data : []).map(normalizeContentSection),
    faqs: Array.isArray(faqs.data) ? faqs.data : []
  };
}

async function loadAdminData() {
  if (!localStorage.getItem('adminToken')) {
    return { enquiries: [] };
  }
  // Load enquiries (protected) separately
  const enquiries = await http.get('/api/enquiries');
  return { enquiries: enquiries.data || [] };
}

function downloadCSV(rows) {
  const headers = ['Name', 'Email', 'Phone', 'Service', 'City', 'Business Type', 'Status', 'Notes', 'Message', 'Created Date', 'Created Time'];
  const lines = rows.map((item) => [
    item.name || '',
    item.email || '',
    item.phone || '',
    item.service || '',
    item.city || '',
    item.business_type || '',
    item.status || '',
    item.notes || '',
    item.message || '',
    item.created_date || (item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''),
    item.created_time || (item.created_at ? new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '')
  ]);
  const csv = [headers, ...lines].map(line => line.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'enquiries.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const data = await loadPublicData();
        if (!mounted) return;
        // Try to load admin data (enquiries) — may fail if not logged in
        try {
          const adminData = await loadAdminData();
          dispatch({ type: ACTIONS.SET_ALL, payload: { ...data, ...adminData } });
        } catch {
          dispatch({ type: ACTIONS.SET_ALL, payload: data });
        }
      } catch (error) {
        if (mounted) {
          dispatch({ type: ACTIONS.SET_LOADING, payload: false });
          dispatch({ type: ACTIONS.SET_ERROR, payload: error?.message || 'Failed to load application data.' });
        }
      }
    };
    bootstrap();
    return () => { mounted = false; };
  }, []);

  const api = useMemo(() => ({
    refreshAll: async () => {
      const data = await loadPublicData();
      try {
        const adminData = await loadAdminData();
        dispatch({ type: ACTIONS.SET_ALL, payload: { ...data, ...adminData } });
        return { ...data, ...adminData };
      } catch {
        dispatch({ type: ACTIONS.SET_ALL, payload: data });
        return data;
      }
    },

    // Services
    getService: async (id) => (await http.get(`/api/services/${id}`)).data,
    getServiceBySlug: async (slug) => (await http.get(`/api/services/by-slug/${slug}`)).data,
    addService: async (payload) => {
      const response = await http.post('/api/services', payload);
      dispatch({ type: ACTIONS.SET_SERVICES, payload: [...state.services, response.data] });
      return response.data;
    },
    updateService: async (id, payload) => {
      const response = await http.put(`/api/services/${id}`, payload);
      dispatch({ type: ACTIONS.SET_SERVICES, payload: state.services.map(item => item.id === response.data.id ? response.data : item) });
      return response.data;
    },
    deleteService: async (id) => {
      await http.delete(`/api/services/${id}`);
      dispatch({ type: ACTIONS.SET_SERVICES, payload: state.services.filter(item => item.id !== id) });
    },

    // Blogs
    addBlog: async (payload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
      const response = await http.post('/api/blogs', formData);
      dispatch({ type: ACTIONS.SET_BLOGS, payload: [response.data, ...state.blogs] });
      return response.data;
    },
    updateBlog: async (id, payload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
      const response = await http.put(`/api/blogs/${id}`, formData);
      dispatch({ type: ACTIONS.SET_BLOGS, payload: state.blogs.map(item => item.id === response.data.id ? response.data : item) });
      return response.data;
    },
    deleteBlog: async (id) => {
      await http.delete(`/api/blogs/${id}`);
      dispatch({ type: ACTIONS.SET_BLOGS, payload: state.blogs.filter(item => item.id !== id) });
    },

    // Testimonials
    addTestimonial: async (payload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
      const response = await http.post('/api/testimonials', formData);
      dispatch({ type: ACTIONS.SET_TESTIMONIALS, payload: [response.data, ...state.testimonials] });
      return response.data;
    },
    updateTestimonial: async (id, payload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
      const response = await http.put(`/api/testimonials/${id}`, formData);
      dispatch({ type: ACTIONS.SET_TESTIMONIALS, payload: state.testimonials.map(item => item.id === response.data.id ? response.data : item) });
      return response.data;
    },
    deleteTestimonial: async (id) => {
      await http.delete(`/api/testimonials/${id}`);
      dispatch({ type: ACTIONS.SET_TESTIMONIALS, payload: state.testimonials.filter(item => item.id !== id) });
    },

    // Enquiries
    addEnquiry: async (payload) => {
      const response = await http.post('/api/enquiries', payload);
      dispatch({ type: ACTIONS.SET_ENQUIRIES, payload: [response.data, ...state.enquiries] });
      return response.data;
    },
    updateEnquiry: async (id, payload) => {
      const response = await http.put(`/api/enquiries/${id}`, payload);
      dispatch({ type: ACTIONS.SET_ENQUIRIES, payload: state.enquiries.map(item => item.id === response.data.id ? response.data : item) });
      return response.data;
    },
    deleteEnquiry: async (id) => {
      await http.delete(`/api/enquiries/${id}`);
      dispatch({ type: ACTIONS.SET_ENQUIRIES, payload: state.enquiries.filter(item => item.id !== id) });
    },

    // Hero Slides
    addHero: async (payload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
      const response = await http.post('/api/hero', formData);
      dispatch({ type: ACTIONS.SET_HERO_SLIDES, payload: [...state.heroSlides, response.data].sort((a, b) => a.slide_order - b.slide_order) });
      return response.data;
    },
    updateHero: async (id, payload) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
      const response = await http.put(`/api/hero/${id}`, formData);
      dispatch({ type: ACTIONS.SET_HERO_SLIDES, payload: state.heroSlides.map(item => item.id === response.data.id ? response.data : item).sort((a, b) => a.slide_order - b.slide_order) });
      return response.data;
    },
    deleteHero: async (id) => {
      await http.delete(`/api/hero/${id}`);
      dispatch({ type: ACTIONS.SET_HERO_SLIDES, payload: state.heroSlides.filter(item => item.id !== id) });
    },

    // Founders
    addFounder: async (payload) => {
      const response = await http.post('/api/founders', payload);
      dispatch({ type: ACTIONS.SET_FOUNDERS, payload: [...state.founders, response.data].sort((a, b) => a.display_order - b.display_order) });
      return response.data;
    },
    updateFounder: async (id, payload) => {
      const response = await http.put(`/api/founders/${id}`, payload);
      dispatch({ type: ACTIONS.SET_FOUNDERS, payload: state.founders.map(item => item.id === response.data.id ? response.data : item).sort((a, b) => a.display_order - b.display_order) });
      return response.data;
    },
    deleteFounder: async (id) => {
      await http.delete(`/api/founders/${id}`);
      dispatch({ type: ACTIONS.SET_FOUNDERS, payload: state.founders.filter(item => item.id !== id) });
    },

    // Content Sections
    updateContentSection: async (sectionKey, payload) => {
      const current = state.contentSections.find(item => item.section_key === sectionKey);
      const normalizedPayload = { ...payload, data: payload?.data ?? current?.data ?? {} };
      const response = await http.put(`/api/content/${sectionKey}`, normalizedPayload);
      const nextSection = normalizeContentSection(response.data);
      const exists = state.contentSections.some(item => item.section_key === sectionKey);
      const next = exists
        ? state.contentSections.map(item => item.section_key === sectionKey ? nextSection : item)
        : [...state.contentSections, nextSection];
      dispatch({ type: ACTIONS.SET_CONTENT_SECTIONS, payload: next });
      return nextSection;
    },

    // FAQs
    addFaq: async (payload) => {
      const response = await http.post('/api/faqs', payload);
      dispatch({ type: ACTIONS.SET_FAQS, payload: [...state.faqs, response.data] });
      return response.data;
    },
    updateFaq: async (id, payload) => {
      const response = await http.put(`/api/faqs/${id}`, payload);
      dispatch({ type: ACTIONS.SET_FAQS, payload: state.faqs.map(item => item.id === response.data.id ? response.data : item) });
      return response.data;
    },
    deleteFaq: async (id) => {
      await http.delete(`/api/faqs/${id}`);
      dispatch({ type: ACTIONS.SET_FAQS, payload: state.faqs.filter(item => item.id !== id) });
    }
  }), [
    state.services, state.blogs, state.testimonials, state.enquiries,
    state.heroSlides, state.founders, state.contentSections, state.faqs
  ]);

  const value = useMemo(() => ({
    state,
    api,
    http,
    exportEnquiriesCSV: () => downloadCSV(state.enquiries)
  }), [state, api]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used inside AdminProvider');
  return context;
}
