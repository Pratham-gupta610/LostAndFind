# FINDIT.AI Multi-Campus Lost & Found Web Application Requirements Document

## 1. Application Overview

### 1.1 Application Name
FINDIT.AI\n
### 1.2 Application Description
A modern, highly interactive multi-campus Lost & Found web application designed to help users report and search for lost or found items across multiple campus locations, with a focus on trust-first design and seamless user experience. Features secure college email authentication with OTP verification for first-time users only, built-in messaging system with editable and deletable messages for direct communication between users, and AI-powered intelligent matching to automatically identify potential matches between lost and found items.

### 1.3 Target Users
Campus community members (students, faculty, staff) who need to report lost items, search for found items, or help return items to their owners.

## 2. Core Functionality

### 2.1 User Authentication & Authorization
\n#### 2.1.1 First-Time User Authentication Flow
- **Email Entry**: User enters college email address in format *@iiitg.ac.in\n- **New User Detection**: System checks if email exists in database
- **OTP Generation**: If email is new, system sends one-time password to email
- **OTP Validation**: User enters OTP within 5-10 minutes expiry window
- **Email Verification**: Upon successful OTP verification, email is marked as verified
- **Account Creation**: User account is created with verified email status
- **Phone Number Collection**: During first login, user provides phone number for contact purposes
- **Auto Login**: User is automatically logged in after verification

#### 2.1.2 Returning User Authentication Flow
- **Email Entry**: User enters previously registered email
- **Existing User Detection**: System recognizes email already exists and is verified
- **Direct Login**: User is logged in immediately without OTP requirement
- **Session-Based Access**: Login maintained through secure session tokens or magic links
- **No OTP Friction**: No verification email sent for returning users

#### 2.1.3 Forgot Password Flow (Registered Users Only)
\n**Entry Point**\n- **Sign-In Page**: 'Forgot Password?' link visible only on sign-in page
\n**Step1: Password Reset Request**
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
- Enforce password rules:
  - Minimum 8 characters
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
- Limit OTP resend attempts (max 3 attempts per15 minutes)
- Log all reset attempts for security monitoring
- Protect against brute-force attacks with rate limiting
- Password reset OTP separate from first-time login OTP

**UX Requirements**
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

#### 2.1.5 Guest Access & Login Requirements
- **Guest Browsing**: Users can view Lost Items, Found Items, and Return History without authentication
- **Login Required Actions**: Authentication required only when reporting items or contacting other users
- **User Profile Storage**: Stores email, phone number, name, verification status, and login history
\n### 2.2 Sign In/Sign Up Flow
- **Homepage Sign In Button**: Homepage displays only'Sign In' button (no separate Sign Up option)
- **Sign In Page**: Clicking 'Sign In' directs to login page
- **Forgot Password Link**: Login page includes 'Forgot Password?' link for password recovery
- **Sign Up Link**: Login page includes text 'Don't have an account? Sign Up' at bottom
- **Sign Up Page**: New users create accounts with OTP verification on first registration

### 2.3 User Profile Management
- **Clickable Profile**: User profile accessible from top navigation area
- **Edit Profile**: Users can edit:\n  - Full Name
  - Phone Number
  - Email (display only, cannot be changed)
- **Profile Update**: Changes saved immediately and reflected across application
- **Profile Access**: Login required to access and edit profile

### 2.4 Navigation System
- **Right Sidebar Menu**: All navigation items (Lost Items, Found Items, Report Lost, Report Found, Return History, Messages) placed in collapsible sidebar on right side
- **Sidebar Toggle**: Open/close sidebar using menu icon
- **Mobile Scrollable Sidebar**: On mobile devices (Android and iOS), sidebar content is fully scrollable to access all menu items comfortably
- **Top Header**: Displays'FINDIT.AI' site name with search icon, keeping top area clean and minimal
- **Mobile Responsive**: Sidebar adapts to mobile screens with smooth slide-in/slide-out animations

### 2.5 Homepage Structure
The homepage displays three clearly separated sections with real-time statistics:
- **Lost Items Section**: Shows all reported lost items with live count
- **Found Items Section**: Shows all reported found items with live count
- **Recently Returned Items Section**: Shows history of successful returns with live count (clickable items)

**Real-Time Counter Updates**: All three section counters automatically update immediately when new items are added or status changes occur.

All sections sorted by latest first with date-range filter options.

### 2.6 Search System
Two separate, independent search systems:
- **Lost Items Search**: Searches only within lost item reports
- **Found Items Search**: Searches only within found item reports\n
Search results update instantly to reflect new entries with no mixing between categories.

### 2.7 Item Reporting\n- **Report Lost Item**: Form for users to submit lost item details (requires login), with'My Reports' history visible on same page
  - Fields include: title, description, category, color, brand, location, date, optional images
- **Report Found Item**: Form for users to submit found item details (requires login), with 'My Reports' history visible on same page
  - Fields include: title, description, category, color, brand, location, date, optional images
- Both forms immediately add entries to respective searchable databases and update homepage counters in real-time
- Upon submission, AI Matching Assistant automatically evaluates potential matches\n
### 2.8 Item Details Page
- Clickable items from Lost, Found, or Returned sections open full details pages
- Lost/Found item details show: item description, date, location, contact info, and other relevant fields
- **Contact Button**: Each item detail page includes 'Contact Owner/Finder' button that opens messaging interface (requires login)
- Returned item details show: owner information, finder information, return date, and item details
- **Match Indicator**: If item is identified as potential match by AI system, badge displays match confidence percentage

### 2.9 AI-Powered Lost & Found Matching Assistant
\n#### 2.9.1Matching Algorithm
- **Automatic Evaluation**: When found item is reported, system automatically compares against all existing lost item reports
- **Similarity Analysis**: AI evaluates matches based on:
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

#### 2.9.3 Match Output Format
System generates match results in following structure:
- similarity_score: numerical value (0-100)
- is_match: boolean (true if score ≥ 75%)\n- reason: short explanation text
- actions: send_email (boolean), enable_chat (boolean)\n\n#### 2.9.4 Privacy & Safety Rules
- Personal contact details (phone numbers, emails) never exposed directly in match notifications
- Users must initiate contact through secure in-app messaging system
- Conservative matching approach: only scores ≥ 75% trigger notifications
\n### 2.10 Messaging System
\n#### 2.10.1 Chat Access & Initiation
- **Chat Interface**: Built-in messaging system allowing users to communicate directly within application
- **Contact Flow**: When someone reports found item, they can contact person who reported lost item through chat section
- **AI Match Integration**: When potential match identified, private chat session automatically enabled between owner and finder
- **Login Required**: Users must be logged in to access messaging features
- **Private Sessions**: Chat sessions accessible only to matched users involved\n
#### 2.10.2 Message Management Features
- **Editable Messages**: Users can edit only their own messages
  - Edited messages update in real-time for both participants
  - Show'edited' label with timestamp after modification
  - Edit history not visible to other user
- **Deletable Messages**: Users can delete only their own messages
  - Support both soft delete (message replaced with 'Deleted') and hard delete (removed from database)
  - Deletion changes reflect instantly in real-time chat
  - Other user cannot recover deleted messages
- **Permission Control**: Users cannot edit or delete others' messages

#### 2.10.3 Chat Features
- **Real-Time Delivery**: Messages delivered instantly with real-time synchronization
- **Message Notifications**: Users receive notifications for new messages
- **Conversation History**: All message threads preserved and accessible from Messages section in sidebar
- **Chat History Deletion**:
  - Users can delete entire chat history at any time from within conversation
  - Deletion is permanent and removes all messages from storage
  - When one user deletes chat history, other user receives notification that chat history was cleared
  - Deleted messages never regenerated or recovered
- **User Privacy**: Phone numbers and emails only shared if users choose to do so within chat conversations

#### 2.10.4 Technical Implementation
- **Backend**: Supabase Auth for authentication, Supabase PostgreSQL for data storage
- **Real-Time**: Supabase Realtime for instant message synchronization
- **Security**: Row Level Security (RLS) ensures users cannot access chats they're not part of
- **Data Model**: Messages table includes: id, chat_id, sender_id, content, is_deleted, edited_at, created_at
\n### 2.11 Filtering & Sorting
- All item lists (Lost/Found/Returned) include date-range filters
- Default sorting: latest entries first
- Filter options easily accessible and responsive
\n### 2.12 My Reports History
Users can view their own submission history directly on Report Lost/Report Found pages, showing all previously submitted reports.\n
### 2.13 Test Data
Preload realistic test data across all categories (Lost Items, Found Items, Returned Items) to demonstrate full functionality.

## 3. Design Style\n
### 3.1 Visual Theme
- **Color Scheme**: Trust-inspiring blue primary color (#2563EB) paired with clean white backgrounds and soft gray accents (#F3F4F6 for cards, #6B7280 for secondary text)
- **Layout Style**: Card-based grid layout with clear visual separation between sections,ample white space for breathing room
- **Typography**: Modern sans-serif font (Inter or similar) with clear hierarchy — bold headings, regular body text, and subtle labels
\n### 3.2 Interactive Elements
- **Smooth Animations**: Fade-in effects for page loads, hover scale transforms on cards (1.02x), smooth transitions (200-300ms) on all interactive elements
- **Button Styles**: Rounded corners (8px), solid primary buttons with hover darkening effect, outlined secondary buttons
- **Card Design**: Soft shadows (01px 3px rgba(0,0,0,0.1)),12px border radius, hover elevation effect
- **Counter Animations**: Smooth number transitions when statistics update
- **Sidebar Animation**: Smooth slide-in/slide-out effect with backdrop overlay, fully scrollable on mobile devices
- **Match Badges**: Distinctive badge design for AI-identified matches with confidence percentage display

### 3.3 User Experience\n- **Production-Level UX**: Intuitive navigation flow, clear call-to-action buttons, instant feedback on user actions
- **Trust-First Design**: Professional appearance, clear information hierarchy, reassuring color palette, transparent process indicators
- **Responsive Behavior**: Smooth transitions between states, loading indicators where appropriate, error handling with friendly messages
- **Real-Time Updates**: Homepage statistics refresh automatically without page reload when items added or status changes
- **Guest-Friendly Browsing**: Users can explore all content without login barriers, with clear prompts when authentication needed
- **AI Transparency**: Clear indication when matches are AI-generated, with confidence scores visible to users
- **Frictionless Return Access**: Returning users enjoy seamless login experience without OTP verification
- **Secure Password Recovery**: Clear, user-friendly password reset flow with helpful feedback messages

## 4. Technical Stack
- **Frontend**: medo.dev\n- **Authentication**: Supabase Email OTP (first-time only) / Session-based login (returning users) / OTP-based password reset
- **Database**: Supabase PostgreSQL\n- **Real-Time Communication**: Supabase Realtime
- **Email Service**: Supabase Email Service
\n## 5. Referenced Images
- image.png (sidebar navigation reference)
- image-2.png (UI layout reference)