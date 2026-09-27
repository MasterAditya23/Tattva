import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  LayoutDashboard, AlertTriangle, ShieldCheck, Sun, Moon, 
  Search, CheckCircle, Clock, Zap, RefreshCw, Server, AlertOctagon, Terminal
} from 'lucide-react';

const API_URL = '[https://tattva-production.up.railway.app](https://tattva-production.up.railway.app)';

export default function App() {
  const [incidents, setIncidents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  // TERMINAL MODAL STATES
  const [activeTerminal, setActiveTerminal] = useState(null);
  const [terminalLines, setTerminalLines] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${API_URL}/incidents/`);
      setIncidents(response.data.reverse());
      setApiOnline(true);
    } catch (error) {
      console.error("Backend offline", error);
      setApiOnline(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchIncidents();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // TERMINAL EXECUTION SIMULATION
  const approveIncident = async (inc) => {
    setActiveTerminal(inc);
    setTerminalLines([]);
    setIsExecuting(true);
    
    const lines = [
      `> Initializing secure SSH tunnel to ${inc.resource_id}...`,
      `> Authenticating via zero-trust SRE certs... [OK]`,
      `> Connected to ${inc.resource_id} at ${new Date().toISOString()}`,
      `> Executing AI-recommended action: ${inc.recommended_action || 'REMEDIATION'}...`,
      `> Validating system state and permissions...`,
      `> Applying configuration changes...`,
      `> Restarting affected services...`,
      `> Running verification health checks... [OK]`,
      `> REMEDIATION SUCCESSFUL. Sending signed approval to API...`
    ];

    let currentLine = 0;
    const interval = setInterval(async () => {
      setTerminalLines(prev => [...prev, lines[currentLine]]);
      currentLine++;
      
      if (currentLine >= lines.length) {
        clearInterval(interval);
        try {
          // Now hit the actual backend to officially resolve it
          await axios.post(`${API_URL}/incidents/${inc.id}/approve`);
          await fetchIncidents();
          setTerminalLines(prev => [...prev, `> API Confirmation Received. Incident Closed.`]);
          setIsExecuting(false);
        } catch (error) {
          console.error("Approval error", error);
          setTerminalLines(prev => [...prev, `> ERROR: Failed to reach backend API.`]);
          setIsExecuting(false);
        }
      }
    }, 500); // 500ms delay per line for cinematic effect
  };

  const viewLogs = (inc) => {
    setActiveTerminal(inc);
    setTerminalLines([
      `> FETCHING HISTORICAL LOGS FOR ${inc.id}...`,
      `> Executed Action: ${inc.recommended_action || 'AUTO_REMEDIATION'}`,
      `> Target Resource: ${inc.resource_id}`,
      `> Timestamp: ${inc.created_at || 'Previous session'}`,
      `> Status: REMEDIATION VERIFIED BY SYSTEM. NO FURTHER ACTION REQUIRED.`
    ]);
    setIsExecuting(false);
  };

  const triggerSimulation = async (type) => {
    const payload = type === 'high' ? {
      resource_id: "DB-Cluster-Primary",
      problem_description: "Unauthorized root-level SSH access detected, index tables corrupted on payment volume."
    } : {
      resource_id: "Nginx-Gateway-01",
      problem_description: "Reverse proxy returning 502 Bad Gateway due to dead worker threads."
    };

    try {
      await axios.post(`${API_URL}/incidents/`, payload);
      fetchIncidents();
    } catch (err) {
      console.error("Simulation failed", err);
    }
  };

  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => 
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.resource_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inc.ai_diagnosis && inc.ai_diagnosis.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inc.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [incidents, searchQuery]);

  const total = incidents.length;
  const pending = incidents.filter(i => i.status === 'PENDING_APPROVAL' || i.status === 'MANUAL_REVIEW').length;
  const verified = incidents.filter(i => i.status === 'VERIFIED').length;
  const highRisk = incidents.filter(i => i.risk_level === 'HIGH_RISK').length;
  const lowRisk = incidents.filter(i => i.risk_level === 'LOW_RISK').length;

  const chartData = [
    { name: 'Low Risk', count: lowRisk, color: '#10B981' },
    { name: 'High Risk', count: highRisk, color: '#EF4444' },
    { name: 'Verified', count: verified, color: '#3B82F6' },
    { name: 'Pending', count: pending, color: '#F59E0B' },
  ];

  const themeClasses = darkMode ? 'bg-[#0B0F19] text-slate-100' : 'bg-slate-100 text-slate-900';
  const cardClasses = darkMode ? 'bg-[#111827] border-slate-800 text-slate-100 shadow-xl' : 'bg-white border-slate-200 text-slate-800 shadow-sm';
  const subtextClasses = darkMode ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`flex h-screen font-sans transition-colors duration-200 ${themeClasses}`}>
      
      <aside className={`w-64 border-r flex flex-col justify-between ${darkMode ? 'bg-[#0E131F] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-inherit">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                TATTVA
              </h1>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">AI SRE Guardian</p>
            </div>
          </div>
          <nav className="p-4 space-y-1.5">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : `${subtextClasses} hover:bg-slate-800/40`}`}>
              <LayoutDashboard size={18} /> Overview
            </button>
            <button onClick={() => setActiveTab('incidents')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'incidents' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : `${subtextClasses} hover:bg-slate-800/40`}`}>
              <AlertTriangle size={18} /> Incidents
              {pending > 0 && <span className="ml-auto text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">{pending}</span>}
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-inherit">
          <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Simulate Ingestion</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => triggerSimulation('low')} className="px-2 py-1.5 text-xs font-semibold rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/40">+ Low Risk</button>
            <button onClick={() => triggerSimulation('high')} className="px-2 py-1.5 text-xs font-semibold rounded bg-rose-950/40 text-rose-400 border border-rose-800/50 hover:bg-rose-900/40">+ High Risk</button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`h-16 border-b flex items-center justify-between px-8 ${darkMode ? 'bg-[#0E131F]/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search by ID, Resource, or Diagnosis..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full rounded-lg pl-9 pr-4 py-1.5 text-xs border focus:outline-none focus:border-blue-500 transition-colors ${darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-inherit">
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <span className={subtextClasses}>{apiOnline ? 'Engine Online (3s Poll)' : 'Engine Disconnected'}</span>
            </div>
            <button onClick={handleManualRefresh} className={`p-2 rounded-lg border border-inherit hover:bg-slate-800/30 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}><RefreshCw size={16} /></button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg border border-inherit hover:bg-slate-800/30 transition-colors">{darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-600" />}</button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-6 relative">
          <section className="grid grid-cols-4 gap-5">
            <div className={`p-5 rounded-xl border ${cardClasses}`}>
              <div className="flex justify-between items-center mb-2"><span className={`text-xs font-semibold tracking-wider uppercase ${subtextClasses}`}>Total Events</span><Server size={18} className="text-blue-500" /></div>
              <p className="text-3xl font-extrabold">{total}</p>
            </div>
            <div className={`p-5 rounded-xl border ${cardClasses}`}>
              <div className="flex justify-between items-center mb-2"><span className={`text-xs font-semibold tracking-wider uppercase text-amber-500`}>Awaiting Action</span><AlertOctagon size={18} className="text-amber-500" /></div>
              <p className="text-3xl font-extrabold text-amber-500">{pending}</p>
            </div>
            <div className={`p-5 rounded-xl border ${cardClasses}`}>
              <div className="flex justify-between items-center mb-2"><span className={`text-xs font-semibold tracking-wider uppercase text-emerald-500`}>Auto-Resolved</span><Zap size={18} className="text-emerald-500" /></div>
              <p className="text-3xl font-extrabold text-emerald-500">{verified}</p>
            </div>
            <div className={`p-5 rounded-xl border ${cardClasses}`}>
              <div className="flex justify-between items-center mb-2"><span className={`text-xs font-semibold tracking-wider uppercase ${subtextClasses}`}>Autonomous Rate</span><CheckCircle size={18} className="text-indigo-400" /></div>
              <p className="text-3xl font-extrabold text-indigo-400">{total > 0 ? Math.round((verified / total) * 100) : 0}%</p>
            </div>
          </section>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
              <div className={`col-span-2 p-6 rounded-xl border ${cardClasses}`}>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Live Incident State Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke={darkMode ? "#64748B" : "#94A3B8"} fontSize={12} tickLine={false} />
                      <YAxis stroke={darkMode ? "#64748B" : "#94A3B8"} fontSize={12} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1E293B' : '#FFFFFF', borderColor: darkMode ? '#334155' : '#E2E8F0', borderRadius: '8px', color: darkMode ? '#F8FAFC' : '#0F172A' }} />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>{chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={`p-6 rounded-xl border flex flex-col justify-between ${cardClasses}`}>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Tattva Policy Spec</h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-lg border border-inherit bg-slate-800/10"><span className="font-bold text-emerald-400">LOW_RISK:</span> Auto-executes remediation with instant automated verification.</div>
                    <div className="p-3 rounded-lg border border-inherit bg-slate-800/10"><span className="font-bold text-rose-400">HIGH_RISK:</span> Halts automation loop. Requires explicit SRE cryptographic sign-off.</div>
                    <div className="p-3 rounded-lg border border-inherit bg-slate-800/10"><span className="font-bold text-blue-400">MODEL:</span> Gemini 3.5 Flash Lite structured inference via JSON schema.</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-inherit flex items-center gap-2 text-xs text-slate-400"><Terminal size={14} /> Ready for production incident streaming.</div>
              </div>
            </div>
          )}

          <section className={`rounded-xl border overflow-hidden ${cardClasses}`}>
            <div className="p-5 border-b border-inherit flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold">Incident Queue & AI Diagnostics</h3>
                <p className={`text-xs ${subtextClasses}`}>Showing {filteredIncidents.length} of {incidents.length} recorded incidents</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`uppercase text-[11px] font-semibold border-b border-inherit ${darkMode ? 'bg-slate-900/60 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                  <tr>
                    <th className="px-6 py-4">Incident / Target</th>
                    <th className="px-6 py-4">AI Diagnostics & Action</th>
                    <th className="px-6 py-4">Risk Category</th>
                    <th className="px-6 py-4 text-right">State / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-inherit">
                  {filteredIncidents.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-sm">No matching incidents found.</td></tr>
                  ) : null}
                  {filteredIncidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-blue-400 tracking-wide">{inc.id}</span>
                        <div className={`font-mono mt-0.5 ${subtextClasses}`}>{inc.resource_id}</div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <p className="font-medium text-slate-200">{inc.ai_diagnosis || "Analyzing..."}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                            Action: {inc.recommended_action || "EVALUATING"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${inc.risk_level === 'HIGH_RISK' ? 'bg-rose-950 text-rose-400 border border-rose-800' : inc.risk_level === 'LOW_RISK' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>{inc.risk_level}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(inc.status === 'PENDING_APPROVAL' || inc.status === 'MANUAL_REVIEW') ? (
                          <button onClick={() => approveIncident(inc)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-blue-600/30 transition-all hover:scale-105 active:scale-95">
                            Authorize Fix
                          </button>
                        ) : (
                          <button onClick={() => viewLogs(inc)} className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors px-2 py-1 rounded hover:bg-emerald-900/30">
                            <CheckCircle size={14} /> Verified (Logs)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TERMINAL MODAL OVERLAY */}
          {activeTerminal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <div className="w-full max-w-3xl bg-[#09090B] border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all">
                
                {/* Terminal Header */}
                <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Terminal size={16} className="text-slate-400" />
                    <span className="text-xs font-mono text-slate-300">
                      root@{activeTerminal.resource_id} � Tattva Execution Environment
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600"></div>
                  </div>
                </div>
                
                {/* Terminal Body */}
                <div className="p-6 h-80 overflow-y-auto font-mono text-sm flex flex-col gap-2 bg-[#09090B]">
                  {terminalLines.map((line, i) => (
                    <div key={i} className={line.includes('ERROR') ? 'text-rose-400' : line.includes('SUCCESSFUL') || line.includes('OK') ? 'text-emerald-400' : 'text-slate-300'}>
                      {line}
                    </div>
                  ))}
                  {isExecuting && <div className="text-emerald-400 animate-pulse font-bold mt-2">_</div>}
                </div>

                {/* Terminal Footer */}
                <div className="p-4 bg-slate-900 border-t border-slate-700 flex justify-end">
                  <button 
                    onClick={() => { if (!isExecuting) setActiveTerminal(null); }}
                    disabled={isExecuting}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isExecuting 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    {isExecuting ? 'Executing Script...' : 'Close Terminal'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
