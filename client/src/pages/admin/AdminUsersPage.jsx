import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await api.patch(`/admin/users/${user._id}`, { status: newStatus });
      if (res.data.success) {
        showToast(
          `Account for "${user.name}" is now ${newStatus}.`,
          newStatus === 'active' ? 'success' : 'info'
        );
        fetchUsers();
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      !searchFilter.trim() ||
      u.name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#A3481D] block mb-0.5">
              Access Control
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              User Accounts ({users.length})
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Manage customer, seller, and administrator accounts.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search name, email, or role..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl py-2.5 pl-9 pr-4 text-xs"
            />
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-400" />
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 animate-pulse h-64" />
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-[#FAF5EE] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4 pl-6">User Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-stone-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#FAF2EC] text-[#A3481D] flex items-center justify-center font-bold text-xs uppercase">
                            {u.name?.charAt(0)}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-stone-600">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'seller'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-stone-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {u.email !== 'admin@craftlk.com' && (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`py-1.5 px-3.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                              u.status === 'active'
                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
