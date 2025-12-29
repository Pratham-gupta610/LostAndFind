# FINDIT.AI Multi-Campus Lost & Found Web Application Requirements Document

## 1. Application Overview

### 1.1 Application Name
FINDIT.AI\n
### 1.2 Application Description
A modern, highly interactive multi-campus Lost & Found web application designed to help users report and search for lost or found items across multiple campus locations, with a focus on trust-first design and seamless user experience. Features secure college email authentication with OTP verification for first-time users only, built-in real-time messaging system with WhatsApp-like delivery states, blue tick read receipts, intelligent popup notifications, advanced chat management including one-sided deletion, role-based conclusion system, and editable/deletable messages for direct communication between users, AI-powered intelligent matching to automatically identify potential matches between lost and found items, and **Gemini 2.5 Flash API-powered** image description extraction for enhanced visual search capabilities.

### 1.3 Target Users
Campus community members (students, faculty, staff) who need to report lost items, search for found items, or help return items to their owners.

## 2. Core Functionality

### 2.1 User Authentication & Authorization
\n#### 2.1.1 First-Time User Authentication Flow
- **Email Entry**: User enters college email address in format *@iiitg.ac.in
- **New User Detection**: System checks if email exists in database
- **OTP Generation**: If email is new, system sends one-time password to email
- **OTP Validation**: User enters OTP within 5-10 minutes expiry window
- **Email Verification**: Upon successful OTP verification, email is marked as verified
- **Account Creation**: User account is created with verified email status
- **Phone Number Collection**: During first login, user provides phone number for contact purposes
- **Auto Login**: User is automatically logged in after verification

#### 2.1.2 Returning User Authentication Flow
- **Email Entry**: User enters previously registered email\n- **Existing User Detection**: System recognizes email already exists and is verified
- **Direct Login**: User is logged in immediately without OTP requirement
- **Session-Based Access**: Login maintained through secure session tokens or magic links
- **No OTP Friction**: No verification email sent for returning users

#### 2.1.3 Forgot Password Flow (Registered Users Only)
\n**Entry Point**\n- **Sign-In Page**: 'Forgot Password?' link visible only on sign-in page
\n**Step 1: Password Reset Request**
- User clicks 'Forgot Password?'
- User enters registered email address
- System checks if email exists in database and is verified
- If email does NOT exist: show generic error message ('If this email is registered, you will receive a reset link')
- If email exists: proceed to OTP generation

**Step 2: Send OTP to Registered Email**
- Generate secure, time-limited OTP
- Send OTP to registered email address
- OTP properties:\n  - Valid for 5-10 minutes\n  - Single-use only
  - Rate-limited requests (prevent abuse)
  - Stored securely (hashed)

**Step 3: OTP Verification**
- User enters OTP received via email
- System verifies:\n  - OTP matches\n  - OTP is not expired
  - OTP is unused
- Invalid OTP: show error message with option to resend
- Valid OTP: allow password reset

**Step 4: Set New Password**
- Prompt user to set new password
- Enforce password rules:\n  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character
- Require password confirmation before submission

**Step 5: Password Update & Login**
- Replace old password with new password
- Invalidate all previous sessions
- Invalidate any active reset tokens
- Automatically log user in OR redirect to login page with success message

**Security Rules for Password Reset**
- OTP sent only to registered, verified email addresses
- Do not reveal whether email exists publicly
- Limit OTP resend attempts (max 3 attempts per 15 minutes)
- Log all reset attempts for security monitoring
- Protect against brute-force attacks with rate limiting
- Password reset OTP separate from first-time login OTP
\n**UX Requirements**
- Clear feedback messages:\n  - 'OTP sent to your email'
  - 'OTP expired, please request a new one'
  - 'Password updated successfully'
- Smooth transitions between reset steps
- Accessible UI for all users
- Loading indicators during verification
\n#### 2.1.4 Authentication Security Rules
- **Email Format Validation**: Validate email format before processing
- **OTP Security**: Single-use OTP, never stored in plain text, rate-limited requests
- **Session Management**: Maintain user session across visits, auto-expire after inactivity
- **Device Recognition**: Remember logged-in devices for seamless return access
- **Manual Logout**: Users can manually end session at any time
\n#### 2.1.5 Guest Access & Login Requirements
- **Guest Browsing**: Users can view Lost Items, Found Items, and Return History without authentication
- **Login Required Actions**: Authentication required only when reporting items or contacting other users
- **User Profile Storage**: Stores email, phone number, name, verification status, and login history
\n### 2.2 Sign In/Sign Up Flow
- **Homepage Sign In Button**: Homepage displays only 'Sign In' button (no separate Sign Up option)
- **Sign In Page**: Clicking 'Sign In' directs to login page
- **Forgot Password Link**: Login page includes 'Forgot Password?' link for password recovery
- **Sign Up Link**: Login page includes text 'Don't have an account? Sign Up' at bottom
- **Sign Up Page**: New users create accounts with OTP verification on first registration

### 2.3 User Profile Management
\n#### 2.3.1 Profile Data Structure
- **Database Table**: `profiles` table linked to authentication users
- **Table Fields**:
  - user_id (UUID, primary key, references auth.users)
  - full_name (text, required)
  - username (text, unique, required)
  - email (read-only, fetched from auth)\n  - phone (text, optional)
  - updated_at (timestamp, auto-updated)
\n#### 2.3.2 Profile Page Access
- **Access Control**: Profile page accessible only to logged-in users
- **Navigation**: User profile accessible from top navigation area
- **Security**: Users can only view and edit their OWN profile data
- **Permission Enforcement**: Prevent viewing or editing of other users' profiles

#### 2.3.3 Profile Display UI
- **Profile View Mode**: Display current profile values inside input fields
- **Field Display**:
  - Full Name (editable)
  - Username (editable)
  - Email (visible but NOT editable, fetched from auth)
  - Phone (editable, optional)
- **Edit Profile Button**: Visible in view mode\n- **Loading State**: Show loading indicator while fetching profile data

#### 2.3.4 Profile Edit & Save Behavior
- **Edit Mode Activation**: Clicking 'Edit Profile' enables input fields
- **Action Buttons in Edit Mode**:
  - 'Save Changes' button
  - 'Cancel' button
- **Save Changes Action**:
  - Validate inputs (non-empty full name, valid unique username)\n  - Update profile record in database
  - Show success message on successful update
  - Show error message if validation fails or update fails
  - Disable 'Save' button while updating (prevent duplicate submissions)
- **Cancel Action**:
  - Revert all input fields to last saved values
  - Return to view mode without saving changes
- **Profile Update**: Changes saved immediately and reflected across application
- **Confirmation**: Show confirmation message on successful profile update

#### 2.3.5 First-Time User Profile Handling
- **Auto Profile Creation**: When user logs in for first time and no profile exists:\n  - Automatically create profile row in database
  - Pre-fill email from auth system
  - Set user_id from authenticated user
- **Profile Completion Prompt**: Prompt user to complete missing required fields (full_name, username)
- **Required Field Validation**: Ensure full_name and username are provided before allowing profile save

#### 2.3.6 Profile Permissions & Security
- **Row Level Security**: Implement database-level security to ensure users can only access their own profile
- **Data Validation**: Validate all inputs on both client and server side
- **Username Uniqueness**: Enforce unique username constraint at database level
- **Session Persistence**: Profile changes persist across sessions
\n#### 2.3.7 Profile UX Requirements
- **Loading State**: Display loading indicator while fetching profile data
- **Disabled Save Button**: Disable 'Save Changes' button during update operation
- **Success Confirmation**: Show clear confirmation message after successful profile update
- **Error Handling**: Display user-friendly error messages for validation failures or update errors
- **Smooth Transitions**: Smooth transitions between view and edit modes
- **Real-Time Updates**: Use real-time updates only if profile changes need to be reflected immediately

### 2.4 Navigation System
- **Right Sidebar Menu**: All navigation items (Lost Items, Found Items, Report Lost, Report Found, Return History, Messages) placed in collapsible sidebar on right side
- **Sidebar Toggle**: Open/close sidebar using three-line hamburger menu icon (☰)
- **Mobile Scrollable Sidebar**: On mobile devices (Android and iOS), sidebar content is fully scrollable to access all menu items comfortably
- **Top Header**: Displays 'FINDIT.AI' site name with search icon, keeping top area clean and minimal
- **Mobile Responsive**: Sidebar adapts to mobile screens with smooth slide-in/slide-out animations

### 2.5 Homepage Structure
The homepage displays three clearly separated sections with real-time statistics:
- **Lost Items Section**: Shows all reported lost items with live count\n- **Found Items Section**: Shows all reported found items with live count
- **Public Return Section**: Shows history of successful returns with live count (clickable items), displaying most recent returns at the top
\n**Real-Time Counter Updates**: All three section counters automatically update immediately when:\n- New items are added\n- Status changes occur\n- Items are concluded as 'Item Found' or 'Owner Found' (counters adjust accordingly: Lost/Found counts decrease, Return count increases)

All sections sorted by latest first with date-range filter options.

### 2.6 Search System
Two separate, independent search systems:
- **Lost Items Search**: Searches only within lost item reports
- **Found Items Search**: Searches only within found item reports\n\n**Image Search Feature with Gemini 2.5 Flash API Integration**:\n- **Image Search Button**: Each search section (Lost Items and Found Items) includes an 'Image Search' button alongside text search
- **Image Upload**: Clicking 'Image Search' button opens image upload interface allowing users to upload one or multiple images
- **Supported Formats**: Accept common image formats (JPG, PNG, JPEG, WebP)\n- **Gemini 2.5 Flash API Description Extraction**:
  - When user uploads image, system sends image to **Gemini 2.5 Flash API**
  - **Gemini 2.5 Flash** analyzes image and generates detailed text description of visible items, including:
    - Object type and category
    - Color and visual characteristics
    - Brand or distinctive features (if visible)
    - Size and shape details
    - Any text or labels visible on item
  - Generated description stored temporarily for matching process
- **Intelligent Matching Process**:
  - System compares Gemini-generated description against all item descriptions in database
  - Uses text similarity algorithms to find matching items
  - Calculates similarity score based on description overlap
  - Ranks results by relevance score
- **Search Results Display**:
  - Display items matching the Gemini-generated description
  - Show similarity percentage for each result
  - Highlight matching keywords between generated description and item descriptions
  - If exact or high-confidence match found, display prominent 'Similar Item Found' indicator
- **Combined Search**: Users can optionally combine image search with text filters for more precise results
- **Search Scope**: Image search respects category boundaries (Lost Items search only searches lost items, Found Items search only searches found items)
- **API Key Configuration**: System uses provided Gemini API key: AIzaSyA27DHTEleWLXl3CPuAipEOvGOKosHekS8
- **API Model Version**: Strictly use **Gemini 2.5 Flash** model for all image analysis requests
- **Error Handling**: Display user-friendly error messages if API call fails or image cannot be processed

Search results update instantly to reflect new entries with no mixing between categories.

### 2.7 Item Reporting\n- **Report Lost Item**: Form for users to submit lost item details (requires login), with 'My Reports' history visible on same page
  - Fields include: title, description, category, color, brand, location, date, optional images
  - **Location Suggestions**: When user enters location, system provides quick-select suggestions including:\n    - Student Activity Centre
    - Day Canteen
    - Night Canteen
    - Others
    - (Plus any other relevant campus locations)
- **Report Found Item**: Form for users to submit found item details (requires login), with 'My Reports' history visible on same page
  - Fields include: title, description, category, color, brand, location, date, optional images
  - **Location Suggestions**: Same location suggestions as Report Lost Item form
- Both forms immediately add entries to respective searchable databases and update homepage counters in real-time
- Upon submission, AI Matching Assistant automatically evaluates potential matches\n\n### 2.8 Item Details Page
- Clickable items from Lost, Found, or Returned sections open full details pages
- Lost/Found item details show: item description, date, location, contact info, and other relevant fields
- **Contact Button**: Each item detail page includes 'Contact Owner/Finder' button that opens messaging interface (requires login)
- Returned item details show: owner information, finder information, return date, and item details
- **Match Indicator**: If item is identified as potential match by AI system, badge displays match confidence percentage
\n### 2.9 AI-Powered Lost & Found Matching Assistant
\n#### 2.9.1 Matching Algorithm
- **Automatic Evaluation**: When found item is reported, system automatically compares against all existing lost item reports\n- **Similarity Analysis**: AI evaluates matches based on:
  - Text similarity (title, description, category)
  - Attribute matching (color, brand, location proximity, time proximity)
  - Visual similarity (if images provided)
  - Object type, shape, size, and unique identifiers
- **Similarity Score**: Calculates match score between 0 and 100
- **Match Threshold**: Items with similarity score ≥ 75% marked as 'Potential Match'
\n#### 2.9.2 Match Notification System
- **Email Notification**: When potential match identified (score ≥ 75%), automated email sent to owner of lost item
- **Email Content**:
  - Item summary with key details
  - Match confidence percentage
  - Brief explanation (1-2 sentences) describing why match is likely
  - Secure link to view found item details and contact finder
  - Safety instructions reminding users not to share personal details immediately
- **Real-Time Alerts**: In-app notification badge appears for matched users
\n#### 2.9.3 Match Output Format
System generates match results in following structure:
- similarity_score: numerical value (0-100)
- is_match: boolean (true if score ≥ 75%)
- reason: short explanation text
- actions: send_email (boolean), enable_chat (boolean)\n\n#### 2.9.4 Privacy & Safety Rules
- Personal contact details (phone numbers, emails) never exposed directly in match notifications
- Users must initiate contact through secure in-app messaging system
- Conservative matching approach: only scores ≥ 75% trigger notifications
\n### 2.10 Advanced Real-Time Messaging System with WhatsApp-Like Features

#### 2.10.1 Chat Visibility & Creation Rule
- **Chat Creation Trigger**: A chat conversation is created and appears in the chat list ONLY AFTER one user sends the first text message
- **No Empty Chats**: If two users have never exchanged messages, the chat must NOT appear in either user's chat list
- **Database Behavior**: Chat record is created in database only when first message is sent
- **Real-Time Appearance**: Once first message is sent, chat appears immediately in both users' chat lists

#### 2.10.2 Message Delivery States
Each message must track the following states:
- **sent**: Message stored on server
- **delivered**: Message delivered to receiver device
- **read**: Receiver has opened the chat and seen the message
\n**Database Fields**:
- message_id (UUID, primary key)\n- chat_id (UUID, references chats table)
- sender_id (UUID, references users)\n- receiver_id (UUID, references users)
- content (text)\n- sent_at (timestamp)
- delivered (boolean, default false)
- delivered_at (timestamp, nullable)
- read (boolean, default false)
- read_at (timestamp, nullable)
- is_deleted (boolean, default false)
- edited_at (timestamp, nullable)
\n#### 2.10.3 Blue Tick Read Receipts (WhatsApp-Style)
- **Tick Icons**:
  - ✔️ (single gray tick) = sent\n  - ✔️✔️ (double gray ticks) = delivered
  - 💙✔️✔️ (double blue ticks) = read/seen
\n- **Read Receipt Behavior**:
  - When receiver opens the chat:\n    - Mark all unread messages as read in database
    - Set read = true and read_at = current timestamp
    - Notify sender in real time via Supabase Realtime\n    - Update sender UI to show blue ticks immediately
  - Blue ticks appear only after receiver has opened and viewed the chat
  - Delivered ticks appear when message reaches receiver device

#### 2.10.4 Popup Notification System
- **Trigger**: When a user receives a new message
- **Popup Appearance**:
  - Show in-app popup notification near the three-line hamburger icon (☰)
  - Popup contains:
    - Sender username (fetched dynamically from profiles table)
    - Message text preview (first 50 characters)
  - Popup appears immediately in real time using Supabase Realtime\n  - Popup auto-dismisses after 5 seconds or when user clicks it

- **Important Rule**: At this stage, DO NOT show unread badge in the chat list yet
- **Popup Click Behavior**: Clicking popup opens the chat directly and marks messages as read
\n#### 2.10.5 Three-Line Icon (☰) Interaction & Unread Badge Logic
- **Three-Line Icon Purpose**: Represents opening the chat panel/sidebar
- **Unread Badge Display Rule**:
  - Unread badge/dot/count appears on chat items ONLY when user clicks the three-line icon (☰) to open chat list
  - Badge shows number of unread messages for each chat
  - Badge color: red or blue to indicate unread status
\n- **Unread Message Indicator Logic**:
  - If message arrives and chat is not open:
    - Show popup near ☰ icon
    - Do NOT show unread badge yet
  - When ☰ icon is clicked:
    - Display chat list\n    - Show unread badge on chats with unseen messages
  - When user opens a specific chat:
    - Clear unread badge for that chat
    - Mark all messages in that chat as read\n    - Trigger blue ticks for the sender in real time

#### 2.10.6 Chat User Identity Display
- **Username Display**: In every chat conversation, clearly display the username of the other person
- **Dynamic Fetching**: Fetch usernames dynamically from profiles table using user_id
- **Storage Rule**: Do NOT store usernames inside chat messages
- **Real-Time Updates**: Username changes in profile reflect immediately in active chats

#### 2.10.7 Chat Access & Initiation
- **Chat Interface**: Built-in messaging system allowing users to communicate directly within application
- **Contact Flow**: When someone reports found item, they can contact person who reported lost item through chat section
- **AI Match Integration**: When potential match identified, private chat session automatically enabled between owner and finder
- **Login Required**: Users must be logged in to access messaging features
- **Private Sessions**: Chat sessions accessible only to matched users involved\n
#### 2.10.8 One-Sided Chat Deletion (Device/User-Specific)
- **User-Specific Deletion**: Deleting a chat must be DEVICE/USER-SPECIFIC\n- **Deletion Behavior**:
  - If User A deletes a chat: chat is removed ONLY from User A's chat list\n  - Chat MUST remain visible for User B\n- **Implementation Mechanism**: Use `chat_visibility` table or `deleted_by_user_ids` field to track which users have deleted the chat
- **Database Structure**: Never hard-delete chat messages globally unless both users delete manually
- **Visibility Control**: Each user maintains their own visibility state for each chat

#### 2.10.9 Role-Based Conclusion System
\n**General Rules**:
- A conclusion system must exist before allowing chat deletion
- Conclusion requirements depend on who reported the item
- Only item reporters can trigger conclusions
- Non-reporters have unrestricted delete access
\n**When User Reported a FOUND Item**:
\n- **UI Elements**:
  - User who reported found item sees 'Conclusion' button near Delete Chat button
  - Delete Chat button is DISABLED by default
\n- **Conclusion Options**:
  1. Owner Found\n  2. Owner Not Found
\n- **If 'Owner Found' Selected**:
  - Show confirmation dialog: 'Are you sure the owner is found?'
  - On confirmation:\n    - Delete the found item from FOUND ITEMS list
    - Add the item to Public Return Section at the top (most recent first)
    - Update homepage statistics: decrease Found Items count, increase Return Items count
    - Keep the item in item history with status 'Owner Found'
    - Enable the Delete Chat button
\n- **If 'Owner Not Found' Selected**:
  - Show confirmation dialog: 'Are you sure the owner is not found?'\n  - On confirmation:
    - DO NOT delete the found item from found list
    - Keep item active and searchable\n    - Enable the Delete Chat button

- **If No Conclusion Selected**:
  - Delete Chat button remains DISABLED
  - User cannot delete chat until conclusion is made

**When User Reported a LOST Item**:

- **UI Elements**:
  - Lost item owner sees 'Conclusion' button\n  - Delete Chat button is DISABLED until conclusion is selected

- **Conclusion Options**:
  1. Item Found
  2. Item Not Found

- **If 'Item Found' Selected**:\n  - Show confirmation dialog: 'Are you sure the item is found?'
  - On confirmation:\n    - Delete the item from LOST ITEMS list
    - Add the item to Public Return Section at the top (most recent first)
    - Update homepage statistics: decrease Lost Items count, increase Return Items count\n    - Keep the item in item history with status 'Item Found'\n    - Enable Delete Chat button

- **If 'Item Not Found' Selected**:
  - Show confirmation dialog: 'Are you sure the item is not found?'
  - On confirmation:
    - DO NOT delete item from lost items list
    - Keep item active and searchable
    - Enable Delete Chat button

**For Non-Reporter Users**:
- User who DID NOT report the item:\n  - Must NOT see the Conclusion button
  - Must have Delete Chat button ENABLED at all times
  - Their delete action affects only their own chat view (one-sided deletion)
  - Can delete chat freely without any conclusion requirement

#### 2.10.10 Message Management Features
- **Editable Messages**: Users can edit only their own messages
  - Edited messages update in real-time for both participants
  - Show 'edited' label with timestamp after modification
  - Edit history not visible to other user
- **Deletable Messages**: Users can delete only their own messages
  - Support both soft delete (message replaced with 'Deleted') and hard delete (removed from database)
  - Deletion changes reflect instantly in real-time chat
  - Other user cannot recover deleted messages
- **Permission Control**: Users cannot edit or delete others' messages
\n#### 2.10.11 Real-Time Requirements
- **Real-Time Delivery**: Messages delivered instantly with real-time synchronization using Supabase Realtime\n- **Real-Time Tick Updates**: Delivery and read states update in real time without page reload
- **Real-Time Popup Notifications**: Popups appear immediately when messages arrive
- **Real-Time Unread Badges**: Unread counts update instantly when messages are read
- **No Page Reloads**: All updates happen seamlessly without requiring page refresh
- **Multiple Chats Support**: System correctly handles multiple simultaneous chats and users

#### 2.10.12 Chat Features
- **Message Notifications**: Users receive popup notifications for new messages near ☰ icon
- **Conversation History**: All message threads preserved and accessible from Messages section in sidebar
- **Chat History Deletion**:
  - Users can delete entire chat history at any time from within conversation (subject to conclusion requirements for item reporters)
  - Deletion is user-specific (one-sided) and removes chat from that user's view only
  - When one user deletes chat history, other user receives notification that chat history was cleared by the other party
  - Deleted chats never regenerated or recovered for the user who deleted them
- **User Privacy**: Phone numbers and emails only shared if users choose to do so within chat conversations
\n#### 2.10.13 Persistence Across Sessions
- **Unread State Persistence**: Unread and read states must persist across:\n  - App reloads\n  - Logout/login\n  - Device switches
- **Database Storage**: All message states (sent, delivered, read) stored in database
- **Session Recovery**: When user logs back in, unread badges and message states restored correctly
\n#### 2.10.14 Database Schema for Messaging
\n**chats table**:
- chat_id (UUID, primary key)
- item_id (UUID, references items table)
- user1_id (UUID, references users)\n- user2_id (UUID, references users)
- created_at (timestamp, set when first message is sent)
- last_message_at (timestamp, updated with each new message)
\n**messages table**:
- message_id (UUID, primary key)
- chat_id (UUID, references chats table)
- sender_id (UUID, references users)
- receiver_id (UUID, references users)
- content (text)
- sent_at (timestamp)
- delivered (boolean, default false)
- delivered_at (timestamp, nullable)\n- read (boolean, default false)
- read_at (timestamp, nullable)
- is_deleted (boolean, default false)
- edited_at (timestamp, nullable)\n\n**chat_visibility table**:
- visibility_id (UUID, primary key)\n- chat_id (UUID, references chats table)
- user_id (UUID, references users)\n- is_visible (boolean, default true)
- deleted_at (timestamp, nullable)

**item_conclusions table**:
- conclusion_id (UUID, primary key)
- item_id (UUID, references items table)
- item_type (LOST or FOUND)
- conclusion_status (OWNER_FOUND | OWNER_NOT_FOUND | ITEM_FOUND | ITEM_NOT_FOUND)\n- concluded_at (timestamp)\n- concluded_by (UUID, references users)
\n#### 2.10.15 Backend Logic Requirements
- **Chat Creation**: Create chat record in database only after first message is sent
- **Delivered State Update**: Mark message as delivered when it reaches receiver device
- **Read State Update**: Mark messages as read when receiver opens chat
- **Real-Time Events**: Emit real-time events for:\n  - New messages
  - Delivery confirmations
  - Read receipts
  - Popup notifications
  - Unread badge updates
- **Row Level Security**: Ensure users can only access chats they are part of

#### 2.10.16 Frontend Logic Requirements
- **Popup Near ☰ Icon**: Display popup notification near hamburger menu icon when new message arrives
- **Chat List Rendering**: Render chat list only when ☰ icon is clicked
- **Unread Badge Handling**: Show unread badges on chat items when chat list is opened
- **Blue Tick UI Updates**: Update message ticks in real time based on delivery and read states
- **Smooth Animations**: Animate popup appearance, badge updates, and tick changes
- **Loading States**: Show loading indicators during message sending and state updates

### 2.11 Item History Management with Public History & Auto-Cleanup

#### 2.11.1 Item History Structure
All items MUST belong to exactly one of these states:
- **ACTIVE**: Items currently visible in Lost or Found lists
- **USER_HISTORY**: Private history visible only to the item reporter
- **MAIN_HISTORY**: Public history visible to ALL users (displayed in Public Return Section)
\nEach item MUST store:
- item_id (UUID, primary key)\n- reporter_user_id (UUID, references user who reported item)
- receiver_user_id (UUID, references user who received item, nullable, populated when conclusion is 'Owner Found' or 'Item Found')
- reporter_email (text, email of user who reported item)
- receiver_email (text, email of user who received item, nullable, populated when conclusion is 'Owner Found' or 'Item Found')
- item_type (LOST or FOUND)
- title (text)
- description (text)
- category (text)
- color (text)
- brand (text)
- location (text)
- date_reported (timestamp)
- status (ACTIVE | OWNER_FOUND | OWNER_NOT_FOUND | ITEM_FOUND | ITEM_NOT_FOUND)
- concluded_at (timestamp, nullable)
- history_type (ACTIVE | USER_HISTORY | MAIN_HISTORY)
- images (array, optional)
\n#### 2.11.2 Owner Found / Item Found Conclusion Behavior
If the item reporter selects conclusion = 'Owner Found' (for found items) OR 'Item Found' (for lost items), perform ALL actions atomically:
1. Remove the item from ACTIVE list (Lost Items or Found Items)
2. Set:\n   - status = OWNER_FOUND (for found items) or ITEM_FOUND (for lost items)
   - history_type = MAIN_HISTORY\n   - concluded_at = current timestamp
   - receiver_user_id = user_id of the person who received the item (the other user in the chat)
   - receiver_email = email of the person who received the item (fetched from profiles table)
3. Add the item to Public Return Section at the top (most recent first)
4. Update homepage statistics in real-time:\n   - Decrease Lost Items count (if lost item concluded as 'Item Found')
   - Decrease Found Items count (if found item concluded as 'Owner Found')
   - Increase Return Items count\n5. Make the item visible in:\n   - Public Return Section (visible to ALL users)
6. Remove the item from:\n   - Reporter's private Lost/Found list
\nThis rule applies when conclusion is 'Owner Found' or 'Item Found'.

#### 2.11.3 Other Conclusion Behavior
If conclusion is:\n- 'Owner Not Found'\n- 'Item Not Found'\n
Then:
1. Remove item from ACTIVE list (if required by logic)
2. Set:\n   - history_type = USER_HISTORY
   - status = OWNER_NOT_FOUND or ITEM_NOT_FOUND (as appropriate)
   - concluded_at = current timestamp
   - receiver_user_id = NULL\n   - receiver_email = NULL
3. Item remains visible ONLY to the reporter
4. Item MUST NOT appear in Public Return Section
5. Homepage statistics remain unchanged

#### 2.11.4 Main History Visibility (Public Return Section)
- **Public Access**: MAIN_HISTORY items are readable by ALL users (including guests) in Public Return Section
- **Read-Only**: No user can edit or delete MAIN_HISTORY items manually
- **Display**: Public Return Section shows all items with history_type = MAIN_HISTORY
- **Display Fields**: For each item in Public Return Section, display:
  - Item details (title, description, category, color, brand, location, date_reported)
  - Reporter email (reporter_email)
  - Receiver email (receiver_email)
  - Conclusion date (concluded_at)
  - Status (OWNER_FOUND or ITEM_FOUND)
- **Sorting**: Items sorted by concluded_at timestamp (latest first, most recent at top)
- **Real-Time Updates**: Public Return Section updates immediately when items are concluded as 'Owner Found' or 'Item Found'

#### 2.11.5 Auto-Delete Policy (CRITICAL)
Automatically delete items older than 6 months based on concluded_at timestamp.\n\nThis auto-delete applies to ALL:\n- USER_HISTORY items
- MAIN_HISTORY items
- Any remaining inactive Lost/Found history\n- ACTIVE items in Lost/Found lists that are older than 6 months

NO EXCEPTIONS.\n
#### 2.11.6 Auto-Delete Execution
- **Scheduled Task**: Run a scheduled cleanup task daily (e.g., using Supabase cron job or database trigger)
- **Deletion Criteria**: Delete any item where:
  - concluded_at < (current_date - 6 months) OR
  - date_reported < (current_date - 6 months) AND status = ACTIVE
- **Deletion Process**:
  - Permanently remove item records from database
  - Remove related chat references safely (cascade delete or set to null)
  - Do not affect active items within 6-month window
  - Log deletion events for audit trail
  - Update homepage statistics accordingly when items are auto-deleted

#### 2.11.7 User History Delete Option
- **Manual Deletion**: Users may manually delete their own USER_HISTORY items one at a time
- **Delete Button**: Each USER_HISTORY item has individual delete button/icon
- **Deletion Effects**:
  - Deleting an item from USER_HISTORY does NOT affect chats\n  - Deleting an item from USER_HISTORY does NOT affect other items
  - Deletion is permanent and removes item from user's history view
- **Restrictions**: Users can NEVER delete MAIN_HISTORY items manually
- **Auto-Delete Override**: Manual deletion does NOT bypass auto-delete rules (items still auto-deleted after 6 months)

#### 2.11.8 Data Safety & Consistency
- **Transactional Updates**: All state changes must be transactional (atomic operations)
- **Single State Rule**: No item may exist in multiple history sections simultaneously
- **State Derivation**: History state must be derived from history_type field only
- **Validation**: Implement database constraints to enforce single-state rule
- **Audit Logging**: Log all conclusion actions, deletions, and state transitions
- **Statistics Integrity**: Ensure homepage counters always reflect accurate counts across all sections

#### 2.11.9 Validation Rules
Implementation is INVALID if:
- 'Owner Found' or 'Item Found' items are not visible to all users in Public Return Section
- Reporter email or receiver email are not displayed in Public Return Section
- Homepage statistics do not update when items are concluded\n- Old items remain after 6 months
- Users can delete public history manually
- Items exist in multiple lists simultaneously
- concluded_at or date_reported timestamps are not properly tracked
- Public Return Section does not display most recent items at the top
- receiver_user_id or receiver_email are not populated when conclusion is 'Owner Found' or 'Item Found'

#### 2.11.10 Expected Outcome
- Owner-found and item-found items appear in Public Return Section at the top
- Public Return Section displays reporter email and receiver email for each item
- Homepage statistics update in real-time when conclusions are made
- Old history is auto-cleaned after 6 months
- Active Lost/Found items older than 6 months are auto-removed
- System remains clean, consistent, and scalable
- Users can view public success stories in Public Return Section with full contact information
- Private conclusions remain private to reporters

### 2.12 Filtering & Sorting
- All item lists (Lost/Found/Public Return) include date-range filters
- Default sorting: latest entries first
- Filter options easily accessible and responsive
\n### 2.13 My Reports History
Users can view their own submission history directly on Report Lost/Report Found pages, showing all previously submitted reports.

### 2.14 UI/UX Requirements for Chat System
\n#### 2.14.1 Visual Feedback
- **Disabled State**: Delete Chat button visually disabled (grayed out) until conclusion is made (for item reporters)
- **Loading States**: Show loading indicator while applying conclusion or sending messages
- **Success Feedback**: Display success message after conclusion is applied
- **Error Handling**: Show user-friendly error messages if conclusion fails or message sending fails
- **Confirmation Dialogs**: Clear, concise confirmation messages for all conclusion actions
- **Tick Animations**: Smooth transitions when ticks change from gray to blue
- **Popup Animations**: Smooth slide-in animation for popup notifications near ☰ icon
- **Badge Animations**: Smooth appearance and disappearance of unread badges

#### 2.14.2 Interaction Design
- **Prevent Double Actions**: Disable conclusion buttons after first click to prevent multiple conclusions
- **Clear Button States**: Visually distinguish between enabled and disabled Delete Chat button
- **Smooth Transitions**: Animate state changes (button enabling, item removal from lists, item addition to Public Return Section)
- **Notification Display**: Show clear notification when other user deletes chat history
- **Statistics Animation**: Smooth counter transitions when homepage statistics update
- **Popup Click Behavior**: Clicking popup opens chat directly and marks messages as read
- **Badge Click Behavior**: Clicking chat with unread badge opens chat and clears badge

#### 2.14.3 Data Integrity & Security
- **Authorization Rules**:
  - Only item owners can conclude items
  - Only chat participants can delete their own chat view
  - Never allow one user to delete chats or items for another user
  - Only message senders can edit or delete their own messages
- **Validation**: Validate user permissions before allowing any conclusion, deletion, or message action
- **Audit Trail**: Log all conclusions, deletions, message edits, and state changes for security and dispute resolution
- **Rollback Prevention**: Once conclusion is made, it cannot be undone (permanent action)
- **Real-Time Security**: Ensure real-time updates respect Row Level Security policies

### 2.15 Gemini API Integration Configuration

#### 2.15.1 API Key Management
- **Provided API Key**: AIzaSyA27DHTEleWLXl3CPuAipEOvGOKosHekS8
- **Environment Variable Storage**: Store Gemini API key securely in environment variables as GEMINI_API_KEY=AIzaSyA27DHTEleWLXl3CPuAipEOvGOKosHekS8
- **Key Configuration**: Configure the provided API key in the application's environment configuration file (.env or equivalent)
- **Secure Storage**: Never expose API key in client-side code, version control, or logs
- **Key Validation**: Validate API key connection on application startup to ensure proper integration

#### 2.15.2 API Model Version
- **Strict Model Requirement**: Use **Gemini 2.5 Flash** model exclusively for all image analysis and description extraction requests
- **Model Specification**: All API calls must explicitly specify model version as 'gemini-2.5-flash'
- **No Model Fallback**: Do not fall back to other Gemini model versions (e.g., Gemini 1.5, Gemini Pro)
- **Version Validation**: Validate that API responses are generated by Gemini 2.5 Flash model

#### 2.15.3 API Request Handling
- **Image Preprocessing**: Resize/compress images before sending to API to optimize performance
- **Request Rate Limiting**: Implement rate limiting to prevent API quota exhaustion
- **Timeout Handling**: Set reasonable timeout (10-15 seconds) for API requests
- **Retry Logic**: Implement retry mechanism for failed requests (max 2 retries)
- **Error Logging**: Log all API errors for debugging and monitoring
\n#### 2.15.4 Description Generation Process
- **Prompt Engineering**: Use optimized prompts to guide Gemini 2.5 Flash API to generate structured item descriptions
- **Response Parsing**: Extract and structure description data from API response
- **Description Storage**: Store generated descriptions temporarily in session or cache
- **Fallback Mechanism**: If API fails, allow users to proceed with manual text search
\n#### 2.15.5 Performance Optimization
- **Caching**: Cache API responses for identical images to reduce redundant calls
- **Async Processing**: Process image analysis asynchronously to avoid blocking UI
- **Loading Indicators**: Show clear loading state during image analysis
- **Progress Feedback**: Display progress messages ('Analyzing image...', 'Searching for matches...')
\n#### 2.15.6 Cost Management
- **Usage Monitoring**: Track API usage and costs\n- **Usage Limits**: Set daily/monthly usage limits to control costs
- **Alert System**: Send alerts when approaching usage limits
- **Optimization**: Compress images and optimize prompts to minimize token usage

### 2.16 Test Data\nPreload realistic test data across all categories (Lost Items, Found Items, Public Return Section) to demonstrate full functionality including:
- Active lost and found items
- Items with various conclusion statuses
- Public history items (Owner Found, Item Found) displayed in Public Return Section with reporter and receiver emails
- Private history items (Owner Not Found, Item Not Found)\n- Chat conversations with various states (concluded, not concluded, deleted by one user)\n- Messages with different delivery states (sent, delivered, read)
- Unread messages to test popup notifications and badge behavior
- Items approaching 6-month auto-delete threshold
- Accurate homepage statistics reflecting current counts
- Sample images for testing Gemini 2.5 Flash API image search functionality

## 3. Design Style\n
### 3.1 Visual Theme
- **Color Scheme**: Trust-inspiring blue primary color (#2563EB) paired with clean white backgrounds and soft gray accents (#F3F4F6 for cards, #6B7280 for secondary text)
- **Layout Style**: Card-based grid layout with clear visual separation between sections, ample white space for breathing room
- **Typography**: Modern sans-serif font (Inter or similar) with clear hierarchy — bold headings, regular body text, and subtle labels
\n### 3.2 Interactive Elements
- **Smooth Animations**: Fade-in effects for page loads, hover scale transforms on cards (1.02x), smooth transitions (200-300ms) on all interactive elements
- **Button Styles**: Rounded corners (8px), solid primary buttons with hover darkening effect, outlined secondary buttons, disabled state with reduced opacity
- **Card Design**: Soft shadows (0 1px 3px rgba(0,0,0,0.1)), 12px border radius, hover elevation effect\n- **Counter Animations**: Smooth number transitions when statistics update (including real-time updates when conclusions are made)
- **Sidebar Animation**: Smooth slide-in/slide-out effect with backdrop overlay, fully scrollable on mobile devices
- **Match Badges**: Distinctive badge design for AI-identified matches with confidence percentage display
- **Conclusion Buttons**: Prominent, clearly labeled buttons with distinct styling for different conclusion options
- **Disabled Button Styling**: Grayed-out appearance with reduced opacity (0.5) and no-cursor pointer for disabled Delete Chat button
- **History Badges**: Clear visual indicators for MAIN_HISTORY items (public) vs USER_HISTORY items (private)\n- **Location Suggestions**: Dropdown or autocomplete UI for location field with quick-select options (Student Activity Centre, Day Canteen, Night Canteen, Others, etc.)
- **Message Tick Icons**: WhatsApp-style tick icons (✔️, ✔️✔️, 💙✔️✔️) with smooth color transitions
- **Popup Notification Design**: Clean, modern popup near ☰ icon with sender name and message preview, auto-dismiss after 5 seconds
- **Unread Badge Design**: Red or blue circular badge with unread count, positioned on chat items in chat list
- **Image Search Button**: Prominent 'Image Search' button with camera/image icon, positioned alongside text search input
- **Image Upload Interface**: Clean drag-and-drop zone with file browser option, showing image preview thumbnails after upload
- **AI Analysis Indicator**: Animated loading indicator during Gemini 2.5 Flash API image analysis with progress text
- **Match Result Highlighting**: Visual highlighting of matching keywords between Gemini-generated description and item descriptions
- **Email Display in History**: Clear, readable display of reporter and receiver emails in Public Return Section with appropriate formatting

### 3.3 User Experience\n- **Production-Level UX**: Intuitive navigation flow, clear call-to-action buttons, instant feedback on user actions
- **Trust-First Design**: Professional appearance, clear information hierarchy, reassuring color palette, transparent process indicators
- **Responsive Behavior**: Smooth transitions between states, loading indicators where appropriate, error handling with friendly messages
- **Real-Time Updates**: Homepage statistics refresh automatically without page reload when items added, status changes occur, or conclusions are made
- **Guest-Friendly Browsing**: Users can explore all content without login barriers, with clear prompts when authentication needed
- **AI Transparency**: Clear indication when matches are AI-generated, with confidence scores visible to users
- **Frictionless Return Access**: Returning users enjoy seamless login experience without OTP verification
- **Secure Password Recovery**: Clear, user-friendly password reset flow with helpful feedback messages
- **Controlled Chat Lifecycle**: Clear visual indicators for chat states, conclusion requirements, and deletion permissions
- **Role-Based Interface**: Different UI elements shown based on user role (item reporter vs. non-reporter)
- **Public History Transparency**: Clear distinction between public Public Return Section and private User History, with reporter and receiver contact information visible in public history
- **Auto-Cleanup Awareness**: Optional notification or indicator for items approaching 6-month auto-delete threshold\n- **Location Input Convenience**: Quick-select location suggestions improve reporting speed and consistency
- **WhatsApp-Like Messaging**: Familiar messaging experience with delivery states, blue ticks, and popup notifications
- **Intelligent Notification System**: Popup notifications appear immediately near ☰ icon, unread badges shown only when chat list is opened
- **Seamless Real-Time Experience**: All message states, ticks, popups, and badges update instantly without page reloads
- **Visual Search Convenience**: Image search with Gemini 2.5 Flash API provides intuitive alternative to text-based search, especially useful when item descriptions are difficult to articulate
- **AI-Powered Search Feedback**: Clear feedback during image analysis process with progress indicators and result explanations
\n## 4. Technical Stack
- **Frontend**: medo.dev\n- **Authentication**: Supabase Email OTP (first-time only) / Session-based login (returning users) / OTP-based password reset
- **Database**: Supabase PostgreSQL\n- **Real-Time Communication**: Supabase Realtime (for messages, delivery states, read receipts, popup notifications, unread badges)
- **Email Service**: Supabase Email Service\n- **Scheduled Tasks**: Supabase cron jobs or database triggers for auto-cleanup
- **Image Recognition**: AI-powered visual similarity search for image-based item matching
- **Gemini API**: **Google Gemini 2.5 Flash API** for image description extraction and intelligent matching
- **API Key**: AIzaSyA27DHTEleWLXl3CPuAipEOvGOKosHekS8 (configured in environment variables as GEMINI_API_KEY)\n- **API Model Version**: Strictly use **Gemini 2.5 Flash** model for all image analysis requests
\n## 5. Referenced Images
- image.png (sidebar navigation reference)
- image-2.png (UI layout reference)