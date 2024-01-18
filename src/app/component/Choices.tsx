import { AudioOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import { useState } from "react";
import * as R from "ramda";

type PropsType = {
  choices: string[] | undefined;
  turnToAudio: () => void;
};

export default function Choices({ choices, turnToAudio }: PropsType) {
  const [waiting, setWaiting] = useState(Array<boolean>(4).fill(false));
  return (
    <main>
      <div className="flex flex-col items-center justify-center pt-32">
        {choices?.map((choice, index) => (
          <div className="text-lg w-96" key={`choice-${index}`}>
            <Button
              type="text"
              onClick={async () => {
                if (waiting.some(R.identity)) return;
                if (choice) {
                  setWaiting([...waiting].fill(true, index, index + 1));
                  const audio = document.createElement("audio");
                  audio.autoplay = true;
                  audio.style.display = "none";
                  audio.src = `/api/tts?text=${choice}`;
                  audio.onplay = () => {
                    setWaiting(Array<boolean>(4).fill(false));
                  };
                }
              }}
            >
              {waiting[index] && (
                <Spin
                  size="small"
                  style={{ color: "rgb(107 114 128 / var(--tw-text-opacity))" }}
                  indicator={<LoadingOutlined />}
                />
              )}
              {!waiting[index] && <AudioOutlined className="h-full w-full" />}
            </Button>
            {choice}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center mt-16">
        <Button type="text" size="large" onClick={turnToAudio}>
          Back
        </Button>
      </div>
    </main>
  );
}
