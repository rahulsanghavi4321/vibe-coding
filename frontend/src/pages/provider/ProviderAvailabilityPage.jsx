import React, { useState } from 'react';
import { Clock, MapPin, CheckCircle2, Save } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export const ProviderAvailabilityPage = () => {
  const [workingDays, setWorkingDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: false,
  });

  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('19:00');
  const [radiusKm, setRadiusKm] = useState(15);
  const [savedMsg, setSavedMsg] = useState('');

  const handleToggleDay = (day) => {
    setWorkingDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMsg('Operational settings updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <DashboardLayout title="Operating Hours & Service Coverage">
      
      <div className="max-w-3xl space-y-8">
        
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Working Days & Shifts</h3>
              <p className="text-xs text-slate-400">Customer slot picker only displays slots within these hours</p>
            </div>
          </div>

          {savedMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* Days selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Active Working Days</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(workingDays).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-3 py-2 rounded-xl font-bold border transition-all ${
                      workingDays[day]
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Window */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shift Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shift End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            {/* Coverage Radius */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block font-semibold text-slate-700 mb-1">
                Service Radius Coverage: <span className="font-bold text-brand-600">{radiusKm} km</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full accent-brand-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Bookings outside this radial zone from Bangalore central depot will be flagged as out-of-area.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Availability Rules</span>
              </button>
            </div>
          </form>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default ProviderAvailabilityPage;
