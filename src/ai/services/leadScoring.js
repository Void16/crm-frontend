export class LeadScoringService {
  static calculateLeadScore(customer, interactions = []) {
    let score = 50; // Base score
    
    // Engagement factors (40% of score)
    const recentInteractions = interactions.filter(i => {
      const daysAgo = (new Date() - new Date(i.created_at)) / (1000 * 60 * 60 * 24);
      return daysAgo <= 30;
    });
    
    score += Math.min(recentInteractions.length * 3, 15); // Max 15 points for interactions
    
    // Interaction sentiment (20% of score)
    const positiveInteractions = interactions.filter(i => 
      i.sentiment_score > 0.6
    ).length;
    score += Math.min(positiveInteractions * 4, 12); // Max 12 points for positive sentiment
    
    // Customer value factors (20% of score)
    if (customer.total_purchase_value > 1000) score += 8;
    if (customer.industry === 'Technology' || customer.industry === 'Finance') score += 5;
    
    // Behavioral factors (10% of score)
    const lastInteractionDays = this.getDaysSinceLastInteraction(interactions);
    if (lastInteractionDays <= 7) score += 6;
    if (lastInteractionDays <= 30) score += 3;
    
    // Company size factors (10% of score)
    if (customer.company_size === 'Enterprise') score += 10;
    else if (customer.company_size === 'Mid-Market') score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  static getLeadGrade(score) {
    if (score >= 85) return { grade: 'A', label: 'Hot Lead', color: 'bg-green-500' };
    if (score >= 70) return { grade: 'B', label: 'Warm Lead', color: 'bg-blue-500' };
    if (score >= 50) return { grade: 'C', label: 'Cool Lead', color: 'bg-yellow-500' };
    return { grade: 'D', label: 'Cold Lead', color: 'bg-gray-500' };
  }

  static getDaysSinceLastInteraction(interactions) {
    if (!interactions.length) return 999;
    const lastInteraction = new Date(Math.max(...interactions.map(i => new Date(i.created_at))));
    return Math.floor((new Date() - lastInteraction) / (1000 * 60 * 60 * 24));
  }
}