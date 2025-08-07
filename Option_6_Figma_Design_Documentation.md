# Option 6: AI-First with Manual Focus - Figma Design Documentation

## Overview
Option 6 represents an AI-first keyword list creation interface with a clean manual editing focus mode. This design prioritizes AI-generated content while providing a distraction-free manual editing experience when needed.

## Design Philosophy
- **AI-First**: The interface defaults to AI mode with no switching tabs
- **Focus Mode**: Manual editing opens in a dedicated, distraction-free mode
- **Clean Separation**: Clear visual and functional separation between AI and manual workflows
- **Minimalist**: Reduced cognitive load through simplified UI patterns

---

## Panel Specifications

### Main Container
- **Width**: 700px (fixed)
- **Height**: 100vh (full viewport height)
- **Position**: Fixed, right-aligned
- **Background**: #FFFFFF
- **Shadow**: `box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1)`
- **Animation**: Slide-in from right (300ms ease-in-out)
- **Z-index**: 20

---

## AI Mode (Default State)

### Header Section
**Container**:
- **Height**: 89px (fixed)
- **Padding**: 32px horizontal, 32px top, 16px bottom
- **Background**: #F8F9FA (background-secondary)
- **Border**: Bottom border 1px solid #E6E9EC

**Components**:

#### Editable List Name
- **Font**: DM Sans, 24px, Regular
- **Color**: #092540 (text-primary)
- **Behavior**: Dynamic width based on content (min: 120px, max: auto)
- **States**:
  - Default: Transparent background, bottom border transparent
  - Hover: Bottom border #E6E9EC
  - Focus: Bottom border #2D54B8, outline none
- **Icon**: Edit icon (16x16px) adjacent to input

#### Close Button
- **Size**: 40x40px
- **Shape**: Circle
- **Background**: Transparent (hover: #F5F5F5)
- **Icon**: X icon (24x24px), color #092540
- **Position**: Right-aligned

### Content Section
**Container**:
- **Padding**: 40px horizontal, 16px top
- **Display**: Flex column, gap 16px
- **Overflow**: Hidden with min-height: 0

#### AI Input Field
**Container**:
- **Height**: 48px
- **Border Radius**: 50px (pill shape)
- **Background**: White
- **Border**: 1px gradient border (from #60A5FA to #34D399)
- **Implementation**: Gradient background with inner white rounded container

**Components**:
- **AI Icon** (24x24px):
  - Position: Left, 16px from edge
  - SVG path with #2D54B8 fill
  - Sparkle/star design indicating AI functionality

- **Selected Keywords Tag** (conditional):
  - **Display**: When `includeSelectedKeywords` is true and keywords exist
  - **Background**: Linear gradient from #a8f7cf to #a6c0ff
  - **Padding**: 8px horizontal, 4px vertical
  - **Border Radius**: 5px
  - **Text**: "X SELECTED KEYWORDS" (12px, bold, uppercase, #3a5166)
  - **Height**: 24px

- **Dynamic Query Tags**:
  - Same styling as Selected Keywords Tag
  - **Close Button**: 12x12px X icon in each tag
  - **Hover**: Slight opacity change on close button

- **Text Input**:
  - **Placeholder**: "Describe your topic or product in a few words"
  - **Font**: DM Sans, 14px
  - **Color**: #092540
  - **Background**: Transparent
  - **Border**: None, outline: none

**Instruction Text**:
- **Font**: DM Sans, 14px, Regular
- **Color**: #6B7280 (text-secondary)
- **Content**: "Enter your topic, then click Create to generate your list."

#### Generate Button & Checkbox Section
**Layout**: Horizontal flex, space-between alignment

**Generate Button**:
- **Padding**: 12px horizontal, 8px vertical
- **Border Radius**: 18px
- **Font**: DM Sans, 14px, Medium
- **States**:
  - Enabled: Background #2D54B8, text white
  - Disabled: Background #F3F4F6, text #9CA3AF
  - Hover (enabled): Background #1E40AF

**Checkbox Section**:
- **Layout**: Horizontal flex, center-aligned, gap 8px
- **Checkbox**:
  - **Size**: 16x16px
  - **Border Radius**: 2px
  - **States**:
    - Unchecked: Border 1px #D1D5DB, background white
    - Checked: Background #2D54B8, white checkmark
    - Disabled: Background #F3F4F6, border #E5E7EB
- **Label**: DM Sans, 14px, dynamic color based on state
  - Enabled: #092540
  - Disabled: #b6bec6

**Tooltip** (when disabled):
- **Background**: #1F2937
- **Text**: "Select keywords first" (white, 12px)
- **Position**: Relative to checkbox, arrow pointing to element
- **Z-index**: 9999

#### Keyword Suggestions Section
**Container**:
- **Flex**: 1 (takes remaining height)
- **Min Height**: 0
- **Overflow**: Auto

**Header**:
- **Text**: "Keyword Suggestions" (16px, Bold, DM Sans, #092540)
- **Margin Bottom**: 16px

**Keyword List Component**:
- **Background**: Inherits from parent
- **Max Height**: None (full available height)
- **Loading State**: AI loader GIF centered

#### Selected Keywords Section (Minimized View)
**Container**:
- **Flex Shrink**: 0
- **Height**: 100px (fixed)
- **Padding**: 16px
- **Background**: #F8F9FA
- **Border Radius**: 8px
- **Border**: 1px solid #E5E7EB

**Header Row**:
- **Layout**: Flex, space-between
- **Left**: "Selected Keywords (X)" + limit counter
- **Right**: "Add Manually" or "View & Edit Manually" link

**Counter Display**:
- **Font**: DM Sans, 14px, Medium
- **Color**: Dynamic based on count (red if ≥50)

**Content Area**:
- **Empty State**:
  - **Icon**: Plus circle (24x24px, #9CA3AF)
  - **Text**: Multi-line description with "Add Manually" link
  - **Illustration**: Empty state image (232x232px)

- **Filled State**:
  - **Dynamic Keyword Display**: Single row with overflow handling
  - **Keywords**: White background chips with 1px gray border
  - **Overflow**: "+X More Keywords" indicator
  - **Text**: "X of 50 keywords selected" with warning if at limit

---

## Focus Mode (Manual Editing)

### Header Section
**Layout**: Same dimensions as AI mode header

**Back Button**:
- **Layout**: Flex with gap 8px
- **Icon**: Left arrow (20x20px)
- **Text**: "Back to Keywords" (18px, DM Sans)
- **Color**: #092540 (hover: #2D54B8)

**List Name**: Same component as AI mode

**Close Button**: Same as AI mode

### Content Section
**Manual Input Area**:
- **Instruction Text**: "Type or paste keywords, then press Enter or click Add"
- **Input Container**:
  - **Height**: 40px
  - **Border**: 1px solid #D1D5DB
  - **Border Radius**: 8px
  - **Padding**: 16px
  - **Icon**: Search icon (20x20px, #9CA3AF)
  - **Placeholder**: "E.g. headphones, wireless, bluetooth"

**Add Button**:
- **Style**: Current button styling (rounded-18px)
- **Text**: "Add"
- **States**: Same as generate button

**Selected Keywords List**:
- **Flex**: 1 (takes remaining space)
- **Layout**: Full keyword management interface
- **Features**: Remove functionality, keyword limit enforcement

### Footer Section
**Container**:
- **Background**: White
- **Padding**: 16px 24px
- **Border Top**: 1px solid #E6E9EC
- **Shadow**: `box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1)`

**Buttons**:
- **Back to Keywords**: Secondary style (text-primary-blue)
- **Save and Analyze**: Primary style, disabled when no keywords

---

## Interactive States

### Animations
- **Panel Slide**: 300ms ease-in-out transform
- **Mode Transition**: Fade between AI and Focus modes
- **Button Hover**: 200ms transition on all interactive elements
- **Input Focus**: Smooth border color transitions

### Responsive Behavior
- **Fixed Width**: 700px at all viewport sizes
- **Content Overflow**: Scroll within sections as needed
- **Z-indexing**: Proper layering for tooltips and overlays

### Loading States
- **AI Generation**: Centered AI loader GIF in suggestions area
- **Button States**: Loading spinner in generate button

---

## Component Library Requirements

### Typography Scale
- **Headings**: DM Sans 24px (list name), 18px (back button), 16px (section headers)
- **Body**: DM Sans 14px (primary text), 12px (labels, tags)
- **Helper Text**: DM Sans 14px, color #6B7280

### Color Palette
- **Primary Blue**: #2D54B8
- **Primary Dark**: #1E40AF
- **Background Secondary**: #F8F9FA
- **Text Primary**: #092540
- **Text Secondary**: #6B7280
- **Border Default**: #E6E9EC
- **Success Green**: #34D399
- **Warning Red**: #EF4444

### Spacing System
- **Container Padding**: 40px horizontal, 32px vertical
- **Component Gaps**: 16px standard, 8px small
- **Button Padding**: 12px horizontal, 8px vertical
- **Input Height**: 40px-48px depending on context

### Border Radius
- **Buttons**: 18px
- **Inputs**: 8px (rectangular), 50px (pill-shaped)
- **Cards**: 8px
- **Tags**: 5px

---

## Implementation Notes

### State Management
- **Mode Switching**: `isFocusMode` boolean controls layout
- **Keyword Limits**: 50 keyword maximum with visual feedback
- **Data Persistence**: State maintained when switching modes

### Accessibility
- **Focus Management**: Clear focus indicators on all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic markup
- **Color Contrast**: WCAG AA compliance for all text

### Performance
- **Virtual Scrolling**: For large keyword lists
- **Debounced Input**: For search and filter operations
- **Lazy Loading**: For keyword suggestions

---

## Figma File Structure

### Pages
1. **Option 6 - Overview**: Complete flow documentation
2. **AI Mode Components**: Individual component designs
3. **Focus Mode Components**: Manual editing interface components
4. **States & Variants**: All interactive states documented
5. **Color & Typography**: Design system specifications

### Component Organization
- **Headers/**: AI mode header, Focus mode header
- **Inputs/**: AI input field, Manual input field, List name input
- **Buttons/**: Primary button, Secondary button, Icon buttons
- **Cards/**: Selected keywords card, Empty state card
- **Lists/**: Keyword suggestion list, Selected keyword list
- **Icons/**: AI icon, Edit icon, Search icon, Arrow icons

This documentation provides the complete blueprint for recreating Option 6 in Figma with pixel-perfect accuracy and full interactive state coverage.