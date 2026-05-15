import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || window.location.origin;

  useEffect(() => {
    if (user) {
      const token = sessionStorage.getItem("token");
      const newSocket = io(SOCKET_URL, { auth: { token } });

      newSocket.on("connect", () => {
        setConnected(true);
      });

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
        setConnected(false);
      });

      newSocket.on("disconnect", () => setConnected(false));

      newSocket.on("order-update", (data) => {
        toast.success(data.message);
      });

      newSocket.on("new-order", () => {
        if (user.role === "agent") toast.success("New order available!");
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user, SOCKET_URL]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
