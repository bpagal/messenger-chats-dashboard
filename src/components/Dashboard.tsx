import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Conversation } from "@/types/conversation.types";
import { Button } from "./ui/button";
import { Messages } from "./Messages";
import type { DateRange } from "react-day-picker";
import { convertToMessageType } from "@/utils/helpers";

export const Dashboard = () => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [query, setQuery] = useState("");

  const resultsMessages = useMemo(() => {
    const messages = conversation?.messages ?? [];

    if (!query) return messages;

    const lowerQuery = query?.toLowerCase();

    return messages?.filter((msg) =>
      msg.text?.toLowerCase().includes(lowerQuery),
    );
  }, [conversation?.messages, query]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredMessages = useMemo(() => {
    let msgs = resultsMessages;

    if (dateRange?.from && dateRange?.to) {
      const from = new Date(dateRange.from).setHours(0, 0, 0, 0);
      const to = new Date(dateRange.to).setHours(23, 59, 59, 999);

      msgs = msgs?.filter(
        (msg) => msg.timestamp >= from && msg.timestamp <= to,
      );
    }

    // ALWAYS sort ascending by date (oldest → newest)
    return [...msgs].sort((a, b) => a.timestamp - b.timestamp);
  }, [resultsMessages, dateRange]);

  return (
    <div className="">
      <div className="p-8 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="json-file">Upload JSON File</Label>
          <Input
            id="json-file"
            type="file"
            accept=".json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();

              reader.onload = (e) => {
                if (!e.target) return;

                const fileContents = e.target.result;
                if (!(typeof fileContents === "string")) return;

                const jsonData: Conversation = JSON.parse(fileContents);
                const isFacebookExport = "sender_name" in jsonData.messages[0];
                const initJsonDataMessages: Conversation["messages"] =
                  isFacebookExport
                    ? convertToMessageType(jsonData.messages)
                    : jsonData.messages;

                const messagesWithId: Conversation["messages"] =
                  initJsonDataMessages.map((elem) => ({
                    ...elem,
                    id: crypto.randomUUID(),
                  }));

                setConversation({
                  ...jsonData,
                  messages: messagesWithId,
                });
              };

              reader.readAsText(file);
            }}
          />

          <Input
            placeholder="Search messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
                disabled={!conversation}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} –{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick date range</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {!!filteredMessages && <Messages messages={filteredMessages} />}
    </div>
  );
};
