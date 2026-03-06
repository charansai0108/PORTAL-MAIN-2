/**
 * Community Branding & White-Labeling (College Owner only)
 */

import React, { useState, useEffect } from 'react';
import { FaPalette, FaImage, FaGlobe, FaSpinner, FaCheckCircle, FaTrash, FaPlus, FaSave, FaExternalLinkAlt } from 'react-icons/fa';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

export default function TenantSettings() {
    const { tenant, setTenant, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [tenantError, setTenantError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        banner: '',
        themeColor: '#4f46e5',
        allowedDomains: '',
        slug: '',
    });

    useEffect(() => {
        if (tenant) {
            setTenantError(null);
            setFormData({
                name: tenant.name || '',
                logo: tenant.logo || '',
                banner: tenant.banner || '',
                themeColor: tenant.themeColor || '#4f46e5',
                allowedDomains: Array.isArray(tenant.allowedDomains) ? tenant.allowedDomains.join(', ') : (tenant.allowedDomains || ''),
                slug: tenant.slug || '',
            });
        }
    }, [tenant]);

    // If tenant is null but user has tenantId, fetch tenant (AuthContext may not have resolved it yet)
    useEffect(() => {
        if (tenant || !user) return;
        const tenantId = user.tenantId ?? user.student?.tenantId ?? user.recruiter?.tenantId;
        if (!tenantId) return;

        let cancelled = false;
        setLoading(true);
        setTenantError(null);
        api.apiRequest(`/super-admin/tenants/${tenantId}`, { silent: true })
            .then((res) => {
                if (!cancelled && res?.tenant) {
                    setTenant(res.tenant);
                    localStorage.setItem('tenantInfo', JSON.stringify(res.tenant));
                }
            })
            .catch((err) => {
                if (!cancelled) setTenantError('Could not load tenant settings. Please refresh.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [tenant, user, setTenant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!tenant?.id) {
            alert('Tenant not loaded yet. Please wait a moment or refresh the page.');
            return;
        }

        try {
            setSaving(true);
            const res = await api.apiRequest(`/super-admin/tenants/${tenant.id}`, {
                method: 'PATCH',
                body: JSON.stringify(formData)
            });
            if (res.tenant) {
                setTenant(res.tenant);
                localStorage.setItem('tenantInfo', JSON.stringify(res.tenant));
                // Notify other windows/components that tenant branding changed
                try {
                    window.dispatchEvent(new CustomEvent('tenantUpdated', { detail: res.tenant }));
                } catch (e) {
                    // ignore if dispatch fails in older browsers
                }
                alert('Branding updated successfully! Refresh to see full changes.');
            }
        } catch (error) {
            console.error('Update tenant error:', error);
            alert('Failed to update branding: ' + (error?.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fadeIn">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-100 rounded-2xl shadow-sm">
                    <FaPalette className="text-violet-600 text-xl" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 leading-none">Community Branding</h1>
                    <p className="text-sm text-gray-500 mt-1">Customize the portal experience for your students and staff.</p>
            </div>
        </div>

            {(loading || tenantError) && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    {loading && <p className="text-amber-800 font-medium">Loading tenant settings...</p>}
                    {tenantError && <p className="text-amber-800 font-medium">{tenantError}</p>}
                </div>
            )}

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Form Inputs */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaGlobe className="text-blue-500" /> Identity & Domain
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">College / Community Name</label>
                                <input
                                    type="text" name="name" value={formData.name} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all font-medium"
                                    placeholder="e.g. Stanford University"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Portal Slug (URL)</label>
                                    <div className="flex items-center">
                                        <input
                                            disabled type="text" value={formData.slug}
                                            className="w-full px-4 py-3.5 bg-gray-100/50 border border-gray-200 rounded-2xl font-bold text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Theme Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color" name="themeColor" value={formData.themeColor} onChange={handleChange}
                                            className="w-14 h-14 p-1.5 bg-white border border-gray-200 rounded-2xl cursor-pointer"
                                        />
                                        <input
                                            type="text" name="themeColor" value={formData.themeColor} onChange={handleChange}
                                            className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl font-mono text-sm uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Allowed Email Domains</label>
                                <input
                                    type="text" name="allowedDomains" value={formData.allowedDomains} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all font-medium"
                                    placeholder="e.g. stanford.edu, cs.stanford.edu"
                                />
                                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider italic">Separate domains by comma. Students signing up with these domains auto-map to you.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaImage className="text-emerald-500" /> Visual Assets
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Logo URL (Transparent Recommended)</label>
                                <input
                                    type="text" name="logo" value={formData.logo} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all font-medium"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Main Banner URL (1920x600 Recommended)</label>
                                <input
                                    type="text" name="banner" value={formData.banner} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition-all font-medium"
                                    placeholder="https://example.com/banner.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Preview */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 text-center">Live Preview</h3>

                        <div className="space-y-8">
                            {/* Header Preview */}
                            <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-lg shadow-black/5 relative overflow-hidden group">
                                <div className="text-[10px] font-bold text-gray-300 mb-2 uppercase tracking-widest">Portal Header</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                        {formData.logo ? <img src={formData.logo} className="max-w-full max-h-full object-contain" /> : <FaImage className="text-gray-300" />}
                                    </div>
                                    <div className="font-bold text-gray-900 text-sm truncate">{formData.name || 'Your Brand'}</div>
                                </div>
                            </div>

                            {/* Banner Preview */}
                            <div className="border border-gray-100 rounded-2xl aspect-[16/6] bg-gray-50 relative overflow-hidden shadow-sm group">
                                {formData.banner ? (
                                    <img src={formData.banner} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                        <FaImage size={24} className="mb-2" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Banner Image</span>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                                    <div className="text-[10px] font-bold text-white truncate">Welcome to {formData.name || 'University'}</div>
                                </div>
                            </div>

                            {/* Theme Preview */}
                            <div className="space-y-4">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">UI Accent Preview</div>
                                <button
                                    disabled
                                    type="button"
                                    style={{ backgroundColor: formData.themeColor }}
                                    className="w-full p-4 rounded-2xl text-white font-bold text-sm shadow-xl shadow-gray-200 opacity-90"
                                >
                                    Primary Action Button
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={saving || !tenant?.id}
                                className="w-full py-4 bg-black text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                {saving ? 'Saving...' : 'Publish Branding'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
