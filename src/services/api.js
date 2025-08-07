const API_BASE_URL = 'https://shopper-agents-api.sandbox.similarweb.com/agent';

// Import compromise for NLP-based keyword extraction (removed - no longer used)

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
        agentId: 'f30f29fb-afb0-5f4a-8719-dcc0f4ee7585' // subtopics_agent ID
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
        // Handle new API response structure with clusters
        if (Array.isArray(data) && data.length > 0 && data[0].group_name) {
          // New clustered response format
          const allKeywords = [];
          const groupedKeywords = [];

          data.forEach(cluster => {
            const clusterKeywords = cluster.keywords.map(kw => 
              `${kw.keyword} (${kw.search_volume})`
            );
            
            // Add to flat keywords list
            allKeywords.push(...clusterKeywords);
            
            // Add to grouped keywords
            groupedKeywords.push({
              name: cluster.group_name,
              keywords: clusterKeywords
            });
          });

          return {
            success: true,
            keywords: allKeywords,
            groupedKeywords: groupedKeywords
          };
        } else {
          // Fallback to old format handling
          const keywords = Array.isArray(data) ? data : [];
          return {
            success: true,
            keywords: keywords,
            groupedKeywords: this.groupKeywords(keywords)
          };
        }
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

    // Parse keywords to extract search volumes
    const parsedKeywords = keywords.map(kw => {
      const match = kw.match(/^(.+?)\s*\((\d+)\)$/);
      return match ? {
        keyword: match[1].trim(),
        searchVolume: parseInt(match[2])
      } : {
        keyword: kw,
        searchVolume: 0
      };
    });

    // Group keywords by semantic similarity
    const clusters = this.createSemanticClusters(parsedKeywords);
    
    return clusters.map(cluster => ({
      name: cluster.name,
      keywords: cluster.keywords
        .sort((a, b) => b.searchVolume - a.searchVolume) // Sort by search volume descending
        .map(k => `${k.keyword} (${k.searchVolume})`)
    }));
  }

  createSemanticClusters(keywords) {
    const clusters = [];
    const usedKeywords = new Set();

    // Extract the main topic from keywords to create dynamic patterns
    const mainTopic = this.extractMainTopic(keywords);
    
    // Define semantic patterns for clustering - now dynamic based on topic
    const semanticPatterns = [
      {
        name: `General ${mainTopic}`,
        patterns: [mainTopic.toLowerCase()],
        priority: 1
      },
      {
        name: 'Cheap/Affordable Options',
        patterns: ['cheap', 'budget', 'affordable', 'inexpensive'],
        priority: 2
      },
      {
        name: 'Best/Top Rated',
        patterns: ['best', 'top', 'highest rated'],
        priority: 3
      },
      {
        name: 'Reviews & Ratings',
        patterns: ['review', 'rating', 'feedback'],
        priority: 4
      },
      {
        name: 'Use Cases',
        patterns: ['for ', 'use case', 'purpose'],
        priority: 5
      },
      {
        name: 'Features & Benefits',
        patterns: ['waterproof', 'wireless', 'bluetooth', 'noise cancelling', 'noise canceling', 'battery', 'long lasting'],
        priority: 6
      },
      {
        name: 'Comparisons',
        patterns: ['vs', 'versus', 'alternatives', 'competitors', 'similar'],
        priority: 7
      },
      {
        name: 'Shopping',
        patterns: ['price', 'cost', 'discount', 'sale', 'deal', 'buy', 'purchase'],
        priority: 8
      }
    ];

    // Sort patterns by priority
    semanticPatterns.sort((a, b) => a.priority - b.priority);

    // Create clusters based on patterns
    semanticPatterns.forEach(pattern => {
      const matchingKeywords = keywords.filter(kw => {
        if (usedKeywords.has(kw.keyword)) return false;
        return pattern.patterns.some(p => 
          kw.keyword.toLowerCase().includes(p.toLowerCase())
        );
      });

      if (matchingKeywords.length > 0) {
        clusters.push({
          name: pattern.name,
          keywords: matchingKeywords
        });
        matchingKeywords.forEach(kw => usedKeywords.add(kw.keyword));
      }
    });

    // Group remaining keywords by common themes
    const remainingKeywords = keywords.filter(kw => !usedKeywords.has(kw.keyword));
    if (remainingKeywords.length > 0) {
      const remainingClusters = this.groupRemainingKeywords(remainingKeywords);
      clusters.push(...remainingClusters);
    }

    return clusters;
  }

  extractMainTopic(keywords) {
    if (!keywords || keywords.length === 0) return 'Keywords';
    
    // Find the most common word or phrase that appears in multiple keywords
    const wordFrequency = {};
    
    keywords.forEach(kw => {
      const words = kw.keyword.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) { // Filter out very short words
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
      });
    });
    
    // Find the most frequent word that appears in at least 2 keywords
    const commonWords = Object.entries(wordFrequency)
      .filter(([word, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1]);
    
    if (commonWords.length > 0) {
      // Capitalize the first letter
      return commonWords[0][0].charAt(0).toUpperCase() + commonWords[0][0].slice(1);
    }
    
    // Fallback: use the first keyword as the topic
    return keywords[0].keyword.split(' ')[0].charAt(0).toUpperCase() + keywords[0].keyword.split(' ')[0].slice(1);
  }

  groupRemainingKeywords(keywords) {
    const clusters = [];
    
    // Group by common words
    const wordFrequency = {};
    keywords.forEach(kw => {
      const words = kw.keyword.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 3) { // Only consider words longer than 3 chars
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
      });
    });

    // Find most common words
    const commonWords = Object.entries(wordFrequency)
      .filter(([word, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    // Create clusters based on common words
    commonWords.forEach(word => {
      const matchingKeywords = keywords.filter(kw => 
        kw.keyword.toLowerCase().includes(word)
      );
      
      if (matchingKeywords.length > 1) {
        clusters.push({
          name: `${word.charAt(0).toUpperCase() + word.slice(1)} Related`,
          keywords: matchingKeywords
        });
      }
    });

    // Group remaining keywords
    const usedInClusters = new Set();
    clusters.forEach(cluster => {
      cluster.keywords.forEach(kw => usedInClusters.add(kw.keyword));
    });

    const finalRemaining = keywords.filter(kw => !usedInClusters.has(kw.keyword));
    if (finalRemaining.length > 0) {
      clusters.push({
        name: 'Other Keywords',
        keywords: finalRemaining
      });
    }

    return clusters;
  }


}

const apiService = new ApiService();
export default apiService; 