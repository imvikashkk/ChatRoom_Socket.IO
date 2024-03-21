import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io("/"), []);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketId] = useState("");
  const [roomName, setRoomName] = useState(null);
  const [isRoomJoined, setIsRoomJoined] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("User Room Connection ID:" + socket.id);
    });

    socket.on("receive-message", (data) => {
      setMessages((messages) => [data, ...messages]);
      console.log(data);
    });

    socket.on("disconnect", () =>{
      setRoomName(null);
      setIsRoomJoined(false);
      setMessages([])
      setMessage("");
    })

    setRoomName(null)
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoom(roomName)
    setRoomName(null);
    setIsRoomJoined(true);
  };

  return (
    <div className="grid place-content-center">
      <div className="flex flex-col gap-2 items-center h-[100vh] py-2">
        <h1 className="h-[4%]">SocketID: {socketID}</h1>
        {isRoomJoined ? (
          <div className="h-[96%]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-1 h-[25%]">
              <h1>RoomID: {room}</h1>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-2 border-blue-400 px-2 py-1"
                placeholder="message"
              />
              <button
                type="submit"
                className="border bg-blue-500 text-white px-2 rounded-md py-1">
                Send
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRoomJoined(false);
                  setMessages([])
                }}
                className="border bg-blue-500 text-white px-2 rounded-md py-1">
                Exit Room
              </button>
            </form>
            <div className="flex flex-col  h-[72%] overflow-auto p-4 border ">
              {messages.map((m, i) => (
                <p key={i} className="max-w-[318px] text-wrap break-words">-: {m}</p>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={joinRoomHandler} className="flex flex-col gap-2">
            <h5>Join Room</h5>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border-2 border-blue-400 px-2 py-1"
              placeholder="roomID"
              required={true}
            />
            <button type="submit" className="border bg-blue-500 text-white px-2 rounded-md py-1">Join</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
