import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RoomProvider } from "./context/RoomContext";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";
import { Create } from "./pages/create";
import { Toaster } from "sonner";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <RoomProvider>
          <img src="/SyncTalk.png" className="m-5" alt="logo" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route
              path="/room/:id"
              element={
                <ChatProvider>
                  <Room />
                </ChatProvider>
              }
            />
          </Routes>
          <Toaster richColors duration={3000} />
        </RoomProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
