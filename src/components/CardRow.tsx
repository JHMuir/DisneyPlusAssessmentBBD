import { useRef } from 'react';
import { getContentText, getContentItemImageURL, getContentIDs } from '../types/helpers.ts';
import { type CardRowProps, ContentFields } from '../types/types.ts';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll.ts';
import '../styles/CardRow.css'
import { useCardNavigation } from '../hooks/useCardNavigation.ts';
import CardOverlay from './CardOverlay.tsx';

const PLACEHOLDER_IMAGE = "/disney-plus-placeholder.png";
const PLACEHOLDER_CARD_AMOUNT = 3;
// React Component that handles the rendering of a given row 

export function CardRow({title, items, loading, error}:CardRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cards = items.map(item => ({
    id: `card-${getContentIDs(item)}`,
    title: getContentText(item, ContentFields.TEXT_FULL, ContentFields.TEXT_TITLE),
    tile: getContentItemImageURL(item, ContentFields.IMAGE_TILE, ContentFields.IMAGE_TILE_RATIO),
  }));

  const placeholderCards = Array.from({ length: PLACEHOLDER_CARD_AMOUNT }, (_, index) => ({
    id: `placeholder-${index}`,
    title: " ",
    tile: " ",
  }))

  const handleImgError = (element: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = element.currentTarget;
    if(img.src !== PLACEHOLDER_IMAGE) {
      img.src = PLACEHOLDER_IMAGE;
    }
  };

  const {selectedCardIndex, showOverlay} = useCardNavigation(cards);
  useHorizontalScroll(selectedCardIndex, containerRef, cardRefs);

  if(error) return <div>Error: {error}</div>;

  const renderCards = loading ? placeholderCards : cards;

  return (
    <div>
      <div className={`card-row-container ${showOverlay ? "blurred" : ""}`}>
        <h2 className="section-title">{loading ? "Loading..." : title}</h2>
        <div className="cards-container" ref={containerRef}>
          <div className="cards-wrapper">
            {renderCards.map((card, index) => (
              <div key={card.id} ref={el => { cardRefs.current[index] = el;} } className={loading ? "placeholder-card" : `card ${selectedCardIndex === index ? 'selected' : ''}`} tabIndex={-1}>
                <div className={`card-image ${!loading && selectedCardIndex === index ? 'selected' : ''}`}>
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
      {showOverlay && !loading && items[selectedCardIndex] && (
          <CardOverlay item={items[selectedCardIndex]}/>
      )}
    </div>
  );
};

export default CardRow;





