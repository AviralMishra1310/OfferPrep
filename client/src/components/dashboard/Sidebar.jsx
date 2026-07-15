import {
    LayoutDashboard,
    FileText,
    Brain,
    BarChart3,
    History,
    Settings,
    LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const menus = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard/home",
        },
        {
            title: "Resume",
            icon: FileText,
            path: "/dashboard/resume",
        },
        {
            title: "AI Interview",
            icon: Brain,
            path: "/dashboard/interview",
        },
        {
            title: "Analytics",
            icon: BarChart3,
            path: "/dashboard/analytics",
        },
        {
            title: "History",
            icon: History,
            path: "/dashboard/history",
        },
        {
            title: "Settings",
            icon: Settings,
            path: "/dashboard/settings",
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col">
            <div className="p-8 border-b border-slate-700">
                <h1 className="text-3xl font-bold">
                    OfferPrep
                </h1>
                <p className="text-slate-400 mt-2">
                    Interview Preparation Platform
                </p>
            </div>
            <nav className="flex-1 px-5 py-6">
                {
                    menus.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.title}
                                to={item.path}
                                className={({ isActive }) =>
                                    `w-full flex items-center gap-4 px-5 py-4 rounded-xl mb-3 transition ${
                                        isActive
                                            ? "bg-blue-600"
                                            : "hover:bg-slate-800"
                                    }`
                                }
                            >
                                <Icon size={22} />
                                {item.title}
                            </NavLink>
                        );
                    })
                }
            </nav>
            <div className="p-5 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 flex justify-center items-center gap-2"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;