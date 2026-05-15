import React, { useEffect, useState } from "react";
import {
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  useStreamVideoClient,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useStream } from "../../contexts/StreamContext";

// Inner component — must be inside <StreamCall>
const CallUI = ({ onClose }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  useEffect(() => {
    if (
      callingState === CallingState.LEFT ||
      callingState === CallingState.IDLE
    ) {
      onClose();
    }
  }, [callingState, onClose]);

  return (
    <StreamTheme>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls onLeave={onClose} />
    </StreamTheme>
  );
};

const StreamVideoCall = ({ orderId, onClose }) => {
  const { videoClient, streamReady } = useStream();
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!streamReady || !videoClient) return;

    const callId = `order-${orderId}`;
    const c = videoClient.call("default", callId);

    c.join({ create: true })
      .then(() => setCall(c))
      .catch((err) => {
        console.error("Failed to join call:", err);
        setError("Could not start video call.");
      });

    return () => {
      c.leave().catch(() => {});
    };
  }, [streamReady, videoClient, orderId]);

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#185697] text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="text-white text-lg">Connecting to call...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <StreamCall call={call}>
        <CallUI onClose={onClose} />
      </StreamCall>
    </div>
  );
};

export default StreamVideoCall;
