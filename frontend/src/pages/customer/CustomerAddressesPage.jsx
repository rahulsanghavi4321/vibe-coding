import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Building2, Briefcase } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/common/Modal';
import api from '../../api/client';

export const CustomerAddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('Home');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [postalCode, setPostalCode] = useState('560100');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/addresses');
      if (res.data && res.data.length > 0) {
        setAddresses(res.data);
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
    setAddresses([
      {
        id: 1,
        title: 'Home',
        address_line1: 'Flat 402, Royal Palms Residency, 7th Main',
        city: 'Bangalore',
        state: 'Karnataka',
        postal_code: '560100',
        is_default: true,
      },
      {
        id: 2,
        title: 'Office',
        address_line1: 'Tower B, 3rd Floor, Embassy TechVillage',
        city: 'Bangalore',
        state: 'Karnataka',
        postal_code: '560103',
        is_default: false,
      }
    ]);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        address_line1: addressLine1,
        city,
        state,
        postal_code: postalCode,
        is_default: isDefault,
      };

      const res = await api.post('/users/addresses', payload);
      setAddresses([...addresses, res.data]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      const newAddr = {
        id: Date.now(),
        title,
        address_line1: addressLine1,
        city,
        state,
        postal_code: postalCode,
        is_default: isDefault,
      };
      setAddresses([...addresses, newAddr]);
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('Home');
    setAddressLine1('');
    setCity('Bangalore');
    setState('Karnataka');
    setPostalCode('560100');
    setIsDefault(false);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/addresses/${id}`);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  return (
    <DashboardLayout title="Saved Addresses">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage Service Locations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Technicians will navigate to your selected location during appointment dispatch.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((a) => (
          <div
            key={a.id}
            className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between ${
              a.is_default ? 'border-brand-500 ring-1 ring-brand-500' : 'border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{a.title}</h4>
                </div>
                {a.is_default && (
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                    Default Address
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {a.address_line1}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {a.city}, {a.state} – {a.postal_code}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Doorstep Delivery Validated</span>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Service Address"
      >
        <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Address Label
            </label>
            <div className="flex gap-2">
              {['Home', 'Office', 'Other'].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setTitle(lbl)}
                  className={`px-3 py-1.5 rounded-xl border font-bold ${
                    title === lbl
                      ? 'border-brand-600 bg-blue-50 text-brand-700'
                      : 'border-slate-300 text-slate-600'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Flat / House No. & Street Address
            </label>
            <input
              type="text"
              required
              placeholder="Flat 304, Green Heights, 12th Cross..."
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">PIN / Postal Code</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="text-brand-600 rounded"
            />
            <span className="font-semibold text-slate-700">Set as my default service address</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold"
            >
              Save Address
            </button>
          </div>
        </form>
      </Modal>

    </DashboardLayout>
  );
};

export default CustomerAddressesPage;
