import useImage from "use-image";
import React, { useState, useEffect, useRef } from "react";
import { Image as KonvaImage, Group } from "react-konva";
import { useHoverDirty, useLongPress } from "react-use";


const IndividualSticker = ({ image, showDeleteButton, setShowDeleteButton, onDelete, onDragEnd }) => {
  const imageRef = useRef(null);
  const isHovered = useHoverDirty(imageRef);
  const [stickerImage] = useImage(image.src);
  const [deleteImage] = useImage("cancel.svg");
  
  const onLongPress = () => {
    setShowDeleteButton(true);
  };

  image.resetButtonRef.current = () => {
    setShowDeleteButton(false);
  };
  const longPressEvent = useLongPress(onLongPress, { delay: 200 });
  const [isDragging, setIsDragging] = useState(false);

  const stickerWidth = image.width;
  const stickerHeight = stickerImage
    ? (image.width * stickerImage.height) / stickerImage.width
    : 0;

  useEffect(() => {
    if (isHovered) {
      setShowDeleteButton(true);
    } else {
      setTimeout(() => {
        setShowDeleteButton(false);
      }, 2000);
    }
  }, [isHovered]);

  return (
    <Group
      draggable
      x={image.x}
      y={image.y}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event) => {
        setIsDragging(false);
        onDragEnd(event);
      }}
    >
      <KonvaImage
        ref={imageRef}
        width={image.width + 30}
        height={stickerHeight + 30}
        image={stickerImage}
        {...longPressEvent}
      />
      {showDeleteButton && !isDragging && (
        <KonvaImage
          onTouchStart={onDelete}
          onClick={onDelete}
          image={deleteImage}
          width={25}
          height={25}
          offsetX={-stickerWidth / 2 - 40}
        />
      )}
    </Group>
  );
};

export default IndividualSticker;
