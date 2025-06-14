import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import api from "../api";
import { fetchBikes } from "../slices/bikeSlice";
import NewsManagement from "../components/admin/NewsManagement";
import UserManagement from "../components/admin/UserManagement";
import { toast } from "react-toastify";
import type { User } from "../types";
import { userService } from "../services/userService";

const AdminPanel: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { bikes } = useSelector((state: RootState) => state.bikes);
  const dispatch = useDispatch();
  const [tab, setTab] = useState<
    "dashboard" | "bikes" | "users" | "orders" | "news"
  >("dashboard");
  const [dashboard, setDashboard] = useState<{
    users: number;
    bikes: number;
    orders: number;
    news: number;
  } | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    specifications: "",
    images: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [newsForm, setNewsForm] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    tags: "",
    status: "published",
  });
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  useEffect(() => {
    dispatch(fetchBikes({}) as any);
    api.get("/admin/dashboard").then((res) => setDashboard(res.data));
    if (tab === "users") {
      fetchUsers();
    }
  }, [dispatch, tab]);
  const fetchUsers = async () => {
    try {
      const users = await userService.getAllUsers();
      setUsers(users);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };
  const fetchOrders = async () => {
    const res = await api.get("/admin/orders");
    setOrders(res.data);
  };
  const fetchNews = async () => {
    try {
      const response = await api.get("/news?status=all");
      setNewsList(response.data.news);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    if (tab === "users") fetchUsers();
    if (tab === "orders") fetchOrders();
    if (tab === "news") {
      fetchNews();
    }
  }, [tab]);

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-red-500">Access denied. Admins only.</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        images: form.images ? form.images.split(",") : [],
        specifications: form.specifications
          ? Object.fromEntries(
              form.specifications.split(",").map((kv) => {
                const [k, v] = kv.split(":");
                return [k.trim(), v.trim()];
              })
            )
          : {},
      };
      if (editingId) {
        await api.patch(`/bikes/${editingId}`, payload);
      } else {
        await api.post("/bikes", payload);
      }
      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
        specifications: "",
        images: "",
      });
      setEditingId(null);
      dispatch(fetchBikes({}) as any);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save bike");
    }
    setLoading(false);
  };

  const handleEdit = (bike: any) => {
    setEditingId(bike._id);
    setForm({
      title: bike.title,
      description: bike.description,
      price: String(bike.price),
      category: bike.category || "",
      specifications: bike.specifications
        ? Object.entries(bike.specifications)
            .map(([k, v]) => `${k}:${v}`)
            .join(",")
        : "",
      images: bike.images ? bike.images.join(",") : "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/bikes/${id}`);
      dispatch(fetchBikes({}) as any);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete bike");
    }
    setLoading(false);
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newsForm).forEach(([key, value]) => {
        if (key === "tags") {
          formData.append(
            key,
            JSON.stringify(value.split(",").map((tag) => tag.trim()))
          );
        } else {
          formData.append(key, value);
        }
      });

      if (selectedNews) {
        await api.put(`/news/${selectedNews._id}`, formData);
      } else {
        await api.post("/news", formData);
      }

      setNewsForm({
        title: "",
        description: "",
        content: "",
        image: "",
        tags: "",
        status: "published",
      });
      setSelectedNews(null);
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const handleNewsDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await api.delete(`/news/${id}`);
        fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const handleBlockUser = async (userId: string) => {
    try {
      setLoading(true);
      const user = users.find((u) => u._id === userId);
      await api.put(`/admin/users/${userId}/block`, {
        isBlocked: !user?.isBlocked,
      });
      toast.success(
        `User ${user?.isBlocked ? "unblocked" : "blocked"} successfully`
      );
      await fetchUsers();
    } catch (error) {
      toast.error("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };
  const handleChangeRole = async (userId: string, role: string) => {
    try {
      setLoading(true);
      await userService.changeRole(userId, role);
      toast.success("User role updated successfully");
      await fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      await userService.deleteUser(userId);
      toast.success("User deleted successfully");
      await fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-primary-50 rounded-xl p-6 shadow text-center border border-primary-100">
        <div className="text-4xl font-bold text-primary-700 mb-2">
          {dashboard?.bikes}
        </div>
        <div className="text-lg text-primary-900">Bikes</div>
      </div>
      <div className="bg-primary-50 rounded-xl p-6 shadow text-center border border-primary-100">
        <div className="text-4xl font-bold text-primary-700 mb-2">
          {dashboard?.users}
        </div>
        <div className="text-lg text-primary-900">Users</div>
      </div>
      <div className="bg-primary-50 rounded-xl p-6 shadow text-center border border-primary-100">
        <div className="text-4xl font-bold text-primary-700 mb-2">
          {dashboard?.orders}
        </div>
        <div className="text-lg text-primary-900">Orders</div>
      </div>
    </div>
  );

  const renderBikesTab = () => (
    <>
      <div className="bg-white rounded shadow p-4 mb-8 border border-primary-100">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Bike" : "Add New Bike"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Select Category</option>
                <option value="Sport">Sport</option>
                <option value="Cruiser">Cruiser</option>
                <option value="Adventure">Adventure</option>
                <option value="Touring">Touring</option>
                <option value="Naked">Naked</option>
                <option value="Dual Sport">Dual Sport</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images (comma-separated URLs)
              </label>
              <input
                type="text"
                name="images"
                value={form.images}
                onChange={handleChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specifications (key:value, comma-separated)
            </label>
            <textarea
              name="specifications"
              value={form.specifications}
              onChange={handleChange}
              rows={4}
              placeholder="Engine: 1000cc, Power: 180hp, Torque: 90Nm"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Format: key1:value1, key2:value2, key3:value3
            </p>
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-4">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm({
                    title: "",
                    description: "",
                    price: "",
                    category: "",
                    specifications: "",
                    images: "",
                  });
                  setEditingId(null);
                }}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
              {loading ? "Saving..." : editingId ? "Update Bike" : "Add Bike"}
            </button>
          </div>
        </form>
      </div>

      {/* Bikes List */}
      <div className="bg-white rounded shadow p-4 border border-primary-100">
        <h3 className="text-lg font-semibold mb-4">Available Bikes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bike
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bikes.map((bike) => (
                <tr key={bike._id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {bike.images?.[0] && (
                        <img
                          src={bike.images[0]}
                          alt={bike.title}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {bike.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
                      {bike.category || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    ${bike.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(bike)}
                      className="text-primary-600 hover:text-primary-800 mr-4">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bike._id)}
                      className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderUsersTab = () => (
    <div className="bg-white rounded shadow p-4 border border-primary-100">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="py-2 px-4">{u.name}</td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4">{u.role}</td>
                <td className="py-2 px-4">
                  {u.isActive ? "Active" : "Inactive"}
                </td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleBlockUser(u._id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      u.isBlocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() =>
                      handleChangeRole(
                        u._id,
                        u.role === "admin" ? "user" : "admin"
                      )
                    }
                    className="ml-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="ml-2 px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="bg-white rounded shadow p-4 border border-primary-100">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Buyer</th>
              <th className="py-2 px-4">Bike</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="py-2 px-4">{o._id.slice(-6)}</td>
                <td className="py-2 px-4">{o.buyer?.name || o.buyer}</td>
                <td className="py-2 px-4">{o.bike?.title || o.bike}</td>
                <td className="py-2 px-4">{o.status}</td>
                <td className="py-2 px-4">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNewsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded shadow p-4 mb-8 border border-primary-100">
        <h2 className="text-xl font-semibold mb-4">
          {selectedNews ? "Edit News" : "Add New News"}
        </h2>
        <form onSubmit={handleNewsSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={newsForm.title}
              onChange={(e) =>
                setNewsForm({ ...newsForm, title: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={newsForm.description}
              onChange={(e) =>
                setNewsForm({ ...newsForm, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={newsForm.content}
              onChange={(e) =>
                setNewsForm({ ...newsForm, content: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={newsForm.image}
              onChange={(e) =>
                setNewsForm({ ...newsForm, image: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={newsForm.tags}
              onChange={(e) =>
                setNewsForm({ ...newsForm, tags: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="news, latest, updates"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={newsForm.status}
              onChange={(e) =>
                setNewsForm({ ...newsForm, status: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-4">
            {selectedNews && (
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
              {selectedNews ? "Update News" : "Add News"}
            </button>
          </div>
        </form>
      </div>

      {/* News List */}
      <div className="bg-white rounded shadow p-4 border border-primary-100">
        <h3 className="text-lg font-semibold mb-4">News Articles</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {newsList.map((news) => (
                <tr key={news._id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {news.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        news.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {news.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedNews(news);
                        setNewsForm({
                          title: news.title,
                          description: news.description,
                          content: news.content,
                          image: news.image,
                          tags: news.tags.join(", "),
                          status: news.status,
                        });
                      }}
                      className="text-primary-600 hover:text-primary-800 mr-4">
                      Edit
                    </button>
                    <button
                      onClick={() => handleNewsDelete(news._id)}
                      className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Dashboard Stats */}
        {dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">
                Total Users
              </h3>
              <p className="text-3xl font-bold">{dashboard.users}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">
                Total Bikes
              </h3>
              <p className="text-3xl font-bold">{dashboard.bikes}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">
                Total Orders
              </h3>
              <p className="text-3xl font-bold">{dashboard.orders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">
                Total News
              </h3>
              <p className="text-3xl font-bold">{dashboard.news || 0}</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6 border-b">
          <nav className="flex space-x-4">
            <button
              onClick={() => setTab("dashboard")}
              className={`py-2 px-4 ${
                tab === "dashboard"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              Dashboard
            </button>
            <button
              onClick={() => setTab("users")}
              className={`py-2 px-4 ${
                tab === "users"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              Users
            </button>
            <button
              onClick={() => setTab("bikes")}
              className={`py-2 px-4 ${
                tab === "bikes"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              Bikes
            </button>
            <button
              onClick={() => setTab("orders")}
              className={`py-2 px-4 ${
                tab === "orders"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              Orders
            </button>
            <button
              onClick={() => setTab("news")}
              className={`py-2 px-4 ${
                tab === "news"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}>
              News
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {" "}
          {tab === "dashboard" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                Welcome to the Admin Dashboard
              </h2>
              <p className="text-gray-600">
                Select a tab above to manage users, bikes, orders, and news
                content.
              </p>
            </div>
          )}
          {tab === "users" && (
            <UserManagement
              users={users}
              onBlockUser={handleBlockUser}
              onChangeRole={handleChangeRole}
              onDeleteUser={handleDeleteUser}
            />
          )}
          {tab === "bikes" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Bike Management</h2>
              {/* Bike management content */}
            </div>
          )}
          {tab === "orders" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Order Management</h2>
              {/* Order management content */}
            </div>
          )}{" "}
          {tab === "news" && <NewsManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
