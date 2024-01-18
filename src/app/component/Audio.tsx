import * as R from "ramda";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { ResponseData } from "@/pages/api/stt";

type PropsType = {
  onAIResponse: (text?: string) => void;
  startWaiting?: () => void;
  finishWaiting?: () => void;
};

export default function Audio({
  onAIResponse,
  startWaiting,
  finishWaiting,
}: PropsType) {
  const AudioRecorderController = useAudioRecorder();
  return (
    <main>
      <div className="flex flex-col items-center justify-center py-56">
        <AudioRecorder
          showVisualizer={true}
          onRecordingComplete={async (blob) => {
            const file = new File([blob], "audio.webm", {
              type: blob.type,
            });
            const formData = new FormData();
            formData.append("file", file);
            startWaiting?.();
            try {
              const res: ResponseData = await (
                await fetch("/api/stt", {
                  method: "POST",
                  body: formData,
                })
              ).json();
              finishWaiting?.();
              onAIResponse(res.text);
            } catch (error) {
              console.error(error);
              finishWaiting?.();
              onAIResponse();
            }
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
          <div className="text-2xl absolute inset-0 flex flex-col items-center justify-center">
            {R.cond([
              [
                ({ isRecording }: typeof AudioRecorderController) =>
                  !isRecording,
                () => <>Click the button to start recording</>,
              ],
              [
                ({ isRecording, isPaused }) => isRecording && !isPaused,
                () => (
                  <>
                    Recording in progress, click the stop button to stop
                    recording, save button to send.
                  </>
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
