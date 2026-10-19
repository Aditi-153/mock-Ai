import { useState, useRef } from "react";

function InterviewRoom() {
  const [question, setQuestion] = useState("explain.......");

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");

  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);

  const speakQuestion = () => {};
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mediaRecorder.mimeType,
      });

      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);

      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.start();
    setIsRecording(true);
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  return (
    <div>
      <h1>Interview Room</h1>

      <h2>{question}</h2>

      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>

      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>

      {audioURL && <audio controls src={audioURL} />}
    </div>
  );
}

export default InterviewRoom;
