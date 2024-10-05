import { useState, useEffect } from 'react';
import axios from 'axios';

const CommentForm = ({ videoId, addComment }) => {
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
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

    axios
      .post('https://66f1060c41537919154f2fc1.mockapi.io/Comments', newComment)
      .then((response) => {
        addComment(response.data);
        setText('');
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="mt-4">
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
