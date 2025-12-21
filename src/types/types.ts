// Database types matching Supabase schema

export interface Profile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LostItem {
  id: string;
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
}

export interface FoundItemInput {
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
