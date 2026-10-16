import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../apis/api";

function Dashboard() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get(import.meta.env.VITE_GET_INTERVIEWS_URL);
        setInterviews(response.data.interviews || []);
      } catch (error) {
        console.error(
          "failed to fetch Interview",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post(import.meta.env.VITE_LOGOUT_URL);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "logut failed");
    }
    navigate("/login");
  };

  const completedInterview = interviews.filter(
    (interview) => interview.status === "completed",
  );

  const averageScore =
    completedInterview.length > 0
      ? completedInterview.reduce(
          (total, interview) => total + interview.score,
          0,
        ) / completedInterview.length
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex items-center justify-between border-b border-slate-800 px-6 py-4 sm:px-10">
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          MockAI
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-indigo-500 hover:text-white"
        >
          Log out
        </button>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <section className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Your dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Welcome back!</h1>

          <p className="mt-3 text-slate-400">
            Ready to prepare for your next interview?
          </p>
        </section>

        <section className="mb-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950 to-slate-900 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">Ready for a new challenge?</h2>

              <p className="mt-2 max-w-xl text-slate-400">
                Practice with AI-generated questions and receive personalized
                feedback to improve your interview skills.
              </p>
            </div>

            <button
              onClick={() => navigate("/interview")}
              className="shrink-0 rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
            >
              + Start Interview
            </button>
          </div>
        </section>

        <section className="mb-10 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Total interviews</p>

            <h2 className="mt-3 text-3xl font-bold">
              {loading ? "..." : interviews.length}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your completed and ongoing interviews
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">Average score</p>

            <h2 className="mt-3 text-3xl font-bold">
              {loading
                ? "..."
                : completedInterview.length > 0
                  ? `${averageScore}/100`
                  : "—"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your performance across completed interviews
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent interviews</h2>

            <span className="text-sm text-slate-500">Your history</span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading your interviews...
            </div>
          ) : interviews.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
                <span className="text-2xl">+</span>
              </div>

              <h3 className="mt-4 font-semibold">
                Your interview journey starts here
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Start your first interview to see your history here.
              </p>

              <button
                onClick={() => navigate("/interview")}
                className="mt-5 font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Start your first interview →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.slice(0, 5).map((interview) => (
                <div
                  key={interview._id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-semibold text-white">
                      {interview.role}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {interview.interviewType} · {interview.difficulty}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        interview.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {interview.status}
                    </span>

                    {interview.status === "completed" && (
                      <span className="font-semibold text-indigo-400">
                        {interview.score}/100
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
