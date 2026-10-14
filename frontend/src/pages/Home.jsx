import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          MockAI
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-slate-300 transition hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center md:py-32">
        <span className="mb-6 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
          AI-powered interview preparation
        </span>

        <h1 className="max-w-4xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
          Practice Interviews.
          <span className="block text-indigo-400">Build Confidence.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
          Prepare for technical and HR interviews with AI-generated questions,
          realistic practice sessions, and personalized feedback on your
          performance.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/register"
            className="rounded-xl bg-indigo-600 px-8 py-4 font-semibold transition hover:bg-indigo-500"
          >
            Start Your Interview
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-8 py-4 font-semibold transition hover:bg-slate-800"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-5 text-left md:grid-cols-3">
          <Feature
            title="AI Questions"
            description="Generate interview questions based on your role and experience."
          />

          <Feature
            title="Practice Sessions"
            description="Practice answering questions in a structured interview."
          />

          <Feature
            title="AI Feedback"
            description="Review your score and feedback after completing an interview."
          />
        </div>
      </main>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-indigo-500/50">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-3 leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export default Home;
