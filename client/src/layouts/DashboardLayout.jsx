import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

function DashboardLayout() {
    return (
        <div className="min-h-screen flex bg-slate-100">
            <Sidebar />
            <main className="flex-1 p-10 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;