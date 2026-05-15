# Chat Notification System

## Overview

A real-time notification system that alerts users when they receive new chat messages, even when the chat window is closed.

## Features

### 🔔 Bell Icon Notification

- **Location**: Top-right corner of dashboard header
- **Visibility**: Only appears when there are unread messages
- **Badge**: Shows total count of unread messages
- **Animation**: Pulsing red badge for attention
- **Action**: Clicking navigates to orders/deliveries tab

### 💬 Per-Order Notification Badges

- **Location**: On "Chat with Agent/Customer" buttons
- **Badge**: Shows unread count for that specific order
- **Animation**: Pulsing red badge
- **Auto-clear**: Badge disappears when chat is opened

### ⚡ Real-time Updates

- Uses Socket.IO for instant notifications
- No page refresh needed
- Works across all tabs and windows

## How It Works

### For Customers:

1. Agent sends a message while chat is closed
2. Bell icon appears in header with count (e.g., "3")
3. Red badge appears on "Chat with Agent" button for that order
4. Click bell icon → navigates to "My Orders" tab
5. Click "Chat with Agent" → opens chat and clears badge

### For Agents:

1. Customer sends a message while chat is closed
2. Bell icon appears in header with count
3. Red badge appears on "Chat with Customer" button for that order
4. Click bell icon → navigates to "My Deliveries" tab
5. Click "Chat with Customer" → opens chat and clears badge

## Technical Implementation

### NotificationContext

Manages notification state across the application:

- Tracks unread messages per order
- Provides functions to mark messages as read
- Calculates total unread count
- Integrates with Socket.IO

### Key Functions:

```javascript
getTotalUnread(); // Returns total unread message count
getUnreadForOrder(orderId); // Returns unread count for specific order
markAsRead(orderId); // Clears unread count for an order
setActiveChatOrder(orderId); // Marks chat as active and clears badge
```

### Socket.IO Integration

Listens for `chat-message` events and:

1. Checks if message is from another user
2. Checks if chat window is currently open
3. If both conditions met, increments unread count
4. Updates UI in real-time

## UI Components

### Bell Icon (Dashboard Header)

```jsx
{
  getTotalUnread() > 0 && (
    <button className="relative p-2">
      <BellIcon />
      <span className="badge">{getTotalUnread()}</span>
    </button>
  );
}
```

### Chat Button Badge (Order List)

```jsx
<button className="relative">
  Chat with Agent
  {getUnreadForOrder(order.id) > 0 && (
    <span className="badge">{getUnreadForOrder(order.id)}</span>
  )}
</button>
```

## Styling

### Badge Styles:

- **Background**: Red (#EF4444)
- **Text**: White
- **Size**: 20px × 20px (header), 24px × 24px (buttons)
- **Position**: Absolute, top-right corner
- **Animation**: Pulse effect for attention
- **Font**: Bold, 10-12px

### Bell Icon:

- **Size**: 24px × 24px
- **Color**: Blue (#185697)
- **Hover**: Gray background
- **Transition**: Smooth 200ms

## User Experience Flow

### Scenario 1: Customer Receives Message

```
1. Agent sends: "I'm on my way!"
2. Customer sees: Bell icon with "1" badge
3. Customer clicks: Bell icon
4. System navigates: To "My Orders" tab
5. Customer sees: Red badge on "Chat with Agent" button
6. Customer clicks: "Chat with Agent"
7. System opens: Chat window
8. System clears: All badges for that order
```

### Scenario 2: Multiple Orders with Messages

```
1. Agent 1 sends message on Order #5
2. Agent 2 sends message on Order #7
3. Customer sees: Bell icon with "2" badge
4. Customer opens: Orders tab
5. Customer sees: Badge "1" on Order #5 chat button
6. Customer sees: Badge "1" on Order #7 chat button
7. Customer opens: Order #5 chat
8. System clears: Badge for Order #5 only
9. Bell icon updates: Shows "1" (Order #7 still unread)
```

## State Management

### Notification State Structure:

```javascript
{
  unreadMessages: {
    5: 2,  // Order #5 has 2 unread messages
    7: 1,  // Order #7 has 1 unread message
  },
  activeChat: 5  // Currently viewing Order #5 chat
}
```

### State Updates:

- **New message received**: Increment count for that order
- **Chat opened**: Set activeChat, clear count for that order
- **Chat closed**: Clear activeChat
- **Message sent**: No change (own messages don't count)

## Browser Notifications (Future Enhancement)

Currently not implemented, but can be added:

- Desktop notifications when app is in background
- Sound alerts for new messages
- Notification permission request

## Performance Considerations

### Optimizations:

1. **Debouncing**: Prevents excessive re-renders
2. **Memoization**: Uses React context efficiently
3. **Selective Updates**: Only updates affected components
4. **Socket Listeners**: Properly cleaned up on unmount

### Memory Management:

- Unread counts stored in memory only
- No persistence (resets on page refresh)
- Minimal state footprint

## Testing Scenarios

### Test 1: Basic Notification

1. Open two browsers (Customer & Agent)
2. Accept an order
3. Agent sends message
4. Verify: Customer sees bell icon with "1"
5. Verify: Badge on chat button shows "1"

### Test 2: Multiple Messages

1. Agent sends 3 messages
2. Verify: Bell icon shows "3"
3. Verify: Chat button badge shows "3"
4. Customer opens chat
5. Verify: All badges clear

### Test 3: Multiple Orders

1. Create 2 orders, both accepted
2. Agent 1 sends message on Order A
3. Agent 2 sends message on Order B
4. Verify: Bell icon shows "2"
5. Verify: Both chat buttons have badges
6. Open Order A chat
7. Verify: Bell icon shows "1"
8. Verify: Order A badge cleared, Order B badge remains

### Test 4: Chat Already Open

1. Customer has chat open for Order #5
2. Agent sends message
3. Verify: No badge appears (chat is active)
4. Verify: Message appears in chat immediately

## Troubleshooting

### Issue: Badges not appearing

**Solution**: Check Socket.IO connection status

### Issue: Badges not clearing

**Solution**: Ensure `setActiveChatOrder()` is called when opening chat

### Issue: Wrong count displayed

**Solution**: Check that messages from self are filtered out

### Issue: Notifications persist after refresh

**Solution**: This is expected behavior (no persistence)

## Future Enhancements

1. **Persistence**: Store unread counts in localStorage
2. **Sound Alerts**: Play sound on new message
3. **Desktop Notifications**: Browser notification API
4. **Message Preview**: Show snippet in notification
5. **Mark All as Read**: Bulk clear function
6. **Notification Settings**: User preferences
7. **Do Not Disturb**: Mute notifications temporarily
8. **Read Receipts**: Show when messages are read

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Bell icon has `title` attribute for screen readers
- Badge uses high contrast colors
- Keyboard navigation supported
- Focus states clearly visible

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: 2025
