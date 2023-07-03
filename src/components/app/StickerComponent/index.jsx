import React, { createRef, useState, useCallback } from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import IndividualSticker from "./IndividualSticker";
import { stickersData } from "./stickerData";
import { Image } from "@chakra-ui/image";
import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const sliderHashTagsImages = [
  '/images/hashtags/1.jpg',
  '/images/hashtags/2.jpg',
  '/images/hashtags/3.jpg',
  '/images/hashtags/4.jpg'
]


function HashtagSlider({ onHashTagClick }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };
  return (
    <Box display="flex" w={'380px'} justifyContent="space-between"  p={2}>
      <Slider {...settings} style={{width: '100%'}}>
        {
          sliderHashTagsImages.map((hashtagImgPath => {
            return (
              <Box px={3} key={hashtagImgPath}>
                <Image src={hashtagImgPath} onClick={() => onHashTagClick(hashtagImgPath)}/>
                </Box>
            )
          }))
        }
      </Slider>
    </Box>
  )
}


export default function Sticker({ image, logoImg, onHashTagClick }) {
  const [background] = useImage(image, 'Anonymous');
  const [logoSticker] = useImage(logoImg, 'Anonymous');
  const [images, setImages] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false)
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

  const onUploadImageToCloudinary = React.useCallback(async (imageBase64) => {
      const formData = new FormData();
      formData.append("file", imageBase64);
      formData.append("folder", "stickers")
      formData.append("upload_preset", "nnbc8dy5");

      const data = await fetch(
        "https://api.cloudinary.com/v1_1/din1iizbq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());
     
      console.log(data);
    
  }, []);

  function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const handleExport = React.useCallback(async () => {
      setShowDeleteButton(false)
      setIsProcessing(true)
      setTimeout(async () => {
        const uri = stageRef.current.toDataURL();
        await onUploadImageToCloudinary(uri)
        downloadURI(uri, 'airtel-employee-avatar.jpg');
        setIsProcessing(false)
      }, 2000)
  }, []);

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
                showDeleteButton={showDeleteButton} 
                setShowDeleteButton={setShowDeleteButton}
              />
            );
          })}
          <KonvaImage 
            image={logoSticker}  
            height={105}  
            width={380}
            x={0}
            y={400}
          />
        </Layer>
      </Stage>

      <HashtagSlider onHashTagClick={(imgSrc) => onHashTagClick(imgSrc)}/>
      
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
                  x: 200,
                  y: 200
                });
              }}
            >
              <Image alt={sticker.alt} src={sticker.url} width={sticker.width} />
            </button>
          );
        })}

    </Box> 
      <Button loadingText='Please wait...' isLoading={isProcessing} colorScheme='red' w={'100%'} onClick={handleExport}>
       Download Sticker
      </Button>
    </div> 
  );
}
