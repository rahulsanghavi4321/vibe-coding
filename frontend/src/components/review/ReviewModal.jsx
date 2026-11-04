import React, { useState } from 'react';
import { Star, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import RatingStars from '../common/RatingStars';
import api from '../../api/client';

export const ReviewModal = ({ isOpen, onClose, booking, onReviewSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!booking) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/reviews', {
        booking_id: booking.id,
        rating,
        comment,
      });

      setLoading(false);
      setSuccess(true);
      if (onReviewSuccess) {
        onReviewSuccess();
      }
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.detail || 'Failed to submit review. You may have already submitted a review.';
      setError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate & Review Service"
      maxWidth="max-w-md"
    >
      {success ? (
        <div className="text-center py-6 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900">Thank you for your feedback!</h4>
          <p className="text-xs text-slate-500">Your review helps maintain quality standards across our platform.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 mb-2">How satisfied are you with the technician & service?</p>
            <div className="flex justify-center">
              <RatingStars
                rating={rating}
                size="xl"
                interactive={true}
                onRatingChange={(newVal) => setRating(newVal)}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 mt-2 inline-block">
              {rating === 5 ? 'Excellent 5/5' : rating === 4 ? 'Good 4/5' : rating === 3 ? 'Average 3/5' : 'Needs Improvement'}
            </span>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Review / Feedback
            </label>
            <textarea
              rows={3}
              required
              placeholder="The technician arrived on time, was polite, and fixed the issue quickly..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-sm"
            >
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ReviewModal;
