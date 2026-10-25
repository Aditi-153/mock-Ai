import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function InterviewRoom() {
  const [interview, setInterview] = useState(null); // Stores interview information
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Stores the index of the current question
  const [transcript, setTranscript] = useState(""); // Stores the user's answer text
  const [isRecording, setIsRecording] = useState(false); // Checks whether audio recording is active
  const [devices, setDevices] = useState([]); // Stores available microphones
  const [selectedDevices, setSelectedDevices] = useState(""); // Stores the selected microphone ID
  const [audioURL, setAudioURL] = useState(""); // Stores the temporary URL of the recorded audio
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks whether the answer is being saved

  const { id } = useParams(); // Gets the interview ID from the URL
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Fetches the interview details from the backend
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_INTERVIEW_API_URL}/${id}`,
          {
            withCredentials: true,
          },
        );

        const data = response.data;

        if (!data.interview) {
          throw new Error(data.message || "Failed to load interview");
        }

        setInterview(data.interview);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load interview",
        );
      }
    };

    if (id) fetchInterview();
  }, [id]);

  // Finds the microphones connected to the device
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

  // Cleans up the temporary audio URL and stops recording when needed
  useEffect(() => {
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);

      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioURL]);

  // Starts recording the user's answer
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
      const response = await axios.post(
        import.meta.env.VITE_VOICE_TRANSCRIBE_URL,
        formData,
      );

      const data = response.data;

      if (!data.success) {
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
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to transcribe audio",
        { id: loadingToast },
      );
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
      const response = await axios.patch(
        `${import.meta.env.VITE_INTERVIEW_API_URL}/${id}/questions/${currentQuestion._id}`,
        { answer: transcript },
        { withCredentials: true },
      );

      const data = response.data;

      if (data.success === false) {
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
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to save answer",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = interview?.questions?.[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="/" className="text-2xl font-bold tracking-tight">
          Mock<span className="text-slate-500">AI</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a href="/" className="text-sm text-slate-600 hover:text-black">
            Home
          </a>

          <a
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-black"
          >
            Dashboard
          </a>

          <a
            href="/dashboard"
            className="text-sm text-slate-600 hover:text-black"
          >
            My Interviews
          </a>
        </div>

        <div className="rounded-full border bg-gray-900 text-white border-slate-200 px-4 py-2 text-sm">
          Interview in progress
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-bold font-medium text-slate-500">INTERVIEW ROOM</p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {interview?.role || "Your Interview"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Focus on the question and answer at your own pace.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-500">
              CURRENT QUESTION
            </p>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium">
              {interview?.questions?.length
                ? `Question ${currentQuestionIndex + 1} of ${interview.questions.length}`
                : "Loading..."}
            </span>
          </div>

          <h2 className="mt-8 text-2xl font-semibold leading-relaxed md:text-3xl">
            {currentQuestion?.question || "Loading your question..."}
          </h2>

          <div className="mt-8">
            <label
              htmlFor="answer"
              className="mb-3 block text-sm font-medium text-slate-700"
            >
              Your answer
            </label>

            <textarea
              id="answer"
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              placeholder="Type your answer here, or record your response below..."
              rows={6}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-lg px-5 py-3 text-sm font-medium text-white transition ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-black hover:bg-slate-800"
              }`}
            >
              {isRecording ? "Stop recording" : "Start recording"}
            </button>

            <button
              type="button"
              onClick={transcribeAudio}
              disabled={isRecording || !audioURL}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Transcribe audio
            </button>
          </div>

          <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={submitAnswer}
              disabled={isSubmitting || !transcript.trim()}
              className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? "Saving answer..." : "Save answer"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default InterviewRoom;
