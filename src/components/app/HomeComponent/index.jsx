import React, { useRef } from 'react';
import { Box, Button, Center, Flex, Spinner, Text } from '@chakra-ui/react'
import Webcam from "react-webcam";
import axios from 'axios';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dynamic from 'next/dynamic';

const FormData = require('form-data');

const Sticker = dynamic(() => import("../StickerComponent"), {
  ssr: false,
});

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user"
};

function CapturePhoto({ setImageSrc }) {
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc);
    },
    [webcamRef, setImageSrc]
  );
  return (
    <Flex direction="column">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        mirrored
      />
      <Button colorScheme="red" rounded={false} mt={2} onClick={capture}>
        Capture photo
      </Button>
    </Flex>
  );
}

function PreviewImage({ imageSrc, setImageSrc, onProceedImage }) {
  return (
    <Flex direction="column">
      <img src={imageSrc} width={videoConstraints.width} height={videoConstraints.height}/>
      <Flex>
        <Button colorScheme="gray" w={'50%'} mt={2} rounded={false} onClick={() => setImageSrc('')}>Retake Photo</Button>
        <Button colorScheme="red"  w={'50%'} mt={2} rounded={false} onClick={onProceedImage}>Proceed</Button>
      </Flex>
    </Flex>
  )
}

function Proecessing() {
  return (
    <Flex direction='column' h={400} alignItems='center' justifyContent="center">
      <Spinner color='red.500' size="xl"/>        
      <Text color="gray" mt={3}>Proecessing...</Text>
    </Flex>
  )
}


export default function Homepage() {
  const [imageSrc, setImageSrc] = React.useState('');
  const [uploadedImagePath, setUploadedImagePath] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false);
  const ref = React.useRef(null)

  const removeBg = async (url) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://www.cutout.pro/api/v1/mattingByUrl?url=${url}&mattingType=6&bgcolor=FFFFFF&outputFormat=jpg_75`,
      headers: { 
        'Accept': 'application/json', 
        'APIKEY': '544b363b1de24a909d414da1ec3a2ee4', 
      }
    };

    const {data: { data: { imageUrl } } } = await axios.request(config)
    const imagePath =  await uploadImageToCloudinary(imageUrl);
    await requestCartoonify(imagePath);
  }

  const requestCartoonify = async (url) => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://www.cutout.pro/api/v1/cartoonSelfieByUrl?cartoonType=13_header&url=${url}`,
      headers: { 
        'Accept': 'application/json', 
        'APIKEY': '544b363b1de24a909d414da1ec3a2ee4', 
      }
    };
    
    const {data: { data: { imageUrl } } } = await axios.request(config).catch((e) => console.log(e))
    const img = await uploadImageToCloudinary(imageUrl)
    console.log(img);
    setUploadedImagePath(img)
    setIsProcessing(false)
  }

  const uploadImageToCloudinary = async (imageSrc) => {
    const formData = new FormData();
      formData.append('file', imageSrc);
      formData.append('upload_preset', 'nnbc8dy5');

      const data = await fetch('https://api.cloudinary.com/v1_1/din1iizbq/image/upload', {
        method: 'POST',
        body: formData
      }).then(r => r.json());
      return data.url
  }


  const onUploadImageToCloudinary = React.useCallback(async () => {
    setIsProcessing(true);
    if (imageSrc) {
      const formData = new FormData();
      formData.append('file', imageSrc);
      formData.append('upload_preset', 'nnbc8dy5');

      const data = await fetch('https://api.cloudinary.com/v1_1/din1iizbq/image/upload', {
        method: 'POST',
        body: formData
      }).then(r => r.json());
      if (data) {
        removeBg(data.url);
      }
    }  
  }, [imageSrc]);




  return (
    <Center height="100vh">
      <Flex
        p={4}
        alignItems="center"
        shadow="lg"
        justifyContent="center"
        border="1px solid #eee"
        width={400}
      >
        {!uploadedImagePath && !imageSrc && !isProcessing && (
          <CapturePhoto setImageSrc={setImageSrc} />
        )}
        {!uploadedImagePath && imageSrc && !isProcessing && (
          <PreviewImage
            imageSrc={imageSrc}
            setImageSrc={setImageSrc}
            onProceedImage={onUploadImageToCloudinary}
          />
        )}
       {!uploadedImagePath && isProcessing && <Proecessing />}
        {uploadedImagePath && (
        <Flex direction="column">
          <Box ref={ref} id="elem">
            <Sticker 
              image={uploadedImagePath}
              logoImg='/stickers/hashtag.png'
            />
          </Box>
        </Flex>
        )}
      </Flex>
    </Center>
  );
}
