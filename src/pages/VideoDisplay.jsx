import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import CommentForm from '../components/CommentForm';

const VideoDisplay = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [channelLogo, setChannelLogo] = useState('');
  const [popularVideosLogos, setPopularVideosLogos] = useState({});
  const [viewCount, setViewCount] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Check if the username is in localStorage
    const username = localStorage.getItem('username');
    if (!username) {
      // Redirect to the login page if username is not in local storage
      navigate('/login');
      return; // Prevent further actions if redirected
    }

    // Fetch video details and statistics
    axios
      .get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics',
          id: id,
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw', // Replace with your YouTube API Key
        },
      })
      .then((response) => {
        if (response.data.items.length > 0) {
          const videoData = response.data.items[0];
          setVideo(videoData);
          setViewCount(videoData.statistics.viewCount);
          const channelId = videoData.snippet.channelId;
          fetchChannelLogo(channelId);
        } else {
          setError('Video not found');
        }
      })
      .catch((err) => {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
      });

    // Fetch popular videos
    axios
      .get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics',
          chart: 'mostPopular',
          maxResults: 10,
          regionCode: 'US',
          key: 'AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw',
        },
      })
      .then((response) => {
        setVideos(response.data.items);
        response.data.items.forEach((video) => {
          fetchChannelLogoForPopularVideos(video.snippet.channelId);
        });
      })
      .catch((err) => {
        console.error('Error fetching popular videos:', err);
        setError('Failed to load popular videos');
      });

    // Fetch comments from MockAPI
    axios
      .get(`https://66f1060c41537919154f2fc1.mockapi.io/comments?videoId=${id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
      });
  }, [id, navigate]);

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
          const logoUrl = response.data.items[0].snippet.thumbnails.default.url;
          setChannelLogo(logoUrl);
        }
      })
      .catch((err) => {
        console.error('Error fetching channel logo:', err);
        setError('Failed to load channel logo');
      });
  };

  const fetchChannelLogoForPopularVideos = (channelId) => {
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
          const logoUrl = response.data.items[0].snippet.thumbnails.default.url;
          setPopularVideosLogos((prevLogos) => ({
            ...prevLogos,
            [channelId]: logoUrl,
          }));
        }
      })
      .catch((err) => {
        console.error('Error fetching channel logo for popular videos:', err);
        setError('Failed to load popular video logos');
      });
  };

  const addComment = (newComment) => {
    setComments([newComment, ...comments]);
  };

  return (
    <div className="flex flex-row w-full mt-10">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {video && (
        <div className="w-2/3 p-4">
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${video.id}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <h2 className="text-2xl font-bold mt-4">{video.snippet.title}</h2>

          <div className="flex items-center mt-2">
            {channelLogo && (
              <img
                src={channelLogo}
                alt="Channel Logo"
                className="w-12 h-12 rounded-full"
              />
            )}
            <p className="ml-4 text-lg font-semibold">
              {video.snippet.channelTitle}
            </p>
            <button className="ml-auto px-4 py-2 bg-red-600 text-white rounded">
              Subscribe
            </button>
          </div>

          <p>{viewCount} views</p>
          <p className="mt-4">{video.snippet.description}</p>

          <CommentForm videoId={id} addComment={addComment} />

          <div className="mt-4">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 border-b">
                  <p className="font-bold">{comment.username}</p>
                  <p>{comment.text}</p>
                </div>
              ))
            ) : (
              <p>No comments available</p>
            )}
          </div>
        </div>
      )}

      <div className="w-1/3 p-4">
        <h3 className="text-xl font-bold mb-4">Popular Videos</h3>
        {videos.map((video) => (
          <div key={video.id} className="mb-4">
            <Link to={`/video/${video.id}`}>
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full"
              />
              <div className="flex items-center mt-2">
                {popularVideosLogos[video.snippet.channelId] && (
                  <img
                    src={popularVideosLogos[video.snippet.channelId]}
                    alt="Channel Logo"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <h4 className="font-bold">{video.snippet.title}</h4>
              </div>
              <p>{video.snippet.channelTitle}</p>
              <p>{video.statistics.viewCount} views</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDisplay;
