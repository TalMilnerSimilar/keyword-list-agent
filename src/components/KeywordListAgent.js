import React, { useState, useEffect, useRef } from 'react';
import KeywordList from './KeywordList';
import KeywordDetails from './KeywordDetails';
import apiService from '../services/api';

const KeywordListAgent = () => {
                const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [isCreateWithAI, setIsCreateWithAI] = useState(true);
  const [topic, setTopic] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false); // Left panel visibility
  const [generatedKeywords, setGeneratedKeywords] = useState([]); // Store generated keywords
  const [groupedKeywords, setGroupedKeywords] = useState(null); // Store grouped keywords
  
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
    if (!topic.trim()) {
      setApiError('Please enter a topic');
      return;
    }

    // Open both panels immediately and show loading state
    console.log('Opening panels and starting loading...');
    setIsPanelOpen(true);
    setIsLeftPanelOpen(true);
    setIsLoadingKeywords(true);
    setApiError(null);

    try {
      const result = await apiService.generateKeywords(topic.trim());
      
      if (result.success) {
        setGeneratedKeywords(result.keywords);
        setGroupedKeywords(result.groupedKeywords);
        setTopic(topic.trim());
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

  return (
    <div className="flex h-screen bg-cover bg-center bg-no-repeat relative" 
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')" }}>
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-text-primary bg-opacity-80"></div>
      
      {/* Main content */}
      <div className="relative flex w-full">
        {/* Secondary panel - Generated Keywords (slides in from right, positioned to left of main panel) */}
        <div 
          ref={generatedKeywordsRef}
          className={`fixed top-0 h-screen w-[500px] bg-background-secondary flex flex-col transform transition-all duration-300 ease-in-out ${
            isLeftPanelOpen || isLoadingKeywords ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible'
          }`} 
          style={{ right: '500px', zIndex: 10 }}
        >
            {/* Header */}
            <div className="flex items-center gap-4 px-8 pt-8 pb-4 flex-shrink-0 border-b border-[#E6E9EC]" style={{ height: '89px', paddingTop: '32px', paddingBottom: '16px' }}>
              <div className="w-9 h-9">
                <img src="/assets/agents-logo.svg" alt="Agents Logo" className="w-full h-full" />
              </div>
              <h1 className="text-2xl font-dm-sans text-text-primary">Keyword List Agent</h1>
            </div>

            {/* Content */}
            <div className="flex-1 px-10 pt-4 flex flex-col gap-4 overflow-hidden">
              <div className="flex flex-col gap-1 flex-shrink-0">
                <h2 className="text-base font-bold font-dm-sans text-text-primary">
                  {isLoadingKeywords ? 'Generated Keywords' : `${generatedKeywords.length} Keyword Suggestions Found`}
                </h2>
                <p className="text-sm font-dm-sans text-text-secondary">
                  {isLoadingKeywords 
                    ? 'Our AI agent is analyzing your topic and creating relevant keywords.'
                    : 'These keywords were generated by our AI agent based on your query. Select the ones you want to add to your list.'
                  }
                </p>
              </div>

              <KeywordList 
                keywords={generatedKeywords}
                groupedKeywords={groupedKeywords}
                selectedKeywords={selectedKeywords}
                onKeywordToggle={handleKeywordToggle}
                isLoadingKeywords={isLoadingKeywords}
              />
            </div>
          </div>

        {/* Main panel - Keyword Details (Slide in from right) */}
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
                           if (!selectedKeywords.includes(keyword)) {
                             setSelectedKeywords(prev => [...prev, keyword]);
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
                         onGenerationComplete={() => {
                           // This will be called when generation is complete
                         }}
                       />
        </div>

        {/* Create Button (shown when panel is closed) */}
        {!isPanelOpen && (
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
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