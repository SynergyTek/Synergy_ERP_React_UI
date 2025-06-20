import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faMessage,
  faRocket,
  faShieldAlt,
} from "@awesome.me/kit-9b926a9ec0/icons/classic/solid";
import { ChatInput } from "~/chat";

const suggestions = [
  {
    icon: faRocket,
    title: "Upload Document",
    description: "Upload and analyze new documents with AI assistance",
    color: "blue",
    payload: "/upload_document",
  },
  {
    icon: faBrain,
    title: "Search Document",
    description: "Find specific information across all your documents",
    color: "green",
    payload: "/search_document",
  },
  {
    icon: faShieldAlt,
    title: "Compare Revisions",
    description: "Compare different versions of your documents",
    color: "purple",
    payload: "/revision_compare",
  },
];

const features = [
  {
    icon: faMessage,
    title: "Natural Conversations",
    description:
      "Engage in human-like conversations with our advanced AI assistant.",
  },
  {
    icon: faBrain,
    title: "Smart Document Analysis",
    description:
      "Get intelligent insights and answers from your documents instantly.",
  },
  {
    icon: faShieldAlt,
    title: "Secure & Private",
    description:
      "Your conversations and documents are protected with enterprise-grade security.",
  },
  {
    icon: faRocket,
    title: "Instant Responses",
    description:
      "Get quick and accurate responses to your queries in real-time.",
  },
];

const ChatLanding = ({ sendMessage, handlePayload }) => {
  return (
    <div className="animate-fade-in flex w-full flex-1 items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="mx-auto px-4 pt-16">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-6xl dark:text-white">
              Meet Your AI Assistant
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              Experience the power of AI-driven document management and
              intelligent conversations.
            </p>
          </div>
          {/* Suggestions */}
          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`flex transform cursor-pointer flex-col rounded-xl border-l-4
                border-${suggestion.color}-500 bg-white p-5 shadow-md transition-all
                duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800`}
                onClick={() => handlePayload(suggestion.payload)}
              >
                <div className="mb-3 flex items-center">
                  <div
                    className={`mr-3 flex h-10 w-10 items-center justify-center rounded-lg
                    bg-${suggestion.color}-100 dark:bg-${suggestion.color}-900`}
                  >
                    <FontAwesomeIcon
                      icon={suggestion.icon}
                      className={`h-5 w-5 text-${suggestion.color}-600 dark:text-${suggestion.color}-400`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {suggestion.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {suggestion.description}
                </p>
              </div>
            ))}
          </div>
          <ChatInput
            className={"my-12"}
            onSendMessage={sendMessage}
            messagesLength={0}
          />
          {/* How It Works Section */}
          <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
                    bg-primary-100 dark:bg-primary-900"
                >
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    1
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Upload Documents
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload your documents to the system for AI analysis
                </p>
              </div>
              <div className="text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
                    bg-primary-100 dark:bg-primary-900"
                >
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    2
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Ask Questions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Chat with the AI about your documents and get instant answers
                </p>
              </div>
              <div className="text-center">
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
                    bg-primary-100 dark:bg-primary-900"
                >
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    3
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Get Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive intelligent insights and recommendations
                </p>
              </div>
            </div>
          </div>
          {/* Features Grid */}
          <div className="my-16 flex flex-col gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="transform rounded-xl bg-white p-6 shadow-lg transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center justify-start gap-4">
                  <div
                    className={
                      "rounded-lg bg-primary-100 px-3 py-2 dark:bg-primary-900"
                    }
                  >
                    <FontAwesomeIcon
                      icon={feature.icon}
                      className="h-6 w-6 text-primary-600 dark:text-primary-400"
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLanding;
