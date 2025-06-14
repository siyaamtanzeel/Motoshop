import React, { useState, useEffect } from "react";
import { User } from "../../types";
import {
  UserCircleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface UserManagementProps {
  users: User[];
  onBlockUser: (userId: string) => Promise<void>;
  onChangeRole: (userId: string, role: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onBlockUser,
  onChangeRole,
  onDeleteUser,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">User Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <UserCircleIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => onChangeRole(user._id, e.target.value)}
                      className="text-sm rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onBlockUser(user._id)}
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        user.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onBlockUser(user._id)}
                        className="text-gray-600 hover:text-gray-900"
                        title={user.isBlocked ? "Unblock User" : "Block User"}>
                        {user.isBlocked ? (
                          <ShieldCheckIcon className="h-5 w-5" />
                        ) : (
                          <ShieldExclamationIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
