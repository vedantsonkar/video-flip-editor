import React, { useState, useEffect, useCallback } from "react";
import { useVideoContext } from "../../context/videoContext";
import { aspectRatioMap } from "../../constants";

interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropperGridProps {
  onDrag: (coordinates: Coordinates) => void;
  parentRef: React.RefObject<HTMLDivElement>;
}

const CropperGrid: React.FC<CropperGridProps> = ({ onDrag, parentRef }) => {
  const { aspectRatio } = useVideoContext();
  const aspectRatioValue = aspectRatioMap[aspectRatio] || 9 / 18;

  const [coordinates, setCoordinates] = useState<Coordinates>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (!parentRef.current) return;

    const parentWidth = parentRef.current.offsetWidth;
    const parentHeight = parentRef.current.offsetHeight;

    let height = parentHeight;
    let width = height * aspectRatioValue;

    if (width > parentWidth) {
      width = parentWidth;
      height = width / aspectRatioValue;
    }

    const x = (parentWidth - width) / 2;
    const y = (parentHeight - height) / 2;
    setCoordinates({
      x,
      y,
      width,
      height,
    });
    onDrag({ height, width, x, y });
  }, [aspectRatioValue, onDrag, parentRef]);

  // Handle dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - coordinates.x,
        y: e.clientY - coordinates.y,
      });
    },
    [coordinates]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !dragStart || !parentRef.current) return;

      const parentWidth = parentRef.current.offsetWidth;
      const parentHeight = parentRef.current.offsetHeight;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const clampedX = Math.max(
        0,
        Math.min(newX, parentWidth - coordinates.width)
      );
      const clampedY = Math.max(
        0,
        Math.min(newY, parentHeight - coordinates.height)
      );

      setCoordinates((prev) => ({
        ...prev,
        x: clampedX,
        y: clampedY,
      }));

      onDrag({ ...coordinates, x: clampedX, y: clampedY });
    },
    [isDragging, dragStart, coordinates, onDrag, parentRef]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  return (
    <div
      className="relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Overlay: Outside the grid */}
      <div
        className="absolute inset-0 bg-gray-900 bg-opacity-60 pointer-events-none"
        style={{
          clipPath: `polygon(
            0% 0%, 
            100% 0%, 
            100% 100%, 
            0% 100%, 
            0% ${coordinates.y}px, 
            ${coordinates.x}px ${coordinates.y}px, 
            ${coordinates.x}px ${coordinates.y + coordinates.height}px, 
            ${coordinates.x + coordinates.width}px ${
            coordinates.y + coordinates.height
          }px, 
            ${coordinates.x + coordinates.width}px ${coordinates.y}px, 
            0% ${coordinates.y}px
          )`,
        }}
      />

      {/* Cropper grid */}
      <div
        className="absolute border-2 border-white pointer-events-none grid grid-cols-3 grid-rows-3"
        style={{
          left: coordinates.x,
          top: coordinates.y,
          width: coordinates.width,
          height: coordinates.height,
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="border-[0.5px] border-dotted border-white border-opacity-40"
            style={{ pointerEvents: "none" }}
          ></div>
        ))}
      </div>

      {/* Draggable area */}
      <div
        className="absolute cursor-move"
        style={{
          left: coordinates.x,
          top: coordinates.y,
          width: coordinates.width,
          height: coordinates.height,
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default CropperGrid;
