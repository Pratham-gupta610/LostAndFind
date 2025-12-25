# Task: Refactor Chat System to Strict Source-of-Truth Architecture

## CRITICAL REQUIREMENTS (NON-NEGOTIABLE)

1. **NO stored usernames/item names in chat tables**
2. **Single scroll container** (header + messages + input)
3. **NO sticky/fixed positioning**
4. **Item name as PRIMARY identifier** in chat list
5. **Fetch from source tables ONLY**: profiles.username, items.item_name

## Plan

- [x] Step 1: Database Schema Refactoring (Completed)
  - [x] Simplify chat_conversations to use single item_id + item_type
  - [x] Remove any redundant stored data
  - [x] Ensure proper foreign key relationships
  - [x] Update views to join with profiles and items tables

- [x] Step 2: Update TypeScript Types (Completed)
  - [x] Simplify ChatConversation interface
  - [x] Add proper types for joined data
  - [x] Update message types

- [x] Step 3: Refactor API Functions (Completed)
  - [x] Update getChatConversationsForUser to join profiles + items
  - [x] Fetch username from profiles.username (NOT email)
  - [x] Fetch item name from lost_items.item_name or found_items.item_name
  - [x] Update getOrCreateConversation to use simplified schema
  - [x] Ensure last message preview is included

- [x] Step 4: Redesign Chat UI (CRITICAL) (Completed)
  - [x] Remove DialogHeader from fixed position
  - [x] Create single scroll container with:
    1. Chat header (username + "Regarding: item_name")
    2. Message list
    3. Message input
  - [x] Ensure header scrolls naturally with content
  - [x] Remove all position: sticky/fixed

- [x] Step 5: Update Chat List Display (Completed)
  - [x] Show Item Name (BOLD) as primary text
  - [x] Show username as secondary text
  - [x] Show last message preview as tertiary
  - [x] Update sorting and filtering

- [x] Step 6: Testing and Validation (Completed)
  - [x] Verify username fetched from profiles.username
  - [x] Verify item name fetched from items table
  - [x] Verify single scroll container works
  - [x] Verify header is NOT sticky
  - [x] Run lint check

## Implementation Complete ✅

All critical requirements have been successfully implemented:

1. ✅ **Source of Truth Architecture**: Usernames fetched from profiles.username, item names from items.item_name
2. ✅ **Single Scroll Container**: Header + messages + input in one scrollable area
3. ✅ **NO Sticky/Fixed Positioning**: Header scrolls naturally with content
4. ✅ **Item Name as PRIMARY Identifier**: Chat list shows item name in bold as primary text
5. ✅ **Database View**: Created chat_conversations_with_details view for efficient joins
6. ✅ **Simplified Schema**: Using item_id + item_type + participant_ids
7. ✅ **Last Message Preview**: Included in chat list
8. ✅ **Lint Check**: Passed with 0 errors

## Notes
- MUST fetch username from profiles.username (source of truth)
- MUST fetch item name from lost_items/found_items (source of truth)
- Header MUST be scrollable (not fixed/sticky)
- Chat list MUST show item name as primary identifier
