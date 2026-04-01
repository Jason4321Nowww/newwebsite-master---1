export interface Attendee {
  user?: string; // ObjectId as string (optional for anonymous)
  isAnonymous: boolean;
}

export interface Event {
  id: string;                      // Provided by backend
  title: string;
  title_it?: string;
  title_fr?: string;
  title_en?: string;
  image?: string;
  description?: string;
  description_it?: string;
  description_fr?: string;
  description_en?: string;
  isMandatory: boolean;
  eventDate: string;              // ISO format from backend
  date: string;                   // Legacy or optional use
  repeat: 'none' | 'weekly' | 'biweekly' | 'monthly' | 'annually';
  repeatEndDate?: string;
  eventType?: 'oeffentlich' | 'nationalversammlung' | 'lokalversammlung' | 'regionalversammlung' | 'rv_zusammenkunft' | 'lv_zusammenkunft' | 'vorstand' | 'vorsitzende' | 'admin';
  visibilityLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  eventLocation: string;
  attendees: Attendee[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // ➕ Frontend-only fields
  isAttending?: boolean;
  attendeesCount?: number;
}
