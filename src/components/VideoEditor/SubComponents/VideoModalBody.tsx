import { FC } from "react";
import VideoPlayer from "../../VideoPlayer/VideoPlayer";

const VideoModalBody: FC = () => {
  return (
    <div
      id="video-editor-modal-body"
      className="flex justify-between items-start w-full"
    >
      <VideoPlayer />
    </div>
  );
};

export default VideoModalBody;
