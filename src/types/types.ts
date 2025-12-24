// Database types matching Supabase schema

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface LostItem {
  id: string;
  user_id: string | null;
  item_name: string;
  description: string;
  category: string;
  date_lost: string;
  location: string;
  campus: string;
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  additional_info: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FoundItem {
  id: string;
  user_id: string | null;
  item_name: string;
  description: string;
  category: string;
  date_found: string;
  location: string;
  campus: string;
  contact_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  additional_info: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReturnedItem {
  id: string;
  item_name: string;
  description: string;
  category: string;
  owner_name: string;
  owner_contact: string | null;
  finder_name: string;
  finder_contact: string | null;
  return_date: string;
  location: string;
  campus: string;
  story: string | null;
  image_url: string | null;
  created_at: string;
}

export interface LostItemInput {
  user_id?: string | null;
  item_name: string;
  description: string;
  category: string;
  date_lost: string;
  location: string;
  campus: string;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  additional_info?: string;
  image_url?: string;
}

export interface FoundItemInput {
  user_id?: string | null;
  item_name: string;
  description: string;
  category: string;
  date_found: string;
  location: string;
  campus: string;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  additional_info?: string;
  image_url?: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export const CATEGORIES = [
  'Wallet',
  'Bag',
  'Electronics',
  'Personal Items',
  'Accessories',
  'Keys',
  'Books',
  'ID Cards',
  'Jewelry',
  'Documents',
  'Medical',
  'Other'
] as const;

export const CAMPUSES = [
  'North Campus',
  'South Campus',
  'Central Campus',
  'East Campus',
  'West Campus'
] as const;

export interface ChatConversation {
  id: string;
  lost_item_id: string | null;
  found_item_id: string | null;
  lost_item_owner_id: string;
  found_item_reporter_id: string;
  match_id: string | null;
  history_deleted_at: string | null;
  history_deleted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  read: boolean;
  sent_after_deletion: boolean;
}

export type MatchStatus = 'pending' | 'confirmed' | 'rejected';

export interface Match {
  id: string;
  lost_item_id: string;
  found_item_id: string;
  similarity_score: number;
  match_reason: string;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
  lost_item?: LostItem;
  found_item?: FoundItem;
}

export interface MatchNotification {
  id: string;
  match_id: string;
  user_id: string;
  notification_type: 'email' | 'in_app';
  sent_at: string;
  read_at: string | null;
  match?: Match;
}
