import { useEffect, useState } from 'react';
import API from '../api/axios';

// Import icons from Lucide
import { FileText, FileDown, File, Files } from 'lucide-react';

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return <FileDown className="w-10 h-10 text-red-500" />;
    case 'doc':
    case 'docx':
      return <Files className="w-10 h-10 text-blue-500" />;
    case 'txt':
      return <FileText className="w-10 h-10 text-gray-600" />;
    default:
      return <File className="w-10 h-10 text-gray-400" />;
  }
};

const Home = () => {
  const [writings, setWritings] = useState([]);

  useEffect(() => {
    API.get('writing/').then(res => setWritings(res.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Welcome Buddy
      </h2>

      {writings.length === 0 ? (
        <p className="text-gray-500 italic">No writings uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {writings.map(w => (
            <li
              key={w.id}
              className="flex items-center gap-5 p-4 border rounded-xl shadow-sm hover:shadow-md bg-white hover:bg-gray-50 transition duration-200"
            >
              <div className="flex-shrink-0">
                {getFileIcon(w.document)}
              </div>

              <div className="flex flex-col">
                <strong className="text-lg font-semibold text-gray-800">
                  {w.title}
                </strong>
                <span className="text-sm text-gray-500 mb-1">
                  {w.category}
                </span>
                <a
                  href={w.document}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Document →
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
