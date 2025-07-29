import { useRef } from 'react';
import { getContentText, getContentImageURL, getContentIDs } from '../types/helpers.ts';
import { type CardRowProps, ContentFields } from '../types/types.ts';
import { horizontalScroll } from '../hooks/horizontalScroll.ts';
import '../styles/CardRow.css'

const PLACEHOLDER_IMAGE = "/disney-plus-placeholder.png";

// React Component that handles the rendering of a given row 

export function CardRow({title, items, loading, error, selectedIndex}:CardRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cards = items.map(item => ({
      id: getContentIDs(item),
      title: getContentText(item, ContentFields.TEXT_FULL, ContentFields.TEXT_TITLE),
      tile: getContentImageURL(item, ContentFields.IMAGE_TILE, ContentFields.IMAGE_TILE_RATIO),
  }));

  const placeholderCards = Array.from({ length:3 }, (_, index) => ({
    id: index,
    title: " ",
    tile: " ",
  }))

  const handleImgError = (element: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = element.currentTarget;
      if(img.src !== PLACEHOLDER_IMAGE) {
        img.src = PLACEHOLDER_IMAGE;
      }
  };

  horizontalScroll(selectedIndex, containerRef, cardRefs);

  if(error) return <div>Error: {error}</div>;

  const renderCards = loading ? placeholderCards : cards;

  return (
    <div className="card-row-container">
      <h2 className="section-title">{loading ? "Loading..." : title}</h2>
      <div className="cards-container" ref={containerRef}>
        <div className="cards-wrapper">
          {renderCards.map((card, index) => (
            <div key={`${loading ? 'placeholder' : 'card'}-${card.id}`} ref={el => { cardRefs.current[index] = el;} } className={loading ? "placeholder-card" : `card ${selectedIndex === index ? 'selected' : ''}`} tabIndex={-1}>
              <div className={`card-image ${!loading && selectedIndex === index ? 'selected' : ''}`}>
                <div>
                  <img src={card.tile} alt={card.title} loading="lazy" onError={handleImgError}></img>
                </div>
              </div>
              <div className="card-info">
                <h3 className="card-title">{card.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardRow;





