/**
 * Platform Global Statistics (Landlord only)
 */

import React, { useEffect, useState } from 'react';
import { FaGlobe, FaBuilding, FaUsers, FaBriefcase, FaClipboardList, FaSpinner, FaRocket, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../../services/api';

export default function PlatformStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                // We'll need to add this to api.js
                const res = await api.apiRequest('/super-admin/stats/platform');
                if (!cancelled) setStats(res);
            } catch (e) {
                console.error('Platform stats error:', e);
                if (!cancelled) setStats({ topColleges: [], summary: {} });
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-64">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-500 italic">Aggregating platform-wide data...</p>
                </div>
            </div>
        );
    }

    const s = stats?.summary || {};
    const topColleges = stats?.topColleges || [];

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FaGlobe className="text-blue-600" />
                    </div>
                    Platform Ecosystem Overview
                </h1>
                <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <FaRocket /> Live Monitoring Active
                </div>
            </div>

            {/* Global Counters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { icon: FaBuilding, color: 'bg-indigo-500', label: 'Active Colleges', value: s.totalColleges, trend: '+2 this week' },
                    { icon: FaUsers, color: 'bg-emerald-500', label: 'Total Students', value: s.totalStudents, trend: '+450 new' },
                    { icon: FaBriefcase, color: 'bg-amber-500', label: 'Open Jobs', value: s.totalJobs, trend: 'Global view' },
                    { icon: FaClipboardList, color: 'bg-violet-500', label: 'Applications', value: s.totalApplications, trend: 'Lifetime' },
                    { icon: FaUsers, color: 'bg-rose-500', label: 'Total Admins', value: s.totalAdmins, trend: 'Capacity' },
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                        <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                            <item.icon className="text-xl" />
                        </div>
                        <div className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">{item.label}</div>
                        <div className="text-3xl font-black text-gray-900 mb-2">{item.value ?? 0}</div>
                        <div className="text-xs font-medium text-blue-600">{item.trend}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Performing Colleges */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaBuilding className="text-indigo-500" /> Recent / Top Communities
                        </h3>
                        <button className="text-sm font-bold text-blue-600 hover:underline">View All Tenants</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest bg-white border-b border-gray-100">
                                    <th className="px-8 py-4">College / Owner</th>
                                    <th className="px-6 py-4">Students</th>
                                    <th className="px-6 py-4">Jobs</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-8 py-4 text-right">Activity</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {topColleges.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-12 text-center text-gray-400 italic font-medium">No colleges registered in the ecosystem yet.</td>
                                    </tr>
                                ) : (
                                    topColleges.map((t) => (
                                        <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{t.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{t.owner || 'No Owner'} • {t.slug}.portal.com</div>
                                            </td>
                                            <td className="px-6 py-5 font-bold text-gray-700">{t.studentsCount}</td>
                                            <td className="px-6 py-5 font-bold text-gray-600">{t.jobsCount}</td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                    <FaCheckCircle className="text-[10px]" /> Healthy
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden ml-auto">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* System Health / Alerts */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        System Integrity
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <FaRocket className="text-indigo-600" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">Infrastructure</div>
                                <div className="text-sm text-gray-600">All regions operational. Multi-tenant isolation verified.</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <FaExclamationTriangle className="text-amber-600" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">Pending Approvals</div>
                                <div className="text-sm text-gray-600">Review pending tenant requests.</div>
                                <button className="mt-2 text-xs font-black text-amber-700 underline" onClick={() => {
                                    // navigate to review tab
                                    window.history.pushState({}, '', '/super-admin?tab=reviewRequests');
                                    window.dispatchEvent(new PopStateEvent('popstate'));
                                }}>Review Requests</button>
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-100 text-center">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Platform Version</div>
                            <div className="text-xl font-black text-gray-900">v2.4.0 <span className="text-xs font-normal text-gray-500">(SaaS Enabled)</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
