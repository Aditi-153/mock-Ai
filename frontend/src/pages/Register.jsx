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
  const navigate = useNavigate();

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
      const response = await api.post("/api/auth/register", {
        ...formData,
        name: name.trim(),
        email: email.trim(),
        age: Number(age),
        phone: phone.trim(),
      });

      toast.success("Registration successful!");

      console.log(response.data.user);

      navigate("/home");
    } catch (error) {
      console.error(error.response?.data || error.message);

      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          MockAI
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Create your account</h1>

        <p className="mt-2 text-slate-400">
          Start your AI-powered interview preparation journey.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-medium">
            Full name
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
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
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block text-sm font-medium">
            Age
            <input
              name="age"
              type="number"
              min="1"
              max="120"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block text-sm font-medium">
            Phone number
            <input
              name="phone"
              type="number"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              name="password"
              type="password"
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-500"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
