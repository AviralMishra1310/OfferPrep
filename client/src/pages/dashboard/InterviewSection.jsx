import { useState } from "react";
import api from "../../api/api";

function InterviewSection() {
    const [role, setRole] = useState("Software Development Engineer");
    const [difficulty, setDifficulty] = useState("Medium");
    const [totalQuestions, setTotalQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [questions, setQuestions] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState("");

    const startInterview = async () => {
        try {
            setLoading(true);
            setMessage("");
            setQuestions([]);
            setCurrentQuestion(0);
            setAnswer("");

            const sessionResponse = await api.post("/interview/start", {
                role,
                difficulty,
                total_questions: totalQuestions,
            });

            setSessionId(sessionResponse.data.id);

            const response = await api.get(
                `/interview/questions?count=${totalQuestions}`
            );

            setQuestions(response.data);
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

    const nextQuestion = async () => {
        try {
            await api.post("/interview/answer", {
                session_id: sessionId,
                question_id: questions[currentQuestion].id,
                question: questions[currentQuestion].question,
                answer: answer,
            });

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setAnswer("");
            } else {
                setMessage("Interview completed successfully.");
                setQuestions([]);
                setCurrentQuestion(0);
                setAnswer("");
            }
        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Failed to save answer."
            );
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
                        onChange={(e) =>
                            setTotalQuestions(Number(e.target.value))
                        }
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
                    {loading ? "Starting..." : "Start Interview"}
                </button>

                {message && (
                    <p className="mt-5 text-center text-green-600">
                        {message}
                    </p>
                )}
            </div>

            {questions.length > 0 && (
                <div className="bg-white rounded-xl shadow p-8 mt-8">
                    <h2 className="text-2xl font-bold mb-4">
                        Question {currentQuestion + 1} of {questions.length}
                    </h2>

                    <p className="text-lg font-medium mb-6">
                        {questions[currentQuestion].question}
                    </p>

                    <textarea
                        rows={6}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Write your answer here..."
                        className="w-full border rounded-lg p-4"
                    />

                    <button
                        onClick={nextQuestion}
                        className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                    >
                        {currentQuestion === questions.length - 1
                            ? "Submit Interview"
                            : "Next"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default InterviewSection;