import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export class SentimentAnalysisService {
  static async analyzeInteraction(interactionText) {
    // Skip if no API key or in development without AI
    if (!process.env.REACT_APP_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY === 'development_mode_only') {
      return this.fallbackAnalysis(interactionText);
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `
        Analyze the sentiment of this customer interaction and return ONLY a JSON response with this exact structure:
        {
          "sentiment": "positive|negative|neutral",
          "score": 0.0-1.0,
          "keywords": ["array", "of", "key", "phrases"],
          "urgency": "low|medium|high",
          "summary": "brief summary of sentiment"
        }
        
        Interaction: "${interactionText}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.fallbackAnalysis(interactionText);
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return this.fallbackAnalysis(interactionText);
    }
  }

  static fallbackAnalysis(text) {
    // Simple rule-based fallback
    const positiveWords = ['great', 'good', 'excellent', 'thanks', 'happy', 'satisfied', 'awesome', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'angry', 'frustrated', 'disappointed', 'issue', 'problem', 'worst'];
    
    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });
    
    let sentiment = 'neutral';
    let score = 0.5;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      score = 0.6 + (positiveCount * 0.1);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      score = 0.4 - (negativeCount * 0.1);
    }
    
    return {
      sentiment,
      score: Math.max(0.1, Math.min(0.9, score)),
      keywords: this.extractKeywords(text),
      urgency: negativeCount > 2 ? 'high' : 'low',
      summary: `${sentiment} sentiment detected with ${positiveCount} positive and ${negativeCount} negative indicators`
    };
  }

  static extractKeywords(text) {
    const commonWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'have', 'was', 'were', 'from']);
    const words = text.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3 && !commonWords.has(word));
    
    // Get most frequent words
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }
}