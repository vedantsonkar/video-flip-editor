import React, {
  useState,
  useCallback,
  FC,
  useMemo,
  useRef,
  useEffect,
} from "react";
import ReactPlayer from "react-player";

import { useVideoContext } from "../../context/videoContext";
import DropDown from "../DropDown";
import { AspectRatioOptions, PlayBackOptions } from "../../constants";
import PlayButtonSvg from "../../assets/vectors/play.svg";
import PauseButtonSvg from "../../assets/vectors/pause.svg";
import SpeakerIconSvg from "../../assets/vectors/speaker.svg";
import MuteIconSvg from "../../assets/vectors/mute.svg";

import CropperGrid from "../CropperGrid/CropperGrid";
import VideoPreview from "../VideoPreview/VideoPreview";

interface TimeDisplayProps {
  currentTime: number;
  totalTime: number;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  currentTime,
  totalTime,
}) => {
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 100);

    return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}.${
      milliseconds < 10 ? "0" : ""
    }${milliseconds}`;
  }, []);

  return (
    <div className="text-sm text-gray-500">
      <span className="text-white">{formatTime(currentTime)}</span> /{" "}
      {formatTime(totalTime)}
    </div>
  );
};

interface PlayBackData {
  timeStamp: number;
  coordinates: [number, number, number, number];
  volume: number;
  playbackRate: number;
}

const VideoPlayer: FC = () => {
  const {
    selectedVideo,
    aspectRatio,
    cropperStarted,
    setAspectRatio,
    setCropperStarted,
  } = useVideoContext();
  const playerRef = useRef<ReactPlayer | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const videoUrl = useMemo(
    () => (selectedVideo ? URL.createObjectURL(selectedVideo) : null),
    [selectedVideo]
  );

  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState("1");
  const [cropState, setCropState] = useState({
    x: 0,
    y: 0,
    width: 1,
    height: 1,
  });

  const [volume, setVolume] = useState(0.8);
  const [data, setData] = useState<PlayBackData[]>([]);

  const updateCanvas = useCallback(() => {
    if (canvasRef?.current && playerRef?.current) {
      const videoElement =
        playerRef.current.getInternalPlayer() as HTMLVideoElement;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { alpha: false });

      if (ctx && videoElement && parentRef?.current) {
        // Calculate scaling factors
        const scaleX = videoElement.videoWidth / parentRef.current?.offsetWidth;
        const scaleY =
          videoElement.videoHeight / parentRef.current?.offsetHeight;

        // Adjust crop coordinates to match intrinsic video resolution
        const adjustedX = cropState.x * scaleX;
        const adjustedY = cropState.y * scaleY;
        const adjustedWidth = cropState.width * scaleX;
        const adjustedHeight = cropState.height * scaleY;

        // Draw the adjusted crop area
        ctx.drawImage(
          videoElement,
          adjustedX,
          adjustedY,
          adjustedWidth,
          adjustedHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
    }
  }, [cropState, canvasRef, playerRef]);

  const handleProgress = useCallback(
    (progress: { playedSeconds: number; played: number }) => {
      setCurrentTime(progress.playedSeconds);
      const newEntry: PlayBackData = {
        timeStamp: progress.playedSeconds,
        coordinates: [
          cropState.x,
          cropState.y,
          cropState.width,
          cropState.height,
        ],
        volume: volume,
        playbackRate: parseFloat(playbackRate),
      };
      setData((prevData) => {
        if (prevData && prevData?.length > 0) {
          return [...prevData, newEntry];
        } else {
          return [newEntry];
        }
      });
    },
    [
      cropState.height,
      cropState.width,
      cropState.x,
      cropState.y,
      playbackRate,
      volume,
    ]
  );

  const handleDuration = useCallback((duration: number) => {
    setTotalTime(duration);
  }, []);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const seekTime = parseFloat(e.target.value);
      setCurrentTime(seekTime);

      if (playerRef?.current) {
        playerRef.current.seekTo(seekTime, "seconds");
      }
    },
    [playerRef]
  );

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleMuteUnmute = useCallback(() => {
    setVolume((prev) => {
      if (prev === 0) {
        return 0.5;
      }
      return 0;
    });
  }, []);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(parseFloat(e.target.value));
    },
    []
  );

  const handlePlaybackRateChange = useCallback((rate: string) => {
    setPlaybackRate(rate);
  }, []);

  const handleAspectRatioChange = useCallback(
    (ratio: string) => {
      setAspectRatio(ratio);
    },
    [setAspectRatio]
  );

  const handleCropUpdate = useCallback(
    (coords: { x: number; y: number; width: number; height: number }) => {
      setCropState(() => ({
        width: coords.width,
        height: coords.height,
        x: coords.x,
        y: coords.y,
      }));
    },
    []
  );

  const downloadJson = useCallback(() => {
    setIsPlaying(false);
    setCropperStarted(false);
    if (data.length === 0) {
      console.warn("No data to download.");
      return;
    }
    const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON string
    const blob = new Blob([jsonData], { type: "application/json" }); // Create a Blob with JSON data
    const url = URL.createObjectURL(blob); // Generate a download URL
    const link = document.createElement("a"); // Create a temporary link element
    link.href = url;
    link.download = "Playback_Data.json"; // Set the filename for the download
    document.body.appendChild(link); // Append the link to the document
    link.click(); // Programmatically trigger the download
    document.body.removeChild(link); // Remove the link from the document
    URL.revokeObjectURL(url); // Clean up the object URL
  }, [data, setCropperStarted]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateCanvas();
    }, 17);
    return () => {
      clearInterval(intervalId);
    };
  }, [updateCanvas]);

  return (
    <div className="w-full flex max-md:flex-col max-md:items-center max-md:gap-y-6 items-start justify-start pb-[6.25rem] gap-x-8">
      {/* Video Player */}
      <div className="flex flex-col gap-y-4 basis-1/2 max-w-[28.75rem]">
        <div
          ref={parentRef}
          className="video-container relative w-[28.75rem] h-[19.188rem]"
        >
          {videoUrl ? (
            <>
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={isPlaying}
                controls={false}
                width="100%"
                height="100%"
                onProgress={handleProgress}
                playbackRate={Number(playbackRate)}
                onDuration={handleDuration}
                volume={volume}
                onEnded={downloadJson}
              />
              {cropperStarted && (
                <div className="absolute inset-0">
                  <CropperGrid
                    onDrag={handleCropUpdate}
                    parentRef={parentRef}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white w-full h-full" />
          )}
        </div>

        <div className="flex items-center justify-center gap-x-4">
          <button
            className="text-white p-2 rounded hover:bg-gray-600 shrink-0"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <img src={PauseButtonSvg} title="Pause" aria-label="Pause" />
            ) : (
              <img src={PlayButtonSvg} title="Play" aria-label="Play" />
            )}
          </button>
          <input
            type="range"
            className="slider w-full"
            min={0}
            max={totalTime || 0}
            value={currentTime}
            step={0.1}
            onChange={handleSeek}
            title="Seek Video"
            aria-label="Seek Video"
          />
        </div>

        <div className="flex items-center gap-x-4 justify-between">
          <TimeDisplay currentTime={currentTime} totalTime={totalTime} />
          <div className="flex items-center justify-center gap-x-2">
            <button onClick={handleMuteUnmute}>
              {volume === 0 ? (
                <img src={MuteIconSvg} title="Unmute" aria-label="Unmute" />
              ) : (
                <img src={SpeakerIconSvg} title="Mute" aria-label="Mute" />
              )}
            </button>
            <input
              type="range"
              className="slider w-16"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              title="Change Volume"
              aria-label="Change Volume"
            />
          </div>
        </div>

        <div className="flex gap-x-2 items-center justify-start">
          <DropDown
            options={PlayBackOptions}
            onOptionSelect={(rate) => handlePlaybackRateChange(rate)}
            selectedValue={playbackRate}
            prefixText="Playback Speed"
          />
          <DropDown
            options={AspectRatioOptions}
            onOptionSelect={(ratio) => handleAspectRatioChange(ratio)}
            selectedValue={aspectRatio}
            prefixText="Aspect Ratio"
          />
        </div>
      </div>
      {/* Preview Player */}
      <VideoPreview
        canvasRef={canvasRef}
        cropState={cropState}
        cropperStarted={cropperStarted}
      />
    </div>
  );
};

export default VideoPlayer;
