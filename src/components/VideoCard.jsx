import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const [channelLogo, setChannelLogo] = useState(null);

  useEffect(() => {
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
            setChannelLogo(response.data.items[0].snippet.thumbnails.default.url);
          }
        })
        .catch((err) => {
          console.error('Error fetching channel logo:', err);
        });
    };

    fetchChannelLogo(video.snippet.channelId); 
  }, [video.snippet.channelId]);

  return (
    <div className="mb-4 p-4 rounded-md ">
      <Link to={`/video/${video.id}`} className="flex flex-col md:flex-row">
        <img
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className="w-full md:w-2/5"
        />

        <div className="flex flex-col justify-center mt-4 md:mt-0 md:ml-4 w-full">
          <h4 className="font-bold text-lg">{video.snippet.title}</h4>

          <div className="flex items-center mt-2">
            {channelLogo ? (
              <img
                src={channelLogo}
                alt="Channel Logo"
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div> 
            )}
            <div>
              <p className="text-sm text-accent">{video.snippet.channelTitle}</p>
              <p className="text-sm text-accent">{video.statistics?.viewCount} views</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;
