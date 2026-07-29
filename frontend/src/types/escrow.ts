export const EscrowStatus = {
  Active: 'Active',
  Completed: 'Completed',
  Refunded: 'Refunded',
} as const;

export type EscrowStatus = (typeof EscrowStatus)[keyof typeof EscrowStatus];

export interface Milestone {
  id: number;
  description: string;
  amount: string;
  isCompleted: boolean;
  isInReview?: boolean; // Milestone work submission status by Freelancer
}

export interface Escrow {
  client: string;
  clientName?: string;
  clientEmail?: string;
  freelancer: string;
  freelancerName?: string;
  freelancerEmail?: string;
  token: string;
  totalAmount: string;
  releasedAmount: string;
  deadline: number; // Unix timestamp in seconds
  status: EscrowStatus;
  milestones: Milestone[];
}

export interface UserFeedback {
  timestamp: string;
  userName?: string;
  userAddress: string;
  rating: number;
  comment: string;
  recipientAddress?: string;
}

export interface DbTransaction {
  timestamp: string;
  eventType: 'ESCROW_CREATED' | 'WORK_SUBMITTED' | 'MILESTONE_RELEASED' | 'REFUNDED' | string;
  clientName: string;
  clientAddress: string;
  clientEmail?: string;
  freelancerName: string;
  freelancerAddress: string;
  freelancerEmail?: string;
  totalAmount: string;
  milestoneId?: number | string;
  milestoneDescription?: string;
  milestoneAmount?: string;
  txHash: string;
}

export interface TestnetEvent {
  id: string;
  ledger: number;
  createdAt: string;
  topic: string[];
  txHash: string;
}