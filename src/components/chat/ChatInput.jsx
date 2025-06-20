import React, { useEffect, useRef, useState } from "react";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";

export default function ChatInput({
  onSendMessage,
  messagesLength,
  ref,
  ...props
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const sendRef = useRef(null);
  const sendMessage = () => {
    onSendMessage(input);
    setInput("");
    inputRef.current.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (inputRef.current && inputRef.current.value.trim()) {
          sendRef.current?.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex w-full flex-col items-center justify-center py-2"
      {...props}
    >
      <div className="flex w-full max-w-4xl justify-center">
        <div
          className={`${messagesLength === 0 ? "p-4" : "p-2"} flex w-full items-center gap-2
            rounded-md bg-white shadow-md transition-all duration-200 dark:bg-slate-900`}
        >
          <Input
            ref={inputRef}
            type="text"
            className={`${messagesLength === 0 ? "h-18 pr-24 text-lg" : "h-12 pr-12"} border-0`}
            value={input}
            placeholder={"Type to start ..."}
            onChange={(e) => setInput(e.target.value)}
          ></Input>
          <Button
            icon={"paper-plane"}
            ref={sendRef}
            onClick={sendMessage}
            size={messagesLength === 0 ? "lg" : "md"}
            className={`${messagesLength === 0 ? "w-16" : "w-12"} aspect-square bg-primary-600
              text-white shadow-sm hover:bg-primary-700`}
          ></Button>
        </div>
      </div>
    </div>
  );
}
