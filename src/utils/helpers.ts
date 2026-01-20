export const formatTime = (ts: number) => {
  const d = new Date(ts);

  // Short date
  const shortDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

  // Full date
  const fullDate = d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Time in h:mm AM/PM

  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${shortDate} ${fullDate}, ${time}`;
};

export const convertToMessageType = (data: any) => {
  return data.map((elem: any) => ({
    isUnsent: false,
    media: [],
    reactions: [],
    senderName: elem.sender_name,
    text: elem.content,
    timestamp: elem.timestamp_ms,
    type: "text",
  }));
};
