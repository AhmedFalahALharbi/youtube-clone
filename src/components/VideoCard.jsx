import { Link } from 'react-router-dom';

const VideoCard = ({ video, channelLogo }) => {
  return (
    <div className="mb-4 p-4 border rounded-md">
      <Link to={`/video/${video.id}`}>
        <img
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className="w-full"
        />
        <div className="flex items-center mt-2">
          {channelLogo && (
            <img
              src={channelLogo}
              alt="Channel Logo"
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <h4 className="font-bold">{video.snippet.title}</h4>
        </div>
        <p className="text-sm text-gray-600">{video.snippet.channelTitle}</p>
      </Link>
    </div>
  );
};

export default VideoCard;
