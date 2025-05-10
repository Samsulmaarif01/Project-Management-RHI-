import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(API_PATH.USER.GET_ALL);
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Manage Users">
      <div className="card my-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold">
            Manajemen Pengguna
          </h2>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Memuat data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse mt-3">
              <thead>
                <tr className="bg-slate-100 text-xs uppercase text-slate-600">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 text-sm text-slate-400"
                    >
                      Tidak ada data pengguna.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id} className="border-t text-sm">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2 capitalize">{user.role}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
