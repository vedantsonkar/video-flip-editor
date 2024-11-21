import axios from "axios";
import { PlayBackData } from "../types"; // Correct import of the type

interface uploadVideoToServerProps {
  timestampData: PlayBackData[]; // Ensuring we get PlayBackData array
  video: File | null;
}

export const uploadVideoToServer = async ({
  timestampData,
  video,
}: uploadVideoToServerProps) => {
  if (!timestampData || timestampData.length === 0 || !video) {
    throw new Error("Error in the provided data");
  }

  const formData = new FormData();
  if (video) {
    formData.append("video", video);
  } else {
    throw new Error("No video file selected");
  }
  formData.append("tasks", JSON.stringify({ tasks: timestampData }));

  try {
    const response = await axios.post(
      "http://localhost:3000/api/video/process",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent?.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent?.total
            );
            console.log(`Upload Progress: ${percent}%`);
          }
        },
      }
    );
    console.log("Video processing completed", response.data);
  } catch (error) {
    console.error("Error uploading video:", error);
  }
};
