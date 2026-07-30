import { useState } from "react";
import api from "../../api/api";

function InterviewSection() {

    const [role, setRole] = useState("Software Development Engineer");
    const [difficulty, setDifficulty] = useState("Medium");
    const [totalQuestions, setTotalQuestions] = useState(5);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const startInterview = async () => {

        try {

            setLoading(true);
            setMessage("");

            await api.post("/interview/start", {
                role,
                difficulty,
                total_questions: totalQuestions,
            });

            setMessage("Interview session created successfully.");

        } catch (error) {

            setMessage(
                error.response?.data?.detail ||
                "Something went wrong."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div>

            <h1 className="text-4xl font-bold">
                AI Interview
            </h1>

            <div className="bg-white rounded-xl shadow p-8 mt-8 max-w-xl">

                <div className="mb-6">

                    <label className="block mb-2 font-medium">
                        Target Role
                    </label>

                    <select
                        className="w-full border rounded-lg p-3"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option>Software Development Engineer</option>
                        <option>Backend Developer</option>
                        <option>Frontend Developer</option>
                        <option>Machine Learning Engineer</option>
                        <option>Data Analyst</option>
                    </select>

                </div>

                <div className="mb-6">

                    <label className="block mb-2 font-medium">
                        Difficulty
                    </label>

                    <select
                        className="w-full border rounded-lg p-3"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>

                </div>

                <div className="mb-8">

                    <label className="block mb-2 font-medium">
                        Number of Questions
                    </label>

                    <select
                        className="w-full border rounded-lg p-3"
                        value={totalQuestions}
                        onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                    </select>

                </div>

                <button
                    onClick={startInterview}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700"
                >
                    {
                        loading
                            ? "Starting..."
                            : "Start Interview"
                    }
                </button>
                {
                    message &&
                    <p className="mt-5 text-center">
                        {message}
                    </p>
                }
            </div>
        </div>
    );
}

export default InterviewSection;