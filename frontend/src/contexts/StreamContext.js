import React, { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import axios from "axios";
import { useAuth } from "./AuthContext";

const StreamContext = createContext();

export const useStream = () => {
  const ctx = useContext(StreamContext);
  if (!ctx) throw new Error("useStream must be used within StreamProvider");
  return ctx;
};

export const StreamProvider = ({ children }) => {
  const { user } = useAuth();
  const [chatClient, setChatClient] = useState(null);
  const [videoClient, setVideoClient] = useState(null);
  const [streamReady, setStreamReady] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    if (!user) return;

    let chat = null;
    let video = null;

    const init = async () => {
      try {
        // axios already has the auth header set from AuthContext
        const { data } = await axios.get(`${API_URL}/api/stream/token`);
        const { token, userId, apiKey } = data;

        // --- Chat client ---
        chat = StreamChat.getInstance(apiKey);
        await chat.connectUser({ id: userId, name: user.name }, token);

        // --- Video client ---
        video = new StreamVideoClient({
          apiKey,
          user: { id: userId, name: user.name },
          token,
        });

        setChatClient(chat);
        setVideoClient(video);
        setStreamReady(true);
      } catch (err) {
        console.error("Stream init error:", err);
      }
    };

    init();

    return () => {
      chat?.disconnectUser();
      video?.disconnectUser();
      setChatClient(null);
      setVideoClient(null);
      setStreamReady(false);
    };
  }, [user]);

  return (
    <StreamContext.Provider value={{ chatClient, videoClient, streamReady }}>
      {children}
    </StreamContext.Provider>
  );
};
