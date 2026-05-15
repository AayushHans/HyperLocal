import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});

  // Load messages from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("chatMessages");
    if (stored) {
      try {
        setChatMessages(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load chat messages", e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(chatMessages).length > 0) {
      sessionStorage.setItem("chatMessages", JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!socket || !user) return;

    // Listen for incoming chat messages
    socket.on("chat-message", (message) => {
      // Store the message
      setChatMessages((prev) => ({
        ...prev,
        [message.orderId]: [...(prev[message.orderId] || []), message],
      }));

      // Only count as unread if:
      // 1. Message is not from current user
      // 2. Chat window for this order is not currently open
      if (message.senderId !== user.userId && activeChat !== message.orderId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [message.orderId]: (prev[message.orderId] || 0) + 1,
        }));

        // Show toast notification for new message
        showMessageNotification(message);
      }
    });

    return () => {
      socket.off("chat-message");
    };
  }, [socket, user, activeChat, chatMessages]);

  const playNotificationSound = () => {
    // Create a simple notification sound using Web Audio API
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log("Could not play notification sound", e);
    }
  };

  const showMessageNotification = (message) => {
    // Play notification sound
    playNotificationSound();

    // Dynamic import to avoid circular dependency
    import("react-hot-toast").then((toast) => {
      const messagePreview =
        message.text.length > 50
          ? message.text.substring(0, 50) + "..."
          : message.text;

      toast.default(
        (t) => (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#185697] flex items-center justify-center text-white font-bold">
                {message.senderName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-900">
                  {message.senderName}
                </p>
                <span className="text-xs text-gray-500 capitalize">
                  ({message.senderRole})
                </span>
              </div>
              <p className="text-sm text-gray-600">{messagePreview}</p>
              <p className="text-xs text-gray-400 mt-1">
                Order #{message.orderId}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        ),
        {
          duration: 5000,
          position: "top-right",
          style: {
            background: "white",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            border: "2px solid #185697",
            maxWidth: "400px",
          },
          icon: "💬",
        },
      );
    });
  };

  const markAsRead = (orderId) => {
    setUnreadMessages((prev) => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

  const getTotalUnread = () => {
    return Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);
  };

  const getUnreadForOrder = (orderId) => {
    return unreadMessages[orderId] || 0;
  };

  const getMessagesForOrder = (orderId) => {
    return chatMessages[orderId] || [];
  };

  const clearMessagesForOrder = (orderId) => {
    setChatMessages((prev) => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

  const setActiveChatOrder = (orderId) => {
    setActiveChat(orderId);
    if (orderId) {
      markAsRead(orderId);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadMessages,
        markAsRead,
        getTotalUnread,
        getUnreadForOrder,
        setActiveChatOrder,
        getMessagesForOrder,
        clearMessagesForOrder,
        chatMessages,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
