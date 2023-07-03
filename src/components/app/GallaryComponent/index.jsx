import React from 'react'

export default function GallaryComponent() {

  const fetchAssets = React.useCallback(async () => {
    const results = await fetch(`https://api.cloudinary.com/v1_1//resources/search`)

  }, [])  

  return (
    <div>index</div>
  )
}
