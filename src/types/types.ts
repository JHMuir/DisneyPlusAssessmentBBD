
// Fully typed every property in the API

export interface Default {
    content: string;
    language: string;
    sourceEntity: string;
}

interface Slug {
    language: string;
    value: string;
}

interface ImageVariant {
    masterId: string;
    masterWidth: number;
    masterHeight: number;
    url: string;
}

interface ImageSet {
    [aspectRatio: string]: {
        [entityType: string]: {
            default: ImageVariant;
        };
    };
}

export interface ImageCollection {
    [imageType: string]: ImageSet;
}

interface MediaURL{
    url: string;
}

interface VideoArtItem {
    mediaMetadata: {
        urls: MediaURL[];
    };
    purpose: string;
}

interface PlaybackURL {
    rel: string;
    href: string;
    templated?: boolean;
    params?: Array<{
        name: string;
        description: string;
    }>;
}

interface MediaMetadata {
    format: string;
    mediaId: string;
    phase: string;
    playbackUrls: PlaybackURL[];
    productType: string;
    runtimeNillis: number;
    state: string;
    type: string;
}

interface Tag {
    displayName: string | null;
    type: string;
    value: string;
}

interface Rating {
    advisories: string[];
    description: string | null;
    system: string;
    value: string;
}

interface Release {
    releaseDate: string | null;
    releaseType: string;
    releaseYear: number;
    territory: string | null;
}

interface MediaRights {
    violations?: string[];
    downloadBLocked: boolean;
    pconBlocked: boolean;
    rewind?: boolean;
}

interface CurrentAvailability {
    region: string;
    kidsMode: boolean | null;
}

interface Group {
    name: string;
    partnerGroupId: string;
    type: string;
}

interface Family {
    encodedFamilyId: string;
    familyId: string;
    parent: boolean;
    parentRed: {
        encodedSeriesId: string | null;
        programId: string;
        seasonId: string | null;
        seriesId: string | null;
    };
    sequenceNumber: number | null;
}

export interface TextContent <T extends string>{
    title: {
        full: {
            [K in T]: {
                default: Default;
            }
        };
        slug: {
            [K in T]: {
                default: Default;
            };
        };
    };
}

export interface SimpleTextContent <T extends string>{
    title: {
        full: {
            [K in T]: {
                default: Default;
            };
        };
    };
}

interface CollectionGroup {
    collectionGroupId: string;
    contentClass: string;
    key: string;
    slugs: Slug[];
}

interface BaseContentItem {
    contentId: string;
    callToAction: string | null;
    currentAvailability: CurrentAvailability;
    image: ImageCollection;
    textExperienceId?: string;
    tags: Tag[];
    mediaRights: MediaRights;
    ratings: Rating[];
    releases: Release[];
    videoArt: VideoArtItem[]
}

interface SeriesContentItem extends BaseContentItem {
    text: TextContent<"series">;
    type: "DmcSeries";
    encodedSeriesId: string;
    seriesId: string;
}

interface MovieContentItem extends BaseContentItem {
    text: TextContent<"program">;
    type: "DmcVideo";
    contentType: "full";
    encodedSeriesId: string | null;
    episodeNumber: number | null;
    episodeSequenceNumber: number | null;
    episodeSeriesSequenceNumber: number | null;
    family: Family;
    groups: Group[];
    internalTitle: string;
    mediaMetadata: MediaMetadata;
    originalLanguage: string;
    programId: string;
    programType: string;
    seasonId: string | null;
    seasonSequenceNumber: number | null;
    seriesId: string | null;
    targetLanguage: string;
    videoId: string;
}

interface CollectionContentItem {
    callToAction: string | null;
    collectionGroup: CollectionGroup;
    collectionId: string;
    image: ImageCollection;
    text: SimpleTextContent<"collection">;
    type: "StandardCollection";
    videoArt: VideoArtItem[];
}

// ContentItem Types
export type Series = SeriesContentItem;
export type Movie = MovieContentItem;
export type Collection = CollectionContentItem;
export type ContentItem = Series | Movie | Collection;


interface SetMeta {
    hits: number;
    offset: number;
    page_size: number;
}

interface CuratedSet {
    contentClass: string;
    items: ContentItem[];
    meta: SetMeta;
    setId: string;
    text: SimpleTextContent<"set">;
    type: 'CuratedSet';
}

export type Set = CuratedSet;
export type Content = ContentItem | Set;

interface ShelfContainer {
    set: CuratedSet;
    type: 'ShelfContainer';
    style: string;
}


interface StandardCollection {
    callToAction: string | null;
    collectionGroup: CollectionGroup;
    collectionId: string;
    containers: ShelfContainer[];
    image: ImageCollection;
    text: SimpleTextContent<"collection">;
    type: "StandardCollection";
    videoArt: VideoArtItem[];
}

export interface APIResponse{
    data: {
        StandardCollection: StandardCollection;
    };
}

export interface CardOverlayProps {
    item: ContentItem;
}
export interface CardRowProps {
    title: string;
    items: ContentItem[];
    loading: boolean;
    error: string | null;
}

export interface CardNavigation {
    activeRowIndex: number;
    selectedCardIndex: number;
}

export interface ContentMiscData {
    region: string;
    rating: string;
    releaseDate: string | null;
}

export interface ContentRow {
    title: string;
    items: ContentItem[];
}
export type ContentRows = ContentRow[]

export interface Card {
    id: string;
    title: string | undefined;
    tile: string | undefined;
}
export type Cards = Card[];

export enum ContentFields {
    TEXT_FULL = "full",
    TEXT_SLUG = "slug",
    TEXT_TITLE = "content",
    TEXT_LANGUAGE = "language",
    IMAGE_TILE = "tile",
    IMAGE_TILE_RATIO = "1.78",
    IMAGE_BACKGROUND = "background",
    IMAGE_BACKGROUND_RATIO = "2.89",
    IMAGE_HERO_TILE = "hero_tile",
    IMAGE_HERO_TILE_RATIO = "3.00",
    IMAGE_HERO_COLLECTION = "hero_collection",
    IMAGE_HERO_COLLECTION_RATIO = "1.78",
    IMAGE_LOGO = "logo",
    IMAGE_LOGO_RATIO = "2.00",
    IMAGE_LOGO_LAYER = "logo_layer",
    IMAGE_LOGO_LAYER_RATIO = "3.00",
    IMAGE_TITLE_TREATMENT = "title_treatment",
    IMAGE_TITLE_TREATMENT_RATIO = "1.78",
    IMAGE_TITLE_TREATMENT_LAYER = "title_treatment_layer",
    IMAGE_TITLE_TREATMENT_LAYER_RATIO = "3.00"
}
