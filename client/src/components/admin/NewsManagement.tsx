import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { newsService, type News } from "../../services/newsService";

interface NewsFormData {
  title: string;
  content: string;
  description: string;
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
    description: "",
    image: null,
  });

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAllNews();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
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
      const file = e.target.files[0];
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      // Validate file type
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        )
      ) {
        toast.error("Only JPEG, JPG, PNG and WEBP images are allowed");
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }
    if (!formData.image && !isEditing) {
      toast.error("Image is required");
      return;
    }

    try {
      setLoading(true);

      // Create FormData object
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("content", formData.content.trim());

      // Only append image if it exists
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Log form data for debugging
      console.log("Form data being sent:", {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        hasImage: !!formData.image,
      });

      if (isEditing && selectedNews) {
        await newsService.updateNews(selectedNews._id, formDataToSend);
        toast.success("News updated successfully");
      } else {
        await newsService.createNews(formDataToSend);
        toast.success("News created successfully");
      }

      // Reset form and fetch updated news list
      setFormData({
        title: "",
        content: "",
        description: "",
        image: null,
      });
      setIsEditing(false);
      setSelectedNews(null);
      await fetchNews();
    } catch (error: any) {
      console.error("Error submitting news:", error);
      toast.error(error.message || "Failed to submit news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            required={!isEditing}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50">
          {loading ? "Saving..." : isEditing ? "Update News" : "Add News"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setSelectedNews(null);
              setFormData({
                title: "",
                content: "",
                description: "",
                image: null,
              });
            }}
            className="ml-4 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
        )}
      </form>

      {/* News List */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">News List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : news.length === 0 ? (
          <p>No news articles found.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {news.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setSelectedNews(item);
                      setFormData({
                        title: item.title,
                        content: item.content,
                        description: item.description,
                        image: null,
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this news article?"
                        )
                      ) {
                        try {
                          await newsService.deleteNews(item._id);
                          toast.success("News deleted successfully");
                          fetchNews();
                        } catch (error) {
                          toast.error("Failed to delete news");
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-800">
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
