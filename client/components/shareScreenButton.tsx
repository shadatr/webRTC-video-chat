"use client";
import { RoomContext } from '@/context/RoomContext';
import React, { useContext } from 'react'

const ShareScreenButton = ({onClick}:{onClick:()=>void}) => {

  
    return (
      <button onClick={onClick}>Share screen</button>
    );
  };
  
export default ShareScreenButton