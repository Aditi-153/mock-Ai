import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../apis/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(import.meta.env.VITE_LOGIN_URL, {
        email: email.trim(),
        password,
      });

      toast.success("Login successful");

      console.log("Logged-in user:", response.data.user);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login request failed:", err.response?.data || err.message);

      toast.error(
        err.response?.data?.message ||
          "Unable to connect to the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="flex h-16 items-center justify-between border-b border-slate-800 px-6 sm:px-10 lg:px-16">
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          MockAI
        </Link>

        <p className="text-sm text-slate-400">
          New to MockAI?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 transition hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </nav>

      <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-10 px-6 py-8 lg:grid-cols-2 lg:gap-16 lg:px-16">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            AI-powered interview preparation
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold leading-tight xl:text-6xl">
            Welcome back.
            <span className="mt-2 block text-indigo-400">
              Let's build confidence.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Continue practicing technical and HR interviews, improve your
            answers, and prepare for your next opportunity.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                ✓
              </span>
              <span className="text-slate-300">
                Practice technical and HR interviews
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                ✓
              </span>
              <span className="text-slate-300">
                Receive personalized AI feedback
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                ✓
              </span>
              <span className="text-slate-300">
                Track your interview performance
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-indigo-950/20 sm:p-8">
          <Link to="/" className="text-2xl font-bold text-indigo-400">
            MockAI
          </Link>

          <h1 className="mt-5 text-3xl font-bold">Welcome back</h1>

          <p className="mt-2 text-slate-400">
            Log in to continue your interview preparation.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block text-sm font-medium">
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>

            <label className="block text-sm font-medium">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-400 transition hover:text-indigo-300"
            >
              Create account
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;
