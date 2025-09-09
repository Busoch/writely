import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch profile and writings when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("profile/");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Delete a writing
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this writing?")) return;

    try {
      await API.delete(`writing/${id}/`);
      setProfile((prev) => ({
        ...prev,
        writings: prev.writings.filter((w) => w.id !== id),
      }));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete writing. Please try again.");
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  if (loading) return <div className="container"><p>Loading profile...</p></div>;
  if (error) return <div className="container text-red-500">{error}</div>;

  return (
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Your Writings</h2>

      {profile && profile.writings?.length > 0 ? (
        <ul className="space-y-4">
          {profile.writings.map((w) => (
            <li key={w.id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <strong>{w.title}</strong>
                  <p className="text-sm text-gray-600">{w.category}</p>
                </div>
                <div className="flex space-x-3">
                  <a
                    href={w.document}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleEdit(w.id)}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven’t uploaded any writings yet.</p>
      )}
    </div>
  );
};

export default Profile;
