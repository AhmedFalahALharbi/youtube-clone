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
      .post('https://670c744d7e5a228ec1d05f7b.mockapi.io/comments', newComment)
      .then((response) => {
        addComment(response.data);
        setText(''); 
      })
      .catch((error) => console.error('Error submitting comment:', error));
  };

  return (
    <div className="mt-4">
      <input
        placeholder="Add a comment..."
        className="border-b-[1px]  p-2 w-full mb-2 bg-neutral focus:bg-secondary"
        value={text}
        onChange={(e) => setText(e.target.value)}
        
      ></input>
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded-full mt-2">
        Comment
      </button>
    </div>
  );
};

export default CommentForm;
