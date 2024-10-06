import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [channelLogos, setChannelLogos] = useState({}); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return; 
    }

   
    axios
      .get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics', 
          chart: 'mostPopular',
          maxResults: 30,
          regionCode: 'SA', 
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw',
        },
      })
      .then((response) => {
        setVideos(response.data.items); 
        response.data.items.forEach((video) => {
          fetchChannelLogo(video.snippet.channelId); 
        });
      })
      .catch((err) => {
        console.error('Error fetching popular videos:', err);
        setError('Failed to load videos');
      });
  }, [navigate]);

  const fetchChannelLogo = (channelId) => {
    axios
      .get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'snippet',
          id: channelId,
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw', 
        },
      })
      .then((response) => {
        if (response.data.items.length > 0) {
          setChannelLogos((prevLogos) => ({
            ...prevLogos,
            [channelId]: response.data.items[0].snippet.thumbnails.default.url,
          }));
        }
      })
      .catch((err) => {
        console.error('Error fetching channel logo:', err);
      });
  };

  return (
    <div className="flex flex-col items-center mt-10 bg-base-100 text-primary">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="p-4  rounded-md">
            <Link to={`/video/${video.id}`}>
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full"
              />
              <div className="flex items-center mt-2">
                <img
                  src={channelLogos[video.snippet.channelId]}
                  alt="Channel Logo"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <h4 className="font-bold">{video.snippet.title}</h4>
              </div>
              <p className="text-sm text-accent">{video.snippet.channelTitle}</p>
              <p className="text-sm text-accent mt-1">{video.statistics.viewCount} views</p>
            </Link>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Home;
