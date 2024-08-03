"use client";
import { RoomContext } from '@/context/RoomContext';
import React, { useContext } from 'react'

const JoinButton = () => {
    const ws = useContext(RoomContext);
    const joinRoom = () => {
      if (ws) {
        ws.emit('join-room');
      } else {
        console.error("WebSocket connection is not available");
      }
    };
  
    return (
      <button onClick={joinRoom}>Start New Meeting</button>
    );
  };
  
export default JoinButton