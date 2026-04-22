# Application Shell Specification

## Overview
Wills24 Admin uses a sidebar + top bar layout pattern. A fixed sidebar on the left provides primary navigation across all 8 sections, while a top bar displays breadcrumbs and a user menu. The sidebar uses a dark neutral background with orange accents for active states.

## Navigation Structure
- Dashboard Home → /dashboard-home (default landing page)
- Sales CRM → /sales-crm
- Accounts → /accounts
- Customers → /customers
- Case Management → /case-management
- Partners → /partners
- Team Management → /team-management
- Reports & Analytics → /reports-analytics

## User Menu
Located in the top-right corner of the top bar. Displays user avatar (initials fallback), user name, and role. Dropdown contains Profile and Logout options.

## Layout Pattern
- **Sidebar (left):** 240px fixed width, dark neutral background (neutral-900), logo/brand at top, icon + label nav items, orange-500 highlight on active item
- **Top bar (top):** Full width minus sidebar, white/neutral background, breadcrumbs on left, user menu on right
- **Content area:** Fills remaining space, scrollable, padded

## Responsive Behavior
- **Desktop (lg+):** Full sidebar with icons and labels, top bar with breadcrumbs and user menu
- **Tablet (md):** Collapsed sidebar showing icons only (64px wide), expandable on hover/click
- **Mobile (< md):** Sidebar hidden by default, hamburger menu button in top bar toggles sidebar as overlay

## Design Notes
- Sidebar uses product neutral palette (neutral-900 bg, neutral-400 text, orange-500 active)
- Top bar uses white background in light mode, neutral-900 in dark mode
- Navigation icons from lucide-react
- Logo text "Wills24" with orange accent on "24"
- Active nav item has orange-500 left border accent and orange-tinted background
