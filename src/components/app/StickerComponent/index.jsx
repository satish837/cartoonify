import React, { createRef, useState, useCallback } from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import IndividualSticker from "./IndividualSticker";
import { stickersData } from "./stickerData";
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";


export default function Sticker({ image, logoImg }) {
  const [background] = useImage(image, 'Anonymous');
  const [logoSticker] = useImage(logoImg, 'Anonymous');
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
    downloadURI(uri, 'airtel-employee-avatar.jpg')
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
        height={530}
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
          <KonvaImage 
            image={logoSticker}  
            height={125}  
            width={380}
            x={0}
            y={400}
          />
        </Layer>
      </Stage>
      
      <Box display="flex" justifyContent="space-between" my={5} bg="gray.50" p={3} shadow="sm">  
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
      <Button colorScheme='red' w={'100%'} onClick={handleExport}>Download Sticker</Button>
    </div> 
  );
}
