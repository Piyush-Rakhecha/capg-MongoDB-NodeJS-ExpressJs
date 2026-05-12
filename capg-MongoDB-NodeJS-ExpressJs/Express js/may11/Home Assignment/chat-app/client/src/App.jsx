import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [typingText, setTypingText] = useState("");

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          isMine: data.id === socket.id.slice(0, 6),
          type: "chat",
        },
      ]);
    });

    socket.on("system_message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          text: msg,
        },
      ]);
    });

    socket.on("user_count", (count) => {
      setOnlineUsers(count);
    });

    socket.on("typing", ({ userId, isTyping }) => {
      if (isTyping) {
        setTypingText(`${userId} is typing...`);
      } else {
        setTypingText("");
      }
    });

    return () => {
      socket.off("chat_message");
      socket.off("system_message");
      socket.off("user_count");
      socket.off("typing");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("chat_message", {
      text: input,
    });

    socket.emit("typing", false);

    setInput("");
  };

  const handleTyping = (e) => {
    setInput(e.target.value);

    socket.emit("typing", true);

    clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", false);
    }, 1500);
  };

  return (
    <div className="app">
      <div className="chat-header">
        <div className="header-left">
          <img src="https://i.pravatar.cc/45" alt="" />

          <div>
            <h3>Live Chat</h3>

            <p>{typingText ? typingText : `${onlineUsers} online`}</p>
          </div>
        </div>
      </div>

      <div className="messages">
        {messages.map((msg, index) => {
          if (msg.type === "system") {
            return (
              <div key={index} className="system-message">
                {msg.text}
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`message-row ${msg.isMine ? "mine" : ""}`}
            >
              <div className="message-bubble">
                <div className="message-text">{msg.text}</div>

                <div className="message-meta">{msg.timestamp}</div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default App;
