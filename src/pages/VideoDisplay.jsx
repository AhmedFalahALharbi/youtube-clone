import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import CommentForm from "../components/CommentForm";

const VideoDisplay = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [videos, setVideos] = useState([]);
  const [channelLogo, setChannelLogo] = useState("");
  const [popularVideosLogos, setPopularVideosLogos] = useState({});
  const [viewCount, setViewCount] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    // Fetch video details and statistics
    axios
      .get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: "snippet,statistics",
          id: id,
          key: "AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw", // Replace with your YouTube API Key
        },
      })
      .then((response) => {
        if (response.data.items.length > 0) {
          const videoData = response.data.items[0];
          setVideo(videoData);
          setViewCount(videoData.statistics.viewCount);
          fetchChannelLogo(videoData.snippet.channelId);
        } else {
          setError("Video not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching video:", err);
        setError("Failed to load video");
      });

    // Fetch popular videos
    axios
      .get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: "snippet,statistics",
          chart: "mostPopular",
          maxResults: 10,
          regionCode: "US",
          key: "AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw",
        },
      })
      .then((response) => {
        setVideos(response.data.items);
        response.data.items.forEach((video) => {
          fetchChannelLogoForPopularVideos(video.snippet.channelId);
        });
      })
      .catch((err) => {
        console.error("Error fetching popular videos:", err);
        setError("Failed to load popular videos");
      });

    // Fetch comments from MockAPI
    axios
      .get(`https://66f1060c41537919154f2fc1.mockapi.io/comments?videoId=${id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
      });
  }, [id, navigate]);

  const fetchChannelLogo = (channelId) => {
    axios
      .get("https://www.googleapis.com/youtube/v3/channels", {
        params: {
          part: "snippet",
          id: channelId,
          key: "AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw",
        },
      })
      .then((response) => {
        if (response.data.items.length > 0) {
          const logoUrl = response.data.items[0].snippet.thumbnails.default.url;
          setChannelLogo(logoUrl);
        }
      })
      .catch((err) => {
        console.error("Error fetching channel logo:", err);
        setError("Failed to load channel logo");
      });
  };

  const fetchChannelLogoForPopularVideos = (channelId) => {
    axios
      .get("https://www.googleapis.com/youtube/v3/channels", {
        params: {
          part: "snippet",
          id: channelId,
          key: "AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw",
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
        console.error("Error fetching channel logo for popular videos:", err);
        setError("Failed to load popular video logos");
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
            allowFullScreen></iframe>
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
            <button className="ml-auto px-4 py-2 bg-primary text-secondary rounded-full">
              Subscribe
            </button>
            <div className="join grid grid-cols-2 mx-2">
              <button className="join-item btn  bg-secondary rounded-full py-2 px-4">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F1F1F1"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg>
              </button>
              <button className="join-item btn bg-secondary rounded-full py-2 px-4">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F1F1F1"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg>
              </button>
            </div>
            <button className="bg-secondary rounded-full p-2 mx-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F1F1F1"><path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z"/></svg>
               
            </button>
            <button className="bg-secondary rounded-full p-2 ">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F1F1F1"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>
            </button>
          </div>
            <div className="collapse rounded-3xl bg-secondary border-accent  my-2">
            <input type="checkbox" />
          <p className=" collapse-title mt-4">{viewCount} views</p>
          <p className="collapse-content mt-4">{video.snippet.description}</p>
            </div>

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
        {/* LinkedIn Profile Card */}
        <div className="mt-6 p-4 border border-accent rounded-md bg-secondary">
          <h3 className="font-bold text-xl mb-2">Connect with Ahmed Alharbi</h3>
          <Link
            to="https://www.linkedin.com/in/ahmed-alharbi-7a8436304/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
              alt="LinkedIn Logo"
              className="w-10 h-10 mr-4"
            />
            <p className="text-blue-700 underline">View LinkedIn Profile</p>
          </Link>
        </div>
        <h3 className="text-xl font-bold mb-4">Related Videos</h3>
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
