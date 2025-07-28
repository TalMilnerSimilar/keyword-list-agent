import React, { useState } from 'react';

const CreateButton = ({ disabled = false, onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseDown = () => {
    console.log('Mouse down on button, disabled:', disabled);
    if (!disabled) {
      setIsClicked(true);
      console.log('Button clicked state set to true');
    }
  };

  const handleMouseUp = () => {
    console.log('Mouse up on button, disabled:', disabled);
    if (!disabled) {
      setIsClicked(false);
      console.log('Button clicked state set to false');
    }
  };

  const handleClick = () => {
    console.log('Click event on button, disabled:', disabled);
    if (!disabled && onClick) {
      console.log('Calling onClick handler');
      onClick();
    }
  };

  const handleMouseEnter = () => {
    console.log('Mouse enter on button, disabled:', disabled);
  };

  const handleMouseLeave = () => {
    console.log('Mouse leave on button, disabled:', disabled);
    setIsClicked(false);
  };

  // Determine button state and styling
  let borderColor, iconColor, cursorClass;
  
  if (disabled) {
    // Disabled state
    borderColor = 'border-[#8995a1]';
    iconColor = 'text-[#6b7c8c]';
    cursorClass = 'cursor-not-allowed';
  } else if (isClicked) {
    // Clicked state
    borderColor = 'border-[#2d54b8]';
    iconColor = 'text-[#2d54b8]';
    cursorClass = 'cursor-pointer';
  } else {
    // Regular state
    borderColor = 'border-[#3e74fe]';
    iconColor = 'text-[#2d54b8]';
    cursorClass = 'cursor-pointer';
  }

  return (
    <div 
      className={`absolute ${cursorClass} z-20`}
      style={{ right: '4px', top: '4px' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className={`rounded-full w-8 h-8 transition-all duration-200 ${disabled ? 'opacity-50' : ''}`}>
        <div 
          className={`rounded-full w-full h-full flex items-center justify-center border transition-all duration-200 ${
            disabled 
              ? 'border-[#8995a1] bg-white' 
              : isClicked 
                ? 'border-[#2d54b8] bg-gradient-to-r from-[#2d54b8] to-[#1d9f83]' 
                : 'border-[#3e74fe] bg-white hover:border-[#3969e0] hover:bg-gradient-to-r hover:from-[#2d54b8] hover:to-[#1d9f83]'
          }`}
        >
          <svg className={`w-4 h-4 transition-colors duration-200 ${
            disabled 
              ? 'text-[#6b7c8c]' 
              : isClicked 
                ? 'text-white' 
                : 'text-[#2d54b8]'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CreateButton; 