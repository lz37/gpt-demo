import { Button, Input } from "antd";
import { useState } from "react";
import * as R from "ramda";
import { ResponseData as ChoicesResponseData } from "@/pages/api/choices";
import defaultPrompt from "@/ai/defaultPrompt";

type PropsType = {
  textFromHTTP: string;
  startWaiting?: () => void;
  finishWaiting?: () => void;
  onAIResponse: (choices?: string[]) => void;
};

export default function TextEditor({
  textFromHTTP,
  startWaiting,
  finishWaiting,
  onAIResponse,
}: PropsType) {
  const [text, setText] = useState(textFromHTTP);
  const [showTextInput, setShowTextInput] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [showPromptInput, setShowPromptInput] = useState(false);
  return (
    <main>
      <div className="grid grid-cols-2 gap-4 w-[1024px] pt-56 pb-24">
        <ComponentWrapper
          mainTitle="The Message Identified:"
          defaultValue={textFromHTTP}
          editorID="text-editor"
          value={text}
          setValue={setText}
          showInput={showTextInput}
          setShowInput={setShowTextInput}
        />
        <ComponentWrapper
          mainTitle="The Current Prompts:"
          defaultValue={defaultPrompt}
          editorID="prompt-editor"
          value={prompt}
          setValue={setPrompt}
          showInput={showPromptInput}
          setShowInput={setShowPromptInput}
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <Button
          type="text"
          size="large"
          onClick={async () => {
            startWaiting?.();
            const choices: ChoicesResponseData = await (
              await fetch(`/api/choices?text=${text}&prompt=${prompt}`)
            ).json();
            finishWaiting?.();
            onAIResponse(choices.choices);
          }}
        >
          Click to Send
        </Button>
      </div>
    </main>
  );
}

type SubTitleProp = {
  showInput: boolean;
  mainTitle: string;
};

function SubTitle({ showInput, mainTitle }: SubTitleProp) {
  return (
    <h1 className="flex flex-col items-center text-2xl">
      <span>{mainTitle}</span>
      <span className="text-lg">
        {!showInput && <>Click Words Below to Edit</>}
        {showInput && <>Click Blank to Finish Editing</>}
      </span>
    </h1>
  );
}

type WrapperProp = {
  mainTitle: string;
  editorID: string;
  showInput: boolean;
  setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValue: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

function ComponentWrapper({
  mainTitle,
  editorID,
  showInput,
  setShowInput,
  defaultValue,
  value,
  setValue,
}: WrapperProp) {
  return (
    <main className="flex flex-col items-center">
      <SubTitle showInput={showInput} mainTitle={mainTitle} />
      <div className="py-4">
        {R.ifElse(
          R.identity<boolean>,
          () => (
            <div className="w-[384px]">
              <Input.TextArea
                id={editorID}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={defaultValue}
                autoSize={{ minRows: 2, maxRows: 6 }}
                onBlur={(e) => {
                  setShowInput(false);
                  if (R.isEmpty(value ?? "")) {
                    setValue(defaultValue);
                  }
                }}
              />
            </div>
          ),
          () => (
            <div
              className="text-xl w-[384px] flex items-center justify-center"
              onClick={() => {
                setShowInput(true);
                setTimeout(() => {
                  const textEditor = document.getElementById(
                    editorID
                  ) as HTMLInputElement;
                  if (textEditor) {
                    textEditor.focus();
                    textEditor.setSelectionRange(0, textEditor.value.length);
                  }
                }, 0);
              }}
            >
              {value}
            </div>
          )
        )(showInput)}
      </div>
    </main>
  );
}
