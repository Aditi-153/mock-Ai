import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../apis/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, age, phone, password } = formData;

    if (!name.trim() || !email.trim() || !password || !age || !phone.trim()) {
      toast.error("All fields are required.");
      return;
    }

    if (Number(age) < 1 || Number(age) > 120) {
      toast.error("Please enter a valid age.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(import.meta.env.VITE_REGISTER_URL, {
        ...formData,
        name: name.trim(),
        email: email.trim(),
        age: Number(age),
        phone: phone.trim(),
      });

      toast.success("Registration successful!");
      console.log(response.data.user);

      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Registration failed.");
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
          Already a member?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Log in
          </Link>
        </p>
      </nav>

      <main className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-10 px-6 py-8 lg:grid-cols-2 lg:gap-16 lg:px-16">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            AI-powered interview preparation
          </div>

          <h1 className="max-w-xl text-5xl font-extrabold leading-tight xl:text-6xl">
            Your next interview.
            <span className="mt-2 block text-indigo-400">
              Your best performance.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Build confidence with realistic technical and HR interviews,
            AI-generated questions, and personalized feedback.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-white">Practice your way</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Choose your role, experience level, and interview type.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Get AI-powered feedback
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Understand your strengths and discover areas to improve.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                ✓
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  Build real confidence
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Practice answering questions before the real interview.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-indigo-950/20 sm:p-7">
          <div className="mb-6">
            <p className="text-sm font-semibold text-indigo-400">GET STARTED</p>

            <h2 className="mt-2 text-2xl font-bold">Create your account</h2>

            <p className="mt-2 text-sm text-slate-400">
              Start preparing for your next interview.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block text-sm font-medium">
              Full name
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>

            <label className="block text-sm font-medium">
              Email address
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">
                Age
                <input
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>

              <label className="block text-sm font-medium">
                Phone number
                <input
                  name="phone"
                  type="tel"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
            </div>

            <label className="block text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Log in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-slate-500">
            Practice smarter. Interview with confidence.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Register;
