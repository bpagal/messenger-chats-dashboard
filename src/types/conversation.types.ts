type Reaction = {
  actor: string;
  reaction: string;
};

type Message = {
  isUnsent: false;
  media: Blob[];
  reactions: Reaction[];
  senderName: string;
  text: string;
  timestamp: number;
  type: "text";
};

export type Conversation = {
  participants: string[];
  threadName: string;
  messages: Message[];
};
