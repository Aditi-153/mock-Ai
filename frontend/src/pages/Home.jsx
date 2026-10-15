import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import InterviewPreview from "../components/InterviewPreview";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6">
        <section className="grid grid-cols-1 items-center gap-12 py-10 lg:min-h-[680px] lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left lg:-translate-y-8">
            <span className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
              AI-powered interview preparation
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Practice Interviews.
              <span className="mt-1 block text-indigo-400">
                Build Confidence.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg sm:leading-8 lg:mx-0">
              Prepare for technical and HR interviews with AI-generated
              questions, realistic practice sessions, and personalized feedback
              on your performance.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
              >
                Start Your Interview
              </Link>

              <Link
                to="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-700 px-6 py-3 font-semibold transition hover:border-slate-600 hover:bg-slate-800"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-400 lg:justify-start">
              <span>✓ Technical Interviews</span>
              <span>✓ HR Interviews</span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl min-w-0 lg:-translate-y-8">
            <InterviewPreview />
          </div>
        </section>

        <section id="features" className="border-t border-slate-800/80 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Everything You Need to Prepare
            </h2>
            <p className="mt-3 text-slate-400">
              Practice, improve, and build confidence for your next interview.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
        </section>
      </main>
    </div>
  );
}

function Feature({ title, description }) {
  return (
    <div className="h-full rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-500/50">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-3 leading-6 text-slate-400">{description}</p>
    </div>
  );
}

export default Home;
