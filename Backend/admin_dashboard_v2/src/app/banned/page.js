// /src/app/banned/page.js
'use client';
import React, { useState, useEffect } from 'react';
import useSession from '@/hooks/useSession';

export default function BanAppealPage() {
  const { user, loading } = useSession();
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    reason: '',
    appeal: '',
  });
  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false,
    message: '',
    error: false
  });

  // Handle session state
  useEffect(() => {
    if (!loading && !user) {
      const currentPath = encodeURIComponent('/banned');
      window.location.href = `/api/auth/login?returnTo=${currentPath}`;
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        userId: user.id,
        username: user.username
      }));
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ isSubmitting: true, message: '', error: false });

    try {
      const response = await fetch('/api/appeals/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          isSubmitting: false,
          message: 'Your appeal has been submitted successfully. We will review it shortly.',
          error: false
        });
        setFormData(prev => ({
          ...prev,
          reason: '',
          appeal: ''
        }));
      } else {
        throw new Error('Failed to submit appeal');
      }
    } catch (error) {
      console.error('Error submitting appeal:', error);
      setSubmitStatus({
        isSubmitting: false,
        message: 'Failed to submit appeal. Please try again later.',
        error: true
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ban Appeal Form
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please explain why you believe your ban should be reconsidered
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                Discord User ID
              </label>
              <input
                id="userId"
                type="text"
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                value={formData.userId}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Discord Username
              </label>
              <input
                id="username"
                type="text"
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                value={formData.username}
              />
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Ban (if known)
              </label>
              <input
                id="reason"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                placeholder="If you know why you were banned, please state it here"
              />
            </div>

            <div>
              <label htmlFor="appeal" className="block text-sm font-medium text-gray-700">
                Your Appeal
              </label>
              <textarea
                id="appeal"
                required
                rows={6}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.appeal}
                onChange={(e) => setFormData({...formData, appeal: e.target.value})}
                placeholder="Please explain why you should be unbanned. Be honest and detailed in your explanation."
              />
            </div>
          </div>

          {submitStatus.message && (
            <div 
              className={`p-4 rounded-md ${
                submitStatus.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitStatus.isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${submitStatus.isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {submitStatus.isSubmitting ? 'Submitting...' : 'Submit Appeal'}
          </button>
        </form>
      </div>
    </div>
  );
}