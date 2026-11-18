// Tracks whose lessons are still being written. Units are listed so the
// whole curriculum is visible on the path; each fills in over later releases.

import type { Track, Unit } from '../types';

const u = (id: string, title: string, description: string): Unit => ({ id, title, description, lessons: [] });

export const corporateFinance: Track = {
  id: 'corp-fin',
  area: 'finance',
  title: 'Corporate Finance',
  tagline: 'Value projects and companies the way investors do.',
  inspiredBy: 'HBS Finance I & II · MIT Sloan Finance Theory',
  units: [
    u('cf-u1', 'Time Value of Money', 'Compounding, discounting, annuities and perpetuities.'),
    u('cf-u2', 'Capital Budgeting', 'NPV, IRR, payback, and choosing between projects.'),
    u('cf-u3', 'Risk & Return', 'Diversification, beta, CAPM, and the cost of capital.'),
    u('cf-u4', 'Valuation', 'DCF, terminal value, and trading multiples.'),
    u('cf-u5', 'Capital Structure', 'Debt vs. equity, WACC, and payout policy.'),
  ],
};

export const strategy: Track = {
  id: 'strategy',
  area: 'strategy',
  title: 'Strategy',
  tagline: 'Why some firms earn more than others, and how to keep it that way.',
  inspiredBy: 'HBS Strategy · MIT Sloan Competitive Strategy',
  units: [
    u('st-u1', 'Industry Analysis', 'The five forces and industry profitability.'),
    u('st-u2', 'Value Creation & Capture', 'Willingness to pay, cost, and the value stick.'),
    u('st-u3', 'Competitive Advantage', 'Cost vs. differentiation, resources, and sustainability.'),
    u('st-u4', 'Platforms & Networks', 'Network effects, multi-sided markets, winner-take-most.'),
    u('st-u5', 'Corporate Strategy', 'Scope, diversification, M&A, and vertical integration.'),
  ],
};

export const marketing: Track = {
  id: 'marketing',
  area: 'strategy',
  title: 'Marketing',
  tagline: 'Choose your customer, then win them profitably.',
  inspiredBy: 'HBS Marketing · MIT Sloan Marketing Management',
  units: [
    u('mk-u1', 'Customer & Segmentation', 'Needs-based segments, targeting, and positioning.'),
    u('mk-u2', 'Pricing', 'Value-based pricing, elasticity, and price discrimination.'),
    u('mk-u3', 'Customer Economics', 'Acquisition cost, retention, and lifetime value.'),
    u('mk-u4', 'Channels & Go-to-Market', 'Direct vs. indirect, sales models, and launch.'),
    u('mk-u5', 'Brand & Communication', 'Brand equity, messaging, and measuring marketing.'),
  ],
};

export const leadingPeople: Track = {
  id: 'leadership',
  area: 'leadership',
  title: 'Leading People',
  tagline: 'Get great work done through others.',
  inspiredBy: 'HBS Leadership & Organizational Behavior · MIT Sloan Organizational Processes',
  units: [
    u('lp-u1', 'Motivation & Performance', 'What drives effort, feedback, and incentives.'),
    u('lp-u2', 'Teams', 'Team design, psychological safety, and conflict.'),
    u('lp-u3', 'Decision-Making', 'Biases, noise, and better group decisions.'),
    u('lp-u4', 'Influence & Power', 'Persuasion, networks, and managing up.'),
    u('lp-u5', 'Culture & Change', 'Shaping culture and leading organizational change.'),
  ],
};

export const negotiation: Track = {
  id: 'negotiation',
  area: 'leadership',
  title: 'Negotiation',
  tagline: 'Create value at the table, then claim your share.',
  inspiredBy: 'HBS and MIT Sloan negotiation electives',
  units: [
    u('ng-u1', 'Foundations', 'BATNA, reservation price, and the ZOPA.'),
    u('ng-u2', 'Claiming Value', 'Anchoring, first offers, and concessions.'),
    u('ng-u3', 'Creating Value', 'Interests vs. positions, trades, and packaging.'),
    u('ng-u4', 'Complex Deals', 'Multi-party negotiations, coalitions, and agents.'),
    u('ng-u5', 'Hard Moments', 'Difficult tactics, emotions, and repairing trust.'),
  ],
};

export const operations: Track = {
  id: 'operations',
  area: 'operations',
  title: 'Operations',
  tagline: 'Design processes that deliver more, faster, for less.',
  inspiredBy: 'HBS Technology & Operations Management · MIT Sloan Operations Management',
  units: [
    u('op-u1', 'Process Analysis', 'Capacity, bottlenecks, and utilization.'),
    u('op-u2', 'Flow & Little’s Law', 'Inventory, throughput, and flow time.'),
    u('op-u3', 'Queues & Variability', 'Why waiting lines explode near full capacity.'),
    u('op-u4', 'Inventory & Supply Chain', 'EOQ, safety stock, and the bullwhip effect.'),
    u('op-u5', 'Quality & Lean', 'Lean, Six Sigma, and continuous improvement.'),
  ],
};

export const dataDecisions: Track = {
  id: 'data',
  area: 'operations',
  title: 'Data & Decisions',
  tagline: 'Turn uncertainty and data into better calls.',
  inspiredBy: 'MIT Sloan Data, Models & Decisions · HBS Data Science for Managers',
  units: [
    u('dd-u1', 'Probability for Managers', 'Expected value, distributions, and base rates.'),
    u('dd-u2', 'Decision Analysis', 'Decision trees and the value of information.'),
    u('dd-u3', 'Statistics & Inference', 'Sampling, confidence intervals, and significance.'),
    u('dd-u4', 'Regression', 'Fitting, interpreting, and misreading regressions.'),
    u('dd-u5', 'Experiments & Causality', 'A/B tests, confounders, and causal claims.'),
  ],
};
