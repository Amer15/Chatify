import React, { useEffect, useState } from "react";
import { Image, Send, X } from "lucide-react";
import { toast } from "sonner";
import { sendMessage } from "../../api-services/message-services";
import { useUserChatStore } from "../../store/chat-store";
import { queryClient } from "../../main";
import { chatKeys } from "../../queries/chat-queries";
import { Message } from "../../types";
import { useUserStore } from "../../store/user-store";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setSelectedFilePreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
        setSelectedFilePreview(null);
      };
    }
  }, [selectedFile]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("HANDLE SELECT CALLED!");
    try {
      const file = e.target.files?.[0];

      if (!file) {
        return;
      }

      const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/png",
      ];

      if (!allowedMimeTypes.includes(file.type)) {
        toast.error(
          `invalid file format, only ${allowedMimeTypes.join(
            ", "
          )} formats are allowed`
        );
        return;
      }

      const maxFileSize = 5 * 1024 * 1024;

      if (file.size > maxFileSize) {
        toast.error(`file too large, max file size is 5MB`);
        return;
      }

      setSelectedFile(file);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Oop! something went wrong");
      }
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setSelectedFilePreview(null);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const user = useUserStore.getState().user;
      if ((!text.trim() && !setSelectedFilePreview) || !user) return;
      const selectedUser = useUserChatStore.getState().selectedUser;

      if (!selectedUser) {
        throw new Error("failed to send message, missing receiver");
      }

      const formData = new FormData();
      formData.append("receiverId", selectedUser._id);
      formData.append("message", text);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      await sendMessage(formData);
      setText("");
      setSelectedFile(null);
      if (selectedFilePreview) {
        URL.revokeObjectURL(selectedFilePreview);
      }
      setSelectedFilePreview(null);
      queryClient.setQueryData(
        chatKeys.selectedUser(selectedUser._id),
        (oldData: {
          total_pages: number;
          current_page: number;
          items_per_page: number;
          current_page_items: number;
          messages: Message[];
        }) => {
          if (!oldData) return;

          return {
            ...oldData,
            messages: [
              ...oldData.messages,
              {
                message: text,
                image: null,
                senderId: user._id,
                receiverId: selectedUser._id,
                createdAt: new Date().toISOString()
              },
            ],
            current_page_items: oldData.current_page_items + 1,
          };
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("failed to send message");
      }
    }
  };

  return (
    <div className="p-4 w-full">
      {selectedFilePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={selectedFilePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <label
            className={`hidden sm:flex btn btn-circle cursor-pointer
    ${selectedFilePreview ? "text-emerald-500" : "text-zinc-400"}`}
          >
            <Image size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !selectedFilePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
