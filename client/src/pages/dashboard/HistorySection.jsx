import { useEffect, useState } from "react";
import api from "../../api/api";

function HistorySection() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await api.get("/interview/history");
            setHistory(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <h2 className="text-xl font-semibold">
                Loading...
            </h2>
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">
                Interview History
            </h1>
            {
                history.length === 0 ? (
                    <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-8">
                        <h2 className="text-2xl font-semibold">
                            No Interviews Found
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Start your first interview to see history here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {
                            history.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow p-6"
                                >
                                    <div className="flex justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                {item.role}
                                            </h2>
                                            <p className="text-gray-600 mt-2">
                                                Difficulty :
                                                {" "}
                                                {item.difficulty}
                                            </p>
                                            <p className="text-gray-600">
                                                Questions :
                                                {" "}
                                                {item.total_questions}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <span
                                                className={`px-3 py-1 rounded-full text-white ${
                                                    item.status === "completed"
                                                        ? "bg-green-600"
                                                        : "bg-blue-600"
                                                }`}
                                            >
                                                {item.status}
                                            </span>
                                            <p className="mt-3 text-sm text-gray-500">
                                                {
                                                    new Date(
                                                        item.created_at
                                                    ).toLocaleString()
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}

export default HistorySection;