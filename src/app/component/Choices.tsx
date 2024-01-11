import { useContext, useEffect } from "react";

type PropsType = {
  choices: string[]|undefined;
};

export default function Choices({ choices }: PropsType) {
  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        {choices?.map((choice, index) => (
          <div className="text-lg text-gray-500 border border-solid w-96" key={`choice-${index}`}>
            {choice}
          </div>
        ))}
      </div>
    </main>
  );
}
