import { useState, useEffect } from 'react';

export type Category = 'Housing' | 'Food' | 'Income' | 'Safety' | 'Health' | 'Community';
export type Urgency = 'Hours' | 'Days' | 'Weeks';

export interface ActionStep {
  id: string;
  rank: number;
  title: string;
  description: string;
  serviceId?: string;
  completed?: boolean;
  type?: 'service' | 'event' | 'membership';
  date?: string;
}

export interface CrisisAssessment {
  category: Category;
  urgency: Urgency;
  riskFlags: string[];
  questions: string[];
  plan: ActionStep[];
}

const SERVICE_REGISTRY = {
  'council-housing': { name: 'Council Housing Options Team', phone: '020 1234 5678', open: '9am - 5pm' },
  'citizens-advice': { name: 'Citizens Advice Bureau', phone: '0800 144 8848' },
  'dv-hotline': { name: 'National Domestic Abuse Helpline', phone: '0808 2000 247', open: '24/7' },
  
  // Restore Hope Specific Services
  'dignity-supermarket': { name: 'Dignity Supermarket', address: 'Restore Hope Latimer', open: 'Wed/Thu 10am-12pm', description: 'Buy £25 of groceries for just £5' },
  'life-skills': { name: 'Life Skills Course', address: 'Restore Hope Latimer', open: 'Tue 7pm' },
  'volunteer-team': { name: 'Volunteer Team', address: 'Restore Hope Latimer', open: 'Apply Online' },
  
  // Events
  'summer-group': { name: 'Restore Hope Summer', address: 'Restore Hope Latimer', open: 'July-August' },
  'kids-club': { name: 'After School Kids Club', address: 'Restore Hope Latimer', open: 'Mon-Fri 4pm' },
};

export async function analyzeCrisis(text: string): Promise<CrisisAssessment> {
  // Simulate network delay for "AI" processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerText = text.toLowerCase();
  let category: Category = 'Income';
  let urgency: Urgency = 'Weeks';
  const riskFlags: string[] = [];
  const plan: ActionStep[] = [];
  const questions: string[] = [];

  // Detect Vulnerabilities for Event Recommendations
  const hasKids = lowerText.includes('child') || lowerText.includes('kid') || lowerText.includes('baby') || lowerText.includes('school') || lowerText.includes('son') || lowerText.includes('daughter');
  const isElderly = lowerText.includes('old') || lowerText.includes('pension') || lowerText.includes('lonely') || lowerText.includes('isolate');

  if (hasKids) riskFlags.push('children_in_household');
  if (isElderly) riskFlags.push('elderly_vulnerable');

  // Rule-based Classification
  if (lowerText.includes('landlord') || lowerText.includes('evict') || lowerText.includes('notice') || lowerText.includes('rent')) {
    category = 'Housing';
    if (lowerText.includes('today') || lowerText.includes('tonight') || lowerText.includes('now')) {
      urgency = 'Hours';
      plan.push({
        id: 'h1', rank: 1, title: 'Call Emergency Housing', 
        description: 'Contact the Council Housing Options Team immediately. Tell them you are "homeless tonight".',
        serviceId: 'council-housing',
        type: 'service'
      });
    } else {
      urgency = 'Days';
      plan.push({
        id: 'h2', rank: 1, title: 'Check Notice Validity', 
        description: 'Do not move out yet. We need to check if the eviction notice is legal.',
        serviceId: 'citizens-advice',
        type: 'service'
      });
    }
    if (!hasKids) questions.push("Do you have children in the household?");
  } 
  else if (lowerText.includes('food') || lowerText.includes('hungry') || lowerText.includes('eat') || lowerText.includes('shop')) {
    category = 'Food';
    urgency = 'Days';
    plan.push({
      id: 'f1', rank: 1, title: 'Access Dignity Supermarket', 
      description: 'Join our membership to buy £25 worth of fresh food and essentials for just £5.',
      serviceId: 'dignity-supermarket',
      type: 'membership'
    });
  }
  else if (lowerText.includes('violence') || lowerText.includes('safe') || lowerText.includes('hit') || lowerText.includes('afraid')) {
    category = 'Safety';
    urgency = 'Hours';
    riskFlags.push('domestic_violence_risk');
    plan.push({
      id: 's1', rank: 1, title: 'Find a Safe Place', 
      description: 'If you are in immediate danger, call 999. Otherwise, contact the helpline.',
      serviceId: 'dv-hotline',
      type: 'service'
    });
  }

  // Add Restore Hope Community Events based on context
  if (hasKids) {
    plan.push({
      id: 'evt1', rank: 3, title: 'Restore Hope Summer',
      description: 'Join our summer programme for families. Games, crafts, and lunch included.',
      serviceId: 'summer-group',
      type: 'event',
      date: 'Starts July 5th'
    });
  }
  
  // Suggest Volunteering as a way to connect (empowerment)
  if (lowerText.includes('help') || lowerText.includes('community') || lowerText.includes('give back')) {
     plan.push({
      id: 'vol1', rank: 4, title: 'Join Volunteer Team',
      description: 'Become part of our award-winning volunteer team.',
      serviceId: 'volunteer-team',
      type: 'event'
    });
  }

  // Default fallback plan if empty
  if (plan.length === 0) {
    category = 'Community'; // Default to community support if no specific crisis found
    plan.push({
      id: 'g1', rank: 1, title: 'Speak to an Advisor',
      description: 'Visit Citizens Advice for a full benefits check.',
      serviceId: 'citizens-advice',
      type: 'service'
    });
     // Default gentle offer
    plan.push({
        id: 'evt3', rank: 2, title: 'Explore Our Groups',
        description: 'We run courses and groups for everyone. Come see what’s on.',
        serviceId: 'life-skills',
        type: 'event'
    });
  }

  return { category, urgency, riskFlags, questions, plan };
}
