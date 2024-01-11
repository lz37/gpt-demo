import * as R from "ramda";
import { useContext } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { ResponseData } from "@/pages/api/send-audio";

type PropsType = {
  onAIResponse: (choices: string[] | undefined) => void;
};

export default function Audio({ onAIResponse }: PropsType) {
  const AudioRecorderController = useAudioRecorder();
  return (
    <main>
      <div className="flex flex-col items-center justify-center h-32">
        <AudioRecorder
          showVisualizer={true}
          onRecordingComplete={async (blob) => {
            const file = new File([blob], "audio.webm", {
              type: blob.type,
            });
            const formData = new FormData();
            formData.append("file", file);
            const res: ResponseData = await (
              await fetch("/api/send-audio", {
                method: "POST",
                body: formData,
              })
            ).json();
            onAIResponse(res.choices);
          }}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
          recorderControls={AudioRecorderController}
          downloadOnSavePress={false}
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="relative lg:min-w-[768px] sm:min-w-[512px] min-w-[256px] h-12">
          <div className="text-2xl text-gray-500 absolute inset-0 flex flex-col items-center justify-center">
            {R.cond([
              [
                ({ isRecording }: typeof AudioRecorderController) =>
                  !isRecording,
                () => <>Click the button to start recording</>,
              ],
              [
                ({ isRecording, isPaused }) => isRecording && !isPaused,
                () => (
                  <>Recording in progress, click the button to stop recording</>
                ),
              ],
              [
                ({ isRecording, isPaused }) => isRecording && isPaused,
                () => <>Click the button to resume recording</>,
              ],
            ])(AudioRecorderController)}
          </div>
        </div>
      </div>
    </main>
  );
}
