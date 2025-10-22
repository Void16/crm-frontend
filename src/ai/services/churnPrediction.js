export class ChurnPredictionService {
  static predictChurnRisk(customer, interactions = []) {
    let riskScore = 0;
    
    // Engagement metrics (40% of risk)
    const daysSinceLastInteraction = this.getDaysSinceLastInteraction(interactions);
    if (daysSinceLastInteraction > 90) riskScore += 40;
    else if (daysSinceLastInteraction > 60) riskScore += 25;
    else if (daysSinceLastInteraction > 30) riskScore += 15;
    
    // Support interactions (25% of risk)
    const negativeInteractions = interactions.filter(i => 
      i.sentiment === 'negative' || i.sentiment_score < 0.4
    ).length;
    riskScore += Math.min(negativeInteractions * 8, 20);
    
    // Payment history (20% of risk)
    if (customer.payment_delinquent) riskScore += 20;
    if (customer.subscription_ending_soon) riskScore += 10;
    
    // Product usage (15% of risk)
    if (customer.feature_usage_rate < 0.2) riskScore += 15;
    else if (customer.feature_usage_rate < 0.5) riskScore += 8;
    
    return {
      riskScore: Math.min(100, riskScore),
      riskLevel: this.getRiskLevel(riskScore),
      factors: this.getRiskFactors(customer, interactions, riskScore),
      recommendation: this.getChurnPreventionRecommendation(riskScore)
    };
  }

  static getRiskLevel(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  static getRiskFactors(customer, interactions, riskScore) {
    const factors = [];
    
    const daysSinceLastInteraction = this.getDaysSinceLastInteraction(interactions);
    if (daysSinceLastInteraction > 60) {
      factors.push('No recent engagement (>60 days)');
    } else if (daysSinceLastInteraction > 30) {
      factors.push('Low recent engagement (>30 days)');
    }
    
    if (customer.payment_delinquent) {
      factors.push('Payment issues detected');
    }
    
    const negativeInteractions = interactions.filter(i => 
      i.sentiment === 'negative' || i.sentiment_score < 0.4
    ).length;
    if (negativeInteractions > 1) {
      factors.push('Multiple negative interactions');
    }
    
    if (customer.feature_usage_rate < 0.3) {
      factors.push('Low product usage');
    }
    
    return factors.slice(0, 3); // Return top 3 factors
  }

  static getChurnPreventionRecommendation(riskScore) {
    if (riskScore >= 70) {
      return 'Immediate personal outreach required - high churn risk';
    } else if (riskScore >= 40) {
      return 'Schedule check-in call and offer proactive support';
    } else {
      return 'Continue regular engagement and monitoring';
    }
  }

  static getDaysSinceLastInteraction(interactions) {
    if (!interactions.length) return 999;
    const lastInteraction = new Date(Math.max(...interactions.map(i => new Date(i.created_at))));
    return Math.floor((new Date() - lastInteraction) / (1000 * 60 * 60 * 24));
  }
}