import {
    LayoutDashboard,
    FileText,
    Brain,
    BarChart3,
    History,
    Settings,
    LogOut
} from "lucide-react";

function Sidebar() {

    const menus = [
        {
            title: "Dashboard",
            icon: LayoutDashboard
        },
        {
            title: "Resume",
            icon: FileText
        },
        {
            title: "AI Interview",
            icon: Brain
        },
        {
            title: "Analytics",
            icon: BarChart3
        },
        {
            title: "History",
            icon: History
        },
        {
            title: "Settings",
            icon: Settings
        }
    ];

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
                                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl hover:bg-slate-800 transition mb-3"
                            >
                                <Icon size={22} />
                                <span className="font-medium">
                                    {item.title}
                                </span>
                            </button>
                        );
                    })
                }
            </nav>

            <div className="p-5 border-t border-slate-700">
                <button
                    className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 transition rounded-xl py-3 font-semibold"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;