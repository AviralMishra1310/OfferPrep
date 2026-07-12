import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile");

        setUser(res.data);
      } catch (err) {
        console.log(err);

        localStorage.removeItem("token");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[420px]">

        <h1 className="text-3xl font-bold text-center mb-6">
          OfferPrep Dashboard
        </h1>

        <p className="text-xl mb-6 text-center">
          Welcome 👋
        </p>

        <div className="space-y-4">

          <div>
            <p className="font-semibold">
              Name
            </p>

            <p>{user.name}</p>
          </div>

          <div>
            <p className="font-semibold">
              Email
            </p>

            <p>{user.email}</p>
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Dashboard;