"use client";
import AudioComponent from "@/app/component/Audio";
import ChoicesComponent from "@/app/component/Choices";
import React, { useState } from "react";
import * as R from "ramda";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import TextEditorComponent from "./component/TextEditor";

enum Show {
  Audio,
  Choices,
  TextEditor,
}

export default function Home() {
  const [text, setText] = useState<string>("test");
  const [choices, setChoices] = useState<string[]>([]);
  const [waiting, setWaiting] = useState(false);
  const [showComponent, setShowComponent] = useState(Show.Audio);
  const [audioKey, setAudioKey] = useState(Math.random());
  const [textEditorKey, setTextEditorKey] = useState(Math.random());
  const [choicesKey, setChoicesKey] = useState(Math.random());
  return (
    <main className="flex flex-col items-center justify-between p-24 text-gray-500">
      <h1 className="text-4xl">IOS GPT APP</h1>
      {R.ifElse(
        R.identity<boolean>,
        () => (
          <div className="flex items-center">
            <Spin
              size="large"
              fullscreen
              style={{ color: "rgb(107 114 128 / var(--tw-text-opacity))" }}
              indicator={<LoadingOutlined />}
            />
          </div>
        ),
        () => (
          <>
            {R.cond([
              [
                R.equals(Show.Audio),
                () => (
                  <AudioComponent
                    key={audioKey}
                    startWaiting={() => setWaiting(true)}
                    finishWaiting={() => setWaiting(false)}
                    onAIResponse={(text) => {
                      if (text) {
                        setText(text);
                        setShowComponent(Show.TextEditor);
                      } else {
                        setText("");
                        setAudioKey(Math.random());
                      }
                    }}
                  />
                ),
              ],
              [
                R.equals(Show.TextEditor),
                () => (
                  <TextEditorComponent
                    key={textEditorKey}
                    startWaiting={() => setWaiting(true)}
                    finishWaiting={() => setWaiting(false)}
                    onAIResponse={(choices) => {
                      setText("");
                      if (choices?.length) {
                        setChoices(choices);
                        setShowComponent(Show.Choices);
                      } else {
                        setChoices([]);
                        setTextEditorKey(Math.random());
                      }
                    }}
                    textFromHTTP={text}
                  />
                ),
              ],
              [
                R.equals(Show.Choices),
                () => (
                  <ChoicesComponent
                    key={choicesKey}
                    choices={choices}
                    turnToAudio={() => {
                      setChoices([]);
                      setChoicesKey(Math.random());
                      setTextEditorKey(Math.random());
                      setAudioKey(Math.random());
                      setShowComponent(Show.Audio);
                    }}
                  />
                ),
              ],
            ])(showComponent)}
          </>
        )
      )(waiting)}
    </main>
  );
}
