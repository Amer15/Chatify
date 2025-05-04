import { useEffect, useRef } from "react";
import { useChat } from "../../queries/chat-queries";
import { useUserChatStore } from "../../store/chat-store";
import { useUserStore } from "../../store/user-store";
import { formatMessageTime } from "../../utils";
import ChatHeader from "./chat-header";
import MessageInput from "./message-input";

const ChatContainer = () => {
  const selectedUser = useUserChatStore((state) => state.selectedUser);
  const user = useUserStore((state) => state.user);
  const { data, isLoading } = useChat(selectedUser?._id ?? "");
  const lastRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data?.messages) {
      lastRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.messages]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {!isLoading && data && data.messages && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {data.messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === user?._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === user?._id
                        ? user?.profileImage || "/avatar.png"
                        : selectedUser?.profileImage || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.message && <p>{message.message}</p>}
              </div>
            </div>
          ))}
          <div ref={lastRef} />
        </div>
      )}

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
