export const demoConversations = [
  {
    id: 'conv-1',
    name: 'SaaS 2.0 Core Squad',
    isGroup: true,
    participantIds: ['user-admin', 'user-member', 'user-4', 'user-5'],
    lastMessage: 'The new color token variables are live in staging.',
    lastMessageAt: '2026-11-23T10:14:00Z',
    unreadCount: 2,
    avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=128&q=80',
    messages: [
      {
        id: 'msg-101',
        senderId: 'user-admin',
        text: 'Morning team! Let’s make sure all drag-and-drop actions on the Kanban board trigger immediate optimistic UI.',
        createdAt: '2026-11-23T09:15:00Z'
      },
      {
        id: 'msg-102',
        senderId: 'user-member',
        text: 'Working on that right now. Connected dnd-kit with the persistent Zustand store, feels super smooth!',
        createdAt: '2026-11-23T09:22:00Z'
      },
      {
        id: 'msg-103',
        senderId: 'user-4',
        text: 'Just uploaded the new glass modal specs to Figma. Let me know if you need SVG assets exported.',
        createdAt: '2026-11-23T09:40:00Z'
      },
      {
        id: 'msg-104',
        senderId: 'user-member',
        text: 'The new color token variables are live in staging.',
        createdAt: '2026-11-23T10:14:00Z'
      }
    ]
  },
  {
    id: 'conv-2',
    name: 'Sophia Chen',
    isGroup: false,
    participantIds: ['user-admin', 'user-member'],
    lastMessage: 'Will push the latest commit before our 2 PM sync.',
    lastMessageAt: '2026-11-23T09:50:00Z',
    unreadCount: 1,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=128&q=80',
    messages: [
      {
        id: 'msg-201',
        senderId: 'user-admin',
        text: 'Sophia, how is the time tracker persistence looking?',
        createdAt: '2026-11-23T09:30:00Z'
      },
      {
        id: 'msg-202',
        senderId: 'user-member',
        text: 'Built with timestamp delta calculation so page reloads never lose running seconds! Also prevents multiple simultaneous timers.',
        createdAt: '2026-11-23T09:35:00Z'
      },
      {
        id: 'msg-203',
        senderId: 'user-member',
        text: 'Will push the latest commit before our 2 PM sync.',
        createdAt: '2026-11-23T09:50:00Z'
      }
    ]
  },
  {
    id: 'conv-3',
    name: 'Marcus Vance',
    isGroup: false,
    participantIds: ['user-admin', 'user-3'],
    lastMessage: 'The Salesforce integration tests passed all sandbox runs.',
    lastMessageAt: '2026-11-22T16:30:00Z',
    unreadCount: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80',
    messages: [
      {
        id: 'msg-301',
        senderId: 'user-3',
        text: 'The Salesforce integration tests passed all sandbox runs.',
        createdAt: '2026-11-22T16:30:00Z'
      }
    ]
  },
  {
    id: 'conv-4',
    name: 'Elena Rostova',
    isGroup: false,
    participantIds: ['user-admin', 'user-4'],
    lastMessage: 'Check out the new electric violet glowing badge styling.',
    lastMessageAt: '2026-11-22T14:10:00Z',
    unreadCount: 0,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80',
    messages: [
      {
        id: 'msg-401',
        senderId: 'user-4',
        text: 'Check out the new electric violet glowing badge styling.',
        createdAt: '2026-11-22T14:10:00Z'
      }
    ]
  },
  {
    id: 'conv-5',
    name: 'DevOps & Infrastructure',
    isGroup: true,
    participantIds: ['user-admin', 'user-5', 'user-7'],
    lastMessage: 'Aurora multi-region failover dry run concluded with 38s recovery time.',
    lastMessageAt: '2026-11-21T17:00:00Z',
    unreadCount: 0,
    avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=128&q=80',
    messages: [
      {
        id: 'msg-501',
        senderId: 'user-5',
        text: 'Aurora multi-region failover dry run concluded with 38s recovery time.',
        createdAt: '2026-11-21T17:00:00Z'
      }
    ]
  }
];
