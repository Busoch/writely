import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../api/axios';
import { FileText, File, FileArchive, FileSpreadsheet, FileType } from 'lucide-react';

const Upload = () => {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ title: '', category: '', document: null });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('categories/')
      .then((res) => setCategories(res.data))
      .catch(() => toast.error('Failed to load categories'));
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setData({ ...data, document: e.target.files[0] });
  };

  // ✅ Choose file icon based on extension
  const getFileIcon = () => {
    if (!data.document) return null;
    const ext = data.document.name.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="text-red-500 w-8 h-8" />;
      case 'doc':
      case 'docx':
        return <File className="text-blue-500 w-8 h-8" />;
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="text-green-500 w-8 h-8" />;
      case 'zip':
      case 'rar':
        return <FileArchive className="text-yellow-500 w-8 h-8" />;
      default:
        return <FileType className="text-gray-500 w-8 h-8" />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.title || !data.category || !data.document) {
      toast.error('Please fill all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('document', data.document);

    try {
      setLoading(true);
      setProgress(0);

      await API.post('writing/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        },
      });

      toast.success('Upload successful!');
      setData({ title: '', category: '', document: null });
      setTimeout(() => navigate('/'), 2000);
    } catch {
      toast.error('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4 shadow-lg rounded bg-white mt-6">
      <h2 className="text-xl font-semibold mb-4">Upload Writing</h2>
      <ToastContainer />

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={data.title}
          required
          className="border p-2 rounded"
        />

        <select
          name="category"
          onChange={handleChange}
          value={data.category}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex items-center space-x-3">
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="border p-2 rounded w-full"
          />
          {getFileIcon()}
        </div>

        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-4 text-xs text-white text-center"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default Upload;
