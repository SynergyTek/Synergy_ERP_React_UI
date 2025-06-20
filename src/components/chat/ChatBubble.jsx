import React, { useEffect, useState } from "react";
import { WordCloud } from "~/chat/WordCloud";
import ListButton from "~/chat/ListButton";
import PropTypes from "prop-types";
import { Input } from "~/ui/input";
import { Icon } from "~";
import { SyncLoader } from "react-spinners";

function ChangeLine({ line, type, text }) {
  return (
    <div className="flex flex-col">
      {type === "add" && (
        <span
          className={`flex items-center gap-4 bg-green-400/50 p-2 font-semibold text-primary-50
          dark:bg-green-500/20`}
        >
          <Icon icon={"add"}></Icon>
          <p>{line.updated_range[0]}</p>
          <p>{text}</p>
        </span>
      )}
      {type === "remove" && (
        <span
          className={
            "flex items-center gap-4 bg-red-400/50 p-2 text-primary-50 dark:bg-red-500/20"
          }
        >
          <Icon icon={"minus"}></Icon>
          <p>{line.original_range[0]}</p>
          <p className="">{text}</p>
        </span>
      )}
    </div>
  );
}

function Change({ data }) {
  let { line_numbers, type, original_lines, updated_lines } = data;
  return (
    <div className="flex flex-col">
      {type === "insert" && (
        <ChangeLine line={line_numbers} type="add" text={updated_lines} />
      )}
      {type === "replace" && (
        <>
          <ChangeLine line={line_numbers} type="remove" text={original_lines} />
          <ChangeLine line={line_numbers} type="add" text={updated_lines} />
        </>
      )}
      {type === "delete" && (
        <ChangeLine line={line_numbers} type="remove" text={original_lines} />
      )}
    </div>
  );
}

function ChatBubble({
  content,
  role = "user",
  theme = "light",
  enabled = true,
  ...props
}) {
  const inputRef = React.useRef(null);
  const [message, setMessage] = useState(<span>...</span>);
  useEffect(() => {
    if (content) {
      if (Array.isArray(content)) {
        setMessage(
          <p className="text-primary-50">
            {content.map((message) => message.text).join("\n")}
          </p>,
        );
      } else if (typeof content === "object") {
        switch (content.action) {
          case "SELECT":
          case "VIEW":
            setMessage(
              <>
                {content.text && (
                  <p className="mb-2 text-primary-100">
                    {content.text.replaceAll("\\n", "\n")}
                  </p>
                )}
                {content.json && <pre>{content.json}</pre>}
                {content.buttons && (
                  <div
                    className={`${enabled ? "" : "pointer-events-none opacity-70"} flex flex-col gap-[1px]
                    overflow-clip rounded-lg border border-primary-300 bg-primary-100 text-sm
                    font-medium text-primary-900 dark:border-primary-500 dark:bg-primary-900/70
                    dark:text-primary-50`}
                  >
                    {content.buttons.map((button, index) => (
                      <ListButton
                        key={index}
                        text={button.title}
                        onClick={
                          enabled ? () => props.onSelect(button.payload) : null
                        }
                      />
                    ))}
                  </div>
                )}
              </>,
            );
            break;
          case "UPLOAD":
            setMessage(
              <span>
                <Input
                  ref={inputRef}
                  type="file"
                  onInput={(e) => {
                    props.onUpload(e.target.files[0], content.payload);
                  }}
                />
              </span>,
            );
            break;
          case "CHART":
            let json = JSON.parse(content.text.replaceAll("\\n", ""));
            let words = [];
            let wordCount = {};
            for (let [key, value] of Object.entries(json)) {
              if (["person", "org", "loc"].includes(key)) {
                value?.split(",").forEach((word) => {
                  word = word.trim();
                  if (word in wordCount) {
                    wordCount[word] += 1;
                  } else {
                    wordCount[word] = 1;
                  }
                  words.push(word);
                });
              }
            }

            setMessage(
              <>
                <WordCloud
                  theme={theme}
                  words={words}
                  height={300}
                  width={400}
                />
                <div
                  className="mt-4 flex h-48 flex-col rounded border-2 border-primary-700
                    dark:border-primary-950"
                >
                  <div
                    className={`flex w-full bg-primary-900/80 p-2 px-3 text-sm font-bold tracking-wider
                      dark:bg-primary-950/60 dark:text-primary-300`}
                  >
                    <span className={"w-full"}>Entity</span>
                    <span>Count</span>
                  </div>
                  <div
                    className={
                      "h-full overflow-y-scroll bg-primary-900/30 dark:bg-primary-950/20"
                    }
                  >
                    {Object.entries(wordCount).map((entry, index) => (
                      <span key={index} className={"flex w-full px-3 py-1"}>
                        <p className={"w-full"}>{entry[0]}</p>
                        <p>{entry[1]}</p>
                      </span>
                    ))}
                  </div>
                </div>
              </>,
            );
            break;
          case "COMPARE":
            const parsedJson =
              typeof content.json === "string"
                ? JSON.parse(content.json)
                : content.json;
            setMessage(
              parsedJson.diff_count > 0 ? (
                <>
                  <p className={"mb-2"}>{content.text}</p>
                  <div className={"flex flex-col gap-2 text-xs"}>
                    {parsedJson &&
                      parsedJson.differences.map((diff, index) => {
                        return <Change key={index} data={diff} />;
                      })}
                  </div>
                </>
              ) : (
                <p>No differences found</p>
              ),
            );
            break;
          case "loading":
            setMessage(
              <SyncLoader color="#fff" size={5} speedMultiplier={0.6} />,
            );
            break;

          default:
            setMessage(
              <p className="text-primary-50">
                {content.text ?? JSON.stringify(content)}
              </p>,
            );
            break;
        }
      } else {
        setMessage(content);
      }
    }
  }, [theme, enabled]);
  return (
    <div
      className={`${role === "user" ? "col-start-6 col-end-13" : "col-start-1 col-end-8"}
        rounded-lg py-1`}
    >
      <div
        className={`flex max-w-full ${role === "user" ? "flex-row-reverse" : "flex-row"} items-end`}
      >
        <span
          className={`flex h-8 min-w-8 items-center justify-center rounded-full opacity-70 ${
            role === "user"
              ? "bg-secondary-600 text-primary-50 dark:bg-secondary-700"
              : "bg-primary-500 text-primary-50 dark:bg-primary-800"
            }`}
        >
          <Icon variant={"fas"} icon={role === "user" ? "user" : "robot"} />
        </span>
        <div
          className={`max-w-[calc(400px+4em)] min-w-0 rounded-xl p-4 text-sm shadow ${
            role === "user"
              ? "mr-3 rounded-br-none bg-secondary-600 text-primary-50 dark:bg-secondary-700"
              : "ml-3 rounded-bl-none bg-primary-500 text-primary-50 dark:bg-primary-800"
            }`}
        >
          <span
            className={`${
              role === "user"
                ? "text-primary-50 dark:text-white"
                : "text-primary-50"
              }`}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}

ChatBubble.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  role: PropTypes.oneOf(["user", "bot"]).isRequired,
  theme: PropTypes.oneOf(["light", "dark"]),
  enabled: PropTypes.bool,
};
export default ChatBubble;
