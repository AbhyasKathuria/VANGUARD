export type UserRole = "citizen" | "worker" | "authority" | "volunteer" | "super_admin";

export type RequestCategory = "health" | "civic" | "emergency" | "farming" | "other";

export type RequestPriority = "low" | "medium" | "high";

export type RequestStatus = "open" | "assigned" | "in_progress" | "resolved";

export interface JWTPayload {
  userId: string;
  name: string;
  phone: string;
  role: UserRole;
  location: string;
  district?: string;
}

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  language: string;
  location: string;
  district?: string;
  active?: boolean;
  workerProfile?: {
    profession: string;
    availability: boolean;
    location: string;
    district?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    verified: boolean;
  } | null;
  volunteerProfile?: {
    organization: string;
    area: string;
    district?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    availability: boolean;
    verified: boolean;
  } | null;
}
