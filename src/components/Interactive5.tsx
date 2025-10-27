import React, { useState, useEffect, useCallback } from 'react';
import { useAudioPool } from '../hooks/useAudioPool';
import './Interactive5.sass';

interface PyramidImage {
  id: number;
  row: number;
  position: number;
  filename: string;
  isVisible: boolean;
}

const Interactive5: React.FC = () => {
  const [images, setImages] = useState<PyramidImage[]>([]);
  const { playSound } = useAudioPool({ maxPoolSize: 5, volume: 0.4 });

  // Initialize pyramid structure
  useEffect(() => {
    const pyramidImages: PyramidImage[] = [];
    let imageIndex = 1;

    // Create pyramid structure: rows with 2, 3, 4, 5, 6 images
    const rowCounts = [2, 3, 4, 5, 6];

    rowCounts.forEach((count, rowIndex) => {
      for (let position = 0; position < count; position++) {
        pyramidImages.push({
          id: imageIndex,
          row: rowIndex + 1,
          position: position + 1,
          filename: `${imageIndex}.jpg`,
          isVisible: false, // Start with all images hidden (white)
        });
        imageIndex++;
      }
    });

    setImages(pyramidImages);
  }, []);

  // Handle image click
  const handleImageClick = useCallback((imageId: number) => {
    setImages(prevImages => {
      const clickedImage = prevImages.find(img => img.id === imageId);

      // Play audio only when clicking on hidden images (isVisible is false)
      if (clickedImage && !clickedImage.isVisible) {
        playSound('/pages/5/cihla.mp3');
      }

      return prevImages.map(img =>
        img.id === imageId ? { ...img, isVisible: true } : img
      );
    });
  }, []);

  // Reset function for R key
  const resetImages = useCallback(() => {
    setImages(prevImages =>
      prevImages.map(img => ({ ...img, isVisible: false }))
    );
  }, []);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r' || event.key === 'R') {
        resetImages();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [resetImages]);

  // Group images by row
  const imagesByRow = images.reduce((acc, img) => {
    if (!acc[img.row]) {
      acc[img.row] = [];
    }
    acc[img.row].push(img);
    return acc;
  }, {} as Record<number, PyramidImage[]>);

  return (
    <div className="interactive5-container">
      <div className="video-container">
        <video autoPlay loop muted playsInline>
          <source src="/pages/5/otaznik1.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="pyramid">
        {Object.entries(imagesByRow).map(([row, rowImages]) => (
          <div key={row} className={`pyramid-row row-${row}`}>
            {rowImages.map((image) => (
              <div
                key={image.id}
                className={`pyramid-image ${image.isVisible ? 'visible' : ''}`}
                onClick={() => handleImageClick(image.id)}
              >
                {image.isVisible ? (
                  <img
                    src={`/pages/5/${image.filename}`}
                    alt={`Pyramid image ${image.id}`}
                  />
                ) : (
                  <div className="white-overlay" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interactive5;