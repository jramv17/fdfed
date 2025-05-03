import React, { useState, useEffect, useRef } from 'react';
import { RiPlayReverseMiniFill } from 'react-icons/ri';
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentMenu, setCurrentMenu] = useState('main'); // Tracks the current menu
  const chatContainerRef = useRef(null);

  // Main menu options
  const mainMenuOptions = [
    { question: 'Hi', response: 'Hello! How can I assist you today?' },
    { question: 'Help', response: 'Here are some options to help you:' },
    {
      question: 'Thank you',
      response: "You're welcome! Let me know if you need anything else.",
    },
  ];

  // Help menu options
  const helpMenuOptions = [
    {
      question: 'How can I create an account?',
      answer:
        "You can create an account by signing up on our website. You'll need your apartment details to register.",
    },
    {
      question: 'I forgot my password, what should I do?',
      answer:
        "Click on the 'Forgot Password' link on the login page, and we'll guide you through the recovery process.",
    },
    {
      question: 'How do I file a complaint?',
      answer:
        "To file a complaint, go to the 'Complaints' section, fill out the form with your issue details, and submit it. We will review it and get back to you.",
    },
    {
      question: 'Can I file an anonymous complaint?',
      answer:
        "Yes, we allow anonymous complaints if you prefer not to share your identity. Just check the 'anonymous' option when filing a complaint.",
    },
    {
      question: 'How do I track a parcel?',
      answer:
        "You can track your parcels by visiting the 'Parcels' section. Simply enter the tracking number and you'll see its status.",
    },
    {
      question: 'How can I view the latest community announcements?',
      answer:
        "You can view the latest announcements on the 'Announcements' page. We'll also notify you through email or app notifications.",
    },
    {
      question: 'How can I connect with other residents in my building?',
      answer:
        'You can join the community chat where you can interact with other residents and stay updated on local happenings.',
    },
    {
      question: 'Thank you',
      answer: "You're welcome! Let me know if you need anything else.",
    },
  ];

  // Scroll to the bottom of the chat whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMainMenu = () => {
    setCurrentMenu('main');
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: 'bot',
        text: 'You are back to the main menu. Here are your options:',
      },
    ]);
  };

  const handleMessage = async (input) => {
    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Handle main menu inputs
    if (currentMenu === 'main') {
      const selectedOption = mainMenuOptions.find(
        (option) => option.question === input
      );

      if (selectedOption) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: selectedOption.response },
        ]);

        if (input === 'Help') {
          setCurrentMenu('help');
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'bot',
            text: "Sorry, I didn't understand that. Please select an option.",
          },
        ]);
      }
    }

    // Handle help menu inputs
    else if (currentMenu === 'help') {
      const selectedOption = helpMenuOptions.find(
        (option) => option.question === input
      );

      if (selectedOption) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: selectedOption.answer },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: 'bot',
            text: "Sorry, I didn't understand that. Please select an option.",
          },
        ]);
      }
    }
  };

  return (
    <div
      style={{
        width: '400px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#fff',
        position: 'fixed',
        right: '20px',
        bottom: '20px',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>ChatBot Assistant</h2>
      <div
        ref={chatContainerRef}
        style={{
          height: '300px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '20px',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              textAlign: message.sender === 'user' ? 'right' : 'left',
              marginBottom: '10px',
            }}
          >
            <p
              style={{
                backgroundColor:
                  message.sender === 'user' ? '#007bff' : '#f1f1f1',
                color: message.sender === 'user' ? '#fff' : '#000',
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '10px',
                maxWidth: '75%',
              }}
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        {(currentMenu === 'main' ? mainMenuOptions : helpMenuOptions).map(
          (option, index) => (
            <button
              key={index}
              onClick={() => handleMessage(option.question)}
              style={{
                flex: '1 1 calc(50% - 10px)',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#555', // Changed to grey
                color: '#fff',
                border: '1px solid #666',
                cursor: 'pointer',
              }}
            >
              {option.question}
            </button>
          )
        )}

        {currentMenu !== 'main' && (
          <button
            onClick={handleMainMenu}
            style={{
              flex: '1 1 calc(50% - 10px)',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#555', // Changed to grey
              color: '#fff',
              border: '1px solid #666',
              cursor: 'pointer',
            }}
          >
            Back to Main Menu
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleMessage(userInput)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            height: '40px',
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginRight: '10px',
          }}
        />
        <button
          onClick={() => handleMessage(userInput)}
          style={{
            height: '40px',
            padding: '0 16px',
            fontSize: '16px',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
      <RiPlayReverseMiniFill size={20} className="fixed top-3 left-2" />
    </div>
  );
};

export default ChatBot;
