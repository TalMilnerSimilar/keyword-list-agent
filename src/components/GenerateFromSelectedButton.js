import React, { useState } from 'react';

const GenerateFromSelectedButton = ({ selectedKeywords, isLoading, hasGenerated, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Button is disabled only if it's currently loading.
  // It becomes enabled again right after generation is complete.
  const isDisabled = isLoading;

  // The "Generated" text will show, but the button will be clickable.
  const getButtonText = () => {
    if (isLoading) return 'Generating...';
    if (hasGenerated) return 'Generated';
    return 'Generate Keywords from Selected';
  };

  // Determine styles for the button's states
  const showDisabledStyle = isLoading || hasGenerated;

  let buttonStyle = {
    borderRadius: '640px',
    padding: '1px',
    border: 'none',
    background: 'linear-gradient(90deg, #3e74fe 0%, #2ad3ab 100%)',
  };
  let innerDivStyle = {
    borderRadius: '639px',
    background: '#ffffff',
  };
  let textClass = 'bg-gradient-to-r from-primary-dark to-primary-green bg-clip-text text-transparent';
  let iconFill = '#2D54B8';

  if (showDisabledStyle) {
    buttonStyle = {
      borderRadius: '640px',
      padding: '0px',
      border: '1px solid #8995a1',
      background: '#ffffff',
    };
    innerDivStyle = {
      borderRadius: '639px',
      background: 'transparent',
    };
    textClass = 'text-[#8995a1]';
    iconFill = '#6b7c8c';
  } else if (isClicked) {
    buttonStyle = {
      borderRadius: '640px',
      padding: '0px',
      border: '1px solid #2d54b8',
      background: 'linear-gradient(89.62deg, #d8e3fe, #d4f7ee)',
    };
    innerDivStyle = {
      borderRadius: '639px',
      background: 'transparent',
    };
  } else if (isHovered) {
    buttonStyle = {
      borderRadius: '640px',
      padding: '1px',
      border: 'none',
      background: 'linear-gradient(90deg, #2D54B8 0%, #1D9F83 100%)',
    };
    innerDivStyle = {
      borderRadius: '639px',
      background: 'linear-gradient(89.62deg, #d8e3fe, #d4f7ee)',
    };
  }
  
  return (
    <>
      {selectedKeywords.length > 0 && (
        <button
          onClick={onClick}
          disabled={isDisabled}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsClicked(false);
          }}
          onMouseDown={() => setIsClicked(true)}
          onMouseUp={() => setIsClicked(false)}
          className={`flex items-center justify-center gap-1.5 text-xs font-bold font-dm-sans rounded-full h-8 w-full mb-3 relative group transition-none ${
            isDisabled ? 'cursor-not-allowed' : ''
          }`}
          style={buttonStyle}
        >
          <div 
            className="flex items-center justify-center gap-1.5 w-full h-full rounded-full"
            style={innerDivStyle}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.97754 8.27246L11.9775 9.63574L8.97754 11L7.61328 14L6.25 11L3.25 9.63574L6.25 8.27246L7.61328 5.27246L8.97754 8.27246ZM7.07324 9.0957L5.88477 9.63574L7.07324 10.1758L7.61328 11.3652L8.15332 10.1758L9.34277 9.63574L8.15332 9.0957L7.61328 7.90723L7.07324 9.0957ZM13.75 5.13574L15.25 5.81738L13.75 6.49902L13.0684 7.99902L12.3867 6.49902L10.8867 5.81738L12.3867 5.13574L13.0684 3.63574L13.75 5.13574Z" fill={iconFill}/>
              </svg>
            </div>
            <span 
              className={`font-bold font-dm-sans text-xs leading-[16px] ${textClass}`}
            >
              {getButtonText()}
            </span>
          </div>
        </button>
      )}
    </>
  );
};

export default GenerateFromSelectedButton; 