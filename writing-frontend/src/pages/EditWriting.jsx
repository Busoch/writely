import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const EditWriting = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    category: "",
    document: null,
  });

  const [originalDocURL, setOriginalDocURL] = useState("");
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch writing details and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [writingRes, catRes] = await Promise.all([
          API.get(`writing/${id}/`),
          API.get("categories/"),
        ]);

        const w = writingRes.data;
        setData({
          title: w.title,
          category: w.category.name,
          document: null,
        });
        setOriginalDocURL(w.document);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to fetch writing or categories", err);
        setErrorMsg("Failed to load writing data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Form input handlers
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setData({ ...data, document: e.target.files[0] });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    if (!data.title || !data.category) {
      setErrorMsg("Title and category are required.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", data.category);
    if (data.document) {
      formData.append("document", data.document);
    }

    try {
      await API.patch(`writing/${id}/`, formData, {
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Writing updated successfully!");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      console.error("Update failed", err);
      setErrorMsg("Failed to update writing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) return <div className="container">Loading writing...</div>;

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Edit Writing</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          value={data.title}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />

        <select
          name="category"
          value={data.category}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <div>
          <label className="block font-medium mb-1">Upload New File:</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        {!data.document && originalDocURL && (
          <p className="text-sm">
            Current File:{" "}
            <a
              href={originalDocURL}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View
            </a>
          </p>
        )}

        {progress > 0 && progress < 100 && (
          <p className="text-gray-600">Uploading: {progress}%</p>
        )}

        {errorMsg && <p className="text-red-600">{errorMsg}</p>}
        {successMsg && <p className="text-green-600">{successMsg}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditWriting;
