import "./App.css";
import { useRef, useState } from "react";
import VideoContext from "./context/videoContext";
import HomePage from "./pages/Home";
import ReactPlayer from "react-player";

const App = () => {
  const playerRef = useRef<ReactPlayer | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState("9:18");
  const [cropperStarted, setCropperStarted] = useState(false);

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
      }}
    >
      <HomePage />
    </VideoContext.Provider>
  );
};

export default App;
