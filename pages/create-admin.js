import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import Login from "./Login";
import LoadingSpinner from "@/components/Loading";

export default function CreateAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deleteAdminModal, setDeleteAdminModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {

      if (!session) {
      return;
    }

    // Check if user is not superAdmin, then redirect to home or other page
    if (session.user.role !== "superAdmin") {
      router.push("/");
    } else {
      fetchAdmins();
    }
  }, [session, status, router]);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/all");
      const data = await res.json();
      if (res.ok) {
        setAdminUsers(data.admins);
      } else {
        toast.error(data.message || "Failed to load admins.");
      }
    } catch (error) {
      toast.error("Error fetching admin users.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.status === 201) {
        toast.success(data.message);
        localStorage.setItem("token", data.token); // Save the token to localStorage
        setEmail("");
        setPassword("");
        setRole("admin");
        fetchAdmins();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error creating admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;

    try {
      const res = await fetch(`/api/admin/delete?id=${adminToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchAdmins();
      } else {
        toast.error("Error deleting admin: " + data.message);
      }
    } catch (error) {
      toast.error("Error deleting admin.");
    } finally {
      setLoading(false);
      setDeleteAdminModal(false);
      setAdminToDelete(null);
    }
  };

  return (
    <Login>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-12 w-full max-w-6xl p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              {/* Delete Admin Modal */}
              {deleteAdminModal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center w-96">
                    <h1 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                      Are you sure you want to delete admin <b>{adminToDelete?.email || "N/A"}</b>?
                      This action is <span className="text-red-600 font-bold">irreversible</span>.
                    </h1>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => setDeleteAdminModal(false)}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAdmin}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Left: Create Admin Form */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-left text-gray-800 dark:text-white mb-6">
                  Create New Admin
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className=" w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="superAdmin">Super Admin</option>
                      <option value="registrar">Registrar</option>
                      <option value="accountant">Accountant</option>
                      <option value="programHeads">Program Heads</option>
                    </select> 
                  </div>
                  <button
                    type="submit"
                    className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all disabled:bg-gray-400 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                        </svg>
                        Create Admin
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right: Admin List */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Admin Users</h2>
                {adminUsers.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">No admin users found.</p>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg border dark:border-gray-600">
                    {adminUsers.map((admin) => (
                      <li
                        key={admin._id}
                        className="p-4 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      >
                        <div>
                          <p className="text-gray-900 dark:text-white">{admin.email}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{admin.role}</p>
                        </div>
                        <button
                          onClick={() => {
                            setAdminToDelete(admin._id);
                            setDeleteAdminModal(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-200 hover:bg-red-400 text-red-600 rounded-md text-sm font-medium transition-all duration-200 dark:text-red-700 dark:hover:bg-red-600 dark:hover:text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            viewBox="0 -960 960 960"
                            fill="currentColor"
                          >
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                          </svg>
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Login>
  );
}
