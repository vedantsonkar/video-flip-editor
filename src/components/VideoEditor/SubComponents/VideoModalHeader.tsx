import { FC } from "react";
import Button from "../../Button";

interface VideoModalHeaderPropTypes {
  selectedTab: "Preview Session" | "Generate Session";
  setSelectedTab: (selectedTab: "Preview Session" | "Generate Session") => void;
}

const VideoModalHeader: FC<VideoModalHeaderPropTypes> = ({
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <div
      id="video-editor-modal-header"
      className="grid grid-cols-3 w-full items-center justify-between mb-[1.25rem]"
    >
      <p className="text-sm md:text-base font-bold select-none">Cropper</p>
      <div className="bg-lightgrey p-1 flex items-center justify-center gap-x-4 rounded-md">
        <Button
          variant="secondary"
          label="Preview Session"
          onClick={() => setSelectedTab("Preview Session")}
          customClasses={
            selectedTab === "Preview Session"
              ? "bg-darkgrey transition-colors w-full flex-1 rounded-md"
              : "bg-lightgrey transition-colors flex-1 rounded-md"
          }
        />
        <Button
          variant="secondary"
          label="Generate Session"
          onClick={() => setSelectedTab("Generate Session")}
          customClasses={
            selectedTab === "Generate Session"
              ? "bg-darkgrey transition-colors w-full flex-1 rounded-md"
              : "bg-lightgrey transition-colors flex-1 rounded-md"
          }
        />
      </div>
    </div>
  );
};

export default VideoModalHeader;
