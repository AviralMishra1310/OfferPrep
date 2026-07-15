import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

function ResumeCard() {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">
                📄 Resume
            </h2>
            <p className="text-gray-600 mb-6">
                Upload and manage your latest resume.
            </p>
            <button
                onClick={() => navigate("/resume")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
            >
                <FileText size={20} />
                Resume Management
            </button>
        </div>
    );
}

export default ResumeCard;