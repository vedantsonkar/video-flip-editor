import { Button } from "../components";
import { useCallback, useRef, useState } from "react";
import VideoEditorModal from "../components/VideoEditor/VideoEditor";
import { useVideoContext } from "../context/videoContext";

function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setSelectedVideo } = useVideoContext();

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("ran");
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      if (file.type !== "video/mp4") {
        alert("Only .mp4 files are allowed!");
        event.target.value = "";
        return;
      }

      setIsModalOpen(true);
      setSelectedVideo(file);
      event.target.value = "";
    },
    [setSelectedVideo]
  );

  return (
    <>
      <div className="flex items-center justify-center flex-col gap-y-16">
        <h1 className="text-7xl font-bold">
          Get started by uploading a video!
        </h1>
        <Button
          label="Upload a Video"
          onClick={handleButtonClick}
          variant="primary"
          customClasses="w-72 text-2xl"
        />
        <input
          style={{ display: "none" }}
          onChange={handleFileChange}
          onSelect={handleFileChange}
          type="file"
          accept="video/mp4"
          ref={fileInputRef}
        />
      </div>
      <VideoEditorModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

export default Home;
