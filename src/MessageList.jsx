import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { firestore } from './firebase';
import './MessageList.css'; // Import the CSS file for styling

function MessageList({ user }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
      });

    return () => unsubscribe();
  }, []);

  const handleDelete = (messageId) => {
    firestore.collection('messages').doc(messageId).delete();
  };
  
  return (
    <div className="message-list">
      <h2>Messages</h2>
      <ul>
        {messages.map((message) => (
          <li className="message-item" key={message.id}>
            <div className="message-content">
              <p className="message-text">{message.text}</p>
              <p className="message-user">@{message.displayName}</p>
            </div>
            { (message.uid == user.uid) && <button className="delete-button" onClick={() => handleDelete(message.id)}>Delete</button> }
          </li>
        ))}
      </ul>
    </div>
  );
}

MessageList.propTypes = {
  user: PropTypes.object.isRequired,
};

export default MessageList;
