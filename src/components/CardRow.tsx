import { useEffect, useRef } from 'react';
import { getContentText, getContentImageURL, getContentIDs } from '../types/helpers.ts';
import { type CardRowProps, ContentFields } from '../types/types.ts';
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

    useEffect(() => {
      if (selectedIndex >= 0 && cardRefs.current[selectedIndex] && containerRef.current) {
          const selectedCard = cardRefs.current[selectedIndex];
          const container = containerRef.current;

          if (selectedCard && container) {
              const cardRect = selectedCard.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();

              if (cardRect.left < containerRect.left || cardRect.right > containerRect.right) {
                  const cardCenter = selectedCard.offsetLeft + selectedCard.offsetWidth / 2;
                  const containerCenter = container.offsetWidth / 2;
                  const scrollPosition = cardCenter - containerCenter;

                  container.scrollTo({
                      left: Math.max(0, scrollPosition),
                      behavior: "smooth"
                  });
              }
          }
      }
  }, [selectedIndex]);
  
  const handleImgError = (element: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = element.currentTarget;
      if(img.src !== PLACEHOLDER_IMAGE) {
        img.src = PLACEHOLDER_IMAGE;
      }
  };

  if(loading) return <div>Loading Disney+ {title} stuff...</div>;
  if(error) return <div>Error: {error}</div>;

    return (
        <div className="card-row-container">
          <h2 className="section-title">{title}</h2>
          <div className="cards-container" ref={containerRef}>
            <div className="cards-wrapper">
              {cards.map((card, index) => (
                <div key={card.id} ref={el => { cardRefs.current[index] = el;} } className={`card ${selectedIndex === index ? 'selected' : ''}`} tabIndex={-1}>
                  <div className="card-image">
                    <div>
                      <img src={card.tile} alt={card.title} onError={handleImgError}></img>
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





