import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [channelLogos, setChannelLogos] = useState({}); // Store channel logos
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch popular videos for the home page
    axios
      .get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics', // Fetch snippet and statistics (for view count)
          chart: 'mostPopular',
          maxResults: 30,
          regionCode: 'SA', // You can change this to any region
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw', // Your YouTube API Key
        },
      })
      .then((response) => {
        setVideos(response.data.items); // Set the popular videos
        response.data.items.forEach((video) => {
          fetchChannelLogo(video.snippet.channelId); // Fetch channel logo for each video
        });
      })
      .catch((err) => {
        console.error('Error fetching popular videos:', err);
        setError('Failed to load videos');
      });
  }, []);

  // Fetch channel logos for the home page videos
  const fetchChannelLogo = (channelId) => {
    axios
      .get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'snippet',
          id: channelId,
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw', // Your YouTube API Key
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
    <div className="flex flex-col items-center mt-10">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="p-4 border rounded-md">
            <Link to={`/video/${video.id}`}>
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full"
              />
              <div className="flex items-center mt-2">
                {/* Display channel logo for each video */}
                <img
                  src={channelLogos[video.snippet.channelId]}
                  alt="Channel Logo"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <h4 className="font-bold">{video.snippet.title}</h4>
              </div>
              <p className="text-sm text-gray-600">{video.snippet.channelTitle}</p>
              {/* Display number of views */}
              <p className="text-sm text-gray-600 mt-1">{video.statistics.viewCount} views</p>
            </Link>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Home;
