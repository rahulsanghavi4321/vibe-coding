import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  PlayCircle, 
  AlertCircle,
  ArrowRight,
  Camera
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Badge from '../../components/common/Badge';
import api from '../../api/client';

export const TechnicianDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechnicianJobs();
  }, []);

  const fetchTechnicianJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/technicians/me/assigned-jobs');
      if (res.data && res.data.length > 0) {
        setJobs(res.data);
      } else {
        setFallback();
      }
    } catch (err) {
      setFallback();
    } finally {
      setLoading(false);
    }
  };

  const setFallback = () => {
    setJobs([
      {
        id: 1,
        booking_ref: 'HS-BK-9801',
        service_title: 'Ceiling Fan Installation & Repair',
        customer_name: 'Aditi Rao',
        customer_phone: '+91 98201 12345',
        booking_date: '2026-11-04',
        time_slot: '10:00 AM - 11:00 AM',
        address: 'Flat 402, Royal Palms Residency, 7th Main, Bangalore',
        status: 'Provider Assigned',
        problem_description: 'Need installation of high-speed BLDC ceiling fan with remote sync.',
      },
      {
        id: 2,
        booking_ref: 'HS-BK-9802',
        service_title: 'AC Jet Deep Servicing & Filter Cleaning',
        customer_name: 'Vikram Mehta',
        customer_phone: '+91 98332 54321',
        booking_date: '2026-11-04',
        time_slot: '02:00 PM - 03:00 PM',
        address: 'Villa 12, Green Meadows, Sarjapur Road, Bangalore',
        status: 'In Progress',
        problem_description: 'Annual deep clean and gas pressure test.',
      }
    ]);
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      await api.patch(`/technicians/jobs/${jobId}/status`, { status: newStatus });
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) {
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    }
  };

  return (
    <DashboardLayout title="Technician Field Dispatch Console">
      
      {/* Mobile Priority Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-amber-900 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Active Daily Schedule · {jobs.length} Jobs Assigned Today</span>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3"
          >
            {/* Top Tag & Ref */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {job.booking_ref}
              </span>
              <Badge status={job.status} />
            </div>

            {/* Service & Customer */}
            <div>
              <h3 className="text-base font-bold text-slate-900">{job.service_title}</h3>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                <span className="font-semibold text-slate-800">{job.customer_name}</span>
                <a
                  href={`tel:${job.customer_phone}`}
                  className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{job.customer_phone}</span>
                </a>
              </div>
            </div>

            {/* Appointment Window */}
            <div className="p-3 bg-blue-50/50 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-brand-800">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>Slot: {job.booking_date} ({job.time_slot})</span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-600 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{job.address}</span>
              </div>
            </div>

            {job.problem_description && (
              <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <strong className="text-slate-700">Customer Note:</strong> {job.problem_description}
              </p>
            )}

            {/* Workflow Step Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
              {job.status === 'Provider Assigned' && (
                <button
                  onClick={() => handleUpdateStatus(job.id, 'In Progress')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Mark Arrival & Start Job</span>
                </button>
              )}

              {job.status === 'In Progress' && (
                <Link
                  to={`/technician/job/${job.id}`}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Photos & Complete Job</span>
                </Link>
              )}

              {job.status === 'Completed' && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Job Finished & Documented</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
};

export default TechnicianDashboard;

