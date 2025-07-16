import type { APIResponse, ContentItem, Series, Movie, Collection, ImageCollection, SimpleTextContent, TextContent, Default, ContentMiscData } from "./types.ts";

// Utility functions that allow easier interfacing with our types

export function extractAllContentItems(
    response: APIResponse | null
): ContentItem[]{
    if (!response) return [];
    return response.data.StandardCollection.containers.flatMap(
        container => container.set.items
    );
}

export function isSeriesContent(
    item: ContentItem
): item is Series {
    return item.type === "DmcSeries";
}

export function isMovieContent(
    item: ContentItem
): item is Movie {
    return item.type === "DmcVideo"
}

export function isCollectionContent(
    item: ContentItem
): item is Collection {
    return item.type === "StandardCollection";
}

export function getContentText(
    item: ContentItem, 
    textType: "full" | "slug",
    contentType: keyof Default
): string | undefined {
    if (isSeriesContent(item)) {
        return getTextContent(item.text, textType, "series", contentType);
    }  
    else if (isMovieContent(item)) {
        return getTextContent(item.text, textType, "program", contentType);
    }
    else if (isCollectionContent(item)){
        return getSimpleTextContent(item.text, "collection", contentType); 
    }
    else{
        return undefined;
    }
}

function getTextContent<T extends string>(
    textContent: TextContent<T>, 
    textType: 'full' | 'slug',
    entityType: T, 
    contentType: keyof Default
): string | undefined {
    return textContent?.title?.[textType]?.[entityType]?.default?.[contentType];
}

function getSimpleTextContent<T extends string>(
    textContent: SimpleTextContent<T>,
    entityType: T,
    contentType: keyof Default
): string  | undefined {
    return textContent?.title?.full?.[entityType]?.default?.[contentType];
}

export function getContentImageURL(
    item: ContentItem,
    imageType: string,
    aspectRatio: string
): string | undefined {
    if (isSeriesContent(item)) {
        return getImageURL(item.image, imageType, aspectRatio, "series");
    }  
    else if (isMovieContent(item)) {
        return getImageURL(item.image, imageType, aspectRatio, "program");
    }
    else if (isCollectionContent(item)){
        return getImageURL(item.image, imageType, aspectRatio, "default"); // Why is this default? And not collection?
    }
    else{
        return undefined;
    }
}

function getImageURL(
    image:ImageCollection, 
    imageType: string, 
    aspectRatio: string, 
    entityType: string
): string | undefined {
    return image[imageType]?.[aspectRatio]?.[entityType]?.default?.url;
}

export function getAllContentImageURL(
    item: ContentItem
): Record<string, Record<string, string>> | undefined {
    if (isSeriesContent(item)) {
        return getAllImageURLs(item.image, "series");
    }  
    else if (isMovieContent(item)) {
        return getAllImageURLs(item.image, "program");
    }
    else if (isCollectionContent(item)){
        return getAllImageURLs(item.image, "default"); // Why is this default? And not collection?
    }
    else{
        return undefined;
    }
}

function getAllImageURLs(
    image:ImageCollection,
    entityType: string,
): Record<string, Record<string, string>> {
    const imageURLs: Record<string, Record<string, string>> = {};

    for (const imageType in image) {
        imageURLs[imageType] = {}
        for (const aspectRatio in image[imageType]) {
            const url = image[imageType]?.[aspectRatio]?.[entityType]?.default?.url;
            if (url) {
                imageURLs[imageType][aspectRatio] = url;
            }
        }
    }
    return imageURLs;
}

export function getContentIDs(
    item: ContentItem, 
): string | undefined {
   if (isSeriesContent(item) || isMovieContent(item)) {
        return item.contentId;
   }
   else if (isCollectionContent(item)) {
        return item.collectionId;
   }
   else return undefined;
}

export function getContentMiscData(
    item: ContentItem,
): ContentMiscData | undefined {
    if(isSeriesContent(item) || isMovieContent(item)) {
        const miscData = {
            region: item?.currentAvailability?.region,
            rating: item?.ratings[0]?.value,
            releaseDate: item?.releases[0]?.releaseDate,
        }
        return miscData;
    }
    else if (isCollectionContent(item)) {
        return undefined; // There's nothing really notable about Collections to display? 
    }
}

export function getContentVideoArtURL(
    item: ContentItem,
): string | undefined{
    return item?.videoArt[0]?.mediaMetadata?.urls[0]?.url;
}

