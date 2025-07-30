import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

const KeywordList = ({ keywords = [], groupedKeywords = null, selectedKeywords, onKeywordToggle, isLoadingKeywords = false }) => {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(null);

  useLayoutEffect(() => {
    const updateHeight = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const available = window.innerHeight - 24; // 24px from bottom viewport
        const calculated = available - rect.top;
        setMaxHeight(calculated > 0 ? calculated : available);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Monitor size changes of the keyword list container
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('KeywordList container size changed:', {
          width: Math.round(width),
          height: Math.round(height),
          keywordsCount: keywords.length,
          selectedCount: selectedKeywords.length,
          timestamp: new Date().toISOString()
        });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [keywords.length, selectedKeywords.length]);

  // Monitor size changes of the content area
  useEffect(() => {
    if (!contentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('KeywordList content area size changed:', {
          width: Math.round(width),
          height: Math.round(height),
          keywordsCount: keywords.length,
          selectedCount: selectedKeywords.length,
          timestamp: new Date().toISOString()
        });
      }
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [keywords.length, selectedKeywords.length]);

  // Helper functions for checkbox logic
  const getLeafKeywords = (item) => {
    if (!item.children || item.children.length === 0) {
      return [item];
    }
    return item.children.flatMap(getLeafKeywords);
  };

  const areAllLeavesSelected = (item) => {
    const leaves = getLeafKeywords(item);
    return leaves.every(leaf => selectedKeywords.includes(leaf.name));
  };

  const areSomeLeavesSelected = (item) => {
    const leaves = getLeafKeywords(item);
    return leaves.some(leaf => selectedKeywords.includes(leaf.name));
  };

  const isCheckboxDisabled = (item) => {
    // If already selected, can always unselect
    if (selectedKeywords.includes(item.name)) {
      return false;
    }
    
    // For groups, check if any of their children are selected (intermediate state)
    if (item.children && item.children.length > 0) {
      const leaves = getLeafKeywords(item);
      const someSelected = leaves.some(leaf => selectedKeywords.includes(leaf.name));
      if (someSelected) {
        return false; // Can always unselect intermediate state
      }
    }
    
    // Check if we're at the 50 keyword limit
    if (selectedKeywords.length >= 50) {
      return true;
    }
    
    return false;
  };

  const handleToggle = (itemId) => {
    const item = findItemById(keywordData, itemId);
    if (!item) return;

    if (item.children && item.children.length > 0) {
      // Parent item - toggle all children
      const leaves = getLeafKeywords(item);
      const allSelected = areAllLeavesSelected(item);
      const someSelected = areSomeLeavesSelected(item);
      
      if (allSelected) {
        // Unselect all
        leaves.forEach(leaf => {
          if (selectedKeywords.includes(leaf.name)) {
            onKeywordToggle(leaf.name);
          }
        });
      } else if (someSelected) {
        // Intermediate state - unselect all
        leaves.forEach(leaf => {
          if (selectedKeywords.includes(leaf.name)) {
            onKeywordToggle(leaf.name);
          }
        });
      } else {
        // Select all - but respect 50 keyword limit
        const currentSelectedCount = selectedKeywords.length;
        const availableSlots = 50 - currentSelectedCount;
        
        if (availableSlots <= 0) {
          // Already at limit, can't add more
          return;
        }
        
        // Add keywords in order until we reach the limit
        let addedCount = 0;
        leaves.forEach(leaf => {
          if (!selectedKeywords.includes(leaf.name) && addedCount < availableSlots) {
            onKeywordToggle(leaf.name);
            addedCount++;
          }
        });
      }
    } else {
      // Leaf item - toggle itself
      if (selectedKeywords.includes(item.name)) {
        // Unselecting - always allowed
        onKeywordToggle(item.name);
      } else {
        // Selecting - check if we're at the limit
        if (selectedKeywords.length >= 50) {
          // At limit, can't add more
          return;
        }
        onKeywordToggle(item.name);
      }
    }
  };

  const findItemById = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleToggleExpand = (itemId) => {
    const item = findItemById(keywordData, itemId);
    if (item) {
      item.isExpanded = !item.isExpanded;
      // Force re-render by updating the state
      setKeywordData([...keywordData]);
    }
  };

  // Create keyword data structure
  const createKeywordData = () => {
    if (groupedKeywords && groupedKeywords.length > 0) {
      // Use grouped keywords from API
      return [
        {
          id: 'all',
          name: 'Select All Keywords',
          count: keywords.length,
          isParent: true,
          isExpanded: true,
          children: groupedKeywords.map((group, groupIndex) => {
            const children = group.keywords.map((keyword, keywordIndex) => ({
              id: `group-${groupIndex}-keyword-${keywordIndex}`,
              name: keyword,
              count: 1,
              isParent: false,
              isExpanded: false,
              children: []
            }));

            return {
              id: `group-${groupIndex}`,
              name: group.name,
              count: children.length,
              isParent: true,
              isExpanded: false,
              children
            };
          })
        }
      ];
    } else if (keywords.length > 0) {
      // Fallback to original logic for flat array
      return [
        {
          id: 'all',
          name: 'Select All Keywords',
          count: keywords.length,
          isParent: true,
          isExpanded: true,
          children: [
            {
              id: 'product-types',
              name: 'Product Types',
              count: keywords.slice(0, Math.min(8, keywords.length)).length,
              isParent: true,
              isExpanded: false,
              children: keywords.slice(0, Math.min(8, keywords.length)).map((keyword, index) => ({
                id: `product-${index}`,
                name: keyword,
                count: 1,
                isParent: false,
                isExpanded: false,
                children: []
              }))
            },
            {
              id: 'features-benefits',
              name: 'Features & Benefits',
              count: keywords.slice(8, Math.min(16, keywords.length)).length,
              isParent: true,
              isExpanded: false,
              children: keywords.slice(8, Math.min(16, keywords.length)).map((keyword, index) => ({
                id: `feature-${index}`,
                name: keyword,
                count: 1,
                isParent: false,
                isExpanded: false,
                children: []
              }))
            },
            {
              id: 'use-cases',
              name: 'Use Cases',
              count: keywords.slice(16, Math.min(24, keywords.length)).length,
              isParent: true,
              isExpanded: false,
              children: keywords.slice(16, Math.min(24, keywords.length)).map((keyword, index) => ({
                id: `use-${index}`,
                name: keyword,
                count: 1,
                isParent: false,
                isExpanded: false,
                children: []
              }))
            },
            {
              id: 'comparisons',
              name: 'Comparisons',
              count: keywords.slice(24, Math.min(32, keywords.length)).length,
              isParent: true,
              isExpanded: false,
              children: keywords.slice(24, Math.min(32, keywords.length)).map((keyword, index) => ({
                id: `compare-${index}`,
                name: keyword,
                count: 1,
                isParent: false,
                isExpanded: false,
                children: []
              }))
            },
            {
              id: 'reviews-ratings',
              name: 'Reviews & Ratings',
              count: keywords.slice(32, Math.min(40, keywords.length)).length,
              isParent: true,
              isExpanded: false,
              children: keywords.slice(32, Math.min(40, keywords.length)).map((keyword, index) => ({
                id: `review-${index}`,
                name: keyword,
                count: 1,
                isParent: false,
                isExpanded: false,
                children: []
              }))
            },
            {
              id: 'shopping',
              name: 'Shopping',
              count: keywords.slice(40, Math.min(48, keywords.length)).length,
              isParent: true,
              isExpanded: false,
              children: keywords.slice(40, Math.min(48, keywords.length)).map((keyword, index) => ({
                id: `shop-${index}`,
                name: keyword,
                count: 1,
                isParent: false,
                isExpanded: false,
                children: []
              }))
            },
            {
              id: 'technical',
              name: 'Technical',
              count: keywords.slice(48, Math.min(50, keywords.length)).length,
              isParent: true,
              isExpanded: false,
              children: keywords.slice(48, Math.min(50, keywords.length)).map((keyword, index) => ({
                id: `tech-${index}`,
                name: keyword,
                count: 1,
                isParent: false,
                isExpanded: false,
                children: []
              }))
            }
          ]
        }
      ];
    } else {
      return [
        {
          id: 'all',
          name: 'All Keywords',
          count: 50,
          isParent: true,
          isExpanded: true,
          children: [
            {
              id: 'notebooks',
              name: 'Notebooks',
              count: 10,
              isParent: true,
              isExpanded: false,
              children: [
                { id: 'notebook1', name: '3 subject notebook college ruled' },
                { id: 'notebook2', name: 'campus notebook binder' },
                { id: 'notebook3', name: 'kokuyo campus notebook binder' },
                { id: 'notebook4', name: 'notebook bulk' },
                { id: 'notebook5', name: 'notebook wide ruled' },
                { id: 'notebook6', name: '3 subject notebook college ruled' },
                { id: 'notebook7', name: 'campus notebook binder' },
                { id: 'notebook8', name: 'campus binder' },
                { id: 'notebook9', name: 'notebook binder' },
                { id: 'notebook10', name: 'campus notebook' },
              ]
            },
            {
              id: 'home-decor',
              name: 'home decor',
              count: 7,
              isParent: true,
              isExpanded: false,
              children: []
            },
            {
              id: 'kids-piano',
              name: 'Kids Piano',
              count: 49,
              isParent: true,
              isExpanded: false,
              children: []
            },
            {
              id: 'gift-card',
              name: 'gift card 10 dollars',
              count: 22,
              isParent: true,
              isExpanded: false,
              children: []
            },
            {
              id: 'another-list',
              name: 'another list',
              count: 18,
              isParent: true,
              isExpanded: false,
              children: [
                { id: 'another-keyword', name: 'another keyword' }
              ]
            }
          ]
        }
      ];
    }
  };

  const [keywordData, setKeywordData] = useState(createKeywordData());

  // Update keywordData when keywords or groupedKeywords props change
  useEffect(() => {
    setKeywordData(createKeywordData());
  }, [keywords, groupedKeywords]);

  const renderKeywordItem = (item, level = 0, isLast = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = item.isExpanded;
    
    // Determine checkbox state
    let checkboxState = 'off';
    if (item.children && item.children.length > 0) {
      // Parent item
      if (areAllLeavesSelected(item)) {
        checkboxState = 'on';
      } else if (areSomeLeavesSelected(item)) {
        checkboxState = 'intermediate';
      }
    } else {
      // Leaf item
      if (selectedKeywords.includes(item.name)) {
        checkboxState = 'on';
      }
    }

    return (
      <div key={item.id} className={`w-full relative ${level === 2 ? 'group' : ''}`}>
        <div className="flex items-center h-10 px-4">
          {/* Level 1 (All Keywords) - No indent, no expand icon */}
          {level === 0 && (
            <div className="flex items-center gap-1 flex-1">
              <div className={`w-6 h-6 relative peer ${isCheckboxDisabled(item) ? 'cursor-not-allowed' : 'cursor-pointer'}" title={isCheckboxDisabled(item) ? 'Keyword limit reached, you can remove keywords to continue adding' : ''}`} onClick={() => handleToggle(item.id)}>
                <div className={`absolute inset-[12.5%] rounded-sm ${
                  checkboxState === 'on' 
                    ? 'bg-[#3e74fe] flex items-center justify-center' 
                    : checkboxState === 'intermediate'
                    ? 'bg-[#3e74fe]'
                    : isCheckboxDisabled(item)
                    ? 'border border-gray-300 bg-gray-100'
                    : 'border border-[#b6bec6]'
                }`}>
                  {checkboxState === 'on' && (
                    <svg viewBox="0 0 16 16" className="w-full h-full fill-current text-white">
                      <path d="M6.173 12.067L2.4 8.293l1.414-1.414 2.36 2.36 6.014-6.014 1.414 1.414-7.028 7.028z" />
                    </svg>
                  )}
                  {checkboxState === 'intermediate' && (
                    <div className="absolute bg-white bottom-[45.833%] left-[20.833%] right-[20.833%] rounded-[1px] top-[45.833%]"></div>
                  )}
                              </div>
              {isCheckboxDisabled(item) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden peer-hover:block whitespace-nowrap z-50">
                  <div className="bg-[#092540] text-white text-xs font-dm-sans rounded py-1 px-2">
                    Keyword limit reached, you can remove keywords to continue adding
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-[#092540]"></div>
                </div>
              )}
              </div>
              <span className={`text-sm font-dm-sans leading-[20px] ${isCheckboxDisabled(item) ? 'text-gray-400' : 'text-text-primary'}`}>
                {item.name}
              </span>
              <span className={`text-sm font-dm-sans leading-[20px] ${isCheckboxDisabled(item) ? 'text-gray-400' : 'text-text-tertiary'}`}>
                ({item.count})
              </span>
            </div>
          )}

          {/* Level 2 (Groups) - Expand icon, no indent */}
          {level === 1 && (
            <>
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center cursor-pointer" onClick={() => handleToggleExpand(item.id)}>
                <svg 
                  className={`w-4 h-4 text-text-tertiary transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex items-center gap-1 flex-1">
                <div className={`w-6 h-6 relative peer ${isCheckboxDisabled(item) ? 'cursor-not-allowed' : 'cursor-pointer'}" title={isCheckboxDisabled(item) ? 'Keyword limit reached, you can remove keywords to continue adding' : ''}`} onClick={() => handleToggle(item.id)}>
                  <div className={`absolute inset-[12.5%] rounded-sm ${
                    checkboxState === 'on' 
                      ? 'bg-[#3e74fe] flex items-center justify-center' 
                      : checkboxState === 'intermediate'
                      ? 'bg-[#3e74fe]'
                      : isCheckboxDisabled(item)
                      ? 'border border-gray-300 bg-gray-100'
                      : 'border border-[#b6bec6]'
                  }`}>
                    {checkboxState === 'on' && (
                      <svg viewBox="0 0 16 16" className="w-full h-full fill-current text-white">
                        <path d="M6.173 12.067L2.4 8.293l1.414-1.414 2.36 2.36 6.014-6.014 1.414 1.414-7.028 7.028z" />
                      </svg>
                    )}
                    {checkboxState === 'intermediate' && (
                      <div className="absolute bg-white bottom-[45.833%] left-[20.833%] right-[20.833%] rounded-[1px] top-[45.833%]"></div>
                    )}
                  </div>
                </div>
                <span className={`text-sm font-dm-sans leading-[20px] ${isCheckboxDisabled(item) ? 'text-gray-400' : 'text-text-primary'}`}>
                  {item.name}
                </span>
                <span className={`text-sm font-dm-sans leading-[20px] ${isCheckboxDisabled(item) ? 'text-gray-400' : 'text-text-tertiary'}`}>
                  ({item.count})
                </span>
              </div>
            </>
          )}

          {/* Level 3 (Specific Keywords) - Indent lines, no expand icon */}
          {level === 2 && (
            <>
              <div className="w-6 h-10 flex-shrink-0"></div>
              <div className="relative w-10 h-10 flex-shrink-0">
                <div 
                  className="absolute bg-[#e6e9ec] w-0.5 translate-x-[-50%]"
                  style={{ 
                    left: 'calc(50% + 1px)',
                    height: isLast ? '30px' : '40px',
                    top: isLast ? '0' : '0'
                  }}
                ></div>
              </div>
              <div className="flex items-center gap-1 flex-1">
                <div className={`w-6 h-6 relative peer ${isCheckboxDisabled(item) ? 'cursor-not-allowed' : 'cursor-pointer'}" title={isCheckboxDisabled(item) ? 'Keyword limit reached, you can remove keywords to continue adding' : ''}`} onClick={() => handleToggle(item.id)}>
                  <div className={`absolute inset-[12.5%] rounded-sm ${
                    checkboxState === 'on' 
                      ? 'bg-[#3e74fe] flex items-center justify-center' 
                      : checkboxState === 'intermediate'
                      ? 'bg-[#3e74fe]'
                      : isCheckboxDisabled(item)
                      ? 'border border-gray-300 bg-gray-100'
                      : 'border border-[#b6bec6]'
                  }`}>
                    {checkboxState === 'on' && (
                      <svg viewBox="0 0 16 16" className="w-full h-full fill-current text-white">
                        <path d="M6.173 12.067L2.4 8.293l1.414-1.414 2.36 2.36 6.014-6.014 1.414 1.414-7.028 7.028z" />
                      </svg>
                    )}
                    {checkboxState === 'intermediate' && (
                      <div className="absolute bg-white bottom-[45.833%] left-[20.833%] right-[20.833%] rounded-[1px] top-[45.833%]"></div>
                    )}
                                  </div>
                {isCheckboxDisabled(item) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden peer-hover:block whitespace-nowrap z-50">
                    <div className="bg-[#092540] text-white text-xs font-dm-sans rounded py-1 px-2">
                      Keyword limit reached, you can remove keywords to continue adding
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-[#092540]"></div>
                  </div>
                )}
                </div>
                {(() => {
                  const match = item.name.match(/^(.*)\s+\((\d+(?:,\d+)*)\)$/);
                  if (match) {
                    const keywordLabel = match[1].trim();
                    const rawVol = parseInt(match[2].replace(/,/g, ''), 10);
                    const formatVolume = (n) => {
                      if (n >= 1_000_000) {
                        const v = n / 1_000_000;
                        const str = v % 1 === 0 ? `${v}` : v.toFixed(1);
                        return `${str.replace(/\.0$/, '')}M`;
                      }
                      if (n >= 1_000) {
                        const v = n / 1_000;
                        const str = v % 1 === 0 ? `${v}` : v.toFixed(1);
                        return `${str.replace(/\.0$/, '')}K`;
                      }
                      return n.toString();
                    };
                    const volume = formatVolume(rawVol);
                    return (
                      <>
                        <span className={`text-sm font-dm-sans leading-[20px] ${isCheckboxDisabled(item) ? 'text-gray-400' : 'text-text-primary'}`}>{keywordLabel}</span>
                        <div className="relative ml-auto">
                          <span 
                            className="text-sm font-dm-sans leading-[20px] text-text-tertiary cursor-pointer hover:bg-gray-100 px-1 rounded"
                            onMouseEnter={(e) => {
                              const tooltip = e.target.nextElementSibling;
                              if (tooltip) tooltip.style.display = 'block';
                            }}
                            onMouseLeave={(e) => {
                              const tooltip = e.target.nextElementSibling;
                              if (tooltip) tooltip.style.display = 'none';
                            }}
                          >
                            {volume}
                          </span>
                          <div className="absolute bottom-full right-0 mb-2 hidden whitespace-nowrap z-50">
                            <div className="bg-[#092540] text-white text-xs font-dm-sans rounded py-2 pl-4 pr-2">
                              Search volume of this keyword
                            </div>
                            <div 
                              className="absolute right-2"
                              style={{
                                width: 0,
                                height: 0,
                                borderLeft: '6px solid transparent',
                                borderRight: '6px solid transparent',
                                borderTop: '6px solid #092540',
                              }}
                            />
                          </div>
                        </div>
                      </>
                    );
                  }
                  return (
                    <span className={`text-sm font-dm-sans leading-[20px] ${isCheckboxDisabled(item) ? 'text-gray-400' : 'text-text-primary'}`}>{item.name}</span>
                  );
                })()}
              </div>
              {/* Hover action button removed as per request */}
            </>
          )}
        </div>

        {/* Render children */}
        {hasChildren && isExpanded && (
          <div>
            {item.children.map((child, index) => 
              renderKeywordItem(
                child, 
                level + 1, 
                index === item.children.length - 1
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
             <div 
         ref={wrapperRef}
         className="relative flex-1 rounded-lg p-[1px] bg-gradient-to-r from-blue-400 to-green-400" style={{ maxHeight: maxHeight ? `${maxHeight}px` : 'auto' }}
      >
          <div
            ref={containerRef}
            className="flex flex-col bg-white rounded-lg relative h-full w-full"
            style={{ overflow: 'hidden', maxHeight: maxHeight ? `${maxHeight}px` : 'auto' }}
          >
              <div ref={contentRef} className="overflow-y-auto px-0 pt-4 pb-6 flex-1">
                  {isLoadingKeywords ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col items-center gap-4">
                        <img src="loader.gif" alt="Loading" style={{ width: '200px', height: '200px' }} />
                        <div className="text-center">
                          <h3 className="text-base font-bold font-dm-sans text-[#092540] leading-[22px] mb-2">
                            Generating Keywords...
                          </h3>
                          <p className="text-xs font-dm-sans text-[#6b7c8c] leading-[16px] w-[280px]">
                            Please wait while we create your keyword suggestions.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                        {keywordData.map((item) => renderKeywordItem(item))}
                    </div>
                  )}
              </div>
          </div>
      </div>

    </>
  );
};

export default KeywordList; 