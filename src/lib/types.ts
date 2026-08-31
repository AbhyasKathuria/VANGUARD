export type UserRole = "citizen" | "worker" | "authority" | "volunteer";

export type RequestCategory = "health" | "civic" | "emergency" | "farming" | "other";

export type RequestPriority = "low" | "medium" | "high";

export type RequestStatus = "open" | "assigned" | "in_progress" | "resolved";

export interface JWTPayload {
  userId: string;
  name: string;
  phone: string;
  role: UserRole;
  location: string;
}

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  language: string;
  location: string;
  workerProfile?: {
    profession: string;
    availability: boolean;
    location: string;
    verified: boolean;
  } | null;
  volunteerProfile?: {
    organization: string;
    area: string;
    availability: boolean;
    verified: boolean;
  } | null;
}
