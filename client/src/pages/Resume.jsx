import { useRef, useState } from "react";
import api from "../api/api";
import {
    Upload,
    FileText,
    CheckCircle,
    Trash2,
    RefreshCcw
} from "lucide-react";

function Resume() {

    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    const inputRef = useRef(null);

    const handleChange = (e) => {

        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setMessage("");
        }

    };

    const handleRemove = () => {
        setFile(null);
        setMessage("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            const res = await api.post(
                "/resume/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setMessage(res.data.message);
        }catch (err) {
            setMessage(
                err.response?.data?.detail ||
                "Upload Failed"
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex justify-center items-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-10">
                <h1 className="text-4xl font-bold text-center text-gray-800">
                    Resume Management
                </h1>

                <p className="text-center text-gray-500 mt-3 mb-10">
                    Upload your latest resume (PDF only, Max 5 MB)
                </p>

                <div
                    onClick={() => inputRef.current.click()}
                    className="border-2 border-dashed border-blue-400 rounded-2xl p-12 cursor-pointer hover:bg-blue-50 hover:border-blue-600 transition-all duration-300"
                >
                    <div className="flex flex-col items-center">
                        <div className="bg-blue-100 rounded-full p-5">
                            <Upload
                                size={55}
                                className="text-blue-600"
                            />
                        </div>
                        <h2 className="text-2xl font-semibold mt-6 text-gray-800">
                            Drag & Drop Resume Here
                        </h2>
                        <p className="text-gray-500 my-4">
                            OR
                        </p>
                        <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 transition text-white px-7 py-3 rounded-xl font-semibold shadow-md"
                        >
                            Choose Resume
                        </button>

                        <p className="text-gray-400 text-sm mt-5">
                            Supported Format : PDF
                        </p>

                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleChange}
                            className="hidden"
                        />

                    </div>

                </div>

                <div className="mt-10">

                    <h2 className="text-xl font-semibold mb-5">
                        Selected Resume
                    </h2>

                    {
                        file ?

                            <div className="flex justify-between items-center bg-green-50 border border-green-300 rounded-2xl p-5">

                                <div className="flex gap-4 items-center">

                                    <FileText
                                        size={40}
                                        className="text-blue-600"
                                    />

                                    <div>

                                        <p className="font-semibold text-lg">
                                            {file.name}
                                        </p>

                                        <p className="text-gray-500">
                                            {(file.size / 1024).toFixed(2)} KB
                                        </p>

                                    </div>

                                </div>

                                <div className="flex items-center gap-3">

                                    <CheckCircle
                                        className="text-green-600"
                                        size={28}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => inputRef.current.click()}
                                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        <RefreshCcw size={18} />
                                        Replace
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleRemove}
                                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                        Remove
                                    </button>

                                </div>

                            </div>

                            :

                            <div className="border rounded-xl bg-gray-50 py-8 text-center text-gray-500">

                                No Resume Selected

                            </div>

                    }

                </div>
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`mt-10 w-full py-4 rounded-xl text-lg font-semibold transition duration-300 ${
                        file && !uploading
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {
                        uploading
                            ? "Uploading..."
                            : "Upload Resume"
                    }
                </button>
                {
                    message && (
                        <p className="text-center mt-5 font-semibold text-green-600">
                            {message}
                        </p>
                    )
                }
                <div className="mt-10 border-t pt-8">
                    <h2 className="text-xl font-semibold">
                        Uploaded Resume
                    </h2>
                    <div className="mt-4 bg-gray-50 rounded-xl border p-6 text-gray-500 text-center">
                        No Resume Uploaded Yet
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Resume;