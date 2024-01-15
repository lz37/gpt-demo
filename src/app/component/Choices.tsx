import { useContext, useEffect } from "react";
import { AudioOutlined } from "@ant-design/icons";
import { Button } from "antd";

type PropsType = {
  choices: string[] | undefined;
};

export default function Choices({ choices }: PropsType) {
  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        {choices?.map((choice, index) => (
          <div className="text-lg text-gray-500 w-96" key={`choice-${index}`}>
            <Button
              type="text"
              onClick={async () => {
                if (choice) {
                  const audio = document.createElement("audio");
                  audio.autoplay = true;
                  audio.style.display = "none";
                  audio.src = `/api/tts?text=${choice}`;
                }
              }}
            >
              <AudioOutlined className="h-full w-full" />
            </Button>
            {choice}
          </div>
        ))}
      </div>
    </main>
  );
}
