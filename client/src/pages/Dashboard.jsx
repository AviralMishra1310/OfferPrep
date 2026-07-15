import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/api";

import DashboardLayout from "../layouts/DashboardLayout";
import ProfileCard from "../components/dashboard/ProfileCard";
import ResumeCard from "../components/dashboard/ResumeCard";

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-2xl">
                Loading...
            </div>
        );
    }
    return (
        <DashboardLayout>
            <div>
                <h1 className="text-4xl font-bold">
                    Welcome, {user.name} 👋
                </h1>
                <p className="text-gray-500 mt-2">
                    Manage your interview preparation from one place.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                <ProfileCard user={user} />
                <ResumeCard />
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;