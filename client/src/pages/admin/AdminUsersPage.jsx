import React, { useState, useEffect } from 'react';
import { Users, Shield, Check, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/dashboard/AdminSidebar';
import api from '../../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

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
        setMsg(`Account for "${user.name}" is now ${newStatus}.`);
        setTimeout(() => setMsg(''), 2500);
        fetchUsers();
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              User Accounts
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Manage customer, seller, and administrator accounts.
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            Total users: {users.length}
          </span>
        </div>

        {msg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

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
                  {users.map((u) => (
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
                          className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ${
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
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
                            className={`py-1 px-3 rounded-lg text-[11px] font-bold transition-colors ${
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
