# FINDIT.AI Multi-Campus Lost & Found Web Application Requirements Document

## 1. Application Overview

### 1.1 Application Name
FINDIT.AI\n
### 1.2 Application Description
A modern, highly interactive multi-campus Lost & Found web application designed to help users report and search for lost or found items across multiple campus locations, with a focus on trust-first design and seamless user experience. Features secure college email authentication, built-in messaging system for direct communication between users, and AI-powered intelligent matching to automatically identify potential matches between lost and found items.

### 1.3 Target Users
Campus community members (students, faculty, staff) who need to report lost items, search for found items, or help return items to their owners.

## 2. Core Functionality\n
### 2.1 User Authentication & Authorization
- **College Email Login**: Users must authenticate using their college email address when attempting to report lost or found items
- **Email Format Validation**: System accepts email addresses in the format *@iiitg.ac.in (e.g., pratham.gupta25b@iiitg.ac.in)
- **Phone Number Access**: During first-time login, users are required to provide their phone number for contact purposes
- **Session Persistence**: Application remembers authenticated users across sessions, eliminating need for repeated login
- **Guest Browsing**: Users can view Lost Items, Found Items, and Return History sections without logging in
- **Login Required Actions**: Authentication is only required when users attempt to report lost/found items or contact other users
- **User Profile**: Stores user email, phone number, name, and authentication status

### 2.2 Sign In/Sign Up Flow
- **Homepage Sign In Button**: Homepage displays only'Sign In' button (no separate Sign Up option)
- **Sign In Page**: When users click 'Sign In', they are directed to login page
- **Sign Up Link**: Login page includes text 'Don't have an account? Sign Up' at the bottom
- **Sign Up Page**: Clicking 'Sign Up' link redirects to registration page where new users can create accounts
\n### 2.3 User Profile Management
- **Clickable Profile**: User profile is clickable from the top navigation area
- **Edit Profile**: Users can edit their profile information including:\n  - Full Name
  - Phone Number
  - Email (display only, cannot be changed)
- **Profile Update**: Changes are saved immediately and reflected across the application
- **Profile Access**: Users must be logged in to access and edit their profile

### 2.4 Navigation System
- **Right Sidebar Menu**: All navigation items (Lost Items, Found Items, Report Lost, Report Found, Return History, Messages) are placed in a collapsible sidebar on the right side of the screen
- **Sidebar Toggle**: Users can open/close the sidebar using a menu icon
- **Top Header**: Displays 'FINDIT.AI' site name with search icon, keeping the top area clean and minimal
- **Mobile Responsive**: Sidebar adapts to mobile screens with smooth slide-in/slide-out animations
\n### 2.5 Homepage Structure
The homepage displays three clearly separated sections with real-time statistics:
- **Lost Items Section**: Shows all reported lost items with live count
- **Found Items Section**: Shows all reported found items with live count
- **Recently Returned Items Section**: Shows history of successful returns with live count (clickable items)

**Real-Time Counter Updates**: All three section counters (Lost Items, Found Items, Returns) automatically update immediately when new items are added or status changes occur.

All sections sorted by latest first with date-range filter options.

### 2.6 Search System
Two separate, independent search systems:
- **Lost Items Search**: Searches only within lost item reports
- **Found Items Search**: Searches only within found item reports\n\nSearch results update instantly to reflect new entries with no mixing between categories.

### 2.7 Item Reporting\n- **Report Lost Item**: Form for users to submit lost item details (requires login), with'My Reports' history visible on the same page
  - Fields include: title, description, category, color, brand, location, date, optional images
- **Report Found Item**: Form for users to submit found item details (requires login), with 'My Reports' history visible on the same page
  - Fields include: title, description, category, color, brand, location, date, optional images
- Both forms immediately add entries to their respective searchable databases and update homepage counters in real-time
- Upon submission, the AI Matching Assistant automatically evaluates potential matches\n
### 2.8 Item Details Page
- Clickable items from Lost, Found, or Returned sections open full details pages
- Lost/Found item details show: item description, date, location, contact info, and other relevant fields
- **Contact Button**: Each item detail page includes a 'Contact Owner/Finder' button that opens the messaging interface (requires login)
- Returned item details show: owner information, finder information, return date, and item details
- **Match Indicator**: If the item is identified as a potential match by the AI system, a badge displays the match confidence percentage

### 2.9 AI-Powered Lost & Found Matching Assistant
\n#### 2.9.1 Matching Algorithm
- **Automatic Evaluation**: When a found item is reported, the system automatically compares it against all existing lost item reports
- **Similarity Analysis**: The AI evaluates matches based on:
  - Text similarity (title, description, category)
  - Attribute matching (color, brand, location proximity, time proximity)
  - Visual similarity (if images are provided)
  - Object type, shape, size, and unique identifiers
- **Similarity Score**: Calculates a match score between 0 and 100\n- **Match Threshold**: Items with similarity score ≥ 75% are marked as 'Potential Match'
\n#### 2.9.2 Match Notification System
- **Email Notification**: When a potential match is identified (score ≥ 75%), an automated email is sent to the owner of the lost item
- **Email Content**:
  - Item summary with key details
  - Match confidence percentage
  - Brief explanation (1-2 sentences) describing why the match is likely
  - Secure link to view the found item details and contact the finder
  - Safety instructions reminding users not to share personal details immediately
- **Real-Time Alerts**: In-app notification badge appears for matched users

#### 2.9.3 Match Output Format
The system generates match results in the following structure:
- similarity_score: numerical value (0-100)
- is_match: boolean (true if score ≥ 75%)
- reason: short explanation text
- actions: send_email (boolean), enable_chat (boolean)\n\n#### 2.9.4 Privacy & Safety Rules
- Personal contact details (phone numbers, emails) are never exposed directly in match notifications
- Users must initiate contact through the secure in-app messaging system
- Conservative matching approach: only scores ≥ 75% trigger notifications
\n### 2.10 Messaging System
- **Chat Interface**: Built-in messaging system allowing users to communicate directly within the application
- **Contact Flow**: When someone reports a found item, they can contact the person who reported the lost item through the chat section
- **AI Match Integration**: When a potential match is identified, a private chat session is automatically enabled between the owner and finder
- **Real-Time Delivery**: Messages are delivered instantly with real-time synchronization
- **Message Notifications**: Users receive notifications for new messages\n- **Conversation History**: All message threads are preserved and accessible from the Messages section in sidebar
- **Chat History Deletion**:
  - Users can delete chat history at any time from within the conversation
  - Deletion is permanent and removes all messages from storage
  - When one user deletes chat history, the other user receives a notification that the chat history was cleared
  - Deleted messages are never regenerated or recovered
- **User Privacy**: Phone numbers and emails are only shared if users choose to do so within chat conversations
- **Login Required**: Users must be logged in to access messaging features
- **Private Sessions**: Chat sessions are accessible only to the matched users involved

### 2.11 Filtering & Sorting
- All item lists (Lost/Found/Returned) include date-range filters\n- Default sorting: latest entries first
- Filter options easily accessible and responsive
\n### 2.12 My Reports History
Users can view their own submission history directly on the Report Lost/Report Found pages, showing all previously submitted reports.\n
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
- **Sidebar Animation**: Smooth slide-in/slide-out effect with backdrop overlay
- **Match Badges**: Distinctive badge design for AI-identified matches with confidence percentage display

### 3.3 User Experience\n- **Production-Level UX**: Intuitive navigation flow, clear call-to-action buttons, instant feedback on user actions
- **Trust-First Design**: Professional appearance, clear information hierarchy, reassuring color palette, transparent process indicators
- **Responsive Behavior**: Smooth transitions between states, loading indicators where appropriate, error handling with friendly messages
- **Real-Time Updates**: Homepage statistics refresh automatically without page reload when items are added or status changes
- **Guest-Friendly Browsing**: Users can explore all content without login barriers, with clear prompts when authentication is needed
- **AI Transparency**: Clear indication when matches are AI-generated, with confidence scores visible to users

## 4. Referenced Images
- image.png (sidebar navigation reference)
- image-2.png (UI layout reference)