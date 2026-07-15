import {
    LayoutDashboard,
    FileText,
    Brain,
    BarChart3,
    History,
    Settings,
    LogOut
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const menus = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            action: () => navigate("/dashboard"),
        },
        {
            title: "Resume",
            icon: FileText,
            action: () => navigate("/resume"),
        },
        {
            title: "AI Interview",
            icon: Brain,
            action: () => alert("Coming in Phase 4"),
        },
        {
            title: "Analytics",
            icon: BarChart3,
            action: () => alert("Coming in Phase 5"),
        },
        {
            title: "History",
            icon: History,
            action: () => alert("Coming in Phase 6"),
        },
        {
            title: "Settings",
            icon: Settings,
            action: () => alert("Coming in Phase 7"),
        }
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
                            <button
                                key={item.title}
                                onClick={item.action}
                                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-slate-800 transition mb-3"
                            >
                                <Icon size={22} />
                                <span>
                                    {item.title}
                                </span>
                            </button>
                        );
                    })
                }
            </nav>

            <div className="p-5 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 rounded-xl py-3 font-semibold"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;