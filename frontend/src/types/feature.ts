// Shared types for features
export interface Feature {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  flag: boolean;
  status: string;
  reasoning: string;
  regulationsViolated: JSON[];
}
