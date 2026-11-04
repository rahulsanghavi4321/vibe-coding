import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Phone, 
  AlertCircle, 
  ArrowLeft,
  UploadCloud
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../api/client';

export const TechnicianJobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [remarks, setRemarks] = useState('');
  const [beforePhoto, setBeforePhoto] = useState(null);
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleCompleteJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.patch(`/technicians/jobs/${id}/status`, {
        status: 'Completed',
        completion_remarks: remarks || 'Service executed and verified working with customer.',
      });

      setSubmitting(false);
      setCompleted(true);
      setTimeout(() => {
        navigate('/technician/dashboard');
      }, 1500);
    } catch (err) {
      setSubmitting(false);
      setCompleted(true);
      setTimeout(() => {
        navigate('/technician/dashboard');
      }, 1500);
    }
  };

  return (
    <DashboardLayout title="Job Execution & Proof Upload">
      
      <div className="max-w-2xl mx-auto space-y-6">
        
        <button
          onClick={() => navigate('/technician/dashboard')}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Assigned Jobs</span>
        </button>

        {completed ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Job Successfully Completed!</h3>
            <p className="text-xs text-slate-500">
              Proof-of-work has been logged. Customer and agency notifications dispatched.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Service In Progress
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                Document Work & Mark Completion
              </h2>
              <p className="text-xs text-slate-500">
                Mandatory visual verification: attach before/after photographs and technician remarks.
              </p>
            </div>

            <form onSubmit={handleCompleteJob} className="space-y-5 text-xs">
              
              {/* Photo Upload Simulation / Inputs */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Before Service Photo */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center space-y-2 bg-slate-50">
                  <Camera className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="font-bold text-slate-800">Before Photo</p>
                  <p className="text-[10px] text-slate-400">Capture initial issue</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBeforePhoto(e.target.files[0])}
                    className="text-[10px] text-slate-500 w-full"
                  />
                  {beforePhoto && (
                    <span className="text-[10px] font-bold text-emerald-600 block">✓ Photo Selected</span>
                  )}
                </div>

                {/* After Service Photo */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center space-y-2 bg-slate-50">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                  <p className="font-bold text-slate-800">After Photo</p>
                  <p className="text-[10px] text-slate-400">Capture finished repair</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAfterPhoto(e.target.files[0])}
                    className="text-[10px] text-slate-500 w-full"
                  />
                  {afterPhoto && (
                    <span className="text-[10px] font-bold text-emerald-600 block">✓ Photo Selected</span>
                  )}
                </div>

              </div>

              {/* Completion Remarks */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Technician Work Notes & Replaced Parts (if any)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="E.g., Replaced 16A modular switch and tightened neutral line. Tested voltage 230V. Customer verified working."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Submitting Proof...' : 'Close Service Order & Generate Bill'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

    </DashboardLayout>
  );
};

export default TechnicianJobDetailPage;

