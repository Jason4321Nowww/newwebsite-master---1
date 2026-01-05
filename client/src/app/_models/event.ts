export interface Attendee {
  user?: string; // ObjectId as string (optional for anonymous)
  isAnonymous: boolean;
}

export interface Event {
  id: string;                      // Provided by backend
  title: string;
  image?: string;
  description?: string;
  isMandatory: boolean;
  eventDate: string;              // ISO format from backend
  date: string;                   // Legacy or optional use
  repeat: 'none' | 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
  visibilityLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  eventLocation: string;
  attendees: Attendee[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // ➕ Frontend-only fields
  isAttending?: boolean;
  attendeesCount?: number;
}
