import React, { useState, useEffect, useRef } from 'react';
import KeywordList from './KeywordList';
import KeywordDetails from './KeywordDetails';
import CreateButton from './CreateButton';
import apiService from '../services/api';

// Dynamic Keyword Display Component
const DynamicKeywordDisplay = ({ selectedKeywords }) => {
  const [visibleCount, setVisibleCount] = useState(selectedKeywords.length);
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const measureFit = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const containerWidth = container.offsetWidth;
      let fitCount = 0;
      
      // Create temporary measuring element
      const tempContainer = document.createElement('div');
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.position = 'absolute';
      tempContainer.style.display = 'flex';
      tempContainer.style.gap = '4px';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.fontFamily = 'DM Sans';
      document.body.appendChild(tempContainer);
      
      try {
        for (let i = 0; i < selectedKeywords.length; i++) {
          const span = document.createElement('span');
          span.style.cssText = 'background: white; padding: 4px 8px; border-radius: 4px; border: 1px solid #e5e7eb; white-space: nowrap; flex-shrink: 0;';
          span.textContent = selectedKeywords[i].replace(/\s+\(\d+(?:,\d+)*\)$/, '');
          tempContainer.appendChild(span);
          
          let currentWidth = tempContainer.offsetWidth;
          
          // If not the last item, test with "+X More Keywords"
          if (i < selectedKeywords.length - 1) {
            const moreSpan = document.createElement('span');
            moreSpan.style.cssText = 'background: white; padding: 4px 8px; border-radius: 4px; border: 1px solid #e5e7eb; white-space: nowrap; flex-shrink: 0; color: #6b7280;';
            moreSpan.textContent = `+${selectedKeywords.length - i - 1} More Keywords`;
            tempContainer.appendChild(moreSpan);
            
            const withMoreWidth = tempContainer.offsetWidth;
            tempContainer.removeChild(moreSpan);
            
            if (withMoreWidth > containerWidth) {
              break;
            }
          }
          
          if (currentWidth > containerWidth) {
            break;
          }
          
          fitCount = i + 1;
        }
      } finally {
        document.body.removeChild(tempContainer);
      }
      
      setVisibleCount(Math.max(1, fitCount)); // At least show 1 keyword
    };
    
    // Initial measurement
    setTimeout(measureFit, 0);
    
    const handleResize = () => measureFit();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedKeywords]);
  
  const visibleKeywords = selectedKeywords.slice(0, visibleCount);
  const hiddenCount = selectedKeywords.length - visibleCount;
  
  return (
    <div className="flex gap-1 overflow-hidden" ref={containerRef}>
      {visibleKeywords.map((keyword, index) => (
        <span key={index} className="bg-white px-2 py-1 rounded text-xs font-dm-sans text-text-primary border whitespace-nowrap flex-shrink-0">
          {keyword.replace(/\s+\(\d+(?:,\d+)*\)$/, '')}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="bg-white px-2 py-1 rounded text-xs font-dm-sans text-text-secondary border whitespace-nowrap flex-shrink-0">
          +{hiddenCount} More Keywords
        </span>
      )}
    </div>
  );
};

// Figma Toggle Component with all states
const FigmaToggle = ({ isOn, isDisabled, onClick }) => {
  const [isHover, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const getToggleStyles = () => {
    if (isDisabled) {
      // Disabled state - same for both ON and OFF
      return {
        container: 'bg-[#f7f7f8] border border-[#e6e9ec] cursor-not-allowed',
        knob: 'bg-[#cbd1d7]',
        position: isOn ? 'justify-end pl-3.5 pr-0.5' : 'justify-start pl-0.5 pr-3.5'
      };
    }
    
    if (isOn) {
      // ON states
      if (isActive) {
        return {
          container: 'bg-[#e8eeff] border border-[#195afe] cursor-pointer',
          knob: 'bg-[#195afe]',
          position: 'justify-end pl-3.5 pr-0.5'
        };
      } else if (isHover) {
        return {
          container: 'bg-[#d1deff] border border-[#195afe] cursor-pointer',
          knob: 'bg-[#195afe]',
          position: 'justify-end pl-3.5 pr-0.5'
        };
      } else {
        return {
          container: 'bg-[#e8eeff] border border-[#195afe] cursor-pointer',
          knob: 'bg-[#195afe]',
          position: 'justify-end pl-3.5 pr-0.5'
        };
      }
    } else {
      // OFF states
      if (isActive) {
        return {
          container: 'bg-[#d1deff] border border-[#b6bec6] cursor-pointer',
          knob: 'bg-[#ffffff]',
          position: 'justify-start pl-0.5 pr-3.5'
        };
      } else if (isHover) {
        return {
          container: 'bg-[#b6bec6] border border-[#b6bec6] cursor-pointer',
          knob: 'bg-[#ffffff]',
          position: 'justify-start pl-0.5 pr-3.5'
        };
      } else {
        return {
          container: 'bg-[#b6bec6] border border-[#b6bec6] cursor-pointer',
          knob: 'bg-[#ffffff]',
          position: 'justify-start pl-0.5 pr-3.5'
        };
      }
    }
  };

  const styles = getToggleStyles();

  return (
    <button
      onClick={!isDisabled ? onClick : undefined}
      disabled={isDisabled}
      onMouseEnter={() => !isDisabled && setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false);
        setIsActive(false);
      }}
      onMouseDown={() => !isDisabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      className={`
        box-border content-stretch flex flex-row items-center py-0.5 relative rounded-2xl shrink-0 w-12 h-6 transition-all duration-200
        ${styles.container} ${styles.position}
      `}
    >
      <div className="overflow-clip relative rounded-[77px] shrink-0 size-3">
        <div className={`absolute inset-0 rounded-2xl transition-all duration-200 ${styles.knob}`} />
      </div>
    </button>
  );
};

const KeywordListAgent = () => {
                const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [isCreateWithAI, setIsCreateWithAI] = useState(true);
  const [topic, setTopic] = useState('');
  const [queryTags, setQueryTags] = useState([]); // added keyword tags
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false); // Left panel visibility
  const [generatedKeywords, setGeneratedKeywords] = useState([]); // Store generated keywords
  const [groupedKeywords, setGroupedKeywords] = useState(null); // Store grouped keywords
  const [selectedOption, setSelectedOption] = useState(1); // Track selected option
  const [includeSelectedKeywords, setIncludeSelectedKeywords] = useState(false); // Track checkbox state
  const [isReviewMode, setIsReviewMode] = useState(false); // For Option 5 Focus Mode
  const [listName, setListName] = useState("New List"); // For Option 5 list name
  const [isSelectedKeywordsExpanded, setIsSelectedKeywordsExpanded] = useState(false); // For Option 5 selected keywords expansion
  const [manualInput, setManualInput] = useState(''); // For Option 6 manual input
  const [isFocusMode, setIsFocusMode] = useState(false); // For Option 6 focus mode
  
  // Store states for each option
  const [optionStates, setOptionStates] = useState({
    1: {
      generatedKeywords: [],
      groupedKeywords: null,
      selectedKeywords: [],
      includeSelectedKeywords: false,
      apiError: null
    },
    2: {
      generatedKeywords: [],
      groupedKeywords: null,
      selectedKeywords: [],
      includeSelectedKeywords: false,
      apiError: null
    },
    3: {
      generatedKeywords: [],
      groupedKeywords: null,
      selectedKeywords: [],
      includeSelectedKeywords: false,
      apiError: null
    },
    4: {
      generatedKeywords: [],
      groupedKeywords: null,
      selectedKeywords: [],
      includeSelectedKeywords: false,
      apiError: null
    },
    5: {
      generatedKeywords: [],
      groupedKeywords: null,
      selectedKeywords: [],
      includeSelectedKeywords: false,
      apiError: null
    },
    6: {
      generatedKeywords: [],
      groupedKeywords: null,
      selectedKeywords: [],
      includeSelectedKeywords: false,
      apiError: null
    }
  });
  
  // API state
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const generatedKeywordsRef = useRef(null);



  // Monitor size changes of the generated keywords container
  useEffect(() => {
    if (!generatedKeywordsRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('Generated keywords container size changed:', {
          width: Math.round(width),
          height: Math.round(height),
          timestamp: new Date().toISOString()
        });
      }
    });

    resizeObserver.observe(generatedKeywordsRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleKeywordToggle = (keyword) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleRemoveKeyword = (keyword) => {
    setSelectedKeywords(prev => prev.filter(k => k !== keyword));
  };

  const handleSaveAndAnalyze = () => {
    console.log('Saving and analyzing keywords:', selectedKeywords);
    // Add your save/analyze logic here
  };

  const handleClose = () => {
    setIsPanelOpen(false);
    setIsLeftPanelOpen(false); // Also close the secondary panel
  };

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleAICreate = async (topic) => {
    // Check if we have either a topic or selected keywords with checkbox checked
    if (!topic.trim() && !(includeSelectedKeywords && selectedKeywords.length > 0)) {
      setApiError('Please enter a topic or select keywords to include');
      return;
    }

    // Open both panels immediately and show loading state
    console.log('Opening panels and starting loading...');
    setIsPanelOpen(true);
    setIsLeftPanelOpen(true);
    setIsLoadingKeywords(true);
    setApiError(null);

    try {
      // If topic is empty but we have selected keywords, use the selected keywords as the topic
      let finalTopic = topic.trim();
      if (!finalTopic && includeSelectedKeywords && selectedKeywords.length > 0) {
        finalTopic = selectedKeywords.map(keyword => {
          // Extract just the keyword part without search volume
          const match = keyword.match(/^(.+?)\s*\(\d+\)$/);
          return match ? match[1].trim() : keyword;
        }).join(', ');
      }
      
      const result = await apiService.generateKeywords(finalTopic);
      
      if (result.success) {
        setGeneratedKeywords(result.keywords);
        setGroupedKeywords(result.groupedKeywords);
        // Don't update the topic state with the final topic that includes selected keywords
        // The topic state should only contain the user's original input
      } else {
        setApiError(result.error || 'Failed to generate keywords');
      }
    } catch (error) {
      console.error('Error generating keywords:', error);
      setApiError('Network error occurred while generating keywords');
    } finally {
      setIsLoadingKeywords(false);
    }
  };

  // Generate mock keywords for testing when API is not available
  const generateMockKeywords = (topic) => {
    const keywordGroups = [
      {
        name: 'Product Types',
        keywords: [
          `${topic} premium`,
          `${topic} professional`,
          `${topic} budget`,
          `${topic} wireless`,
          `${topic} bluetooth`,
          `${topic} wired`,
          `${topic} portable`,
          `${topic} compact`
        ]
      },
      {
        name: 'Features & Benefits',
        keywords: [
          `${topic} noise cancelling`,
          `${topic} waterproof`,
          `${topic} durable`,
          `${topic} lightweight`,
          `${topic} comfortable`,
          `${topic} high quality`,
          `${topic} long battery life`,
          `${topic} fast charging`
        ]
      },
      {
        name: 'Use Cases',
        keywords: [
          `${topic} for gaming`,
          `${topic} for work`,
          `${topic} for travel`,
          `${topic} for exercise`,
          `${topic} for music`,
          `${topic} for calls`,
          `${topic} for streaming`,
          `${topic} for recording`
        ]
      },
      {
        name: 'Comparisons',
        keywords: [
          `${topic} vs airpods`,
          `${topic} vs sony`,
          `${topic} vs bose`,
          `${topic} alternatives`,
          `${topic} competitors`,
          `${topic} similar products`
        ]
      },
      {
        name: 'Reviews & Ratings',
        keywords: [
          `${topic} review`,
          `${topic} ratings`,
          `${topic} customer reviews`,
          `${topic} pros and cons`,
          `${topic} complaints`,
          `${topic} problems`,
          `${topic} issues`,
          `${topic} feedback`,
          `${topic} testimonials`,
          `${topic} user experience`
        ]
      },
      {
        name: 'Shopping',
        keywords: [
          `${topic} price`,
          `${topic} cost`,
          `${topic} discount`,
          `${topic} sale`,
          `${topic} deals`
        ]
      },
      {
        name: 'Technical',
        keywords: [
          `${topic} specifications`,
          `${topic} specs`,
          `${topic} technical details`,
          `${topic} features list`,
          `${topic} specifications sheet`
        ]
      }
    ];

    // Flatten all keywords into a single array
    return keywordGroups.flatMap(group => group.keywords);
  };

  const handleClearAll = () => {
      setSelectedKeywords([]);
  };

  const handleSwitchToManual = () => {
      setIsLeftPanelOpen(false);
  };

  const handleSwitchToAI = (currentTopic) => {
      if (currentTopic && currentTopic.trim()) {
          setIsLeftPanelOpen(true);
      }
  };

  // Handle option changes
  const handleOptionChange = (option) => {
    // Save current state before switching
    setOptionStates(prev => ({
      ...prev,
      [selectedOption]: {
        generatedKeywords: [...generatedKeywords],
        groupedKeywords: groupedKeywords,
        selectedKeywords: [...selectedKeywords],
        includeSelectedKeywords: includeSelectedKeywords,
        apiError: apiError
      }
    }));
    
    setSelectedOption(option);
    
    // Restore state for the new option
    const newState = optionStates[option] || {
      generatedKeywords: [],
      groupedKeywords: null,
      selectedKeywords: [],
      includeSelectedKeywords: false,
      apiError: null
    };
    setGeneratedKeywords(newState.generatedKeywords);
    setGroupedKeywords(newState.groupedKeywords);
    setSelectedKeywords(newState.selectedKeywords);
    setIncludeSelectedKeywords(newState.includeSelectedKeywords);
    setApiError(newState.apiError);
    
    // Option 1: Close secondary panel if no query has been run yet
    if (option === 1 && newState.generatedKeywords.length === 0) {
      setIsLeftPanelOpen(false);
    }
    
    // Option 2 and 3: Always open secondary panel when in AI mode
    if ((option === 2 || option === 3) && isCreateWithAI) {
          setIsLeftPanelOpen(true);
      }
  };

  const handleAddToQuery = (keyword) => {
    setQueryTags(prev => {
      if (prev.includes(keyword)) return prev;
      return [...prev, keyword];
    });
    // focus AI tab and open panels
    if (!isCreateWithAI) setIsCreateWithAI(true);
    if (!isPanelOpen) setIsPanelOpen(true);
  };

  return (
    <div className="flex h-screen bg-cover bg-center bg-no-repeat relative" 
         style={{ backgroundImage: "url('/dashboard-background.png')" }}>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-text-primary bg-opacity-80"></div>
      
      {/* Main content */}
      <div className="relative flex w-full">
        {/* Left sidebar with option buttons - appears when panels are open */}
        {(isPanelOpen || isLeftPanelOpen || isLoadingKeywords) && (
          <div className="fixed top-0 left-0 h-screen w-[200px] bg-white shadow-lg z-30 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-8 pb-4 flex-shrink-0 border-b border-[#E6E9EC]" style={{ height: '89px', paddingTop: '32px', paddingBottom: '16px' }}>
              <h2 className="text-lg font-bold font-dm-sans text-text-primary">Options</h2>
            </div>
            
            {/* Option buttons */}
            <div className="flex-1 px-6 pt-4 flex flex-col gap-3">
              <button 
                onClick={() => handleOptionChange(1)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium font-dm-sans transition-colors duration-200 ${
                  selectedOption === 1 
                    ? 'bg-primary-blue text-white' 
                    : 'bg-gray-50 hover:bg-gray-100 text-text-primary'
                }`}
              >
                Option 1
              </button>
              <button 
                onClick={() => handleOptionChange(2)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium font-dm-sans transition-colors duration-200 ${
                  selectedOption === 2 
                    ? 'bg-primary-blue text-white' 
                    : 'bg-gray-50 hover:bg-gray-100 text-text-primary'
                }`}
              >
                Option 2
              </button>
              <button 
                onClick={() => handleOptionChange(3)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium font-dm-sans transition-colors duration-200 ${
                  selectedOption === 3 
                    ? 'bg-primary-blue text-white' 
                    : 'bg-gray-50 hover:bg-gray-100 text-text-primary'
                }`}
              >
                Option 3
              </button>
              <button 
                onClick={() => handleOptionChange(4)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium font-dm-sans transition-colors duration-200 ${
                  selectedOption === 4 
                    ? 'bg-primary-blue text-white' 
                    : 'bg-gray-50 hover:bg-gray-100 text-text-primary'
                }`}
              >
                Option 4
              </button>
              <button 
                onClick={() => handleOptionChange(5)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium font-dm-sans transition-colors duration-200 ${
                  selectedOption === 5 
                    ? 'bg-primary-blue text-white' 
                    : 'bg-gray-50 hover:bg-gray-100 text-text-primary'
                }`}
              >
                Option 5
              </button>
              <button 
                onClick={() => handleOptionChange(6)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium font-dm-sans transition-colors duration-200 ${
                  selectedOption === 6 
                    ? 'bg-primary-blue text-white' 
                    : 'bg-gray-50 hover:bg-gray-100 text-text-primary'
                }`}
              >
                Option 6
              </button>
              
              {/* Option Description */}
              <div className="px-0 pt-4 pb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-bold font-dm-sans text-blue-800 mb-2">
                    {selectedOption === 1 && "Default Layout"}
                    {selectedOption === 2 && "AI Input in Secondary Panel"}
                    {selectedOption === 3 && "Figma Toggle Design"}
                    {selectedOption === 4 && "Clean Main Panel"}
                    {selectedOption === 5 && "Focus Mode"}
                    {selectedOption === 6 && "AI-First with Manual Focus"}
                  </h3>
                  <p className="text-xs font-dm-sans text-blue-700 leading-relaxed">
                    {selectedOption === 1 && "The standard layout with AI/Manual input in the main panel and keyword suggestions in the secondary panel."}
                    {selectedOption === 2 && "AI input moves to the secondary panel when in AI mode. Manual input stays in main panel."}
                    {selectedOption === 3 && "Same as Option 2 but with custom Figma-designed toggle switches and blue-bordered AI input field."}
                    {selectedOption === 4 && "All input fields moved to secondary panel. Main panel is completely clean with no text inputs."}
                    {selectedOption === 5 && "Single full-width panel that switches between Generate and Review modes for focused workflow."}
                    {selectedOption === 6 && "Always in AI mode with no tabs. Manual editing opens a dedicated focus mode for clean separation."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

                {/* Panels for Options 1-4 */}
        {selectedOption !== 5 && selectedOption !== 6 && (
          <>
            {/* Secondary panel - Generated Keywords */}
        <div 
          ref={generatedKeywordsRef}
              className={`fixed top-0 h-screen w-[500px] flex flex-col transform transition-all duration-300 ease-in-out ${
                selectedOption === 4 ? 'bg-white' : 'bg-background-secondary'
              } ${
               isLeftPanelOpen || isLoadingKeywords || ((selectedOption === 2 || selectedOption === 3) && isCreateWithAI && isPanelOpen) || ((selectedOption === 4 || selectedOption === 5 || selectedOption === 6) && isPanelOpen) ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'
          }`} 
          style={{ right: '500px', zIndex: 10 }}
        >
            {/* Header */}
              <div className={`flex items-center gap-4 px-8 pt-8 pb-4 flex-shrink-0 ${selectedOption === 4 ? '' : 'border-b border-[#E6E9EC]'}`} style={{ height: '89px', backgroundColor: '#F8F9FA' }}>
              <div className="w-9 h-9">
                <img src="/assets/agents-logo.svg" alt="Agents Logo" className="w-full h-full" />
              </div>
              <h1 className="text-2xl font-dm-sans text-text-primary">Keyword List Agent</h1>
            </div>

            {/* Content */}
              <div className="flex-1 px-8 py-4 flex flex-col gap-4 overflow-visible">
                {/* AI/Manual Toggle for Option 4 and 5 only */}
                {(selectedOption === 4 || selectedOption === 5) && (
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
                          handleSwitchToAI(topic);
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
                          handleSwitchToManual();
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
                )}

                {/* AI Input for Options 2, 3, 4 in secondary panel */}
                {(selectedOption === 2 || selectedOption === 3 || selectedOption === 4) && isCreateWithAI && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-dm-sans text-text-secondary">
                      {selectedOption === 3 ? 'Enter your topic, then click Generate to generate your list.' : 'Enter your topic, then click Create to generate your list.'}
                    </p>
                    <div className="flex items-center gap-4 relative">
                      <div className="flex-1 relative">
                        <div className="bg-white flex items-center gap-1 h-12 px-4 py-0 rounded-[50px] relative">
                          {selectedOption === 3 ? (
                            <div className="absolute inset-0 pointer-events-none rounded-[50px] border border-[#70a2ff]"></div>
                          ) : (
                            <div className="absolute inset-0 pointer-events-none rounded-[50px] bg-gradient-to-r from-blue-400 to-green-400 p-[1px]">
                              <div className="w-full h-full bg-white rounded-[50px]"></div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 relative z-10 w-full overflow-hidden">
                            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.97754 8.27246L11.9775 9.63574L8.97754 11L7.61328 14L6.25 11L3.25 9.63574L6.25 8.27246L7.61328 5.27246L8.97754 8.27246ZM7.07324 9.0957L5.88477 9.63574L7.07324 10.1758L7.61328 11.3652L8.15332 10.1758L9.34277 9.63574L8.15332 9.0957L7.61328 7.90723L7.07324 9.0957ZM13.75 5.13574L15.25 5.81738L13.75 6.49902L13.0684 7.99902L12.3867 6.49902L10.8867 5.81738L12.3867 5.13574L13.0684 3.63574L13.75 5.13574Z" fill="#2D54B8"/>
                            </svg>
                            
                            {includeSelectedKeywords && selectedKeywords.length > 0 && (
                              <div className="bg-gradient-to-l from-[#a8f7cf] from-[0.12%] to-[#a6c0ff] to-[99.77%] px-2 py-1 rounded-[5px] flex-shrink-0 h-6 flex items-center">
                                  <span className="text-[12px] font-bold font-dm-sans text-[#3a5166] leading-[16px] uppercase">
                                      {selectedKeywords.length} Selected Keywords
                                  </span>
                              </div>
                            )}

                            {queryTags.map((tag,i)=> (
                              <div key={i} className="bg-gradient-to-l from-[#a8f7cf] from-[0.12%] to-[#a6c0ff] to-[99.77%] px-2 py-1 rounded-[5px] flex-shrink-0 h-6 flex items-center gap-1 group">
                                 <span className="text-[12px] font-bold font-dm-sans text-[#3a5166] leading-[16px] uppercase">{tag}</span>
                                 <button onClick={(e)=>{
                                   e.stopPropagation();
                                   setQueryTags(prev=>prev.filter(t=>t!==tag));
                                 }} className="w-3 h-3 text-[#3a5166] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                                   ×
                                 </button>
                              </div>
                            ))}
                            <textarea
                              rows={1}
                              value={topic}
                              onChange={(e) => {
                                setTopic(e.target.value);
                                // auto resize
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && topic === '' && includeSelectedKeywords && selectedKeywords.length > 0) {
                                  e.preventDefault();
                                  setIncludeSelectedKeywords(false);
                                }
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAICreate(topic);
                                }
                              }}
                              placeholder={includeSelectedKeywords && selectedKeywords.length > 0 ? '' : (selectedOption === 3 ? 'E.g. "High-end headphone" or "Sneakers"' : "E.g. High-end headphone or Sneakers")}
                              className={`w-full resize-none overflow-hidden bg-transparent text-sm font-dm-sans focus:outline-none leading-[16px] ${
                                topic.trim() ? 'text-[#092540]' : 'text-text-placeholder'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {selectedOption === 3 ? (
                        <button
                          disabled={!(topic.trim() || (includeSelectedKeywords && selectedKeywords.length > 0) || queryTags.length>0)}
                          onClick={() => handleAICreate(topic)}
                          className="px-4 py-2 rounded-[640px] font-dm-sans font-bold text-[14px] leading-[20px] transition-all duration-200 cursor-pointer bg-gradient-to-r from-[#3e74fe] to-[#2ad3ab] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Generate
                        </button>
                      ) : (
                        <CreateButton
                          topic={topic}
                          isLoading={isLoadingKeywords}
                          isDisabled={!(topic.trim() || (includeSelectedKeywords && selectedKeywords.length > 0) || queryTags.length>0)}
                          onClick={() => handleAICreate(topic)}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        {selectedOption === 3 ? (
                          <FigmaToggle 
                            isOn={includeSelectedKeywords}
                            isDisabled={selectedKeywords.length === 0}
                            onClick={() => {
                              if (selectedKeywords.length > 0) {
                                setIncludeSelectedKeywords(!includeSelectedKeywords);
                              }
                            }}
                          />
                        ) : (
                          <button 
                            onClick={() => {
                              if (selectedKeywords.length > 0) {
                                setIncludeSelectedKeywords(!includeSelectedKeywords);
                              }
                            }}
                            disabled={selectedKeywords.length === 0}
                            className={`w-6 h-6 flex items-center justify-center ${
                              selectedKeywords.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'
                            }`}
                          >
                            <div className="w-6 h-6 relative">
                              {includeSelectedKeywords ? (
                                <div className="absolute inset-[12.5%] bg-blue-500 rounded-sm flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <div className={`absolute inset-[12.5%] border rounded-sm ${
                                  selectedKeywords.length > 0 ? 'border-[#b6bec6]' : 'border-[#e6e9ec]'
                                }`}></div>
                              )}
                            </div>
                          </button>
                        )}
                        {selectedKeywords.length === 0 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-[9999]">
                            <div className="bg-[#092540] text-white text-xs font-dm-sans rounded py-2 pl-4 pr-2">
                              Select at least one keyword to enable
                            </div>
                            <div 
                              className="absolute left-1/2 transform -translate-x-1/2"
                              style={{
                                width: 0,
                                height: 0,
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderTop: '6px solid #092540',
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <span className={`font-dm-sans leading-[20px] ${
                        selectedOption === 3 
                          ? 'text-[12px] text-[#6b7c8c]' 
                          : `text-sm ${
                              selectedKeywords.length > 0 ? 'text-[#092540]' : 'text-[#b6bec6]'
                            }`
                      }`}>
                        Include your Selected Keywords in your topic
                      </span>
                    </div>
                    
                    {apiError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                        <p className="text-sm text-red-600 font-dm-sans">
                          {apiError}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Input for Option 5 only - Options 2, 3, 4 use secondary panel */}
                {selectedOption === 5 && isCreateWithAI && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-dm-sans text-text-secondary">
                      {selectedOption === 3 ? 'Enter your topic, then click Generate to generate your list.' : 'Enter your topic, then click Create to generate your list.'}
                    </p>
                    <div className="flex items-center gap-4 relative">
                      <div className="flex-1 relative">
                        <div className="bg-white flex items-center gap-1 h-12 px-4 py-0 rounded-[50px] relative">
                          {selectedOption === 3 ? (
                            <div className="absolute inset-0 pointer-events-none rounded-[50px] border border-[#70a2ff]"></div>
                          ) : (
                            <div className="absolute inset-0 pointer-events-none rounded-[50px] bg-gradient-to-r from-blue-400 to-green-400 p-[1px]">
                              <div className="w-full h-full bg-white rounded-[50px]"></div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 relative z-10 w-full overflow-hidden">
                            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.97754 8.27246L11.9775 9.63574L8.97754 11L7.61328 14L6.25 11L3.25 9.63574L6.25 8.27246L7.61328 5.27246L8.97754 8.27246ZM7.07324 9.0957L5.88477 9.63574L7.07324 10.1758L7.61328 11.3652L8.15332 10.1758L9.34277 9.63574L8.15332 9.0957L7.61328 7.90723L7.07324 9.0957ZM13.75 5.13574L15.25 5.81738L13.75 6.49902L13.0684 7.99902L12.3867 6.49902L10.8867 5.81738L12.3867 5.13574L13.0684 3.63574L13.75 5.13574Z" fill="#2D54B8"/>
                            </svg>
                            
                            {includeSelectedKeywords && selectedKeywords.length > 0 && (
                              <div className="bg-gradient-to-l from-[#a8f7cf] from-[0.12%] to-[#a6c0ff] to-[99.77%] px-2 py-1 rounded-[5px] flex-shrink-0 h-6 flex items-center">
                                  <span className="text-[12px] font-bold font-dm-sans text-[#3a5166] leading-[16px] uppercase">
                                      {selectedKeywords.length} Selected Keywords
                                  </span>
                              </div>
                            )}

                            {queryTags.map((tag,i)=> (
                              <div key={i} className="bg-gradient-to-l from-[#a8f7cf] from-[0.12%] to-[#a6c0ff] to-[99.77%] px-2 py-1 rounded-[5px] flex-shrink-0 h-6 flex items-center gap-1 group">
                                 <span className="text-[12px] font-bold font-dm-sans text-[#3a5166] leading-[16px] uppercase">{tag}</span>
                                 <button onClick={(e)=>{
                                   e.stopPropagation();
                                   setQueryTags(prev=>prev.filter(t=>t!==tag));
                                 }} className="w-3 h-3 text-[#3a5166] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                                   ×
                                 </button>
                              </div>
                            ))}
                            <textarea
                              rows={1}
                              value={topic}
                              onChange={(e) => {
                                setTopic(e.target.value);
                                // auto resize
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && topic === '' && includeSelectedKeywords && selectedKeywords.length > 0) {
                                  e.preventDefault();
                                  setIncludeSelectedKeywords(false);
                                }
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleAICreate(topic);
                                }
                              }}
                              placeholder={includeSelectedKeywords && selectedKeywords.length > 0 ? '' : (selectedOption === 3 ? 'E.g. "High-end headphone" or "Sneakers"' : "E.g. High-end headphone or Sneakers")}
                              className={`w-full resize-none overflow-hidden bg-transparent text-sm font-dm-sans focus:outline-none leading-[16px] ${
                                topic.trim() ? 'text-[#092540]' : 'text-text-placeholder'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {selectedOption === 3 ? (
                        <button
                          disabled={!(topic.trim() || (includeSelectedKeywords && selectedKeywords.length > 0) || queryTags.length>0)}
                          onClick={() => handleAICreate(topic)}
                          className="px-4 py-2 rounded-[640px] font-dm-sans font-bold text-[14px] leading-[20px] transition-all duration-200 cursor-pointer bg-gradient-to-r from-[#3e74fe] to-[#2ad3ab] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Generate
                        </button>
                      ) : (
                        <CreateButton
                          topic={topic}
                          isLoading={isLoadingKeywords}
                          isDisabled={!(topic.trim() || (includeSelectedKeywords && selectedKeywords.length > 0) || queryTags.length>0)}
                          onClick={() => handleAICreate(topic)}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        {selectedOption === 3 ? (
                          <FigmaToggle 
                            isOn={includeSelectedKeywords}
                            isDisabled={selectedKeywords.length === 0}
                            onClick={() => {
                              if (selectedKeywords.length > 0) {
                                setIncludeSelectedKeywords(!includeSelectedKeywords);
                              }
                            }}
                          />
                        ) : (
                          <button 
                            onClick={() => {
                              if (selectedKeywords.length > 0) {
                                setIncludeSelectedKeywords(!includeSelectedKeywords);
                              }
                            }}
                            disabled={selectedKeywords.length === 0}
                            className={`w-6 h-6 flex items-center justify-center ${
                              selectedKeywords.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'
                            }`}
                          >
                            <div className="w-6 h-6 relative">
                              {includeSelectedKeywords ? (
                                <div className="absolute inset-[12.5%] bg-blue-500 rounded-sm flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <div className={`absolute inset-[12.5%] border rounded-sm ${
                                  selectedKeywords.length > 0 ? 'border-[#b6bec6]' : 'border-[#e6e9ec]'
                                }`}></div>
                              )}
                            </div>
                          </button>
                        )}
                        {selectedKeywords.length === 0 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-50">
                            <div className="bg-[#092540] text-white text-xs font-dm-sans rounded py-2 pl-4 pr-2">
                              Select at least one keyword to enable
                            </div>
                            <div 
                              className="absolute left-1/2 transform -translate-x-1/2"
                              style={{
                                width: 0,
                                height: 0,
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderTop: '6px solid #092540',
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <span className={`font-dm-sans leading-[20px] ${
                        selectedOption === 3 
                          ? 'text-[12px] text-[#6b7c8c]' 
                          : `text-sm ${
                              selectedKeywords.length > 0 ? 'text-[#092540]' : 'text-[#b6bec6]'
                            }`
                      }`}>
                        Include your Selected Keywords in your topic
                      </span>
                    </div>
                    
                    {apiError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                        <p className="text-sm text-red-600 font-dm-sans">
                          {apiError}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Input for Option 4 and 5 */}
                {(selectedOption === 4 || selectedOption === 5) && !isCreateWithAI && (
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
                              type="text"
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && topic.trim()) {
                                  e.preventDefault();
                                  // Split by comma and add each keyword
                                  const keywords = topic.split(',').map(k => k.trim()).filter(k => k.length > 0);
                                  keywords.forEach(keyword => {
                                    if (!selectedKeywords.includes(keyword)) {
                                      setSelectedKeywords(prev => [...prev, keyword]);
                                    }
                                  });
                                  setTopic('');
                                }
                              }}
                              placeholder="E.g. headphones, wireless, bluetooth"
                              className={`flex-1 bg-transparent text-sm font-dm-sans focus:outline-none leading-[20px] ${
                                topic.trim() ? 'text-[#092540]' : 'text-text-placeholder'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        disabled={!topic.trim()}
                        onClick={() => {
                          if (topic.trim()) {
                            // Split by comma and add each keyword
                            const keywords = topic.split(',').map(k => k.trim()).filter(k => k.length > 0);
                            keywords.forEach(keyword => {
                              if (!selectedKeywords.includes(keyword)) {
                                setSelectedKeywords(prev => [...prev, keyword]);
                              }
                            });
                            setTopic('');
                          }
                        }}
                        className={`px-4 py-2 rounded-[18px] text-sm font-medium font-dm-sans transition-colors ${
                          topic.trim()
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



                {/* Keyword Suggestions Title */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <h2 className="text-base font-bold font-dm-sans text-text-primary">
                    {isLoadingKeywords ? 'Generated Keywords' : generatedKeywords.length > 0 ? `${generatedKeywords.length} Keyword Suggestions Found` : 'Keyword Suggestions'}
                </h2>
                <p className="text-sm font-dm-sans text-text-secondary">
                    {isLoadingKeywords ? 'Our AI agent is analyzing...' : generatedKeywords.length > 0 ? 'Click keywords to add them to your list.' : 'Enter a topic above to generate keyword suggestions.'}
                </p>
              </div>

                {/* Keywords List */}
              <KeywordList 
                keywords={generatedKeywords}
                groupedKeywords={groupedKeywords}
                selectedKeywords={selectedKeywords}
                onKeywordToggle={handleKeywordToggle}
                isLoadingKeywords={isLoadingKeywords}
                onAddToQuery={handleAddToQuery}
                  selectedOption={selectedOption}
              />
            </div>

              {/* 24px bottom spacer for all options 1, 2, 3, 4 */}
              {(selectedOption === 1 || selectedOption === 2 || selectedOption === 3 || selectedOption === 4) && (
                <div className="flex-shrink-0 h-6"></div>
              )}
          </div>

            {/* Main panel - Keyword Details */}
        <div className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isPanelOpen || isLoadingKeywords ? 'translate-x-0' : 'translate-x-full'
        }`} style={{ zIndex: 20 }}>
                                 <KeywordDetails
                         isCreateWithAI={isCreateWithAI}
                         setIsCreateWithAI={setIsCreateWithAI}
                         topic={topic}
                         setTopic={setTopic}
                         selectedKeywords={selectedKeywords}
                         onRemoveKeyword={handleRemoveKeyword}
                         onAddKeyword={(keyword) => {
                                          console.log('onAddKeyword called with:', keyword);
                           if (!selectedKeywords.includes(keyword)) {
                                            console.log('Adding keyword to selectedKeywords:', keyword);
                             setSelectedKeywords(prev => [...prev, keyword]);
                                          } else {
                                            console.log('Keyword already exists:', keyword);
                           }
                         }}
                         onAICreate={handleAICreate}
                         onSaveAndAnalyze={handleSaveAndAnalyze}
                         onClose={handleClose}
                         onClearAll={handleClearAll}
                         onSwitchToManual={handleSwitchToManual}
                         onSwitchToAI={handleSwitchToAI}
                         isLoadingKeywords={isLoadingKeywords}
                         apiError={apiError}
                         queryTags={queryTags}
                         setQueryTags={setQueryTags}
                                        selectedOption={selectedOption}
                         onGenerationComplete={() => {
                           // This will be called when generation is complete
                         }}
                       />
        </div>
          </>
        )}

        {/* Full-width panel for Option 5 - Focus Mode */}
        {selectedOption === 5 && (
          <div className={`fixed top-0 right-0 h-full w-[700px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`} style={{ zIndex: 20 }}>
            {/* Content for Focus Mode will go here */}
            {isReviewMode ? (
              <KeywordDetails
                isCreateWithAI={isCreateWithAI}
                setIsCreateWithAI={setIsCreateWithAI}
                topic={topic}
                setTopic={setTopic}
                selectedKeywords={selectedKeywords}
                onRemoveKeyword={handleRemoveKeyword}
                onAddKeyword={(keyword) => {
                  console.log('onAddKeyword called with:', keyword);
                  if (!selectedKeywords.includes(keyword)) {
                    console.log('Adding keyword to selectedKeywords:', keyword);
                    setSelectedKeywords(prev => [...prev, keyword]);
                  } else {
                    console.log('Keyword already exists:', keyword);
                  }
                }}
                onAICreate={handleAICreate}
                onSaveAndAnalyze={handleSaveAndAnalyze}
                onClose={handleClose}
                onClearAll={handleClearAll}
                onSwitchToManual={handleSwitchToManual}
                onSwitchToAI={handleSwitchToAI}
                isLoadingKeywords={isLoadingKeywords}
                apiError={apiError}
                queryTags={queryTags}
                setQueryTags={setQueryTags}
                selectedOption={selectedOption}
                onGenerationComplete={() => {
                  // This will be called when generation is complete
                }}
                isFocusMode={true}
                onBackToGenerate={() => setIsReviewMode(false)}
              />
            ) : (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-4 flex-shrink-0 bg-background-secondary border-b border-[#E6E9EC]" style={{ height: '89px' }}>
                  <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="text-2xl font-dm-sans text-text-primary bg-transparent border-b border-transparent px-2 py-1 hover:border-b-[#E6E9EC] focus:border-b-blue-500 focus:outline-none transition-colors"
                        style={{ width: `${Math.max(120, listName.length * 15)}px` }}
                      />
                      <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Content */}
                <div className="flex-1 px-10 pt-4 flex flex-col gap-4 overflow-hidden relative min-h-0">
                  {/* AI/Manual Toggle */}
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
                          handleSwitchToAI(topic);
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
                          handleSwitchToManual();
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

                  {/* AI Input */}
                  {isCreateWithAI && (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-dm-sans text-text-secondary">
                        Enter your topic, then click Create to generate your list.
                      </p>
                      <div className="flex items-center gap-4 relative">
                        <div className="flex-1 relative">
                          <div className="bg-white flex items-center gap-1 h-12 px-4 py-0 rounded-[50px] relative">
                            <div className="absolute inset-0 pointer-events-none rounded-[50px] bg-gradient-to-r from-blue-400 to-green-400 p-[1px]">
                              <div className="w-full h-full bg-white rounded-[50px]"></div>
                            </div>
                            <div className="flex items-center gap-2 relative z-10 w-full overflow-hidden">
                              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.97754 8.27246L11.9775 9.63574L8.97754 11L7.61328 14L6.25 11L3.25 9.63574L6.25 8.27246L7.61328 5.27246L8.97754 8.27246ZM7.07324 9.0957L5.88477 9.63574L7.07324 10.1758L7.61328 11.3652L8.15332 10.1758L9.34277 9.63574L8.15332 9.0957L7.61328 7.90723L7.07324 9.0957ZM13.75 5.13574L15.25 5.81738L13.75 6.49902L13.0684 7.99902L12.3867 6.49902L10.8867 5.81738L12.3867 5.13574L13.0684 3.63574L13.75 5.13574Z" fill="#2D54B8"/>
                              </svg>
                              
                              {includeSelectedKeywords && selectedKeywords.length > 0 && (
                                <div className="bg-gradient-to-l from-[#a8f7cf] from-[0.12%] to-[#a6c0ff] to-[99.77%] px-2 py-1 rounded-[5px] flex-shrink-0 h-6 flex items-center">
                                    <span className="text-[12px] font-bold font-dm-sans text-[#3a5166] leading-[16px] uppercase">
                                        {selectedKeywords.length} Selected Keywords
                                    </span>
                                </div>
                              )}

                              {queryTags.map((tag,i)=> (
                                <div key={i} className="bg-gradient-to-l from-[#a8f7cf] from-[0.12%] to-[#a6c0ff] to-[99.77%] px-2 py-1 rounded-[5px] flex-shrink-0 h-6 flex items-center gap-1 group">
                                   <span className="text-[12px] font-bold font-dm-sans text-[#3a5166] leading-[16px] uppercase">{tag}</span>
                                   <button onClick={(e)=>{
                                     e.stopPropagation();
                                     setQueryTags(prev=>prev.filter(t=>t!==tag));
                                   }} className="w-3 h-3 text-[#3a5166] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                                     ×
                                   </button>
                                </div>
                              ))}
                              <textarea
                                rows={1}
                                value={topic}
                                onChange={(e) => {
                                  setTopic(e.target.value);
                                  // auto resize
                                  e.target.style.height = 'auto';
                                  e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace' && topic === '' && includeSelectedKeywords && selectedKeywords.length > 0) {
                                    e.preventDefault();
                                    setIncludeSelectedKeywords(false);
                                  }
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAICreate(topic);
                                  }
                                }}
                                placeholder={includeSelectedKeywords && selectedKeywords.length > 0 ? '' : "E.g. High-end headphone or Sneakers"}
                                className={`w-full resize-none overflow-hidden bg-transparent text-sm font-dm-sans focus:outline-none leading-[16px] ${
                                  topic.trim() ? 'text-[#092540]' : 'text-text-placeholder'
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        <CreateButton
                          topic={topic}
                          isLoading={isLoadingKeywords}
                          isDisabled={!(topic.trim() || (includeSelectedKeywords && selectedKeywords.length > 0) || queryTags.length>0)}
                          onClick={() => handleAICreate(topic)}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative group">
                          <button 
                            onClick={() => {
                              if (selectedKeywords.length > 0) {
                                setIncludeSelectedKeywords(!includeSelectedKeywords);
                              }
                            }}
                            disabled={selectedKeywords.length === 0}
                            className={`w-6 h-6 flex items-center justify-center ${
                              selectedKeywords.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'
                            }`}
                          >
                            <div className="w-6 h-6 relative">
                              {includeSelectedKeywords ? (
                                <div className="absolute inset-[12.5%] bg-blue-500 rounded-sm flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <div className={`absolute inset-[12.5%] border rounded-sm ${
                                  selectedKeywords.length > 0 ? 'border-[#b6bec6]' : 'border-[#e6e9ec]'
                                }`}></div>
                              )}
                            </div>
                          </button>
                          {selectedKeywords.length === 0 && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-50">
                              <div className="bg-[#092540] text-white text-xs font-dm-sans rounded py-2 pl-4 pr-2">
                                Select at least one keyword to enable
                              </div>
                              <div 
                                className="absolute left-1/2 transform -translate-x-1/2"
                                style={{
                                  width: 0,
                                  height: 0,
                                  borderLeft: '6px solid transparent',
                                  borderRight: '6px solid transparent',
                                  borderTop: '6px solid #092540',
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <span className={`text-sm font-dm-sans leading-[20px] ${
                          selectedKeywords.length > 0 ? 'text-[#092540]' : 'text-[#b6bec6]'
                        }`}>
                          Include your Selected Keywords in your topic
                        </span>
                      </div>
                      
                      {apiError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                          <p className="text-sm text-red-600 font-dm-sans">
                            {apiError}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Input */}
                  {!isCreateWithAI && (
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
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && topic.trim()) {
                                    e.preventDefault();
                                    // Split by comma and add each keyword
                                    const keywords = topic.split(',').map(k => k.trim()).filter(k => k.length > 0);
                                    keywords.forEach(keyword => {
                                      if (!selectedKeywords.includes(keyword)) {
                                        setSelectedKeywords(prev => [...prev, keyword]);
                                      }
                                    });
                                    setTopic('');
                                  }
                                }}
                                placeholder="E.g. headphones, wireless, bluetooth"
                                className={`flex-1 bg-transparent text-sm font-dm-sans focus:outline-none leading-[20px] ${
                                  topic.trim() ? 'text-[#092540]' : 'text-text-placeholder'
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          disabled={!topic.trim()}
                          onClick={() => {
                            if (topic.trim()) {
                              // Split by comma and add each keyword
                              const keywords = topic.split(',').map(k => k.trim()).filter(k => k.length > 0);
                              keywords.forEach(keyword => {
                                if (!selectedKeywords.includes(keyword)) {
                                  setSelectedKeywords(prev => [...prev, keyword]);
                                }
                              });
                              setTopic('');
                            }
                          }}
                          className={`px-4 py-2 rounded-[18px] text-sm font-medium font-dm-sans transition-colors ${
                            topic.trim()
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

                  {/* AI Mode Layout */}
                  {isCreateWithAI && (
                    <>
                      {/* Keyword Suggestions - Main focus in AI Mode */}
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <h2 className="text-base font-bold font-dm-sans text-text-primary">
                          {isLoadingKeywords ? 'Generated Keywords' : generatedKeywords.length > 0 ? `${generatedKeywords.length} Keyword Suggestions Found` : 'Keyword Suggestions'}
                        </h2>
                        <p className="text-sm font-dm-sans text-text-secondary">
                          {isLoadingKeywords ? 'Our AI agent is analyzing...' : generatedKeywords.length > 0 ? 'Click keywords to add them to your list.' : 'Enter a topic above to generate keyword suggestions.'}
                        </p>
                      </div>
                      <div className="flex-1 min-h-0 overflow-hidden">
                        <KeywordList 
                          keywords={generatedKeywords}
                          groupedKeywords={groupedKeywords}
                          selectedKeywords={selectedKeywords}
                          onKeywordToggle={handleKeywordToggle}
                          isLoadingKeywords={isLoadingKeywords}
                          onAddToQuery={handleAddToQuery}
                          selectedOption={selectedOption}
                        />
                      </div>

                      {/* Selected Keywords - Bottom summary in AI Mode */}
                      {selectedKeywords.length > 0 && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold font-dm-sans text-text-primary">
                              Selected Keywords
                            </h3>
                            <span className={`text-sm font-dm-sans ${selectedKeywords.length >= 50 ? 'text-red-500' : 'text-text-primary'}`}>
                              {selectedKeywords.length} / 50
                            </span>
                          </div>
                          
                          {/* Keyword limit warning */}
                          {selectedKeywords.length >= 50 && (
                            <div className="flex items-center justify-between -mt-1">
                              <span className="text-xs text-text-secondary">
                                Keyword limit reached, you can remove keywords below to continue adding.
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div></div>
                            <button
                              onClick={() => {
                                if (isSelectedKeywordsExpanded) {
                                  setIsSelectedKeywordsExpanded(false);
                                } else {
                                  setIsCreateWithAI(false); // Switch to manual mode
                                }
                              }}
                              className="flex items-center gap-1 text-sm font-dm-sans text-primary-blue hover:text-primary-dark transition-colors"
                            >
                              {isSelectedKeywordsExpanded ? 'Collapse' : `Review ${selectedKeywords.length} Selected Keywords`}
                              <svg className={`w-4 h-4 transform transition-transform ${isSelectedKeywordsExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSelectedKeywordsExpanded ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                              </svg>
                            </button>
                          </div>

                          {/* AI Mode - Summarized View (Default) */}
                          {!isSelectedKeywordsExpanded && (
                            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 border border-blue-200">
                              <p className="text-sm font-dm-sans text-text-secondary mb-2">
                                {selectedKeywords.length} of 50 keywords selected for your list
                              </p>
                              <DynamicKeywordDisplay selectedKeywords={selectedKeywords} />
                            </div>
                          )}

                          {/* AI Mode - Expanded View */}
                          {isSelectedKeywordsExpanded && (
                            <div className="bg-background-secondary rounded-lg relative overflow-y-auto" style={{ maxHeight: '200px' }}>
                              <div className="p-3">
                                <div className="flex flex-wrap gap-2">
                                  {selectedKeywords.map((keyword, index) => (
                                    <div key={`${keyword}-${index}`} className="bg-white flex items-center gap-2 pl-3 pr-1 h-8 rounded-[40px] shadow-sm shrink-0">
                                      <span className="text-xs font-dm-sans text-text-primary leading-[16px] truncate max-w-[280px]">
                                        {keyword.replace(/\s+\(\d+(?:,\d+)*\)$/, '')}
                                      </span>
                                      <button
                                        onClick={() => handleRemoveKeyword(keyword)}
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
                              <div className="absolute border border-border-default border-solid inset-0 pointer-events-none rounded-lg"></div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Manual Mode Layout */}
                  {!isCreateWithAI && (
                    <>
                      {/* Selected Keywords - Full space in Manual Mode */}
                      {selectedKeywords.length > 0 ? (
                        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold font-dm-sans text-text-primary">
                              Selected Keywords
                            </h3>
                            <div className="flex items-center gap-4">
                              <span className={`text-sm font-dm-sans ${selectedKeywords.length >= 50 ? 'text-red-500' : 'text-text-primary'}`}>
                                {selectedKeywords.length} / 50
                              </span>
                              <button
                                onClick={handleClearAll}
                                className="text-sm font-dm-sans text-red-500 hover:text-red-700 transition-colors"
                              >
                                Clear All
                              </button>
                            </div>
                          </div>
                          
                          {/* Keyword limit warning */}
                          {selectedKeywords.length >= 50 && (
                            <div className="flex items-center justify-between -mt-1">
                              <span className="text-xs text-text-secondary">
                                Keyword limit reached, you can remove keywords below to continue adding.
                              </span>
                            </div>
                          )}
                          <div className="bg-background-secondary rounded-lg relative flex-1 overflow-y-auto">
                            <div className="p-3">
                              <div className="flex flex-wrap gap-2">
                                {selectedKeywords.map((keyword, index) => (
                                  <div key={`${keyword}-${index}`} className="bg-white flex items-center gap-2 pl-3 pr-1 h-8 rounded-[40px] shadow-sm shrink-0">
                                    <span className="text-xs font-dm-sans text-text-primary leading-[16px] truncate max-w-[280px]">
                                      {keyword.replace(/\s+\(\d+(?:,\d+)*\)$/, '')}
                                    </span>
                                    <button
                                      onClick={() => handleRemoveKeyword(keyword)}
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
                            <div className="absolute border border-border-default border-solid inset-0 pointer-events-none rounded-lg"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold font-dm-sans text-text-primary">
                              Selected Keywords ({selectedKeywords.length})
                            </h3>
                          </div>
                          <div className="flex-1 bg-background-secondary rounded relative overflow-y-auto">
                            <div className="flex flex-col items-center justify-center h-full gap-2">
                              <div className="text-center mb-2">
                                <p className="text-base font-bold font-dm-sans text-[#092540] leading-[22px] mb-2">Start adding keywords</p>
                                <p className="text-xs font-dm-sans text-[#6b7c8c] leading-[16px] w-[280px]">Select keywords from the AI generated list or manually to add them here</p>
                              </div>
                              <div className="flex flex-col items-center justify-center h-[232px] w-[404px] px-0 py-2.5">
                                <div className="h-[232px] w-[404px] relative">
                                  <img 
                                    src="/empty state.png" 
                                    alt="Empty state illustration"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="absolute border border-border-default border-solid inset-0 pointer-events-none rounded-lg"></div>
                          </div>
                        </div>
                      )}
                    </>
                  )}


                </div>

                {/* Footer */}
                <div className="bg-white relative">
                  <div className="flex flex-col gap-[7px] items-end justify-start overflow-hidden px-6 py-4 w-full">
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-[18px] text-sm font-medium font-dm-sans text-primary-blue hover:bg-blue-50 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleSaveAndAnalyze}
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
            )}
          </div>
        )}

        {/* Full-width panel for Option 6 - AI Mode with Focus Mode for Manual */}
        {selectedOption === 6 && (
          <div className={`fixed top-0 right-0 h-full w-[700px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`} style={{ zIndex: 20 }}>
            {isFocusMode ? (
              // Focus Mode - Manual Input
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-4 flex-shrink-0 bg-background-secondary border-b border-[#E6E9EC]" style={{ height: '89px' }}>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsFocusMode(false)}
                      className="flex items-center gap-2 text-text-primary hover:text-primary-blue transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span className="text-lg font-dm-sans">Back to Keywords</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="text-2xl font-dm-sans text-text-primary bg-transparent border-b border-transparent px-2 py-1 hover:border-b-[#E6E9EC] focus:border-b-blue-500 focus:outline-none transition-colors"
                        style={{ width: `${Math.max(120, listName.length * 15)}px` }}
                      />
                      <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Content */}
                <div className="flex-1 px-10 pt-4 flex flex-col gap-4 overflow-hidden relative min-h-0">
                  {/* Manual Input Section */}
                  <div className="flex-shrink-0">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-dm-sans text-text-secondary">Type or paste keywords, then press Enter or click Add</p>
                      <div className="flex items-center gap-4 relative">
                        <div className="flex-1 relative">
                          <div className="bg-white flex flex-col gap-1 h-10 items-start justify-center px-4 py-0 rounded-lg relative">
                            <div className="absolute inset-0 pointer-events-none rounded-lg border border-gray-300"></div>
                            <div className="flex items-center gap-2 relative z-10 w-full">
                              <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <input
                                type="text"
                                placeholder="E.g. headphones, wireless, bluetooth"
                                className="flex-1 bg-transparent text-sm font-dm-sans focus:outline-none leading-[20px] text-[#092540]"
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && manualInput.trim()) {
                                    const keywords = manualInput.split(',').map(k => k.trim()).filter(k => k);
                                    const currentSelectedCount = selectedKeywords.length;
                                    const availableSlots = 50 - currentSelectedCount;
                                    
                                    if (availableSlots <= 0) {
                                      // Already at limit, can't add more
                                      return;
                                    }
                                    
                                    let addedCount = 0;
                                    keywords.forEach(keyword => {
                                      if (!selectedKeywords.includes(keyword) && addedCount < availableSlots) {
                                        setSelectedKeywords(prev => [...prev, keyword]);
                                        addedCount++;
                                      }
                                    });
                                    setManualInput('');
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (manualInput.trim()) {
                              const keywords = manualInput.split(',').map(k => k.trim()).filter(k => k);
                              const currentSelectedCount = selectedKeywords.length;
                              const availableSlots = 50 - currentSelectedCount;
                              
                              if (availableSlots <= 0) {
                                // Already at limit, can't add more
                                return;
                              }
                              
                              let addedCount = 0;
                              keywords.forEach(keyword => {
                                if (!selectedKeywords.includes(keyword) && addedCount < availableSlots) {
                                  setSelectedKeywords(prev => [...prev, keyword]);
                                  addedCount++;
                                }
                              });
                              setManualInput('');
                            }
                          }}
                          disabled={!manualInput.trim()}
                          className={`px-4 py-2 rounded-[18px] text-sm font-medium font-dm-sans transition-colors ${
                            manualInput.trim()
                              ? 'bg-primary-blue text-white hover:bg-primary-dark'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Selected Keywords - Full space in Focus Mode */}
                  {selectedKeywords.length > 0 ? (
                    <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold font-dm-sans text-text-primary">
                          Selected Keywords
                        </h3>
                        <div className="flex items-center gap-4">
                          <span className={`text-sm font-dm-sans ${selectedKeywords.length >= 50 ? 'text-red-500' : 'text-text-primary'}`}>
                            {selectedKeywords.length} / 50
                          </span>
                          <button
                            onClick={handleClearAll}
                            className="text-sm font-dm-sans text-red-500 hover:text-red-700 transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      
                      {/* Keyword limit warning */}
                      {selectedKeywords.length >= 50 && (
                        <div className="flex items-center justify-between -mt-1">
                          <span className="text-xs text-text-secondary">
                            Keyword limit reached, you can remove keywords below to continue adding.
                          </span>
                        </div>
                      )}
                      <div className="bg-background-secondary rounded-lg relative flex-1 overflow-y-auto">
                        <div className="p-3">
                          <div className="flex flex-wrap gap-2">
                            {selectedKeywords.map((keyword, index) => (
                              <div key={`${keyword}-${index}`} className="bg-white flex items-center gap-2 pl-3 pr-1 h-8 rounded-[40px] shadow-sm shrink-0">
                                <span className="text-xs font-dm-sans text-text-primary leading-[16px] truncate max-w-[280px]">
                                  {keyword.replace(/\s+\(\d+(?:,\d+)*\)$/, '')}
                                </span>
                                <button
                                  onClick={() => handleRemoveKeyword(keyword)}
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
                        <div className="absolute border border-border-default border-solid inset-0 pointer-events-none rounded-lg"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold font-dm-sans text-text-primary">
                          Selected Keywords ({selectedKeywords.length})
                        </h3>
                      </div>
                      <div className="bg-background-secondary rounded-lg relative flex-1 overflow-y-auto">
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <div className="text-center mb-2">
                            <p className="text-base font-bold font-dm-sans text-[#092540] leading-[22px] mb-2">Start adding keywords</p>
                            <p className="text-xs font-dm-sans text-[#6b7c8c] leading-[16px] w-[280px]">Select keywords from the AI generated list or manually to add them here</p>
                          </div>
                          <div className="flex flex-col items-center justify-center h-[232px] w-[404px] px-0 py-2.5">
                            <div className="h-[232px] w-[404px] relative">
                              <img 
                                src="/empty state.png" 
                                alt="Empty state illustration"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="absolute border border-border-default border-solid inset-0 pointer-events-none rounded-lg"></div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Footer */}
                <div className="bg-white relative">
                  <div className="flex flex-col gap-[7px] items-end justify-start overflow-hidden px-6 py-4 w-full">
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={() => setIsFocusMode(false)}
                        className="px-4 py-2 rounded-[18px] text-sm font-medium font-dm-sans text-primary-blue hover:bg-blue-50 transition-colors"
                      >
                        Back to Keywords
                      </button>
                      <button
                        onClick={handleSaveAndAnalyze}
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
            ) : (
              // AI Mode - No tabs, always AI
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-8 pt-8 pb-4 flex-shrink-0 bg-background-secondary border-b border-[#E6E9EC]" style={{ height: '89px' }}>
                  <div className="flex items-center gap-4">

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="text-2xl font-dm-sans text-text-primary bg-transparent border-b border-transparent px-2 py-1 hover:border-b-[#E6E9EC] focus:border-b-blue-500 focus:outline-none transition-colors"
                        style={{ width: `${Math.max(120, listName.length * 15)}px` }}
                      />
                      <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Content */}
                <div className="flex-1 px-10 pt-4 flex flex-col gap-4 overflow-hidden relative min-h-0">
                  {/* AI Input - Always visible, no tabs for Option 6 */}
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-dm-sans text-text-secondary">
                      Enter your topic, then click Create to generate your list.
                    </p>
                    <div className="flex items-center gap-4 relative">
                      <div className="flex-1 relative">
                        <div className="bg-white flex items-center gap-1 h-12 px-4 py-0 rounded-[50px] relative">
                          <div className="absolute inset-0 pointer-events-none rounded-[50px] bg-gradient-to-r from-blue-400 to-green-400 p-[1px]">
                            <div className="w-full h-full bg-white rounded-[50px]"></div>
                          </div>
                          <div className="flex items-center gap-2 relative z-10 w-full overflow-hidden">
                            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.97754 8.27246L11.9775 9.63574L8.97754 11L7.61328 14L6.25 11L3.25 9.63574L6.25 8.27246L7.61328 5.27246L8.97754 8.27246ZM7.07324 9.0957L5.88477 9.63574L7.07324 10.1758L7.61328 11.3652L8.15332 10.1758L9.34277 9.63574L8.15332 9.0957L7.61328 7.90723L7.07324 9.0957ZM13.75 5.13574L15.25 5.81738L13.75 6.49902L13.0684 7.99902L12.3867 6.49902L10.8867 5.81738L12.3867 5.13574L13.0684 3.63574L13.75 5.13574Z" fill="#2D54B8"/>
                            </svg>
                            
                            {includeSelectedKeywords && selectedKeywords.length > 0 && (
                              <div className="bg-gradient-to-l from-[#a8f7cf] from-[0.12%] to-[#a6c0ff] to-[99.77%] px-2 py-1 rounded-[5px] flex-shrink-0 h-6 flex items-center">
                                  <span className="text-[12px] font-bold font-dm-sans text-[#3a5166] leading-[16px] uppercase">
                                      {selectedKeywords.length} Selected Keywords
                                  </span>
                              </div>
                            )}

                            {queryTags.map((tag,i)=> (
                              <div key={i} className="bg-gradient-to-l from-[#a8f7cf] from-[0.12%] to-[#a6c0ff] to-[99.77%] px-2 py-1 rounded-[5px] flex-shrink-0 h-6 flex items-center gap-1 group">
                                 <span className="text-[12px] font-bold font-dm-sans text-[#3a5166] leading-[16px] uppercase">{tag}</span>
                                 <button onClick={(e)=>{
                                   e.stopPropagation();
                                   setQueryTags(prev=>prev.filter(t=>t!==tag));
                                 }} className="w-3 h-3 text-[#3a5166] opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                                   ×
                                 </button>
                              </div>
                            ))}
                            <textarea
                              rows="1"
                              placeholder={includeSelectedKeywords && selectedKeywords.length > 0 ? '' : "E.g. High-end headphone or Sneakers"}
                              className="w-full resize-none overflow-hidden bg-transparent text-sm font-dm-sans focus:outline-none leading-[16px] text-[#092540]"
                              value={topic}
                              onChange={(e) => {
                                setTopic(e.target.value);
                                // auto resize
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && topic === '' && includeSelectedKeywords && selectedKeywords.length > 0) {
                                  e.preventDefault();
                                  setIncludeSelectedKeywords(false);
                                }
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  if (topic.trim() || (includeSelectedKeywords && selectedKeywords.length > 0)) {
                                    handleAICreate(topic);
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAICreate(topic)}
                        disabled={!topic.trim() && !(includeSelectedKeywords && selectedKeywords.length > 0)}
                        className={`px-4 py-2 rounded-[640px] font-dm-sans font-bold text-[14px] leading-[20px] transition-all duration-200 cursor-pointer ${
                          (topic.trim() || (includeSelectedKeywords && selectedKeywords.length > 0))
                            ? ''
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        style={{
                          background: (topic.trim() || (includeSelectedKeywords && selectedKeywords.length > 0))
                            ? 'linear-gradient(135deg, rgb(62, 116, 254) 0%, rgb(42, 211, 171) 100%)'
                            : '#e5e7eb',
                          color: (topic.trim() || (includeSelectedKeywords && selectedKeywords.length > 0))
                            ? 'rgb(255, 255, 255)'
                            : '#9ca3af'
                        }}
                      >
                        Create
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative group">
                        <button 
                          onClick={() => {
                            if (selectedKeywords.length > 0) {
                              setIncludeSelectedKeywords(!includeSelectedKeywords);
                            }
                          }}
                          disabled={selectedKeywords.length === 0}
                          className={`w-6 h-6 flex items-center justify-center ${
                            selectedKeywords.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'
                          }`}
                        >
                          <div className="w-6 h-6 relative">
                            <div className={`absolute inset-[12.5%] border rounded-sm ${
                              selectedKeywords.length > 0 
                                ? (includeSelectedKeywords ? 'bg-[#2D54B8] border-[#2D54B8]' : 'border-[#2D54B8]')
                                : 'border-[#e6e9ec]'
                            }`}>
                              {includeSelectedKeywords && selectedKeywords.length > 0 && (
                                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </button>
                        {selectedKeywords.length === 0 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-50">
                            <div className="bg-[#092540] text-white text-xs font-dm-sans rounded py-2 pl-4 pr-2">
                              Select at least one keyword to enable
                            </div>
                            <div 
                              className="absolute left-1/2 transform -translate-x-1/2"
                              style={{
                                width: 0,
                                height: 0,
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderTop: '6px solid #092540',
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <span className={`text-sm font-dm-sans leading-[20px] ${
                        selectedKeywords.length > 0 ? 'text-[#092540]' : 'text-[#b6bec6]'
                      }`}>
                        Include your Selected Keywords in your topic
                      </span>
                    </div>
                  </div>

                  {/* Keyword Suggestions - Main focus */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <h2 className="text-base font-bold font-dm-sans text-text-primary">
                      {isLoadingKeywords ? 'Generated Keywords' : generatedKeywords.length > 0 ? `${generatedKeywords.length} Keyword Suggestions Found` : 'Keyword Suggestions'}
                    </h2>
                    <p className="text-sm font-dm-sans text-text-secondary">
                      {isLoadingKeywords ? 'Our AI agent is analyzing...' : generatedKeywords.length > 0 ? 'Click keywords to add them to your list.' : 'Enter a topic above to generate keyword suggestions.'}
                    </p>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <KeywordList 
                      keywords={generatedKeywords}
                      groupedKeywords={groupedKeywords}
                      selectedKeywords={selectedKeywords}
                      onKeywordToggle={handleKeywordToggle}
                      isLoadingKeywords={isLoadingKeywords}
                      onAddToQuery={handleAddToQuery}
                      selectedOption={selectedOption}
                    />
                  </div>

                  {/* Selected Keywords - Custom Minimized View for Option 6 */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h3 className="text-base font-bold font-dm-sans text-text-primary">
                          Selected Keywords
                        </h3>
                        <span className={`text-sm font-dm-sans ${selectedKeywords.length >= 50 ? 'text-red-500' : 'text-text-primary'}`}>
                          {selectedKeywords.length} / 50
                        </span>
                      </div>
                      <button
                        onClick={() => setIsFocusMode(true)}
                        className="flex items-center gap-1 text-sm font-dm-sans text-primary-blue hover:text-primary-dark transition-colors"
                      >
                        {selectedKeywords.length > 0 ? 'View & Edit Manually' : 'Add Manually'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Keyword limit warning */}
                    {selectedKeywords.length >= 50 && (
                      <div className="flex items-center justify-between -mt-1">
                        <span className="text-xs text-text-secondary">
                          Keyword limit reached, you can remove keywords below to continue adding.
                        </span>
                      </div>
                    )}

                    {selectedKeywords.length > 0 ? (
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200 h-[100px] flex flex-col justify-center">
                        <p className="text-sm font-dm-sans text-text-secondary mb-2">
                          {selectedKeywords.length} of 50 keywords selected for your list
                        </p>
                        <DynamicKeywordDisplay selectedKeywords={selectedKeywords} />
                      </div>
                    ) : (
                      <div className="bg-[#f7f7f8] rounded border border-[#e6e9ec] p-4 h-[100px] flex flex-col items-center justify-center text-center">
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <h4 className="text-[16px] font-bold font-dm-sans text-[#092540] leading-[22px]">
                            Start adding keywords
                          </h4>
                          <p className="text-[12px] font-dm-sans text-[#6b7c8c] leading-[16px] w-[280px]">
                            Select keywords from the AI generated list above or click "Add Manually" on the right
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-white relative">
                  <div className="flex flex-col gap-[7px] items-end justify-start overflow-hidden px-6 py-4 w-full">
                    <div className="flex items-center justify-between w-full">
                      <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-[18px] text-sm font-medium font-dm-sans text-primary-blue hover:bg-blue-50 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleSaveAndAnalyze}
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
            )}
          </div>
        )}

        {/* Create Button (shown when panel is closed) */}
        {!isPanelOpen && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={handleOpenPanel}
              className="bg-primary-blue hover:bg-primary-dark text-white px-6 py-3 rounded-[18px] text-sm font-medium font-dm-sans shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Create a keyword list
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordListAgent; 