import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom"; 
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
  const navigate = useNavigate(); 

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }

    axios
      .get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: "snippet,statistics",
          id: id,
          key: "AIzaSyCQTFSPFFl6g1LTKyCFBnz873ZyIRIB7xw", 
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
      


    axios
      .get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: "snippet,statistics",
          chart: "most_popular",
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
      

    axios
      .get(`https://66f1060c41537919154f2fc1.mockapi.io/comments?videoId=${id}`)
      .then((response) => {
        setComments(response.data);
      })
      
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
      
  };

  const addComment = (newComment) => {
    setComments([newComment, ...comments]);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full mt-10">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Main Video Section */}
      {video && (
        <div className="w-full lg:w-2/3 p-4">
          {/* Video iframe */}
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${video.id}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <h2 className="text-2xl font-bold mt-4">{video.snippet.title}</h2>

          {/* Channel Info and Buttons */}
          <div className="flex flex-wrap items-center mt-2">
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

            {/* Like and Share Buttons */}
            <div className="flex items-center space-x-2 mx-2">
              <button className="btn bg-secondary rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F1F1F1">
                  <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                </svg>
              </button>
              <button className="btn bg-secondary rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F1F1F1">
                  <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
                </svg>
              </button>
              <button className="bg-secondary rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F1F1F1">
                  <path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z" />
                </svg>
              </button>
              <button className="bg-secondary rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#F1F1F1">
                  <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Video Info and Description */}
          <div className="collapse rounded-3xl bg-secondary border-accent  my-2">
            <input type="checkbox" />
            <p className="collapse-title mt-4">{viewCount} views</p>
            <p className="collapse-content mt-4">{video.snippet.description}</p>
          </div>

          {/* Comment Section */}
          <CommentForm videoId={id} addComment={addComment} />
          <div className="mt-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-4 p-4 ">
                  <div className="bg-gray-400 rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#F1F1F1"
                    >
                      <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-primary">{comment.username}</p>
                    </div>
                    <p className="text-primary">{comment.text}</p>

                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <button>
                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#F1F1F1">
                          <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                        </svg>
                      </button>
                      <button>
                        <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#F1F1F1">
                          <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
                        </svg>
                      </button>
                      <button className="hover:text-blue-600">Reply</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No comments available</p>
            )}
          </div>
        </div>
      )}

      {/* Related Videos Section */}
      <div className="w-full lg:w-1/3 p-4">
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