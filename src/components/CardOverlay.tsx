import { useState, useRef, type JSX, useEffect } from "react";
import { ContentFields, type CardOverlayProps, type ContentMiscData } from "../types/types.ts";
import { getContentText, getContentImageURL, getContentMiscData, getContentVideoArtURL } from "../types/helpers.ts";
import '../styles/CardOverlay.css'

export function CardOverlay({item}: CardOverlayProps) {
    const videoRef = useRef<HTMLVideoElement>(null); 
    const [topImageIndex, setTopImage] = useState(0);
    const [bottomImageIndex, setBottomImage] = useState(0);

    const overlayData = {
        title: getContentText(item, ContentFields.TEXT_FULL, ContentFields.TEXT_TITLE),
        heroTile: getContentImageURL(item, ContentFields.IMAGE_HERO_TILE, ContentFields.IMAGE_HERO_TILE_RATIO),
        heroCollectionTile: getContentImageURL(item, ContentFields.IMAGE_HERO_COLLECTION, ContentFields.IMAGE_HERO_COLLECTION_RATIO),
        titleTreatmentLayer: getContentImageURL(item, ContentFields.IMAGE_TITLE_TREATMENT_LAYER, ContentFields.IMAGE_TITLE_TREATMENT_LAYER_RATIO),
        logoLayer: getContentImageURL(item, ContentFields.IMAGE_LOGO_LAYER, ContentFields.IMAGE_LOGO_LAYER_RATIO),
        video: getContentVideoArtURL(item),
        miscData: getContentMiscData(item),
    };

    const camelToTitle = (camelStr: string): string => {
        return camelStr
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
    };

    const renderMiscData = (miscData: ContentMiscData | undefined) => {
        if(!miscData) return;

        const elements: JSX.Element[] = [];
        let keyIndex = 0;
        Object.entries(miscData).forEach(([key, value]) => {
            elements.push(<p key={keyIndex++}>{camelToTitle(key)}: {value}</p>);
          });
        return elements;
    };
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

    const handleTopMissingImg = () => {
        if(topImageIndex < topImagesArray.length - 1) {
            setTopImage(prev => prev + 1);
        }
    };

    const handleBottomMissingImg = () => {
        if(bottomImageIndex < bottomImagesArray.length - 1) {
            setBottomImage(prev => prev + 1);
        }
    };
    
    useEffect(() => {
        if(overlayData.video && videoRef.current) {
            const video = videoRef.current;
            setTimeout(() => {
                video.play().catch((error) => {
                    console.log(`Error: ${error}`);
                });
            }, 100);
        }
    }, [overlayData.video]);

    return (
        <div className="overlay-container">
            {overlayData.video && (
                <video ref={videoRef} src={overlayData.video} className="overlay-video-top" loop muted playsInline preload="metadata"style={{borderTopRightRadius: "12px", borderTopLeftRadius: "12px"}} />
            )}
            {!overlayData.video && (
                <img src={currentTopImage} onError={handleTopMissingImg} style={{borderTopRightRadius: "12px", borderTopLeftRadius: "12px"}}/>
            )}
            <div className="overlay-container-text">
                <img src={currentBottomImage} onError={handleBottomMissingImg} style={{borderBottomLeftRadius: "12px",borderBottomRightRadius: "12px", width:"100%", height:"auto"}} alt={overlayData.title}/>
                <div className="overlay-text">
                    {renderMiscData(overlayData.miscData)}
                </div>
            </div>
        </div>
    )

}

export default CardOverlay;