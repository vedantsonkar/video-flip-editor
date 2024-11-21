import "./App.css";
import { useRef, useState } from "react";
import VideoContext from "./context/videoContext";
import HomePage from "./pages/Home";
import ReactPlayer from "react-player";
import { PlayBackData } from "./types";

const App = () => {
  const playerRef = useRef<ReactPlayer | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState("9:18");
  const [cropperStarted, setCropperStarted] = useState(false);
  const [data, setData] = useState<PlayBackData[]>([]);

  return (
    <VideoContext.Provider
      value={{
        playerRef,
        selectedVideo,
        setSelectedVideo,
        aspectRatio,
        setAspectRatio,
        cropperStarted,
        setCropperStarted,
        data,
        setData,
      }}
    >
      <HomePage />
    </VideoContext.Provider>
  );
};

export default App;
