import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const VideoDisplay = () => {
  const { id } = useParams(); // Get video ID from the URL
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [channelLogo, setChannelLogo] = useState(''); // For main video channel logo
  const [popularVideosLogos, setPopularVideosLogos] = useState({}); // Store channel logos for popular videos
  const [viewCount, setViewCount] = useState(null); // Store main video view count
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the main video details with statistics (to get the number of views)
    axios
      .get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics', // Fetch snippet and statistics (for views)
          id: id, // The video ID from useParams
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw', // Your YouTube API Key
        },
      })
      .then((response) => {
        if (response.data.items.length > 0) {
          const videoData = response.data.items[0];
          setVideo(videoData); // Set the main video details
          setViewCount(videoData.statistics.viewCount); // Set the view count

          // Fetch the channel logo for the main video
          const channelId = videoData.snippet.channelId;
          fetchChannelLogo(channelId, setChannelLogo);
        } else {
          setError('Video not found');
        }
      })
      .catch((err) => {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
      });

    // Fetch most popular videos with statistics (to get the view count)
    axios
      .get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics', // Fetch snippet and statistics (for views)
          chart: 'mostPopular',
          maxResults: 10,
          regionCode: 'US', // You can change this to any region
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw', // Your YouTube API Key
        },
      })
      .then((response) => {
        setVideos(response.data.items); // Set the popular videos
        response.data.items.forEach((video) => {
          fetchChannelLogo(video.snippet.channelId, (logoUrl) => {
            setPopularVideosLogos((prevLogos) => ({
              ...prevLogos,
              [video.snippet.channelId]: logoUrl,
            }));
          });
        });
      })
      .catch((err) => {
        console.error('Error fetching popular videos:', err);
      });

    // Fetch YouTube comments for the main video
    axios
      .get('https://www.googleapis.com/youtube/v3/commentThreads', {
        params: {
          part: 'snippet',
          videoId: id, // The video ID for which to retrieve comments
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw', // Your YouTube API Key
        },
      })
      .then((response) => {
        setComments(response.data.items); // Set the comments
      })
      .catch((err) => {
        console.error('Error fetching comments:', err);
      });
  }, [id]);

  // Fetch the channel logo for the main video or a popular video
  const fetchChannelLogo = (channelId, setLogo) => {
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
          const logoUrl = response.data.items[0].snippet.thumbnails.default.url;
          setLogo(logoUrl); // Set the channel logo
        }
      })
      .catch((err) => {
        console.error('Error fetching channel logo:', err);
      });
  };

  return (
    <div className="flex flex-row w-full mt-10">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {video ? (
        <div className="w-2/3 p-4">
          {/* Embed the video using iframe */}
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>

          {/* Display video title, view count, description, and channel logo */}
          <div className="mt-4 flex items-center">
            <img src={channelLogo} alt="Channel Logo" className="w-12 h-12 rounded-full mr-4" />
            <div>
              <h2 className="text-2xl font-bold">{video.snippet.title}</h2>
              {viewCount && (
                <p className="text-sm text-gray-600 mt-1">{viewCount} views</p>
              )}
              <p>{video.snippet.description}</p>
              <p className="text-sm text-gray-600">Channel: {video.snippet.channelTitle}</p>
            </div>
          </div>

          {/* Display YouTube comments */}
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 border-b">
                  <p className="font-bold">
                    {comment.snippet.topLevelComment.snippet.authorDisplayName}
                  </p>
                  <p>{comment.snippet.topLevelComment.snippet.textOriginal}</p>
                </div>
              ))
            ) : (
              <p>No comments available</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading video...</p>
      )}

      {/* Sidebar for displaying popular videos */}
      <div className="w-1/3 p-4">
        <h3 className="text-xl font-bold mb-4">Popular Videos</h3>
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id} className="mb-4">
              <Link to={`/video/${video.id.videoId}`}>
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full"
                />
                <div className="flex items-center mt-2">
                  {/* Display channel logo for each popular video */}
                  <img
                    src={popularVideosLogos[video.snippet.channelId]}
                    alt="Channel Logo"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <h4 className="font-bold">{video.snippet.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{video.snippet.channelTitle}</p>
                {/* Display view count */}
                <p className="text-sm text-gray-600 mt-1">{video.statistics.viewCount} views</p>
              </Link>
            </div>
          ))
        ) : (
          <p>Loading popular videos...</p>
        )}
      </div>
    </div>
  );
};

export default VideoDisplay;
