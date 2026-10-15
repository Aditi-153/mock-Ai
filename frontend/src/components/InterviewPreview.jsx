import { Mic } from "lucide-react";
function InterviewPreview() {
  return (
    <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-lg font-semibold">Interview Room</h2>

        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-400">
          Demo
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="font-medium text-white">Frontend Developer</p>
          <p className="mt-1 text-sm text-slate-400">Technical Interview</p>
        </div>

        <span className="rounded-lg bg-indigo-400/10 px-3 py-2 text-sm text-indigo-300">
          Intermediate
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-indigo-300">
            QUESTION 03 / 08
          </span>

          <span className="text-sm text-slate-400">02:14</span>
        </div>

        <h3 className="mt-4 text-xl font-semibold leading-relaxed">
          How would you optimize a React application?
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Explain your approach and give practical examples.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 py-7">
        <div className="flex h-10 w-14 items-center justify-center rounded-full bg-indigo-600">
          <Mic size={24} strokeWidth={2} className="text-white" />
        </div>

        <p className="text-sm text-slate-400">
          Sample voice-response interface
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Example AI Feedback</h3>

          <span className="font-semibold text-indigo-300">8/10</span>
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Good explanation with clear examples. You could improve your answer by
          discussing performance optimization techniques in more detail.
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        Illustrative session · Sample data
      </p>
    </div>
  );
}

export default InterviewPreview;
