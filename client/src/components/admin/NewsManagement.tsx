import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { newsService, type News } from "../../services/newsService";

interface NewsFormData {
  title: string;
  content: string;
  image: File | null;
}

const NewsManagement: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    image: null,
  });
  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAllNews();
      setNews(data);
    } catch (error) {
      toast.error("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (isEditing && selectedNews) {
        await newsService.updateNews(selectedNews._id, formDataToSend);
        toast.success("News updated successfully");
      } else {
        await newsService.createNews(formDataToSend);
        toast.success("News created successfully");
      }

      fetchNews();
      resetForm();
    } catch (error) {
      toast.error("Failed to save news");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;

    try {
      setLoading(true);
      await newsService.deleteNews(id);
      toast.success("News deleted successfully");
      fetchNews();
    } catch (error) {
      toast.error("Failed to delete news");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsItem: News) => {
    setSelectedNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      image: null,
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", image: null });
    setSelectedNews(null);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">News Management</h2>

      {/* News Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit News" : "Add New News"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full"
              accept="image/*"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {loading ? "Saving..." : isEditing ? "Update News" : "Add News"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      {/* News List */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold p-6 border-b">News List</h3>
        {loading && <div className="p-6 text-center">Loading...</div>}
        {!loading && news.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No news articles found
          </div>
        )}
        {!loading && news.length > 0 && (
          <div className="divide-y">
            {news.map((item) => (
              <div
                key={item._id}
                className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsManagement;
