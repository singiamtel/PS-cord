"use client";

import {
  createRef,
  FormEvent,
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PS_context } from "./PS_context";
import useAutosizeTextArea from "@/utils/useAutosizeTextArea";

export default function ChatBox() {
  const [input, setInput] = useState<string>("");
  const { client, room } = useContext(PS_context);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = createRef<HTMLFormElement>();
  useAutosizeTextArea(textAreaRef.current, input);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!client || !room) return;
    client.sendMessage(room, input);
    setInput("");
  };

  const enterSubmit: KeyboardEventHandler = (e) => {
    // if user pressed enter, submit form
    // don't submit if user pressed shift+enter
    if (e.key === "Enter" && !e.shiftKey) {
      if (!formRef.current?.textContent) {
        return;
      }
      // submit form
      formRef.current?.requestSubmit();
      e.preventDefault();
    }
  };

  useEffect(() => {
  }, [input]);

  return (
    <div className="w-full">
      <form onSubmit={submit} ref={formRef} className="w-full">
        <div className="flex flex-row">
          <textarea
            className="mr-5 ml-5 p-2 rounded-lg flex-grow bg-gray-375 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={enterSubmit}
            ref={textAreaRef}
          >
          </textarea>
        </div>
      </form>
    </div>
  );
}
