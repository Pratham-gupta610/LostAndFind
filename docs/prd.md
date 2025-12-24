# FINDIT.AI Multi-Campus Lost & Found Web Application Requirements Document

## 1. Application Overview

### 1.1 Application Name
FINDIT.AI\n
### 1.2 Application Description
A modern, highly interactive multi-campus Lost & Found web application designed to help users report and search for lost or found items across multiple campus locations, with a focus on trust-first design and seamless user experience. Features secure college email authentication and built-in messaging system for direct communication between users.

### 1.3 Target Users
Campus community members (students, faculty, staff) who need to report lost items, search for found items, or help return items to their owners.

## 2. Core Functionality\n
### 2.1 User Authentication & Authorization
- **College Email Login**: Users must authenticate using their college email address upon first entry to the application
- **Phone Number Access**: During first-time login, users are required to provide their phone number for contact purposes
- **Session Persistence**: Application remembers authenticated users across sessions, eliminating need for repeated login
- **User Profile**: Stores user email, phone number, and authentication status\n
### 2.2 Homepage Structure
The homepage displays three clearly separated sections with real-time statistics:
- **Lost Items Section**: Shows all reported lost items with live count\n- **Found Items Section**: Shows all reported found items with live count
- **Recently Returned Items Section**: Shows history of successful returns with live count (clickable items)

**Real-Time Counter Updates**: All three section counters (Lost Items, Found Items, Returns) automatically update immediately when new items are added or status changes occur.

All sections sorted by latest first with date-range filter options.

### 2.3 Navigation System
Top header displays'FINDIT.AI' site name, followed by a clean navigation bar containing:
- Home\n- Lost Items
- Found Items
- Report Lost\n- Report Found
- History of Returns
- Messages (new)
\n### 2.4 Search System
Two separate, independent search systems:
- **Lost Items Search**: Searches only within lost item reports
- **Found Items Search**: Searches only within found item reports

Search results update instantly to reflect new entries with no mixing between categories.

### 2.5 Item Reporting
- **Report Lost Item**: Form for users to submit lost item details, with'My Reports' history visible on the same page
- **Report Found Item**: Form for users to submit found item details, with 'My Reports' history visible on the same page
- Both forms immediately add entries to their respective searchable databases and update homepage counters in real-time

### 2.6 Item Details Page
- Clickable items from Lost, Found, or Returned sections open full details pages
- Lost/Found item details show: item description, date, location, contact info, and other relevant fields
- **Contact Button**: Each item detail page includes a 'Contact Owner/Finder' button that opens the messaging interface
- Returned item details show: owner information, finder information, return date, and item details

### 2.7 Messaging System
- **Chat Interface**: Built-in messaging system allowing users to communicate directly within the application
- **Contact Flow**: When someone reports a found item, they can contact the person who reported the lost item through the chat section
- **Message Notifications**: Users receive notifications for new messages\n- **Conversation History**: All message threads are preserved and accessible from the Messages section in navigation
- **User Privacy**: Phone numbers and emails are only shared if users choose to do so within chat conversations

### 2.8 Filtering & Sorting
- All item lists (Lost/Found/Returned) include date-range filters\n- Default sorting: latest entries first
- Filter options easily accessible and responsive

### 2.9 My Reports History
Users can view their own submission history directly on the Report Lost/Report Found pages, showing all previously submitted reports.\n
### 2.10 Test Data
Preload realistic test data across all categories (Lost Items, Found Items, Returned Items) to demonstrate full functionality.

## 3. Design Style\n
### 3.1 Visual Theme
- **Color Scheme**: Trust-inspiring blue primary color (#2563EB) paired with clean white backgrounds and soft gray accents (#F3F4F6 for cards, #6B7280 for secondary text)
- **Layout Style**: Card-based grid layout with clear visual separation between sections,ample white space for breathing room
- **Typography**: Modern sans-serif font (Inter or similar) with clear hierarchy — bold headings, regular body text, and subtle labels

### 3.2 Interactive Elements
- **Smooth Animations**: Fade-in effects for page loads, hover scale transforms on cards (1.02x), smooth transitions (200-300ms) on all interactive elements
- **Button Styles**: Rounded corners (8px), solid primary buttons with hover darkening effect, outlined secondary buttons
- **Card Design**: Soft shadows (01px 3px rgba(0,0,0,0.1)),12px border radius, hover elevation effect
- **Counter Animations**: Smooth number transitions when statistics update\n
### 3.3 User Experience
- **Production-Level UX**: Intuitive navigation flow, clear call-to-action buttons, instant feedback on user actions
- **Trust-First Design**: Professional appearance, clear information hierarchy, reassuring color palette, transparent process indicators
- **Responsive Behavior**: Smooth transitions between states, loading indicators where appropriate, error handling with friendly messages
- **Real-Time Updates**: Homepage statistics refresh automatically without page reload when items are added or status changes
\n## 4. Referenced Images
- image.png (appears4 times in user upload)\n- image-2.png