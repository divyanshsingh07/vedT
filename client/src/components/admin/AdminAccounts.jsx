import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import toast from 'react-hot-toast';

const AdminAccounts = () => {
  const { axios } = useAppContext();
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminAccounts();
  }, []);

  const fetchAdminAccounts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/admin-accounts');
      
      if (data.success) {
        setAdminAccounts(data.adminAccounts);
      } else {
        toast.error('Failed to fetch admin accounts');
      }
    } catch (error) {
      console.error('Error fetching admin accounts:', error);
      toast.error('Failed to fetch admin accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (email) => {
    if (!window.confirm(`Are you sure you want to delete the admin account: ${email}?`)) {
      return;
    }

    try {
      const { data } = await axios.delete('/api/admin/admin-account', {
        data: { email }
      });
      
      if (data.success) {
        toast.success(data.message);
        fetchAdminAccounts(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting admin account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete admin account');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-border p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-heading">Admin Accounts</h2>
        <button
          onClick={fetchAdminAccounts}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-bold uppercase tracking-wide"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-border border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-xs sm:text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-bold text-heading uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-bold text-heading uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-bold text-heading uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-3 text-left font-bold text-heading uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border">
              {adminAccounts.map((admin, index) => (
                <tr key={index} className="hover:bg-accent-soft">
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap font-bold text-heading">
                    {admin.name}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-muted font-semibold">
                    {admin.email}
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-[11px] sm:text-xs font-bold rounded-full bg-accent text-white">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteAdmin(admin.email)}
                      className="inline-flex items-center justify-center text-red-600 hover:text-red-800 transition-colors duration-200 border border-red-600 hover:border-red-800 px-2 py-1 rounded"
                      title="Delete Admin Account"
                    >
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 p-4 bg-slate-50 border border-border rounded-lg">
        <h3 className="text-sm font-bold text-heading mb-2">Login Credentials:</h3>
        <div className="space-y-2 text-sm text-muted font-semibold">
          <p><strong>Blog Manager:</strong> manager@example.com / manager123</p>
          <p><strong>Test Account:</strong> test@example.com / test123</p>
          <p><strong>Demo User:</strong> demo@example.com / demo123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAccounts;
