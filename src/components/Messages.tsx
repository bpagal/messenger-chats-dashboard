import type { Conversation } from "@/types/conversation.types";
import { formatTime } from "@/utils/helpers";

type Props = {
  messages: Conversation["messages"];
};

export const Messages = ({ messages }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => {
        const text = message.text ?? "[No text]";

        return (
          <p className="whitespace-pre-line" key={message.id}>
            <strong>
              [{formatTime(message.timestamp)}] {message.senderName}:
            </strong>
            {text}
          </p>
        );
      })}
    </div>
  );
};
