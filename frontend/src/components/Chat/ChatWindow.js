import React, { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageComposer,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import axios from "axios";
import { MdClose, MdVideoCall } from "react-icons/md";
import { useStream } from "../../contexts/StreamContext";
import { useAuth } from "../../contexts/AuthContext";
import StreamVideoCall from "../VideoCall/StreamVideoCall";

const ChatWindow = ({ orderId, onClose }) => {
  const { chatClient, streamReady } = useStream();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    if (!streamReady || !chatClient) return;

    const setupChannel = async () => {
      try {
        // Tell backend to create/get the channel and add members
        await axios.post(`${API_URL}/api/stream/channel/${orderId}`);

        const ch = chatClient.channel("messaging", `order-${orderId}`);
        await ch.watch();
        setChannel(ch);
      } catch (err) {
        console.error("Channel setup error:", err);
        setError("Could not load chat. Please try again.");
      }
    };

    setupChannel();

    return () => {
      channel?.stopWatching();
    };
  }, [streamReady, chatClient, orderId]);

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border-2 border-[#185697] p-6 z-50">
        <p className="text-red-500">{error}</p>
        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500 underline"
        >
          Close
        </button>
      </div>
    );
  }

  if (!streamReady || !channel) {
    return (
      <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border-2 border-[#185697] flex items-center justify-center z-50">
        <div className="text-gray-500 text-sm">Loading chat...</div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border-2 border-[#185697] flex flex-col z-50 overflow-hidden">
        {/* Header */}
        <div className="bg-[#185697] text-white px-4 py-3 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm">Chat — Order #{orderId}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setInCall(true)}
              className="p-1.5 hover:bg-blue-700 rounded transition"
              title="Start Video Call"
            >
              <MdVideoCall size={22} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-blue-700 rounded transition"
            >
              <MdClose size={18} />
            </button>
          </div>
        </div>

        {/* Stream Chat UI */}
        <div className="flex-1 overflow-hidden">
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <Window>
                <MessageList />
                <MessageComposer />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>

      {/* Video call overlay */}
      {inCall && (
        <StreamVideoCall orderId={orderId} onClose={() => setInCall(false)} />
      )}
    </>
  );
};

export default ChatWindow;
