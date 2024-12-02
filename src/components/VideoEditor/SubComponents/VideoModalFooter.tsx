import { FC, useCallback } from "react";
import Button from "../../Button";
import { useVideoContext } from "../../../context/videoContext";
// import { uploadVideoToServer } from "../../../services";

interface VideoModalFooterPropTypes {
  setIsModalOpen: (isModalOpen: boolean) => void;
}

const VideoModalFooter: FC<VideoModalFooterPropTypes> = ({
  setIsModalOpen,
}) => {
  const {
    cropperStarted,
    // selectedVideo,
    // data,
    setCropperStarted,
    setSelectedVideo,
    setSelectedTab,
  } = useVideoContext();

  const onCancel = useCallback(() => {
    setSelectedVideo(null);
    setIsModalOpen(false);
  }, [setIsModalOpen, setSelectedVideo]);

  // const uploadToServer = useCallback(async () => {
  //   const response = await uploadVideoToServer({
  //     video: selectedVideo,
  //     timestampData: data,
  //   });
  //   console.log("Response", response);
  // }, [data, selectedVideo]);

  return (
    <div
      id="video-editor-modal-footer"
      className="flex w-full items-end justify-between border-t-[0.5px] border-[#494C55] pt-[1.25rem] pb-4"
    >
      <div className="flex items-center justify-center gap-x-2">
        <Button
          label="Start Cropper"
          onClick={() => {
            if (!cropperStarted) {
              setCropperStarted(true);
            }
          }}
          disabled={cropperStarted}
        />
        <Button
          label="Remove Cropper"
          onClick={() => {
            if (cropperStarted) {
              setCropperStarted(false);
            }
          }}
          disabled={!cropperStarted}
        />
        <Button
          label="Generate Preview"
          onClick={() => setSelectedTab("Preview Session")}
        />
      </div>
      <Button label="Cancel" onClick={onCancel} variant="secondary" />
    </div>
  );
};

export default VideoModalFooter;
