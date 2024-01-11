"use client";
import AudioComponent from "@/app/component/Audio";
import ChoicesComponent from "@/app/component/Choices";
import React, { useState } from "react";

export default function Home() {
  const [choices, setChoices] = useState<string[]>([]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl text-gray-500">IOS GPT APP</h1>
      <AudioComponent
        onAIResponse={(choices) => {
          if (choices) {
            setChoices(choices);
          } else {
            setChoices([]);
          }
        }}
      />
      <ChoicesComponent choices={choices}/>
    </main>
  );
}
