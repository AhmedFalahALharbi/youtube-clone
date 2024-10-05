const VideoPlayer = ({ videoId }) => {
  return (
    <div className="relative pb-56.25">
      <iframe
        title="YouTube video player"
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
