/**
 * Platform Community Directory (Landlord only)
 */

import React, { useEffect, useState } from 'react';
import { FaBuilding, FaSpinner, FaCheckCircle, FaExclamationCircle, FaUserShield, FaExternalLinkAlt, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import api from '../../../services/api';

export default function CommunityManager() {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const res = await api.apiRequest('/super-admin/tenants');
            if (res.tenants) setTenants(res.tenants);
        } catch (e) {
            console.error('List tenants error:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-none">Registered Communities</h1>
                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Tenant Directory & Oversight</p>
                </div>

                <div className="relative group w-full md:w-80">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or slug..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white shadow-sm border border-gray-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all font-medium text-gray-900"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden shadow-2xl shadow-indigo-500/5">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50 text-left">
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Community Profile</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">URL / Domain</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Demographics</th>
                                <th className="px-6 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Registered On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto mb-2" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Syncing Directory...</p>
                                    </td>
                                </tr>
                            ) : filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-medium italic">
                                        No communities found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((t) => (
                                    <tr key={t.id} className="hover:bg-indigo-50/20 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-indigo-100 transition-all">
                                                    {t.logo ? <img src={t.logo} className="object-contain max-h-full" /> : <FaBuilding className="text-indigo-400" />}
                                                </div>
                                                <div>
                                                    <div className="font-extrabold text-gray-900 text-lg group-hover:text-indigo-700 transition-colors">{t.name}</div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter mt-0.5">ID: {t.id?.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={`https://${t.slug}.yourportal.com`} target="_blank" rel="noreferrer"
                                                    className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors"
                                                >
                                                    {t.slug} <FaExternalLinkAlt size={10} />
                                                </a>
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 font-medium italic">{t.domain || 'No Custom Domain'}</div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-gray-900">{(t._count?.users || 0)}</span>
                                                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Active Users</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-gray-900">{(t._count?.jobs || 0)}</span>
                                                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Total Jobs</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${t.status === 'ACTIVE'
                                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-500/10'
                                                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                                                }`}>
                                                {t.status === 'ACTIVE' ? <FaCheckCircle size={10} /> : <FaExclamationCircle size={10} />}
                                                {t.status || 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="text-sm text-gray-900 font-bold">{new Date(t.createdAt).toLocaleDateString()}</div>
                                            <div className="text-[10px] text-gray-400 font-black tracking-widest uppercase">{new Date(t.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
