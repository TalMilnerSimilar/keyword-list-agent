import React, { useState } from 'react';

const CreateButton = ({ topic, isLoading, hasGenerated, isDisabled, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const getButtonText = () => {
    if (isLoading) return "Generating...";
    return "Create";
  };

  const finalIsDisabled = isDisabled || isLoading || hasGenerated;

  const getButtonStyles = () => {
    if (finalIsDisabled) {
      // Disabled state
      return {
        background: '#cbd1d7',
        textColor: '#f7f7f8',
        cursor: 'cursor-not-allowed'
      };
    } else if (isClicked) {
      // Clicked state
      return {
        background: 'linear-gradient(135deg, #2d54b8 0%, #1d9f83 100%)',
        textColor: '#ffffff',
        cursor: 'cursor-pointer'
      };
    } else if (isHovered) {
      // Hover state
      return {
        background: 'linear-gradient(135deg, #3969e0 0%, #2ad3ab 100%)',
        textColor: '#ffffff',
        cursor: 'cursor-pointer'
      };
    } else {
      // Default state
      return {
        background: 'linear-gradient(135deg, #3e74fe 0%, #2ad3ab 100%)',
        textColor: '#ffffff',
        cursor: 'cursor-pointer'
      };
    }
  };

  const styles = getButtonStyles();

  const handleMouseDown = () => {
    if (!finalIsDisabled) {
      setIsClicked(true);
    }
  };

  const handleMouseUp = () => {
    if (!finalIsDisabled) {
      setIsClicked(false);
    }
  };

  const handleMouseEnter = () => {
    if (!finalIsDisabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsClicked(false);
  };

  const handleClick = () => {
    if (!finalIsDisabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded-[640px] font-dm-sans font-bold text-[14px] leading-[20px] transition-all duration-200 ${styles.cursor}`}
      style={{ 
        background: styles.background,
        color: styles.textColor
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={finalIsDisabled}
    >
      {getButtonText()}
    </button>
  );
};

export default CreateButton; 