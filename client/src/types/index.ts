export type User = {
  _id: string;
  fullName: string;
  email: string;
  profileImage: string;
  createdAt: string;
};

export type Message = {
  _id: string;
  receiverId: string;
  senderId: string;
  message: string | null;
  image: string | null;
  createdAt: string;
};

export type UserStoreProps = {
  user: User | null;
  isAuth: boolean;
  setUser: (payload: User) => void;
  updateUser: (payload: User) => void;
  removeUser: () => void;
};

export type UserChatStoreProps = {
  selectedUser: User | null;
  onlineUsers: string[];
  setSelectedUser: (payload: User) => void;
  removeSelectedUser: () => void;
  updateOnlineUsers: (payload: string[]) => void;
};
