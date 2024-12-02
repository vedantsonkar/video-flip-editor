import React, {
  FC,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import PreviewSvg from "../../assets/vectors/preview.svg";
import { useVideoContext } from "../../context/videoContext";
import { twMerge } from "tailwind-merge";

interface VideoPreviewPropTypes {
  data: Array<{
    timeStamp: number;
    coordinates: [number, number, number, number];
    volume: number;
    playbackRate: number;
  }>;
}

const VideoPreview: FC<VideoPreviewPropTypes> = ({ data }) => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { selectedVideo } = useVideoContext();
  const videoUrl = useMemo(
    () => (selectedVideo ? URL.createObjectURL(selectedVideo) : null),
    [selectedVideo]
  );

  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const updateCanvas = useCallback(() => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const videoElement = videoRef.current;

    if (ctx && videoElement && parentRef.current) {
      const currentTime = videoElement.currentTime;

      // Find the most recent data entry based on the current time
      const currentData = data
        .slice()
        .reverse()
        .find((entry) => currentTime >= entry.timeStamp);

      if (currentData) {
        const [x, y, croppedWidth, croppedHeight] = currentData.coordinates;
        setWidth(croppedWidth);
        setHeight(croppedHeight);
        // Adjust playback rate and volume
        videoElement.playbackRate = currentData.playbackRate;
        videoElement.volume = currentData.volume;

        // Calculate scaling factors
        const scaleX = canvas.width / videoElement.videoWidth;
        const scaleY = canvas.height / videoElement.videoHeight;

        // Scale crop dimensions
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = croppedWidth * scaleX;
        const scaledHeight = croppedHeight * scaleY;

        // Draw the scaled cropped area on the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          videoElement,
          x, // Source x-coordinate (video space)
          y, // Source y-coordinate (video space)
          croppedWidth, // Source width (video space)
          croppedHeight, // Source height (video space)
          scaledX, // Destination x-coordinate (canvas space)
          scaledY, // Destination y-coordinate (canvas space)
          scaledWidth, // Destination width (canvas space)
          scaledHeight // Destination height (canvas space)
        );
      }
    }
  }, [data]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.addEventListener("loadedmetadata", () => {
        if (canvasRef.current) {
          canvasRef.current.width = videoElement.videoWidth;
          canvasRef.current.height = videoElement.videoHeight;
        }
      });
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("loadedmetadata", () => {});
      }
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const startCanvasUpdates = () => {
      if (!intervalId) {
        intervalId = setInterval(updateCanvas, 17);
      }
    };

    const stopCanvasUpdates = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const videoElement = videoRef.current;
    console.log("videoElement", videoElement);
    if (videoElement) {
      videoElement.addEventListener("play", startCanvasUpdates);
      videoElement.addEventListener("pause", stopCanvasUpdates);
      videoElement.addEventListener("ended", stopCanvasUpdates);
    }

    return () => {
      stopCanvasUpdates();
      if (videoElement) {
        videoElement.removeEventListener("play", startCanvasUpdates);
        videoElement.removeEventListener("pause", stopCanvasUpdates);
        videoElement.removeEventListener("ended", stopCanvasUpdates);
      }
    };
  }, [updateCanvas]);

  return (
    <div className="text-center mx-auto">
      <p>Preview</p>
      {videoUrl ? (
        <div
          ref={parentRef}
          className="relative mx-auto overflow-hidden border border-white"
          style={{
            maxWidth: "100%",
            height: "100%",
          }}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            style={{ display: "none" }}
          />
          <div
            className={twMerge(
              "overflow-hidden mx-auto absolute inset-0 w-full h-full"
            )}
          >
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="inset-0 mx-auto w-full h-full object-cover object-center"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-full gap-y-2">
          <img src={PreviewSvg} title="Preview" alt="Preview" />
          <p className="text-white font-bold text-sm">Preview not available</p>
          <p className="text-white text-sm text-opacity-50">No video found</p>
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoPreview);
