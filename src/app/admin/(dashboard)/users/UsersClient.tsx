"use client";

import { useState, useTransition } from "react";
import { 
  createUser, 
  updateUserRole, 
  toggleUserStatus, 
  resetPassword 
} from "./actions";

export default function UsersClient({ users, currentUserRole }: { users: any[]; currentUserRole: string }) {
  const [isPending, startTransition] = useTransition();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: "", email: "", password: "", role: "EDITOR" });
  
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createUser(newUserData);
      if (res.success) {
        setIsAddingUser(false);
        setNewUserData({ name: "", email: "", password: "", role: "EDITOR" });
        alert("User added successfully");
      } else {
        alert(res.error || "Failed to add user");
      }
    });
  };

  const handleRoleChange = (id: string, role: string) => {
    if (confirm(`Are you sure you want to change this user's role to ${role}?`)) {
      startTransition(async () => {
        const res = await updateUserRole(id, role);
        if (!res.success) alert(res.error || "Failed to update role");
      });
    }
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    if (confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      startTransition(async () => {
        const res = await toggleUserStatus(id, !currentStatus);
        if (!res.success) alert(res.error || "Failed to update status");
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUserId) return;
    
    startTransition(async () => {
      const res = await resetPassword(resettingUserId, newPassword);
      if (res.success) {
        setResettingUserId(null);
        setNewPassword("");
        alert("Password reset successfully");
      } else {
        alert(res.error || "Failed to reset password");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-gray-900">Admin Users</h2>
          <p className="text-gray-500 text-sm mt-1">Manage administrators, editors, and access roles.</p>
        </div>
        <button
          onClick={() => setIsAddingUser(!isAddingUser)}
          className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {isAddingUser ? "Cancel" : "Add User"}
        </button>
      </div>

      {isAddingUser && (
        <form onSubmit={handleAddUser} className="bg-white p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Add New Admin User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                required
                type="text"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-black focus:border-black"
                value={newUserData.name}
                onChange={e => setNewUserData({...newUserData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                required
                type="email"
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-black focus:border-black"
                value={newUserData.email}
                onChange={e => setNewUserData({...newUserData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                required
                type="password"
                minLength={6}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-black focus:border-black"
                value={newUserData.password}
                onChange={e => setNewUserData({...newUserData, password: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-black focus:border-black"
                value={newUserData.role}
                onChange={e => setNewUserData({...newUserData, role: e.target.value})}
              >
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
                {currentUserRole === 'SUPER_ADMIN' && <option value="SUPER_ADMIN">Super Admin</option>}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="mt-4 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            Create User
          </button>
        </form>
      )}

      {resettingUserId && (
        <form onSubmit={handleResetPassword} className="bg-gray-100 p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Reset Password</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                required
                type="password"
                minLength={6}
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-black focus:border-black"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setResettingUserId(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className={user.isActive ? "" : "bg-gray-50"}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    disabled={isPending || (currentUserRole === 'ADMIN' && user.role === 'SUPER_ADMIN')}
                    className="text-sm border-gray-300 rounded-none focus:ring-black focus:border-black py-1"
                  >
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN" disabled={currentUserRole !== 'SUPER_ADMIN' && user.role !== 'SUPER_ADMIN'}>Super Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                    disabled={isPending || (currentUserRole === 'ADMIN' && user.role === 'SUPER_ADMIN')}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setResettingUserId(user._id)}
                    disabled={isPending || (currentUserRole === 'ADMIN' && user.role === 'SUPER_ADMIN')}
                    className="text-gray-600 hover:text-black mr-4 disabled:opacity-30"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
