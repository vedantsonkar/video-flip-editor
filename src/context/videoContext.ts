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
  selectedTab: "Preview Session" | "Generate Session";
  setSelectedTab: (selectedTab: "Preview Session" | "Generate Session") => void;
}

const VideoContext = createContext<VideoContextProps>({
  playerRef: null,
  selectedVideo: null,
  aspectRatio: "9:18",
  cropperStarted: false,
  data: [],
  selectedTab: "Generate Session",
  setSelectedVideo: () => {},
  setAspectRatio: () => {},
  setCropperStarted: () => {},
  setData: () => {},
  setSelectedTab: () => {},
});

export const useVideoContext = () => useContext(VideoContext);

export default VideoContext;
