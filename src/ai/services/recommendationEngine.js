import { ChurnPredictionService } from './churnPrediction';

export class RecommendationEngine {
  static getInteractionRecommendations(customer, interactions = []) {
    const recommendations = [];
    
    // Based on churn risk
    const churnData = ChurnPredictionService.predictChurnRisk(customer, interactions);
    if (churnData.riskLevel === 'high') {
      recommendations.push({
        type: 'urgent',
        title: 'High Churn Risk Detected',
        message: `Customer has ${churnData.riskScore}% churn risk due to ${churnData.factors.join(', ')}`,
        action: 'Schedule urgent call with account manager',
        priority: 1
      });
    }
    
    // Based on recent sentiment
    const recentInteractions = interactions.slice(0, 5);
    const negativeCount = recentInteractions.filter(i => 
      i.sentiment === 'negative' || i.sentiment_score < 0.4
    ).length;
    
    if (negativeCount >= 2) {
      recommendations.push({
        type: 'support',
        title: 'Customer Needs Support',
        message: 'Multiple negative interactions detected recently',
        action: 'Offer proactive support and check satisfaction',
        priority: 2
      });
    }
    
    // Based on engagement level
    const daysSinceLastContact = this.getDaysSinceLastInteraction(interactions);
    if (daysSinceLastContact > 60) {
      recommendations.push({
        type: 'engagement',
        title: 'Re-engage Customer',
        message: 'No interactions for over 60 days',
        action: 'Send personalized check-in email',
        priority: 2
      });
    } else if (daysSinceLastContact > 30) {
      recommendations.push({
        type: 'engagement',
        title: 'Maintain Engagement',
        message: 'Limited recent engagement',
        action: 'Schedule follow-up call',
        priority: 3
      });
    }
    
    // Based on customer value and recent activity
    if ((customer.total_purchase_value > 5000 || customer.company_size === 'Enterprise') && daysSinceLastContact < 14) {
      recommendations.push({
        type: 'upsell',
        title: 'Upsell Opportunity',
        message: 'High-value customer recently engaged',
        action: 'Schedule strategic account review',
        priority: 2
      });
    }
    
    // New customer onboarding
    const customerAgeDays = (new Date() - new Date(customer.created_at)) / (1000 * 60 * 60 * 24);
    if (customerAgeDays < 30 && interactions.length < 3) {
      recommendations.push({
        type: 'onboarding',
        title: 'New Customer Onboarding',
        message: 'Customer recently onboarded - ensure smooth transition',
        action: 'Schedule onboarding check-in',
        priority: 2
      });
    }
    
    return recommendations.sort((a, b) => a.priority - b.priority);
  }
  
  static getDaysSinceLastInteraction(interactions) {
    if (!interactions.length) return 999;
    const lastInteraction = new Date(Math.max(...interactions.map(i => new Date(i.created_at))));
    return Math.floor((new Date() - lastInteraction) / (1000 * 60 * 60 * 24));
  }
}