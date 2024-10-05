import { useState, useEffect } from 'react';
import axios from 'axios';

const CommentForm = ({ videoId, addComment }) => {
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve the username from localStorage when the component mounts
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleSubmit = () => {
    if (!text || !username) return;

    const newComment = {
      text,
      username,
      videoId,
    };

    // Post new comment to MockAPI
    axios
      .post('https://66f1060c41537919154f2fc1.mockapi.io/comments', newComment)
      .then((response) => {
        addComment(response.data);
        setText(''); // Clear the input field after submission
      })
      .catch((error) => console.error('Error submitting comment:', error));
  };

  return (
    <div className="mt-4">
      {/* Remove username input and fetch from localStorage */}
      <textarea
        placeholder="Add a public comment..."
        className="border p-2 w-full mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2">
        Comment
      </button>
    </div>
  );
};

export default CommentForm;
