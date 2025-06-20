import React, { useEffect, useRef, useState } from "react";
import { dmsApi } from "api";
import { ChatBubble, ChatInput } from "~/chat";
import { ChatSidebar } from "@/components/chat";
import { Button } from "~";
import ChatLanding from "@/pages/chat/landing";

const modes = {
  default: 0,
  search: 2,
  qa: 3,
  doc_qa: 4,
  revision: 5,
};

function Index() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const inputRef = useRef(null);
  const [loading, setloading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState(modes.default);
  const [parentFolderId, setParentFolderId] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [chatTitle, setChatTitle] = useState(null);

  useEffect(() => {
    dmsApi.get(`/dms/chatbox/GetHistory?userId=${user.Id}`).then((response) => {
      setHistory(response.data);
    });
  }, []);
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
      }, 200);
    }
  }, [messages]);

  const getResponse = async (query) => {
    let id = sessionId;
    if (sessionId === null) {
      let newTitle = "Conversation " + (history.length + 1);
      setChatTitle(newTitle);
      id = await startNewChat(newTitle);
    }
    try {
      const response = await dmsApi.get("/dms/chatbox/GetResponse", {
        params: {
          query,
          sessionId: sessionId ?? id,
          userId: user.Id,
        },
      });
      if (response.data.length) {
        let responseMode = response.data[response.data.length - 1].custom?.mode;
        if (responseMode) {
          handleMode(responseMode);
        }
      }
      return response.data.map((message) => {
        if (message.custom && message.custom.buttons) {
          message.custom.action = "SELECT";
        }
        return {
          role: "bot",
          content: message.text ?? message.custom,
        };
      });
    } catch (error) {
      console.error("Error", error);
    }
  };

  const startNewChat = async (title) => {
    let response = await dmsApi.get("/dms/chatbox/NewConversation", {
      params: {
        name: title,
        userId: user.Id,
      },
    });

    setSessionId(response.data.id);
    setHistory((prevHistory) => [
      {
        Id: response.data.id,
        HistoryName: title,
        CreatedDate: new Date().toISOString(),
      },
      ...prevHistory,
    ]);
    return response.data.id;
  };
  const sendMessage = async (message) => {
    setloading(true);
    const newMessage = {
      role: "user",
      content: [
        {
          text: message,
        },
      ],
    };
    setMessages([
      ...messages,
      newMessage, // { role: 'bot', content: [{ text: 'Thinking...' }] },
    ]);

    let userInput;
    switch (mode) {
      case modes.search:
        userInput =
          "/search_info_action" + JSON.stringify({ query_term: message });
        break;
      case modes.qa:
        userInput = "/ask_question" + JSON.stringify({ qa_term: message });
        break;
      case modes.doc_qa:
        userInput = "/ask_question_doc" + JSON.stringify({ qa_term: message });
        break;

      default:
        userInput = message;
        break;
    }
    if (mode === modes.search) {
      setMode(modes.default);
    }
    let response = await getResponse(userInput);
    setloading(false);
    setMessages([...messages, newMessage, ...response]);
  };

  return (
    <main className="flex w-full">
      {/* Mobile Sidebar Toggle */}
      <Button
        className="absolute top-24 right-4 z-30 lg:hidden"
        mode={"secondary"}
        icon={"sidebar"}
        onClick={() => setIsSidebarOpen(true)}
      ></Button>

      <div className="flex min-h-[calc(100dvh-5em)] w-full flex-grow flex-col items-center lg:w-auto">
        {messages.length === 0 ? (
          <ChatLanding
            sendMessage={sendMessage}
            handlePayload={handlePayload}
          />
        ) : (
          <>
            <div className={"sticky h-12 w-full max-w-4xl p-3 pt-4"}>
              <div>
                <h5 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                  {chatTitle || "Chat with AI Assistant"}
                </h5>
              </div>
            </div>
            <div
              className="relative mx-4 my-4 h-full w-full max-w-4xl space-y-2 rounded-xl bg-white/70 p-4
                shadow-xl backdrop-blur-sm transition-all duration-300 dark:bg-slate-900"
            >
              <div className="flex flex-col gap-2 whitespace-pre-wrap">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`transform transition-all duration-300
                      ${message.role === "user" ? "animate-slide-in-top" : "animate-slide-in-bottom"}`}
                  >
                    <ChatBubble
                      role={message.role}
                      content={message.content}
                      onSelect={async (payload) => {
                        handlePayload(payload);
                        let response = await getResponse(payload);

                        setMessages([...messages, ...response]);
                      }}
                      onUpload={async (file) => await handleFileUpload(file)}
                      enabled={index === messages.length - 1}
                    />
                  </div>
                ))}
                {loading && (
                  <ChatBubble role="robot" content={{ action: "loading" }} />
                )}
              </div>
            </div>

            <div className="animate-fade-in w-full max-w-5xl px-4">
              <ChatInput onSendMessage={sendMessage} ref={inputRef} />
            </div>
          </>
        )}
      </div>
      {/* Sidebar */}
      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        history={history}
        onDeleteChat={(id) => {
          dmsApi
            .get("/dms/chatbox/DeleteHistory", {
              params: {
                sessionId: id,
              },
            })
            .then(() => {
              let newHistory = history.filter((item) => item.Id !== id);
              setHistory(newHistory);
            });
        }}
        onNewChat={() => {
          setMessages([]);
          setSessionId(null);
        }}
        onSelect={(history) => {
          dmsApi
            .get("/dms/chatbox/GetChatMessages", {
              params: {
                sessionId: history.Id,
              },
            })
            .then((response) => {
              console.log(response);
              let responses = [];
              response.data
                .sort(
                  (a, b) => new Date(a.CreatedDate) - new Date(b.CreatedDate),
                )
                .forEach((message) => {
                  let user = message["Response"];

                  let content = "";

                  if (user === "user") {
                    if (message["Message"].startsWith("/extract_entities")) {
                      content = "Extract Entities";
                    } else if (message["Message"] === "/search_document") {
                      content = "Search Document";
                    } else if (message["Message"] === "/show_menu") {
                      content = "Show Menu";
                    } else if (message["Message"] === "/upload_document") {
                      content = "Upload Document";
                    } else if (message["Message"] === "/request_summary") {
                      content = "Summarize Document ";
                    } else if (message["Message"] === "/qa_document") {
                      content = "Q&A ";
                    } else if (message["Message"] === "/exit_task") {
                      content = "Exit Q&A";
                    } else if (
                      message["Message"].startsWith("/search_info_action")
                    ) {
                      let jsonPart = message["Message"].replace(
                        "/search_info_action",
                        "",
                      );
                      try {
                        let parsed = JSON.parse(jsonPart);
                        content = parsed.query_term;
                      } catch (err) {
                        console.error("Invalid JSON format");
                      }
                    } else if (
                      message["Message"].startsWith("/ask_question_doc")
                    ) {
                      let jsonPart = message["Message"].replace(
                        "/ask_question_doc",
                        "",
                      );
                      try {
                        let parsed = JSON.parse(jsonPart);
                        content = parsed.qa_term;
                      } catch (err) {
                        console.error("Invalid JSON format");
                      }
                    } else if (
                      message["Message"].startsWith("/select_document")
                    ) {
                      content = null;
                    } else if (
                      message["Message"].startsWith("/request_summary")
                    ) {
                      content = "Summarize";
                    } else if (message["Message"].startsWith("/qa_context")) {
                      content = "Ask a Question";
                    } else if (
                      message["Message"].startsWith("/revision_compare")
                    ) {
                      content = "Compare Revisions";
                    } else if (
                      message["Message"].startsWith("/select_workspace")
                    ) {
                      content = "Select Workspace";
                    } else {
                      content = message["Message"];
                    }
                    if (content)
                      responses.push({
                        role: "user",
                        content,
                      });
                  } else {
                    try {
                      const parsedMessages = JSON.parse(message["Message"]);
                      parsedMessages.forEach((botMessage) => {
                        responses.push({
                          role: "bot",
                          content: botMessage.text ?? botMessage.custom,
                        });
                      });
                    } catch (err) {
                      console.error(
                        " Invalid bot message format:",
                        message["Message"],
                      );
                      responses.push({
                        role: "bot",
                        content: message["Message"], // fallback if not JSON
                      });
                    }
                  }
                });

              setMessages(responses);
              setSessionId(history.Id);
              setChatTitle(history["HistoryName"]);
            });
        }}
      />
    </main>
  );

  function handleMode(responseMode) {
    console.log(responseMode);
    if (responseMode === "SEARCH") {
      setMode(modes.search);
    }
  }

  function handlePayload(payload) {
    console.log(mode);
    if (
      payload === "/search_document" ||
      payload === "/extract_entities" ||
      payload === "/revision_compare"
    ) {
      setMode(modes.search);
    } else if (payload === "/qa_document") {
      setMode(modes.qa);
    } else if (payload.startsWith("/qa_context")) {
      setMode(modes.doc_qa);
    } else if (payload === "/exit_task") {
      setMode(modes.default);
    } else if (payload.startsWith("/select_doc_type")) {
      let id = payload.match(/"document_type_id":\s*"([^"]+)"/)[1];
      setTemplateId(id);
    } else if (payload.startsWith("/select_folder")) {
      let id = payload.match(/"folder_id":\s*"([^"]+)"/)[1];
      setParentFolderId(id);
    }
  }

  async function handleFileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);

    let { data } = await dmsApi.post("/dms/query/DmsFileUpload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    let fileData = await dmsApi.get(`/dms/query/CreateDocumentOfFile`, {
      params: {
        userId: user.Id,
        parentFolderId,
        fileId: data.fileId,
        fileName: data.filename,
        templateId,
      },
    });

    let noteData = fileData.data["Item"];
    let response = await getResponse(
      "/upload_doc_complete" +
        JSON.stringify({
          document_id: noteData.Id,
          document_name: noteData.NoteSubject,
          document_no: noteData.NoteNo,
        }),
    );
    setMessages([...messages, ...response]);
  }
}

export default Index;
