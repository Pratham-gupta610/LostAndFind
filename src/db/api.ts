import { supabase } from './supabase';
import type { LostItem, FoundItem, ReturnedItem, LostItemInput, FoundItemInput, ChatConversation, ChatMessage } from '@/types/types';

// Lost Items API
export const getLostItems = async (
  searchTerm?: string,
  dateFrom?: Date,
  dateTo?: Date
): Promise<LostItem[]> => {
  let query = supabase
    .from('lost_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchTerm && searchTerm.trim() !== '') {
    query = query.or(`item_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,campus.ilike.%${searchTerm}%`);
  }

  if (dateFrom) {
    query = query.gte('date_lost', dateFrom.toISOString());
  }

  if (dateTo) {
    const endOfDay = new Date(dateTo);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.lte('date_lost', endOfDay.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching lost items:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const getLostItemById = async (id: string): Promise<LostItem | null> => {
  const { data, error } = await supabase
    .from('lost_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching lost item:', error);
    throw error;
  }

  return data;
};

export const createLostItem = async (item: LostItemInput): Promise<LostItem> => {
  const { data, error } = await supabase
    .from('lost_items')
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error('Error creating lost item:', error);
    throw error;
  }

  return data;
};

// Found Items API
export const getFoundItems = async (
  searchTerm?: string,
  dateFrom?: Date,
  dateTo?: Date
): Promise<FoundItem[]> => {
  let query = supabase
    .from('found_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (searchTerm && searchTerm.trim() !== '') {
    query = query.or(`item_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,campus.ilike.%${searchTerm}%`);
  }

  if (dateFrom) {
    query = query.gte('date_found', dateFrom.toISOString());
  }

  if (dateTo) {
    const endOfDay = new Date(dateTo);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.lte('date_found', endOfDay.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching found items:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const getFoundItemById = async (id: string): Promise<FoundItem | null> => {
  const { data, error } = await supabase
    .from('found_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching found item:', error);
    throw error;
  }

  return data;
};

export const createFoundItem = async (item: FoundItemInput): Promise<FoundItem> => {
  const { data, error } = await supabase
    .from('found_items')
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error('Error creating found item:', error);
    throw error;
  }

  return data;
};

// Returned Items API
export const getReturnedItems = async (
  dateFrom?: Date,
  dateTo?: Date
): Promise<ReturnedItem[]> => {
  let query = supabase
    .from('returned_items')
    .select('*')
    .order('return_date', { ascending: false });

  if (dateFrom) {
    query = query.gte('return_date', dateFrom.toISOString());
  }

  if (dateTo) {
    const endOfDay = new Date(dateTo);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.lte('return_date', endOfDay.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching returned items:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const getReturnedItemById = async (id: string): Promise<ReturnedItem | null> => {
  const { data, error } = await supabase
    .from('returned_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching returned item:', error);
    throw error;
  }

  return data;
};

// Get recent items for homepage
export const getRecentLostItems = async (limit = 6): Promise<LostItem[]> => {
  const { data, error } = await supabase
    .from('lost_items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent lost items:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const getRecentFoundItems = async (limit = 6): Promise<FoundItem[]> => {
  const { data, error } = await supabase
    .from('found_items')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent found items:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const getRecentReturnedItems = async (limit = 6): Promise<ReturnedItem[]> => {
  const { data, error } = await supabase
    .from('returned_items')
    .select('*')
    .order('return_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent returned items:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

// Count functions for stats
export const getLostItemsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('lost_items')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting lost items:', error);
    return 0;
  }

  return count || 0;
};

export const getFoundItemsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('found_items')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting found items:', error);
    return 0;
  }

  return count || 0;
};

export const getReturnedItemsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('returned_items')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting returned items:', error);
    return 0;
  }

  return count || 0;
};

// Chat API
export const getOrCreateConversation = async (
  lostItemId: string | null,
  foundItemId: string | null,
  lostItemOwnerId: string,
  foundItemReporterId: string
): Promise<ChatConversation | null> => {
  // First try to get existing conversation
  let query = supabase
    .from('chat_conversations')
    .select('*');

  if (lostItemId) {
    query = query.eq('lost_item_id', lostItemId);
  }
  if (foundItemId) {
    query = query.eq('found_item_id', foundItemId);
  }

  const { data: existing } = await query.maybeSingle();

  if (existing) {
    return existing;
  }

  // Create new conversation
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      lost_item_id: lostItemId,
      found_item_id: foundItemId,
      lost_item_owner_id: lostItemOwnerId,
      found_item_reporter_id: foundItemReporterId,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }

  return data;
};

export const getUserConversations = async (userId: string): Promise<ChatConversation[]> => {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .or(`lost_item_owner_id.eq.${userId},found_item_reporter_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const getConversationMessages = async (conversationId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return Array.isArray(data) ? data : [];
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  message: string
): Promise<ChatMessage | null> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      message,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  // Update conversation's updated_at
  await supabase
    .from('chat_conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
};

export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('chat_messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};
