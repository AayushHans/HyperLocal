import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useSocket } from "../../contexts/SocketContext";

const VideoCall = ({ orderId, userRole, onClose }) => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Get user media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err.name, err.message);
        if (err.name === "NotAllowedError") {
          alert(
            "Camera/microphone permission denied. Please allow access in your browser settings.",
          );
        } else if (err.name === "NotFoundError") {
          alert("No camera or microphone found on this device.");
        } else if (err.name === "NotReadableError") {
          alert(
            "Camera or microphone is already in use by another application.",
          );
        } else {
          alert(`Could not access camera/microphone: ${err.message}`);
        }
      });

    // Join the chat room so video signaling events reach this socket
    socket.emit("join-chat", { orderId, userId: null, role: userRole });

    socket.on("incoming-call", ({ from, signal }) => {
      setReceivingCall(true);
      setCaller(from);
      setCallerSignal(signal);
    });

    socket.on("call-accepted", (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) connectionRef.current.signal(signal);
    });

    socket.on("call-ended", () => leaveCall());

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-ended");
    };
  }, [socket, orderId]);

  // Stop tracks when component unmounts
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const callUser = () => {
    if (!stream) return;
    const peer = new Peer({
      initiator: true,
      trickle: true,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (data) => {
      socket.emit("call-user", {
        orderId,
        signalData: data,
        from: userRole,
        fromName: userRole,
      });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) userVideo.current.srcObject = remoteStream;
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    if (!stream) return;
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: true,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (data) => {
      socket.emit("answer-call", { signal: data, to: orderId });
    });

    peer.on("stream", (remoteStream) => {
      if (userVideo.current) userVideo.current.srcObject = remoteStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) connectionRef.current.destroy();
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (socket) socket.emit("end-call", { orderId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative w-full h-full max-w-6xl max-h-screen p-4">
        <button
          onClick={leaveCall}
          className="absolute top-6 right-6 z-10 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
        >
          End Call
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* My Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={myVideo}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black bg-opacity-70 text-white text-sm rounded">
              You ({userRole})
            </div>
          </div>

          {/* Remote Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            {callAccepted && !callEnded ? (
              <>
                <video
                  ref={userVideo}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-black bg-opacity-70 text-white text-sm rounded">
                  {userRole === "customer" ? "Agent" : "Customer"}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  {receivingCall && !callAccepted ? (
                    <div>
                      <p className="text-xl mb-4">Incoming call...</p>
                      <button
                        onClick={answerCall}
                        className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                      >
                        Answer
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl mb-4">Waiting for other user...</p>
                      {!callAccepted && (
                        <button
                          onClick={callUser}
                          className="px-6 py-3 bg-[#F69130] text-white font-bold rounded-lg hover:bg-[#e57f1f] transition"
                        >
                          Start Call
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
