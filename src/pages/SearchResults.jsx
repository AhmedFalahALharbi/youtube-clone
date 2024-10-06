import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard';

const SearchResults = () => {
  const { query } = useParams();
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return; 
    }

    axios
      .get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 20,
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw',
        },
      })
      .then((response) => {
        const videoIds = response.data.items.map((video) => video.id.videoId).join(',');

        axios
          .get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
              part: 'snippet,statistics',
              id: videoIds,
              key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw',
            },
          })
          .then((response) => {
            setVideos(response.data.items);
          })
          .catch((error) => console.error('Error fetching video statistics:', error));
      })
      .catch((error) => console.error('Error fetching search results:', error));
  }, [query, navigate]);

  return (
    <div className="p-5">
      <h2 className="text-2xl mb-4">Search Results for `{query}`</h2>
      <div className="grid grid-cols-1 gap-4">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} channelLogo={null} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
