import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import {
    Upload,
    FileText,
    CheckCircle,
    Trash2,
    RefreshCcw,
    Eye,
    ScanSearch,
    User,
    Mail,
    Phone,
    GraduationCap,
    BriefcaseBusiness,
    FolderKanban,
    Code2
} from "lucide-react";

function ResumeUploader() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadedResume, setUploadedResume] = useState(null);
    const [parsing, setParsing] = useState(false);
    const [candidateProfile, setCandidateProfile] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const loadResumeData = async () => {
            await fetchLatestResume();
            await fetchCandidateProfile();
        };
        loadResumeData();
    }, []);

    // =========================================================
    // FETCH LATEST RESUME
    // =========================================================
    const fetchLatestResume = async () => {
        try {
            const res = await api.get("/resume/latest");
            if (res.data) {
                setUploadedResume(res.data);
            } else {
                setUploadedResume(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    // =========================================================
    // FETCH SAVED CANDIDATE PROFILE
    // =========================================================

    const fetchCandidateProfile = async () => {
        try {
            const res = await api.get(
                "/resume/profile"
            );
            if (res.data) {
                setCandidateProfile(
                    res.data
                );
            } else {
                setCandidateProfile(null);
            }
        } catch (err) {
            console.log(
                "Candidate profile fetch error:",
                err
            );
            setCandidateProfile(null);
        }
    };

    // =========================================================
    // SELECT FILE
    // =========================================================
    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setMessage("");
        setCandidateProfile(null);
        // PDF validation
        if (selectedFile.type !== "application/pdf") {
            setMessage("❌ Only PDF files are allowed.");
            inputRef.current.value = "";
            return;
        }
        // Maximum 5 MB
        if (selectedFile.size > 5 * 1024 * 1024) {
            setMessage("❌ File size should not exceed 5 MB.");
            inputRef.current.value = "";
            return;
        }
        // Empty file validation
        if (selectedFile.size === 0) {
            setMessage("❌ Empty file is not allowed.");
            inputRef.current.value = "";
            return;
        }
        setFile(selectedFile);
    };

    // =========================================================
    // REMOVE SELECTED FILE
    // =========================================================
    const handleRemove = () => {
        setFile(null);
        setMessage("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    // =========================================================
    // UPLOAD RESUME
    // =========================================================
    const handleUpload = async () => {
        if (!file) return;
        try {
            setUploading(true);
            setMessage("");
            setCandidateProfile(null);

            const formData = new FormData();
            formData.append(
                "file",
                file
            );
            const res = await api.post(
                "/resume/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setMessage(
                res.data.message
            );
            await fetchLatestResume();
            setFile(null);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        } catch (err) {
            setMessage(
                "❌ " +
                (
                    err.response?.data?.detail ||
                    "Upload Failed"
                )
            );
        } finally {
            setUploading(false);
        }
    };
    
    // =========================================================
    // VIEW RESUME
    // =========================================================
    const handleView = async () => {
        try {
            const res = await api.get(
                "/resume/view",
                {
                    responseType: "blob",
                }
            );
            const pdfFile = new Blob(
                [res.data],
                {
                    type: "application/pdf",
                }
            );
            const fileURL =
                URL.createObjectURL(pdfFile);
            window.open(
                fileURL +
                "#toolbar=1&navpanes=0&scrollbar=1",
                "_blank"
            );
            setTimeout(() => {
                URL.revokeObjectURL(
                    fileURL
                );
            }, 1000);
        } catch (err) {
            console.log(err);
            setMessage(
                "❌ " +
                (
                    err.response?.data?.detail ||
                    "Unable to view resume"
                )
            );
        }
    };
    // =========================================================
    // PARSE RESUME
    // =========================================================
    const handleParse = async () => {
        try {
            setParsing(true);
            setMessage("");
            setCandidateProfile(null);
            const res = await api.post(
                "/resume/parse"
            );
            setCandidateProfile(
                res.data.candidate_profile
            );
            setMessage(
                res.data.message
            );
            await fetchCandidateProfile();
                } catch (err) {
            console.log(err);
            setMessage(
                "❌ " +
                (
                    err.response?.data?.detail ||
                    "Resume parsing failed"
                )
            );
        } finally {
            setParsing(false);
        }
    };
    // =========================================================
    // DELETE RESUME
    // =========================================================
    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your resume?"
        );
        if (!confirmDelete) return;
        try {
            setMessage("");
            const res = await api.delete(
                "/resume/delete"
            );
            setMessage(
                res.data.message
            );
            setCandidateProfile(null);
            setUploadedResume(null);
            setFile(null);
            await fetchLatestResume();
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        } catch (err) {
            setMessage(
                "❌ " +
                (
                    err.response?.data?.detail ||
                    "Delete Failed"
                )
            );
        }
    };


    // =========================================================
    // UI
    // =========================================================
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex justify-center items-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-10">
                {/* =====================================================
                    PAGE TITLE
                ===================================================== */}
                <h1 className="text-4xl font-bold text-center text-gray-800">
                    Resume Management
                </h1>

                <p className="text-center text-gray-500 mt-3 mb-10">
                    Upload your latest resume (PDF only, Max 5 MB)
                </p>
                {/* =====================================================
                    FILE SELECT AREA
                ===================================================== */}
                <div
                    onClick={() => inputRef.current?.click()}
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
                            Supported Format : PDF (Maximum 5 MB)
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
                {/* =====================================================
                    SELECTED RESUME
                ===================================================== */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-5">
                        Selected Resume
                    </h2>
                    {
                        file ? (
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
                                        onClick={() => inputRef.current?.click()}
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
                        ) : (
                            <div className="border rounded-xl bg-gray-50 py-8 text-center text-gray-500">
                                No Resume Selected
                            </div>
                        )
                    }
                </div>
                {/* =====================================================
                    UPLOAD BUTTON
                ===================================================== */}
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
                {/* =====================================================
                    MESSAGE
                ===================================================== */}
                {
                    message && (
                        <p
                            className={`text-center mt-5 font-semibold ${
                                message.startsWith("❌")
                                    ? "text-red-600"
                                    : "text-green-600"
                            }`}
                        >
                            {message}

                        </p>
                    )
                }
                {/* =====================================================
                    UPLOADED RESUME
                ===================================================== */}
                <div className="mt-10 border-t pt-8">
                    <h2 className="text-xl font-semibold">
                        Uploaded Resume
                    </h2>
                    {
                        uploadedResume ? (
                            <div className="mt-4 rounded-xl border border-green-300 bg-green-50 p-6">
                                <h3 className="font-semibold text-lg">
                                    {uploadedResume.filename}
                                </h3>


                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mt-5">
                                    <div>
                                        <p className="text-gray-500">
                                            Uploaded At
                                        </p>
                                        <p>
                                            {
                                                new Date(
                                                    uploadedResume.uploaded_at
                                                ).toLocaleString()
                                            }
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {/* VIEW */}
                                        <button
                                            type="button"
                                            onClick={handleView}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            <Eye size={18} />
                                            View
                                        </button>
                                        {/* PARSE */}
                                        <button
                                            type="button"
                                            onClick={handleParse}
                                            disabled={parsing}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${
                                                parsing
                                                    ? "bg-purple-300 cursor-not-allowed"
                                                    : "bg-purple-600 hover:bg-purple-700"
                                            }`}
                                        >
                                            <ScanSearch size={18} />
                                            {
                                                parsing
                                                    ? "Parsing..."
                                                    : "Parse Resume"
                                            }
                                        </button>
                                        {/* DELETE */}
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 bg-gray-50 rounded-xl border p-6 text-center text-gray-500">
                                No Resume Uploaded Yet
                            </div>
                        )
                    }
                </div>

                {/* =====================================================
                    CANDIDATE PROFILE
                ===================================================== */}
                {
                    candidateProfile && (
                        <div className="mt-10 border-t pt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <User
                                    size={28}
                                    className="text-purple-600"
                                />
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Candidate Profile
                                </h2>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                                {/* BASIC INFORMATION */}
                                <div className="grid md:grid-cols-3 gap-5">
                                    <div className="bg-white rounded-xl border p-4">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <User size={18} />
                                            <span>Name</span>
                                        </div>

                                        <p className="font-semibold">
                                            {candidateProfile.name || "Not Found"}
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-xl border p-4">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <Mail size={18} />
                                            <span>Email</span>
                                        </div>

                                        <p className="font-semibold break-all">
                                            {candidateProfile.email || "Not Found"}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-xl border p-4">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <Phone size={18} />
                                            <span>Phone</span>
                                        </div>

                                        <p className="font-semibold">
                                            {candidateProfile.phone || "Not Found"}
                                        </p>
                                    </div>
                                </div>
                                {/* SKILLS */}
                                <div className="mt-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Code2
                                            size={22}
                                            className="text-blue-600"
                                        />
                                        <h3 className="text-xl font-semibold">
                                            Skills
                                        </h3>
                                    </div>
                                    {
                                        candidateProfile.skills?.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {
                                                    candidateProfile.skills.map(
                                                        (skill, index) => (
                                                            <span
                                                                key={`${skill}-${index}`}
                                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                                                            >
                                                                {skill}
                                                            </span>
                                                        )
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">
                                                No skills detected.
                                            </p>
                                        )
                                    }
                                </div>
                                {/* EDUCATION */}
                                <div className="mt-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <GraduationCap
                                            size={22}
                                            className="text-green-600"
                                        />
                                        <h3 className="text-xl font-semibold">
                                            Education
                                        </h3>
                                    </div>
                                    {
                                        candidateProfile.education?.length > 0 ? (
                                            <div className="space-y-2">
                                                {
                                                    candidateProfile.education.map(
                                                        (item, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-white border rounded-lg p-3"
                                                            >
                                                                {item}
                                                            </div>
                                                        )
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">
                                                No education information detected.
                                            </p>
                                        )
                                    }
                                </div>
                                {/* PROJECTS */}
                                <div className="mt-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FolderKanban
                                            size={22}
                                            className="text-orange-600"
                                        />
                                        <h3 className="text-xl font-semibold">
                                            Projects
                                        </h3>
                                    </div>
                                    {
                                        candidateProfile.projects?.length > 0 ? (
                                            <div className="space-y-2">
                                                {
                                                    candidateProfile.projects.map(
                                                        (item, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-white border rounded-lg p-3"
                                                            >
                                                                {item}
                                                            </div>
                                                        )
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">
                                                No projects detected.
                                            </p>
                                        )
                                    }
                                </div>
                                {/* EXPERIENCE */}
                                <div className="mt-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <BriefcaseBusiness
                                            size={22}
                                            className="text-indigo-600"
                                        />
                                        <h3 className="text-xl font-semibold">
                                            Experience
                                        </h3>
                                    </div>
                                    {
                                        candidateProfile.experience?.length > 0 ? (
                                            <div className="space-y-2">
                                                {
                                                    candidateProfile.experience.map(
                                                        (item, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-white border rounded-lg p-3"
                                                            >
                                                                {item}
                                                            </div>
                                                        )
                                                    )
                                                }
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">
                                                No experience detected.
                                            </p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
export default ResumeUploader;