import React, { useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { Sliders, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AdminSettingsPage = () => {
  const platformSettings = useAdminStore(state => state.platformSettings);
  const updatePlatformSettings = useAdminStore(state => state.updatePlatformSettings);

  const [maintenance, setMaintenance] = useState(platformSettings.maintenanceMode);
  const [allowReg, setAllowReg] = useState(platformSettings.allowPublicRegistrations);
  const [requireEmail, setRequireEmail] = useState(platformSettings.requireEmailVerification);
  const [rateLimit, setRateLimit] = useState(platformSettings.apiRateLimitPerMin || 1200);

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updatePlatformSettings({
      maintenanceMode: maintenance,
      allowPublicRegistrations: allowReg,
      requireEmailVerification: requireEmail,
      apiRateLimitPerMin: parseInt(rateLimit, 10)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-black text-white font-heading">
          Platform Configuration & Limits
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Global infrastructure thresholds, registration policies, and maintenance toggles
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Platform configuration updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white">Maintenance Mode</h4>
            <p className="text-xs text-slate-400">Put all customer tenant workspaces in read-only maintenance</p>
          </div>
          <input
            type="checkbox"
            checked={maintenance}
            onChange={(e) => setMaintenance(e.target.checked)}
            className="w-4 h-4 text-brand-violet rounded"
          />
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white">Allow Public Self-Service Registrations</h4>
            <p className="text-xs text-slate-400">Permit new users to register trial accounts via /register</p>
          </div>
          <input
            type="checkbox"
            checked={allowReg}
            onChange={(e) => setAllowReg(e.target.checked)}
            className="w-4 h-4 text-brand-violet rounded"
          />
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white">Require Email Verification</h4>
            <p className="text-xs text-slate-400">Enforce OTP token link validation before workspace access</p>
          </div>
          <input
            type="checkbox"
            checked={requireEmail}
            onChange={(e) => setRequireEmail(e.target.checked)}
            className="w-4 h-4 text-brand-violet rounded"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Global API Rate Limit (requests / min / tenant)
          </label>
          <input
            type="number"
            value={rateLimit}
            onChange={(e) => setRateLimit(e.target.value)}
            className="w-full max-w-xs px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-white font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" size="sm">
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
