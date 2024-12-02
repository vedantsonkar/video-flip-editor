import { FC } from "react";
import Modal from "../Modal";
import VideoModalHeader from "./SubComponents/VideoModalHeader";
import VideoModalFooter from "./SubComponents/VideoModalFooter";
import VideoModalBody from "./SubComponents/VideoModalBody";
import { useVideoContext } from "../../context/videoContext";
import GeneratedPreview from "../VideoPreview/GeneratedPreview";

interface VideoEditorModalPropTypes {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

const VideoEditorModal: FC<VideoEditorModalPropTypes> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const { selectedTab, data, setSelectedTab, setSelectedVideo } =
    useVideoContext();

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
        className="px-5 py-[1.563rem] h-full"
      >
        <VideoModalHeader
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
        />
        {selectedTab === "Generate Session" ? (
          <>
            <VideoModalBody />
            <VideoModalFooter setIsModalOpen={setIsModalOpen} />
          </>
        ) : (
          <>
            <GeneratedPreview data={data} />
          </>
        )}
      </div>
    </Modal>
  );
};

export default VideoEditorModal;
