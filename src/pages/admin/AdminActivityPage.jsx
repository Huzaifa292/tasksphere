import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { timeAgo } from '../../utils/dateUtils';
import { Activity, ShieldCheck, Terminal, AlertTriangle } from 'lucide-react';

export const AdminActivityPage = () => {
  const activities = useAdminStore(state => state.activities);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white font-heading">
          System Security & Audit Logs
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Immutable event telemetry for SOC2 compliance, user auth challenges, and administrative overrides
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="font-bold text-slate-300 font-mono flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-cyan" />
            LIVE TELEMETRY STREAM
          </span>
          <span className="text-emerald-400 font-mono text-[11px]">● Listening to Redis PubSub</span>
        </div>

        <div className="space-y-3">
          {activities.map(act => (
            <div key={act.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex items-start justify-between gap-4 text-xs">
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  act.status === 'Success' ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
                <div>
                  <h4 className="font-bold text-white">{act.action}</h4>
                  <p className="text-slate-400 text-xs mt-0.5">{act.detail}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[10px] text-slate-500 font-mono block">{timeAgo(act.timestamp)}</span>
                <span className="text-[10px] text-brand-cyan font-mono">{act.ip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
