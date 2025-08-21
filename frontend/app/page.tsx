"use client";

import React, { useState, useEffect, useRef } from 'react';

import { IMessage } from '@/app/types/types'; // Doğru yerden import ettiğinizden emin olun
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';

// Sunucuya gönderilecek mesajın tipi (ID içermez)
type OutgoingMessage = Omit<IMessage, 'id'>;

const Home: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5050/ws");

    ws.onopen = () => {
      console.log("WebSocket bağlantısı kuruldu.");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const receivedMessage: IMessage = JSON.parse(event.data);
        setMessages(prevMessages => [...prevMessages, receivedMessage]);
      } catch (error) {
        console.error("Gelen mesaj parse edilemedi:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket bağlantısı kapandı.");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket hatası:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === '' || username.trim() === '' || !socket) {
        console.warn('Kullanıcı adı, mesaj boş olamaz ve bağlantı aktif olmalı.');
        return;
    }

    // HATA DÜZELTMESİ: Gönderilen mesajın tipi OutgoingMessage olarak değiştirildi.
    const messageToSend: OutgoingMessage = {
      sender: username,
      text: newMessage,
    };

    socket.send(JSON.stringify(messageToSend));
    
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Header username={username} setUsername={setUsername} />
      <MessageList messages={messages} currentUser={username} chatEndRef={chatEndRef} />
      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        username={username}
      />
    </div>
  );
}

export default Home;
