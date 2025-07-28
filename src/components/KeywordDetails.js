import React, { useState, useEffect, useRef } from 'react';
import CreateButton from './CreateButton';

const KeywordDetails = ({
  isCreateWithAI,
  setIsCreateWithAI,
  topic,
  setTopic,
  selectedKeywords,
  onRemoveKeyword,
  onAddKeyword,
  onAICreate,
  onSaveAndAnalyze,
  onClose,
  onClearAll,
  onSwitchToManual,
  onSwitchToAI,
  isLoadingKeywords,
  apiError,
  onGenerationComplete
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [listName, setListName] = useState("New List");
  const [inputWidth, setInputWidth] = useState(120);
  const [aiTopic, setAiTopic] = useState("");
  const [manualTopic, setManualTopic] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [lastGeneratedTopic, setLastGeneratedTopic] = useState("");
  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const aiInputRef = useRef(null);
  const manualInputRef = useRef(null);

  // Monitor size changes of the keyword details container
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('KeywordDetails container size changed:', {
          width: Math.round(width),
          height: Math.round(height),
          selectedCount: selectedKeywords.length,
          isCreateWithAI,
          timestamp: new Date().toISOString()
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedKeywords.length, isCreateWithAI]);

  // Measure text width for dynamic input sizing
  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth;
      setInputWidth(Math.max(120, width + 20)); // Add some padding
    }
  }, [listName]);

  // Focus the appropriate input field when tab changes and handle tab-specific text
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCreateWithAI && aiInputRef.current) {
        aiInputRef.current.focus();
      } else if (!isCreateWithAI && manualInputRef.current) {
        manualInputRef.current.focus();
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [isCreateWithAI]);

  // Get the current topic based on active tab
  const currentTopic = isCreateWithAI ? aiTopic : manualTopic;
  const setCurrentTopic = isCreateWithAI ? setAiTopic : setManualTopic;

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-8 pb-4 bg-background-secondary">
        <div className="flex items-center gap-2">
          <div className="relative">
            <span 
              ref={measureRef}
              className="text-2xl font-dm-sans text-text-primary invisible absolute whitespace-pre"
            >
              {listName || "New List"}
            </span>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              style={{ width: `${inputWidth}px` }}
              className="text-2xl font-dm-sans text-text-primary bg-transparent border-b border-transparent px-2 py-1 hover:border-b-[#E6E9EC] focus:border-b-blue-500 focus:outline-none transition-colors"
            />
          </div>
          <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 bg-white px-8 py-4 flex flex-col gap-6 overflow-hidden">
        {/* Toggle Switcher */}
        <div className="bg-white rounded-lg border border-border-default relative h-10">
          <div className="flex items-start justify-start overflow-hidden w-full h-full rounded-lg">
            {/* Create With AI Button */}
            <button
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-2.5 transition-all duration-200 ${
                isCreateWithAI 
                  ? 'bg-gradient-to-r from-blue-50 to-green-50' 
                  : 'bg-white'
              }`}
              onClick={() => {
                setIsCreateWithAI(true);
                onSwitchToAI(topic);
              }}
            >
              <div className="w-[18px] h-[18px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.97754 8.27246L11.9775 9.63574L8.97754 11L7.61328 14L6.25 11L3.25 9.63574L6.25 8.27246L7.61328 5.27246L8.97754 8.27246ZM7.07324 9.0957L5.88477 9.63574L7.07324 10.1758L7.61328 11.3652L8.15332 10.1758L9.34277 9.63574L8.15332 9.0957L7.61328 7.90723L7.07324 9.0957ZM13.75 5.13574L15.25 5.81738L13.75 6.49902L13.0684 7.99902L12.3867 6.49902L10.8867 5.81738L12.3867 5.13574L13.0684 3.63574L13.75 5.13574Z" fill="#2D54B8"/>
                </svg>
              </div>
              <span className={`text-sm font-medium font-dm-sans ${
                isCreateWithAI 
                  ? 'bg-gradient-to-r from-primary-dark to-primary-green bg-clip-text text-transparent' 
                  : 'text-text-primary'
              }`}>
                Create With AI
              </span>
            </button>
            
            {/* Divider */}
            <div className="flex items-center justify-center relative self-stretch">
              <div className="flex-none h-full rotate-[180deg] scale-y-[-100%]">
                <div className="bg-border-default h-full w-px"></div>
              </div>
            </div>
            
            {/* Add Manually Button */}
            <button
              className={`flex-1 flex items-center justify-center gap-2.5 px-3 py-2.5 transition-all duration-200 ${
                !isCreateWithAI 
                  ? 'bg-blue-50' 
                  : 'bg-white'
              }`}
              onClick={() => {
                setIsCreateWithAI(false);
                onSwitchToManual();
              }}
            >
              <span className={`text-sm font-dm-sans ${
                !isCreateWithAI 
                  ? 'text-primary-blue font-medium' 
                  : 'text-text-primary'
              }`}>
                Add Manually
              </span>
            </button>
          </div>
        </div>

                            {/* Input Section */}
                    {isCreateWithAI ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-dm-sans text-text-secondary">
                          Enter your topic, then click Create to generate your list.
                        </p>

                        <div className="flex items-center gap-4 relative">
                          <div className="flex-1 relative">
                            <div className="bg-white flex flex-col gap-1 h-10 items-start justify-center px-4 py-0 rounded-[50px] relative">
                              <div className="absolute inset-0 pointer-events-none rounded-[50px] bg-gradient-to-r from-blue-400 to-green-400 p-[1px]">
                                <div className="w-full h-full bg-white rounded-[50px]"></div>
                              </div>
                              <div className="flex items-center gap-2 relative z-10 w-full px-0">
                                <svg className="w-5 h-5" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8.97754 8.27246L11.9775 9.63574L8.97754 11L7.61328 14L6.25 11L3.25 9.63574L6.25 8.27246L7.61328 5.27246L8.97754 8.27246ZM7.07324 9.0957L5.88477 9.63574L7.07324 10.1758L7.61328 11.3652L8.15332 10.1758L9.34277 9.63574L8.15332 9.0957L7.61328 7.90723L7.07324 9.0957ZM13.75 5.13574L15.25 5.81738L13.75 6.49902L13.0684 7.99902L12.3867 6.49902L10.8867 5.81738L12.3867 5.13574L13.0684 3.63574L13.75 5.13574Z" fill="#2D54B8"/>
                                </svg>
                                                              <input
                                ref={aiInputRef}
                                type="text"
                                value={currentTopic}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  setCurrentTopic(newValue);
                                  
                                  // Reset generated state if topic changed
                                  if (hasGenerated && newValue !== lastGeneratedTopic) {
                                    setHasGenerated(false);
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && currentTopic.trim() && !isLoadingKeywords && !hasGenerated) {
                                    onAICreate(currentTopic.trim());
                                    setHasGenerated(true);
                                    setLastGeneratedTopic(currentTopic.trim());
                                  }
                                }}
                                placeholder="E.g. High-end headphone or Sneakers"
                                className={`flex-1 bg-transparent text-sm font-dm-sans focus:outline-none leading-[16px] ${
                                  currentTopic.trim() ? 'text-[#092540]' : 'text-text-placeholder'
                                }`}
                              />
                              </div>
                            </div>
                          </div>

                          <button
                            disabled={!currentTopic.trim() || isLoadingKeywords || hasGenerated}
                            onClick={() => {
                              if (currentTopic.trim() && !isLoadingKeywords && !hasGenerated) {
                                console.log('Creating keywords for:', currentTopic);
                                onAICreate(currentTopic.trim());
                                setHasGenerated(true);
                                setLastGeneratedTopic(currentTopic.trim());
                              }
                            }}
                            className={`px-4 py-2 text-sm font-bold font-dm-sans transition-colors ${
                              currentTopic.trim() && !isLoadingKeywords && !hasGenerated
                                ? 'text-white cursor-pointer'
                                : 'text-[#f7f7f8] cursor-not-allowed'
                            }`}
                            style={{
                              borderRadius: '640px',
                              background: currentTopic.trim() && !isLoadingKeywords && !hasGenerated
                                ? 'linear-gradient(90deg, #3e74fe 0.21%, #2ad3ab 99.79%)'
                                : '#cbd1d7'
                            }}
                            onMouseEnter={(e) => {
                              if (currentTopic.trim() && !isLoadingKeywords) {
                                e.target.style.background = 'linear-gradient(90deg, #2d54b8 0.21%, #25c0a0 99.79%)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (currentTopic.trim() && !isLoadingKeywords) {
                                e.target.style.background = 'linear-gradient(90deg, #3e74fe 0.21%, #2ad3ab 99.79%)';
                              }
                            }}
                            onMouseDown={(e) => {
                              if (currentTopic.trim() && !isLoadingKeywords) {
                                e.target.style.background = 'linear-gradient(90deg, #1e3a8a 0.21%, #1a9f7f 99.79%)';
                              }
                            }}
                            onMouseUp={(e) => {
                              if (currentTopic.trim() && !isLoadingKeywords) {
                                e.target.style.background = 'linear-gradient(90deg, #2d54b8 0.21%, #25c0a0 99.79%)';
                              }
                            }}
                          >
                            {isLoadingKeywords ? (
                              'Generating...'
                            ) : hasGenerated ? (
                              'Generated'
                            ) : (
                              'Create'
                            )}
                          </button>
                        </div>

                        {apiError && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                            <p className="text-sm text-red-600 font-dm-sans">
                              {apiError}
                            </p>
                          </div>
                        )}
                        <p className="text-xs font-dm-sans text-text-tertiary">
                          Tip: You can write a list of keywords as a topic
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-dm-sans text-text-secondary">
                          Type or paste keywords, then click Add
                        </p>

                        <div className="flex items-center gap-4 relative">
                          <div className="flex-1 relative">
                            <div className="bg-white flex flex-col gap-1 h-10 items-start justify-center px-4 py-0 rounded-lg relative">
                              <div className="absolute inset-0 pointer-events-none rounded-lg border border-gray-300"></div>
                              <div className="flex items-center gap-2 relative z-10 w-full">
                                <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                  ref={manualInputRef}
                                  type="text"
                                  value={currentTopic}
                                  onChange={(e) => setCurrentTopic(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && currentTopic.trim()) {
                                      e.preventDefault();
                                      // Split by comma and add each keyword
                                      const keywords = currentTopic.split(',').map(k => k.trim()).filter(k => k.length > 0);
                                      keywords.forEach(keyword => {
                                        onAddKeyword(keyword);
                                      });
                                      setCurrentTopic('');
                                    }
                                  }}
                                  placeholder="E.g. headphones, wireless, bluetooth"
                                  className={`flex-1 bg-transparent text-sm font-dm-sans focus:outline-none leading-[20px] ${
                                    currentTopic.trim() ? 'text-[#092540]' : 'text-text-placeholder'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            disabled={!currentTopic.trim()}
                            onClick={() => {
                              if (currentTopic.trim()) {
                                // Split by comma and add each keyword
                                const keywords = currentTopic.split(',').map(k => k.trim()).filter(k => k.length > 0);
                                keywords.forEach(keyword => {
                                  onAddKeyword(keyword);
                                });
                                // Clear the input
                                setCurrentTopic('');
                              }
                            }}
                            className={`px-4 py-2 rounded-[18px] text-sm font-medium font-dm-sans transition-colors ${
                              currentTopic.trim()
                                ? 'bg-primary-blue text-white hover:bg-primary-dark'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Add
                          </button>
                        </div>

                        <p className="text-xs font-dm-sans text-text-tertiary">
                          Tip: You can add multiple keywords at once, separated by commas
                        </p>
                      </div>
                    )}

                            {/* Selected Keywords */}
                    <div className="flex-1 flex flex-col gap-4 overflow-hidden">

                      
                      <div className="flex items-end justify-between">
                        <h3 className="text-base font-bold font-dm-sans text-text-primary">
                          Selected keywords
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-dm-sans ${selectedKeywords.length >= 50 ? 'text-red-500' : 'text-text-primary'}`}>
                                {selectedKeywords.length} / 50
                            </span>
                            <div 
                                className="relative"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <button onClick={onClearAll}>
                                    <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                                {isHovering && (
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2">
                                        Clear all
                                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                      </div>
                      
                      {/* Keyword limit info row */}
                      {selectedKeywords.length >= 50 && (
                        <div className="flex items-center justify-between -mt-3">
                          <span className="text-xs text-text-secondary">
                            Keyword limit reached, you can remove keywords below to continue adding.
                          </span>
                        </div>
                      )}

                      <div className="flex-1 bg-background-secondary rounded relative overflow-y-auto">
                        {selectedKeywords.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-900 mb-1">No keywords selected</p>
                                    <p className="text-xs text-gray-500">Select keywords from the AI generated list or manually to add them here</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 h-full">
                                <div className="flex flex-wrap" style={{ gap: '8px' }}>
                                    {selectedKeywords.map((keyword, index) => (
                                        <div key={`${keyword}-${index}`} className="bg-white flex items-center gap-2 pl-3 pr-1 h-8 rounded-[40px] shadow-[0px_3px_5px_0px_rgba(42,62,82,0.12)] shrink-0">
                                            <span className="text-xs font-dm-sans text-text-primary leading-[16px] truncate max-w-[360px]">
                                                {keyword}
                                            </span>
                                            <button
                                                onClick={() => onRemoveKeyword(keyword)}
                                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="absolute border border-border-default border-solid inset-0 pointer-events-none rounded"></div>
                      </div>
                    </div>
      </div>

      {/* Footer */}
      <div className="bg-white relative">
        <div className="flex flex-col gap-[7px] items-end justify-start overflow-hidden px-6 py-4 w-full">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[18px] text-sm font-medium font-dm-sans text-primary-blue hover:bg-blue-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onSaveAndAnalyze}
              disabled={selectedKeywords.length === 0}
              className={`px-4 py-2 rounded-[18px] text-sm font-medium font-dm-sans transition-colors ${
                selectedKeywords.length === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-primary-blue text-white hover:bg-primary-dark'
              }`}
            >
              Save and Analyze
            </button>
          </div>
        </div>
        <div className="absolute border-border-default border-[1px_0px_0px] border-solid inset-0 pointer-events-none shadow-lg"></div>
      </div>
    </div>
  );
};

export default KeywordDetails; 