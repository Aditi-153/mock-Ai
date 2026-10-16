import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../apis/api";

function InterviewSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    difficulty: "Easy",
    interviewType: "Technical",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role.trim() || !formData.experience.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        import.meta.env.VITE_CREATE_INTERVIEW_URL,
        formData,
      );

      toast.success("interview creted successfully");

      navigate(`/interview/${response.data.interview._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "failed tp create interview",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] px-6 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-8 text-sm text-gray-400 hover:text-white"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold">Set Up Your Interview</h1>
        <p className="mt-2 text-gray-400">
          Customize your interview and get ready to practice.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-gray-700 bg-[#111827] p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">Job Role *</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="w-full rounded-lg border border-gray-700 bg-[#0B1120] px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Experience *
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. Fresher or 2 years"
              className="w-full rounded-lg border border-gray-700 bg-[#0B1120] px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-[#0B1120] px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Interview Type
            </label>
            <select
              name="interviewType"
              value={formData.interviewType}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-[#0B1120] px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option value="Technical">Technical</option>
              <option value="HR">HR</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Interview..." : "Generate Interview"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InterviewSetup;
