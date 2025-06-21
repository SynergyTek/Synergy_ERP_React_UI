import React, { useEffect, useRef, useState } from "react";
// import { dmsApi } from "api"; // We will use fetch directly
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

  const API_BASE_URL = "https://localhost:7039";

  // useEffect(() => {
  //   if (user.Id) {
  //       fetch(`${API_BASE_URL}/dms/chatbox/GetHistory?userId=${user.Id}`)
  //         .then(res => {
  //             if (!res.ok) {
  //                 throw new Error(`HTTP error! status: ${res.status}`);
  //             }
  //             return res.json();
  //         })
  //         .then(data => {
  //           setHistory(data);
  //         }).catch(error => console.error("Failed to fetch history:", error));
  //   }
  // }, [user.Id]);

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

  // const getResponse = async (query) => {
  //   let id = sessionId;
  //   if (sessionId === null) {
  //     let newTitle = "Conversation " + (history.length + 1);
  //     setChatTitle(newTitle);
  //     id = await startNewChat(newTitle);
  //   }
  //   try {
  //     const url = `${API_BASE_URL}/dms/chatbox/GetResponse?` + new URLSearchParams({
  //         query,
  //         sessionId: id,
  //         userId: user.Id,
  //     });

  //     const response = await fetch(url);
  //      if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     debugger
  //     if (data.length) {
  //       let responseMode = data[data.length - 1].custom?.mode;
  //       if (responseMode) {
  //         handleMode(responseMode);
  //       }
  //     }
  //     return data.map((message) => {
  //       debugger
  //       if (message.custom && message.custom.buttons) {
  //         message.custom.action = "SELECT";
  //       }
  //       return {
  //         role: "bot",
  //         content: message.text ?? message.custom,
  //       };
  //     });
  //   } 
  //   catch (error) {
  //     console.error("Error fetching response:", error);
  //     return [{ role: 'bot', content: 'Sorry, I encountered an error.' }];
  //   }
  // };

const getResponse = async (query) => {
  let id = sessionId;

  if (sessionId === null) {
    let newTitle = "Conversation " + (history.length + 1);
    setChatTitle(newTitle);
    id = await startNewChat(newTitle);
  }

  try {
    const url = `${API_BASE_URL}/dms/chatbox/GetResponse?` + new URLSearchParams({
      query,
      sessionId: id,
      userId: user.Id,
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawText = await response.text();
    console.log("Raw response from backend:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse JSON from backend:", parseError);
      return [{ role: 'bot', content: 'Invalid response format from server.' }];
    }


    const messages = Array.isArray(data) ? data : [data];

    if (messages.length) {
      let responseMode = messages[messages.length - 1].custom?.mode;
      if (responseMode) {
        handleMode(responseMode);
      }
    }

    return messages.map((message) => {
      if (message.custom && message.custom.buttons) {
        message.custom.action = "SELECT";
      }

      return {
        role: "bot",
        content: message.text ?? message.custom ?? "No response text.",
      };
    });

  } catch (error) {
    console.error("Error fetching response:", error);
    return [{ role: 'bot', content: 'Sorry, I encountered an error.' }];
  }
};


  const startNewChat = async (title) => {
    const url = `${API_BASE_URL}/dms/chatbox/NewConversation?` + new URLSearchParams({
        name: title,
        userId: user.Id,
    });
    let response = await fetch(url);
    let data = await response.json();

    setSessionId(data.id);
    setHistory((prevHistory) => [
      {
        Id: data.id,
        HistoryName: title,
        CreatedDate: new Date().toISOString(),
      },
      ...prevHistory,
    ]);
    return data.id;
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
      newMessage,
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
    if(response) {
      setMessages([...messages, newMessage, ...response]);
    }
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
                        const newMessage = { role: 'user', content: [{ text: "Selected: " + payload }]};
                        setMessages([...messages, newMessage]);
                        let response = await getResponse(payload);
                        if(response) {
                          setMessages([...messages, newMessage, ...response]);
                        }
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
           const url = `${API_BASE_URL}/dms/chatbox/DeleteHistory?` + new URLSearchParams({ sessionId: id });
           fetch(url, { method: 'GET' }) // Assuming DELETE is GET for simplicity as in controller
            .then(res => {
                if(!res.ok) throw new Error("Failed to delete");
                let newHistory = history.filter((item) => item.Id !== id);
                setHistory(newHistory);
                setMessages([]);
                setSessionId(null);
                setChatTitle(null);
            }).catch(console.error);
        }}
        onNewChat={() => {
          setMessages([]);
          setSessionId(null);
          setChatTitle(null);
        }}
        onSelect={(selectedHistory) => {
          const url = `${API_BASE_URL}/dms/chatbox/GetChatMessages?` + new URLSearchParams({ sessionId: selectedHistory.Id });
          fetch(url)
            .then(res => res.json())
            .then((data) => {
              let responses = [];
              data.forEach((message) => {
                  let userOrBot = message.Response; // Changed from 'user'
                  let content = "";

                  if (userOrBot === "user") {
                      // This logic parses specific command-like messages from the user
                      if (message.Message.startsWith("/extract_entities")) {
                          content = "Extract Entities";
                      } else if (message.Message.startsWith("/search_info_action")) {
                          let jsonPart = message.Message.replace("/search_info_action", "");
                          try {
                              let parsed = JSON.parse(jsonPart);
                              content = parsed.query_term;
                          } catch (err) { content = "Search"; }
                      } else {
                          content = message.Message;
                      }
                      if (content)
                        responses.push({
                          role: "user",
                          content: [{text: content}],
                        });
                  } else { // bot messages
                    try {
                      // Rasa bot messages are often a JSON string of a list of messages
                      const parsedMessages = JSON.parse(message.Message);
                      parsedMessages.forEach((botMessage) => {
                        responses.push({
                          role: "bot",
                          content: botMessage.text ?? botMessage.custom,
                        });
                      });
                    } catch (err) {
                       // If not a JSON string, treat as plain text
                      responses.push({
                        role: "bot",
                        content: message.Message,
                      });
                    }
                  }
                });

              setMessages(responses);
              setSessionId(selectedHistory.Id);
              setChatTitle(selectedHistory.HistoryName);
            }).catch(console.error);
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
      let idMatch = payload.match(/"document_type_id":\s*"([^"]+)"/);
      if(idMatch) setTemplateId(idMatch[1]);
    } else if (payload.startsWith("/select_folder")) {
      let idMatch = payload.match(/"folder_id":\s*"([^"]+)"/);
      if(idMatch) setParentFolderId(idMatch[1]);
    }
  }

  async function handleFileUpload(file) {
    const formData = new FormData();
    formData.append("file", file);

    // Note: These dms/query endpoints are not in your ChatboxController.cs
    // You would need to implement them separately in your backend.
    console.log("File upload is not yet implemented in the backend controller provided.");

    /*
    // Example of how you might call them if they existed:
    try {
        let { data } = await dmsApi.post("/dms/query/DmsFileUpload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
    } catch(error) {
        console.error("File upload failed", error);
    }
    */
  }
}

export default Index;