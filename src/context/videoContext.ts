import { createContext, MutableRefObject, useContext } from "react";
import ReactPlayer from "react-player";

interface VideoContextProps {
  playerRef: MutableRefObject<ReactPlayer | null> | null;
  selectedVideo: File | null;
  setSelectedVideo: (video: File | null) => void;
  aspectRatio: string;
  setAspectRatio: (aspectRatio: string) => void;
  cropperStarted: boolean;
  setCropperStarted: (cropperStarted: boolean) => void;
}

const VideoContext = createContext<VideoContextProps>({
  playerRef: null,
  selectedVideo: null,
  aspectRatio: "9:18",
  cropperStarted: false,
  setSelectedVideo: () => {},
  setAspectRatio: () => {},
  setCropperStarted: () => {},
});

export const useVideoContext = () => useContext(VideoContext);

export default VideoContext;
