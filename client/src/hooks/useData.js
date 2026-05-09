/**
 * useData.js — FINAL MERGED VERSION
 * Handles new { data, meta } API shape from upgraded projects + messages routes.
 * All hook return signatures are identical to original — zero breaking changes.
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

// ── PROJECTS ──────────────────────────────────────────────────

export function useProjects(featured = false) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data: res } = await api.get(`/projects${featured ? '?featured=true' : ''}`);
      // Unwraps new { data, meta } envelope; falls back for plain array
      setProjects(Array.isArray(res) ? res : (res.data ?? []));
    } catch (e) {
      setError(e?.response?.data?.error ?? 'Failed to load projects');
    } finally { setLoading(false); }
  }, [featured]);

  useEffect(() => { fetch(); }, [fetch]);
  return { projects, loading, error, refetch: fetch };
}

export function useAllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data: res } = await api.get('/projects');
      setProjects(Array.isArray(res) ? res : (res.data ?? []));
    } catch (e) {
      setError(e?.response?.data?.error ?? 'Failed to load projects');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createProject = async (payload) => {
    const { data } = await api.post('/projects', payload);
    setProjects(prev => [data, ...prev]); return data;
  };
  const updateProject = async (id, payload) => {
    const { data } = await api.put(`/projects/${id}`, payload);
    setProjects(prev => prev.map(p => p._id === id ? data : p)); return data;
  };
  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p._id !== id));
  };

  return { projects, loading, error, refetch: fetch, createProject, updateProject, deleteProject };
}

// ── MESSAGES ──────────────────────────────────────────────────

export function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data: res } = await api.get('/messages');
      // Unwraps new { data, meta } envelope; falls back for plain array
      setMessages(Array.isArray(res) ? res : (res.data ?? []));
    } catch (e) {
      setError(e?.response?.data?.error ?? 'Failed to load messages');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const markRead = async (id) => {
    await api.patch(`/messages/${id}/read`);
    setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
  };
  const deleteMessage = async (id) => {
    await api.delete(`/messages/${id}`);
    setMessages(prev => prev.filter(m => m._id !== id));
  };

  return { messages, loading, error, refetch: fetch, markRead, deleteMessage };
}

// ── CERTIFICATES ──────────────────────────────────────────────

export function useCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const { data: res } = await api.get('/certificates');
      // Updated to match the { data, meta } pattern while staying backwards compatible
      setCertificates(Array.isArray(res) ? res : (res.data ?? []));
    } catch (e) {
      setError(e?.response?.data?.error ?? 'Failed to load certificates');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createCertificate = async (payload) => {
    const { data } = await api.post('/certificates', payload);
    setCertificates(prev => [data, ...prev]);
    return data;
  };

  const updateCertificate = async (id, payload) => {
    const { data } = await api.put(`/certificates/${id}`, payload);
    setCertificates(prev => prev.map(c => c._id === id ? data : c));
    return data;
  };

  const deleteCertificate = async (id) => {
    await api.delete(`/certificates/${id}`);
    setCertificates(prev => prev.filter(c => c._id !== id));
  };

  return { certificates, loading, error, refetch: fetch, createCertificate, updateCertificate, deleteCertificate };
}