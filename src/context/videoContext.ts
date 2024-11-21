import { createContext, MutableRefObject, useContext } from "react";
import ReactPlayer from "react-player";
import { PlayBackData } from "../types";

interface VideoContextProps {
  playerRef: MutableRefObject<ReactPlayer | null> | null;
  selectedVideo: File | null;
  setSelectedVideo: (video: File | null) => void;
  aspectRatio: string;
  setAspectRatio: (aspectRatio: string) => void;
  cropperStarted: boolean;
  setCropperStarted: (cropperStarted: boolean) => void;
  data: PlayBackData[];
  setData: React.Dispatch<React.SetStateAction<PlayBackData[]>>;
}

const VideoContext = createContext<VideoContextProps>({
  playerRef: null,
  selectedVideo: null,
  aspectRatio: "9:18",
  cropperStarted: false,
  data: [],
  setSelectedVideo: () => {},
  setAspectRatio: () => {},
  setCropperStarted: () => {},
  setData: () => {},
});

export const useVideoContext = () => useContext(VideoContext);

export default VideoContext;
