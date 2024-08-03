"use client";
import { RoomContext } from '@/context/RoomContext';
import React, { useContext } from 'react'

const CreateButton = () => {
    const {ws} = useContext(RoomContext);
    const createRoom = () => {
      if (ws) {
        ws.emit('create-room');
      } else {
        console.error("WebSocket connection is not available");
      }
    };
  
    return (
      <button onClick={createRoom}>Start New Meeting</button>
    );
  };
  
export default CreateButton