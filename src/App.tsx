import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Cpu, RefreshCw, Server, ShieldCheck } from 'lucide-react';

interface HealthData {
  status: string;
  kernel: string;
  role: string;
  service: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  readyForImport: boolean;
}

export default function App() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
      const data: HealthData = await res.json();
      setHealth(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased">
      <main className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-semibold tracking-tight text-white">
                OB/NBE Regulatory Reporting Kernel
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Technical landing pad and verified runtime host
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Kernel Operational
          </div>
        </div>

        {/* Runtime Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <Cpu className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-medium text-slate-200">Frontend Environment</div>
              <div className="text-xs text-slate-400 mt-0.5">React 19 &bull; Vite &bull; TypeScript</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <Server className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <div className="font-medium text-slate-200">Backend Runtime</div>
              <div className="text-xs text-slate-400 mt-0.5">Node.js &bull; Express API Host</div>
            </div>
          </div>
        </div>

        {/* Health Check Card */}
        <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>Runtime Health Status</span>
            </div>
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Probing...' : 'Re-check'}</span>
            </button>
          </div>

          {error ? (
            <div className="p-3 rounded bg-red-950/30 border border-red-900/50 text-red-300 text-xs">
              Error querying /api/health: {error}
            </div>
          ) : health ? (
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">Service:</span>
                <span className="text-slate-300">{health.service}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">API Endpoint:</span>
                <span className="text-emerald-400">GET /api/health (200 OK)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">Uptime:</span>
                <span className="text-slate-300">{health.uptimeSeconds}s</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-900">
                <span className="text-slate-500">Environment:</span>
                <span className="text-slate-300">{health.environment}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Last Verified:</span>
                <span className="text-slate-400">{lastChecked || health.timestamp}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500">Initializing health verification...</div>
          )}
        </div>

        {/* Landing Environment Notice */}
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-sky-950/20 border border-sky-800/30 text-xs text-sky-200/90 leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <p>
            Clean kernel initialized. System is configured to serve as a stable landing environment.
            Standing by for the existing application ZIP import.
          </p>
        </div>

      </main>
    </div>
  );
}
