import { FC, useState } from "react";
import Modal from "../Modal";
import VideoModalHeader from "./SubComponents/VideoModalHeader";
import VideoModalFooter from "./SubComponents/VideoModalFooter";
import VideoModalBody from "./SubComponents/VideoModalBody";
import { useVideoContext } from "../../context/videoContext";

interface VideoEditorModalPropTypes {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

const VideoEditorModal: FC<VideoEditorModalPropTypes> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const { setSelectedVideo } = useVideoContext();
  const [selectedTab, setSelectedTab] = useState<
    "Preview Session" | "Generate Session"
  >("Preview Session");
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setSelectedVideo(null);
        setIsModalOpen(false);
      }}
      showCloseIcon={false}
    >
      <div
        id="video-editor-modal"
        aria-label="video-editor-modal"
        className="px-5 py-[1.563rem]"
      >
        <VideoModalHeader
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
        />
        <VideoModalBody />
        <VideoModalFooter setIsModalOpen={setIsModalOpen} />
      </div>
    </Modal>
  );
};

export default VideoEditorModal;
