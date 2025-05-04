import Navbar from "../components/common/navbar";
import NoChatSelected from "../components/home/no-chat-selected";
import ChatContainer from "../components/home/chat-container";
import Sidebar from "../components/home/sidebar";
import { useUserChatStore } from "../store/chat-store";
import { useEffect } from "react";
import { useUserStore } from "../store/user-store";
import { useSocketStore } from "../store/socket-store";

const HomePage = () => {
  const selectedUserId = useUserChatStore((state) => state.selectedUser);
  const socket = useSocketStore((state) => state.socket);
  const connectSocket = useSocketStore((state) => state.connectSocket);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (socket || !user) return;
    connectSocket(user._id);
  }, []);

  return (
    <>
      <Navbar />
      <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-20 px-4">
          <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar />
              {!selectedUserId ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
