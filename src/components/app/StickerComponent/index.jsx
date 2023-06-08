import React, { createRef, useState, useCallback } from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { IndividualSticker } from "./individualSticker";
import { stickersData } from "./stickerData";
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";


export default function Sticker({ image }) {
  const [background] = useImage(image, 'Anonymous');
  const [images, setImages] = useState([]);
  const stageRef = React.useRef(null);


  const addStickerToPanel = ({ src, width, x, y }) => {
    setImages((currentImages) => [
      ...currentImages,
      {
        width,
        x,
        y,
        src,
        resetButtonRef: createRef()
      }
    ]);
  };

  const resetAllButtons = useCallback(() => {
    images.forEach((image) => {
      if (image.resetButtonRef.current) {
        image.resetButtonRef.current();
      }
    });
  }, [images]);

  const handleCanvasClick = useCallback(
    (event) => {
      if (event.target.attrs.id === "backgroundImage") {
        resetAllButtons();
      }
    },
    [resetAllButtons]
  );

  function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  


  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    downloadURI(uri, 'stage.jpg')
    // we also can save uri as file
    // but in the demo on Konva website it will not work
    // because of iframe restrictions
    // but feel free to use it in your apps:
    // downloadURI(uri, 'stage.png');
  };

  return (
    <div>
      <Stage
        width={380}
        height={400}
        onClick={handleCanvasClick}
        onTap={handleCanvasClick}
        ref={stageRef}
      >
        <Layer>
          <KonvaImage
            image={background}
            height={400}
            width={380}
            id="backgroundImage"
          />
          {images.map((image, i) => {
            return (
              <IndividualSticker
                onDelete={() => {
                  const newImages = [...images];
                  newImages.splice(i, 1);
                  setImages(newImages);
                }}
                onDragEnd={(event) => {
                  image.x = event.target.x();
                  image.y = event.target.y();
                }}
                key={i}
                image={image}
              />
            );
          })}
        </Layer>
      </Stage>
      
      <Box mt={5}>  
      {stickersData.map((sticker, id) => {
        return (
          <button
            key={id}
            className="button"
            onMouseDown={() => {
              addStickerToPanel({
                src: sticker.url,
                width: sticker.width,
                x: 100,
                y: 100
              });
            }}
          >
            <Image alt={sticker.alt} src={sticker.url} width={sticker.width} />
          </button>
        );
      })}

    </Box> 
    <Button onClick={handleExport}>Download Sticker</Button>
    </div> 
  );
}
