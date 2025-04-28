export interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  members: number[];
  userId?: number[];
  users?: { id: number; name: string }[];
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}
