import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

function InterviewRoom() {
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_INTERVIEW_API_URL}/${id}`,
          { credentials: "include" },
        );

        const data = await response.json();

        if (!response.ok || !data.interview) {
          throw new Error(data.message || "Failed to load interview");
        }

        setInterview(data.interview);
      } catch (error) {
        toast.error(error.message || "Failed to load interview");
      }
    };

    if (id) fetchInterview();
  }, [id]);

  useEffect(() => {
    const getMicrophone = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();

        const microphones = allDevices.filter(
          (device) => device.kind === "audioinput",
        );

        setDevices(microphones);

        if (microphones.length === 0) {
          toast.error("No microphone detected");
        }
      } catch {
        toast.error("Failed to detect microphones");
      }
    };

    getMicrophone();
  }, []);

  useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);

      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedDevices
          ? { deviceId: { exact: selectedDevices } }
          : true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType,
        });

        const url = URL.createObjectURL(audioBlob);

        setAudioURL((previousURL) => {
          if (previousURL) URL.revokeObjectURL(previousURL);
          return url;
        });

        stream.getTracks().forEach((track) => track.stop());
        toast.success("Recording completed");
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      toast.success("Recording started");
    } catch {
      toast.error("Microphone access failed. Check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async () => {
    if (!audioURL || audioChunksRef.current.length === 0) {
      toast.error("Record an answer before transcribing");
      return;
    }

    const audioBlob = new Blob(audioChunksRef.current, {
      type: mediaRecorderRef.current?.mimeType || "audio/webm",
    });

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const loadingToast = toast.loading("Transcribing your answer...");

    try {
      const response = await fetch(import.meta.env.VITE_VOICE_TRANSCRIBE_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Transcription failed");
      }

      setTranscript(data.transcript || "");

      if (data.transcript?.trim()) {
        toast.success("Transcription completed", { id: loadingToast });
      } else {
        toast.error("No speech detected. Try recording again.", {
          id: loadingToast,
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to transcribe audio", {
        id: loadingToast,
      });
    }
  };

  const submitAnswer = async () => {
    if (!transcript.trim()) {
      toast.error("Please enter your answer first");
      return;
    }

    const currentQuestion = interview?.questions?.[currentQuestionIndex];

    if (!currentQuestion) {
      toast.error("Question not found");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_INTERVIEW_API_URL}/${id}/questions/${currentQuestion._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ answer: transcript }),
        },
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to save answer");
      }

      setInterview((previousInterview) => ({
        ...previousInterview,
        questions: previousInterview.questions.map((question) =>
          question._id === currentQuestion._id
            ? { ...question, answer: transcript }
            : question,
        ),
      }));

      toast.success("Answer saved successfully");
    } catch (error) {
      toast.error(error.message || "Failed to save answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = interview?.questions?.[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
    
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              MOCKAI · PRACTICE SESSION
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Interview Room
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Practice your answers and build confidence.
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
            <p className="text-xs text-slate-400">Interview role</p>
            <p className="mt-1 font-semibold">
              {interview?.role || "Loading..."}
            </p>
          </div>
        </header>

        {interview && (
          <div className="rounded-full bg-slate-800 p-1">
            <div
              className="h-2 rounded-full bg-indigo-500 transition-all"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / interview.questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        )}

     
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl sm:p-8">
          {currentQuestion ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-lg bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-300">
                  Question {currentQuestionIndex + 1} of{" "}
                  {interview.questions.length}
                </span>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {interview.difficulty}
                </span>
              </div>

              <h2 className="mt-6 text-xl font-semibold leading-relaxed sm:text-2xl">
                {currentQuestion.question}
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Take a moment to think, then record your answer.
              </p>
            </>
          ) : (
            <p className="text-slate-300">
              {interview ? "No question available." : "Loading interview..."}
            </p>
          )}
        </section>

      
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Voice recording</h2>
          <p className="mt-1 text-sm text-slate-400">
            Record your answer using your microphone.
          </p>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="microphone"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Select microphone
              </label>

              <select
                id="microphone"
                value={selectedDevices}
                onChange={(event) => setSelectedDevices(event.target.value)}
                disabled={isRecording}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="">Default microphone</option>
                {devices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={startRecording}
                disabled={isRecording}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRecording ? "Recording..." : "Start Recording"}
              </button>

              <button
                onClick={stopRecording}
                disabled={!isRecording}
                className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Stop Recording
              </button>
            </div>
          </div>

          {isRecording && (
            <p className="mt-4 flex items-center gap-2 text-sm text-red-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              Recording in progress...
            </p>
          )}

          {audioURL && (
            <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-4">
              <p className="mb-3 text-sm font-medium">Recording preview</p>
              <audio controls src={audioURL} className="w-full" />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Your answer</h2>
              <p className="mt-1 text-sm text-slate-400">
                Transcribe your recording or edit the text below.
              </p>
            </div>

            {currentQuestion?.answer?.trim() && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-300">
                ✓ Answer saved
              </span>
            )}
          </div>

          <textarea
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Your transcribed answer will appear here..."
            rows={7}
            className="mt-5 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500 focus:border-indigo-500"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={transcribeAudio}
              disabled={!audioURL || isRecording}
              className="rounded-xl border border-slate-600 px-5 py-3 text-sm font-semibold transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Transcribe Audio
            </button>

            <button
              onClick={submitAnswer}
              disabled={!currentQuestion || isSubmitting}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Submit Answer"}
            </button>
          </div>
        </section>

        
        {interview?.questions?.length > 1 && (
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <button
              onClick={() => {
                setCurrentQuestionIndex((index) => index - 1);
                setTranscript("");
                setAudioURL("");
              }}
              disabled={currentQuestionIndex === 0}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous Question
            </button>

            <button
              onClick={() => {
                setCurrentQuestionIndex((index) => index + 1);
                setTranscript("");
                setAudioURL("");
              }}
              disabled={currentQuestionIndex === interview.questions.length - 1}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewRoom;
