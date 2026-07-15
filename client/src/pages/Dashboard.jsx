import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import HomeSection from "./dashboard/HomeSection";
import ResumeSection from "./dashboard/ResumeSection";
import InterviewSection from "./dashboard/InterviewSection";
import AnalyticsSection from "./dashboard/AnalyticsSection";
import HistorySection from "./dashboard/HistorySection";
import SettingsSection from "./dashboard/SettingsSection";

function Dashboard() {
    return (
        <Routes>
            <Route element={<DashboardLayout />}>
                <Route
                    path="/"
                    element={<Navigate to="home" replace />}
                />
                <Route
                    path="home"
                    element={<HomeSection />}
                />
                <Route
                    path="resume"
                    element={<ResumeSection />}
                />
                <Route
                    path="interview"
                    element={<InterviewSection />}
                />
                <Route
                    path="analytics"
                    element={<AnalyticsSection />}
                />
                <Route
                    path="history"
                    element={<HistorySection />}
                />
                <Route
                    path="settings"
                    element={<SettingsSection />}
                />
            </Route>
        </Routes>
    );
}

export default Dashboard;