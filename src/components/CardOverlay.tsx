import { useState, useRef, type JSX } from "react";
import { ContentFields, type CardOverlayProps, type ContentMiscData } from "../types/types.ts";
import { getContentText, getContentImageURL, getContentMiscData, getContentVideoArtURL, isCollectionContent } from "../types/helpers.ts";
import { videoAutoplay } from "../hooks/videoAutoplay.ts";
import '../styles/CardOverlay.css'

// React Component that renders an overlay by stitching together two images alongside some select data from a given item
// If the item contains a video asset, it autoplays and loops the video instead of the top image

export function CardOverlay({item}: CardOverlayProps) {
    const videoRef = useRef<HTMLVideoElement>(null); 
    const [topImageIndex, setTopImage] = useState(0);
    const [bottomImageIndex, setBottomImage] = useState(0);
    const [allBottomImagesUsed, setAllBottomImagesUsed] = useState(false);

    const overlayData = {
        title: getContentText(item, ContentFields.TEXT_FULL, ContentFields.TEXT_TITLE),
        heroTile: getContentImageURL(item, ContentFields.IMAGE_HERO_TILE, ContentFields.IMAGE_HERO_TILE_RATIO),
        heroCollectionTile: getContentImageURL(item, ContentFields.IMAGE_HERO_COLLECTION, ContentFields.IMAGE_HERO_COLLECTION_RATIO),
        titleTreatmentLayer: getContentImageURL(item, ContentFields.IMAGE_TITLE_TREATMENT_LAYER, ContentFields.IMAGE_TITLE_TREATMENT_LAYER_RATIO),
        logoLayer: getContentImageURL(item, ContentFields.IMAGE_LOGO_LAYER, ContentFields.IMAGE_LOGO_LAYER_RATIO),
        video: getContentVideoArtURL(item),
        miscData: getContentMiscData(item),
        isCollection: isCollectionContent(item),
    };

    // Small regex function that returns a Title Case string from a camelCase string
    const camelToTitle = (camelStr: string): string => {
        return camelStr
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
    };

    // Function to takes in masData and creates a multi-line html element
    const renderMiscData = (miscData: ContentMiscData | undefined) => {
        if(!miscData) return;

        const elements: JSX.Element[] = [];
        let keyIndex = 0;
        Object.entries(miscData).forEach(([key, value]) => {
            elements.push(<p key={keyIndex++}>{camelToTitle(key)}: {value}</p>);
          });
        return elements;
    };

    // Fallback Image Arrays - in the event that an item doesn't have a certain image, we attempt to render the next image in the array instead 
    const topImagesArray = [
        overlayData.heroTile,
        overlayData.heroCollectionTile,
    ].filter(Boolean);
    const bottomImagesArray = [
        overlayData.titleTreatmentLayer,
        overlayData.logoLayer,
    ].filter(Boolean);

    const currentTopImage = topImagesArray[topImageIndex];
    const currentBottomImage = bottomImagesArray[bottomImageIndex];

    // Functions that iterate through the Image Arrays
    const handleTopMissingImg = () => {
        if(topImageIndex < topImagesArray.length - 1) {
            setTopImage(prev => prev + 1);
        }
    };
    const handleBottomMissingImg = () => {
        if(bottomImageIndex < bottomImagesArray.length - 1) {
            setBottomImage(prev => prev + 1);
        } else {
            setAllBottomImagesUsed(true);
        }
    };
    
    videoAutoplay(overlayData.video, videoRef);

    return (
        <div className="overlay-container">
            {overlayData.video && (
                <video ref={videoRef} src={overlayData.video} className="overlay-video-top" loop muted playsInline preload="metadata"style={{borderTopRightRadius: "12px", borderTopLeftRadius: "12px"}} />
            )}
            {!overlayData.video && (
                <img src={currentTopImage} alt={overlayData.title} onError={handleTopMissingImg} style={{borderTopRightRadius: "12px", borderTopLeftRadius: "12px"}}/>
            )}
            <div className="overlay-container-bottom">
                <div>
                    {currentBottomImage && !allBottomImagesUsed ? (
                        <img src={currentBottomImage} alt={overlayData.title} onError={handleBottomMissingImg} style={{borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px", width:"100%", height:"auto"}}/>
                    ) : (
                        <div className="overlay-bottom">
                            <div className="overlay-bottom-title">
                                {overlayData.title}
                            </div>
                        </div>
                    )}
                </div>
                <div className="overlay-text">
                    {!overlayData.isCollection ? 
                        renderMiscData(overlayData.miscData) : 
                        (<div>This is a {overlayData.title} Collection</div>)}
                </div>
            </div>
        </div>
    )

}

export default CardOverlay;