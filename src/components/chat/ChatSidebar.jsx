import { Button } from "~";
import { useEffect, useState } from "react";

const humanizeDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ChatSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  history,
  onDeleteChat,
  onSelect = (item) => {},
  onNewChat = () => {},
}) {
  const [items, setItems] = useState(
    history.sort((a, b) => {
      return new Date(a.CreatedDate) < new Date(b.CreatedDate) ? 1 : -1;
    }),
  );
  const deleteHistory = (id) => {
    onDeleteChat(id);
  };
  useEffect(() => {
    setItems(history);
  }, [history]);
  return (
    <div
      className={`fixed inset-y-0 top-0 right-0 flex h-[calc(100dvh-5em)] transform flex-col
        overflow-y-auto bg-white/80 shadow-lg transition-transform duration-300
        ease-in-out lg:sticky dark:bg-slate-800/90 ${
        isSidebarOpen
            ? "z-40 w-3/5 min-w-64 translate-x-0"
            : "w-72 translate-x-full lg:translate-x-0"
        }`}
    >
      <div
        className="sticky top-0 z-10 border-b border-gray-300 bg-white/70 p-4 text-lg font-bold
          backdrop-blur-sm dark:border-gray-700 dark:bg-slate-900/70"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={"text-primary-950 dark:text-primary-50"}>
              History
            </span>
          </div>
          {isSidebarOpen && (
            <Button
              mode={"secondary"}
              icon={"close"}
              onClick={() => setIsSidebarOpen(false)}
            ></Button>
          )}
        </div>
      </div>
      <div className="flex-grow space-y-2 p-2">
        {/* History Items Placeholder */}
        <Button
          text={"New Chat"}
          onClick={onNewChat}
          icon={"plus"}
          className="border-opacity-40 mb-2 w-full border"
        ></Button>
        {items.map((item, i) => {
          return (
            <div
              key={i}
              className="group flex transform cursor-pointer justify-between rounded-lg p-3 text-sm
                text-gray-700 transition-all duration-200 hover:scale-[1.02] hover:bg-gray-200
                hover:shadow-md dark:text-gray-300 dark:hover:bg-slate-700"
            >
              <div
                onClick={() => {
                  onSelect(item);
                }}
              >
                <div
                  className="font-medium transition-colors group-hover:text-blue-600
                    dark:group-hover:text-blue-400"
                >
                  {item["HistoryName"]}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {humanizeDate(item["CreatedDate"])}
                </div>
              </div>
              <Button
                mode={"tertiary"}
                icon={"trash"}
                onClick={(e) => {
                  deleteHistory(item["Id"]);
                }}
              ></Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
