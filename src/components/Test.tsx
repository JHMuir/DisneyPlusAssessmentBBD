import { getData } from '../api/api.ts'
import { extractAllContentItems, isSeriesContent, isMovieContent, getContentText, isCollectionContent, getAllContentImageURL } from '../types/helpers.ts';
import { ContentFields } from '../types/types.ts';

// React Component that allowed me to test functions and explore the API. Not currently being used

export function renderImageURLs(
  imageData: Record<string, Record<string, string>> | undefined
) {
  if(imageData){
    const imagesList = Object.entries(imageData).flatMap(([imageType, aspectRatios]) =>
      Object.entries(aspectRatios).map(([aspectRatio, url]) => (
          <div>
              <h3>{imageType}: {aspectRatio}</h3>
              <img 
                  // key={`${imageType}-${aspectRatio}`}
                  src={url} 
                  alt={`Image Not Found`}
                  style={{ maxWidth: '200px', margin: '10px' }} 
              />
          </div>  
      ))
    );
      return imagesList;
  } else {
      return undefined;
  }   
}

export function Test() {
  const {data, loading, error } = getData()
  if (loading) {
    return <div>Loading... {loading}</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!data) {
    return <div>No data?</div>;
  }

  const allItems = extractAllContentItems(data);
  const seriesItems = allItems.filter(isSeriesContent);
  const movieItems = allItems.filter(isMovieContent);
  const collectionItems = allItems.filter(isCollectionContent);
  console.log(seriesItems);
  console.log(movieItems);
  console.log(collectionItems);
  
  const seriesList = seriesItems.map( item => {
    const title = getContentText(item, ContentFields.TEXT_FULL, ContentFields.TEXT_TITLE);
    const imageData = renderImageURLs(getAllContentImageURL(item));
    return (
      <div>
        <li key={item.contentId}><strong>Series:</strong> {title}</li>
        <div>{imageData}</div>
      </div>
    );
  });

  const moviesList = movieItems.map(item => {
    const title = getContentText(item, ContentFields.TEXT_FULL, ContentFields.TEXT_TITLE);
    const imageData = renderImageURLs(getAllContentImageURL(item));
    return (
      <div>
        <li key={item.contentId}><strong>Movies:</strong> {title}</li>
        <div>{imageData}</div>
      </div>
    );
  });

  const collectionsList = collectionItems.map( item => {
    const title = getContentText(item, ContentFields.TEXT_FULL, ContentFields.TEXT_TITLE);
    const imageData = renderImageURLs(getAllContentImageURL(item))
    return (
      <div>
        <li key={item.collectionId}><strong>Collection:</strong> {title}</li>
        <div>{imageData}</div>
      </div>
    );
  });

  return (
    <div>
      <div>
        <h3>Collections: {collectionsList.length}</h3>
        <ol>{collectionsList}</ol>
      </div>
      <div>
        <h3>Series: {seriesList.length}</h3>
        <ol>{seriesList}</ol>
      </div>
      <div>
        <h3>Movies: {moviesList.length}</h3>
        <ol>{moviesList}</ol>
      </div>
    </div>
  );

}

export default Test;
