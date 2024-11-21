import React, { FC, MutableRefObject } from "react";
import { twMerge } from "tailwind-merge";
import PreviewSvg from "../../assets/vectors/preview.svg";

interface VideoPreviewPropTypes {
  cropperStarted: boolean;
  cropState: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
}

const VideoPreview: FC<VideoPreviewPropTypes> = ({
  cropperStarted,
  cropState,
  canvasRef,
}) => {
  const croppedAspect = cropState.width / cropState.height;

  // Precomputed styles
  const containerClass = twMerge(
    "gap-y-4 basis-1/2 text-center",
    cropperStarted ? "flex flex-col" : "grid grid-rows-3"
  );

  const canvasWrapperStyles = cropperStarted
    ? {
        width: `${cropState.width}px`,
        height: `${cropState.width / croppedAspect}px`,
      }
    : { width: "100%", height: "100%" };

  const fallbackPreview = (
    <div className="flex flex-col items-center justify-center text-center h-full gap-y-2 w-1/2 m-auto grow">
      <img src={PreviewSvg} title="Preview" aria-label="Preview" />
      <p className="text-white font-bold text-sm">Preview not available</p>
      <p className="text-white text-sm text-opacity-50">
        Please click on “Start Cropper” and then play video
      </p>
    </div>
  );

  return (
    <div className={containerClass}>
      <p>Preview</p>
      {cropperStarted ? (
        <div
          className={twMerge("overflow-hidden mx-auto")}
          style={canvasWrapperStyles}
        >
          <canvas
            ref={canvasRef}
            width={cropState.width}
            height={cropState.width / croppedAspect}
            className="inset-0 mx-auto w-full h-full object-cover object-center border border-white"
          />
        </div>
      ) : (
        fallbackPreview
      )}
    </div>
  );
};

export default React.memo(VideoPreview);
