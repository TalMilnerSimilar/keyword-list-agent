const API_BASE_URL = 'https://shopper-agents-api.sandbox.similarweb.com/agent';

// Import compromise for NLP-based keyword extraction
let nlp;
try {
  nlp = require('compromise');
} catch (error) {
  console.warn('Compromise library not available, using fallback naming');
}

class ApiService {
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async loadAvailableAgents() {
    try {
      const response = await fetch(`${API_BASE_URL}/available-agents`);
      if (response.ok) {
        const data = await response.json();
        return data.success && data.data ? data.data : [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load agents:', error);
      return [];
    }
  }

  async generateKeywords(topic, agentId = null) {
    try {
      const requestBody = { 
        topic, 
        domain: 'amazon.com',
        agentId: 'ddc14fc3-3351-462d-b7e3-9da802fa87e1' // Guy's Assistant ID
      };

      const response = await fetch(`${API_BASE_URL}/invoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        const keywords = Array.isArray(data) ? data : [];
        return {
          success: true,
          keywords: keywords,
          groupedKeywords: this.groupKeywords(keywords)
        };
      } else {
        return {
          success: false,
          error: data.message || 'Failed to generate keywords'
        };
      }
    } catch (error) {
      console.error('Failed to generate keywords:', error);
      
      // Check if it's a connection error
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return {
          success: false,
          error: 'API server is not running. Please start the server at localhost:8897'
        };
      }
      
      return {
        success: false,
        error: 'Network error: ' + error.message
      };
    }
  }

  groupKeywords(keywords) {
    if (!keywords || keywords.length === 0) return [];

    const grouped = [];
    
    for (let i = 0; i < keywords.length; i += 8) {
      const groupKeywords = keywords.slice(i, i + 8);
      const groupName = this.analyzeAndNameGroup(groupKeywords);
      
      grouped.push({
        name: groupName,
        keywords: groupKeywords
      });
    }

    return grouped;
  }

  analyzeAndNameGroup(keywords) {
    if (!keywords || keywords.length === 0) return 'Other';

    // Use compromise NLP library for intelligent keyword extraction
    if (nlp) {
      try {
        // Join all keywords into one piece of text
        const clusterText = keywords.join(" ");
        
        // Use compromise to extract nouns as possible keywords
        let doc = nlp(clusterText);
        const nouns = doc.nouns().out('array');
        
        // Get frequency count
        const freq = {};
        nouns.forEach(noun => {
          const cleanNoun = noun.toLowerCase().trim();
          if (cleanNoun.length > 2) { // Filter out very short words
            freq[cleanNoun] = (freq[cleanNoun] || 0) + 1;
          }
        });
        
        // Sort keywords by frequency
        const keywords = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
        
        // Name is top 2-3 keywords joined by space, capitalized
        const name = keywords.slice(0, 3)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        
        return name || "Keywords";
      } catch (error) {
        console.warn('Error in NLP analysis:', error);
        return this.fallbackNaming(keywords);
      }
    } else {
      // Fallback to pattern-based naming if compromise is not available
      return this.fallbackNaming(keywords);
    }
  }

  fallbackNaming(keywords) {
    if (!keywords || keywords.length === 0) return 'Other';

    // Convert keywords to lowercase for analysis
    const lowerKeywords = keywords.map(k => k.toLowerCase());
    
    // Define patterns for different categories
    const patterns = {
      'Product Types': [
        'wireless', 'bluetooth', 'wired', 'over-ear', 'on-ear', 'in-ear', 'open-back', 'closed-back',
        'noise cancelling', 'noise canceling', 'active noise', 'passive noise', 'studio', 'gaming',
        'sport', 'waterproof', 'water-resistant', 'portable', 'compact', 'premium', 'budget', 'cheap'
      ],
      'Features & Benefits': [
        'noise cancelling', 'noise canceling', 'waterproof', 'water-resistant', 'wireless', 'bluetooth',
        'long battery', 'fast charging', 'comfortable', 'lightweight', 'durable', 'high quality',
        'premium', 'budget', 'cheap', 'inexpensive', 'hifi', 'studio quality', 'crystal clear',
        'deep bass', 'balanced sound', 'surround sound', 'spatial audio'
      ],
      'Use Cases': [
        'for gaming', 'for work', 'for travel', 'for exercise', 'for music', 'for calls',
        'for streaming', 'for recording', 'for studio', 'for office', 'for home', 'for outdoor',
        'for sports', 'for kids', 'for professional', 'for casual', 'for daily use'
      ],
      'Comparisons': [
        'vs', 'versus', 'alternatives', 'competitors', 'similar', 'compare', 'comparison',
        'better than', 'best', 'top', 'leading', 'popular', 'trending'
      ],
      'Reviews & Ratings': [
        'review', 'reviews', 'rating', 'ratings', 'customer', 'user', 'feedback', 'testimonial',
        'pros', 'cons', 'complaint', 'problem', 'issue', 'experience', 'opinion', 'recommendation'
      ],
      'Shopping': [
        'price', 'cost', 'discount', 'sale', 'deal', 'offer', 'buy', 'purchase', 'shop',
        'store', 'amazon', 'ebay', 'walmart', 'target', 'best buy', 'cheap', 'affordable'
      ],
      'Technical': [
        'specification', 'specs', 'technical', 'details', 'features', 'specs sheet',
        'frequency', 'impedance', 'sensitivity', 'driver', 'cable', 'connector', 'jack',
        'usb', 'type-c', 'lightning', 'bluetooth version', 'codec', 'aptx', 'ldac'
      ],
      'Brands & Models': [
        'sony', 'bose', 'sennheiser', 'audio-technica', 'beyerdynamic', 'akg', 'shure',
        'jbl', 'beats', 'airpods', 'airpods pro', 'airpods max', 'wh-1000xm', 'qc35',
        'hd', 'dt', 'k', 'mdr', 'wf', 'wh', 'qc', 'quietcomfort', 'momentum'
      ],
      'Accessories': [
        'case', 'stand', 'mount', 'adapter', 'cable', 'wire', 'connector', 'jack',
        'dongle', 'receiver', 'transmitter', 'charger', 'charging', 'carrying',
        'protective', 'cover', 'skin', 'grip', 'holder', 'organizer'
      ]
    };

    // Count matches for each category
    const categoryScores = {};
    
    Object.keys(patterns).forEach(category => {
      categoryScores[category] = 0;
      patterns[category].forEach(pattern => {
        lowerKeywords.forEach(keyword => {
          if (keyword.includes(pattern)) {
            categoryScores[category]++;
          }
        });
      });
    });

    // Find the category with the highest score
    let bestCategory = 'Other';
    let bestScore = 0;

    Object.keys(categoryScores).forEach(category => {
      if (categoryScores[category] > bestScore) {
        bestScore = categoryScores[category];
        bestCategory = category;
      }
    });

    // If no strong pattern is found, try to infer from keywords
    if (bestScore === 0) {
      // Check for specific keywords that might indicate category
      const allKeywords = lowerKeywords.join(' ');
      
      if (allKeywords.includes('vs') || allKeywords.includes('versus') || allKeywords.includes('compare')) {
        return 'Comparisons';
      } else if (allKeywords.includes('review') || allKeywords.includes('rating') || allKeywords.includes('feedback')) {
        return 'Reviews & Ratings';
      } else if (allKeywords.includes('price') || allKeywords.includes('cost') || allKeywords.includes('sale')) {
        return 'Shopping';
      } else if (allKeywords.includes('spec') || allKeywords.includes('technical') || allKeywords.includes('detail')) {
        return 'Technical';
      } else if (allKeywords.includes('for ') || allKeywords.includes('use case')) {
        return 'Use Cases';
      } else {
        return 'Product Types'; // Default fallback
      }
    }

    return bestCategory;
  }
}

export default new ApiService(); 