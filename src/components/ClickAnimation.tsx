import React from 'react';
import './ClickAnimation.sass';

interface ClickAnimationProps {
  x: number;
  y: number;
  onAnimationEnd?: () => void;
}

const ClickAnimation: React.FC<ClickAnimationProps> = ({ x, y, onAnimationEnd }) => {
  return (
    <div
      className="click-animation"
      style={{
        left: x,
        top: y,
      }}
      onAnimationEnd={onAnimationEnd}
    />
  );
};

export default ClickAnimation;