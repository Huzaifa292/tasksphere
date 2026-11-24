import { create } from 'zustand';
import { demoConversations } from '../data/demoMessages';
import { demoDiscussions } from '../data/demoDiscussions';

const STORAGE_CONV_KEY = 'tasksphere_conversations';
const STORAGE_DISC_KEY = 'tasksphere_discussions';

const getInitialConversations = () => {
  try {
    const saved = localStorage.getItem(STORAGE_CONV_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return demoConversations;
};

const getInitialDiscussions = () => {
  try {
    const saved = localStorage.getItem(STORAGE_DISC_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return demoDiscussions;
};

export const useMessageStore = create((set, get) => ({
  conversations: getInitialConversations(),
  activeConversationId: 'conv-1',
  discussions: getInitialDiscussions(),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  sendMessage: (convId, text, senderId = 'user-admin') => {
    if (!text.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    set(state => {
      const nextConvs = state.conversations.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastMessageAt: newMsg.createdAt,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      });
      localStorage.setItem(STORAGE_CONV_KEY, JSON.stringify(nextConvs));
      return { conversations: nextConvs };
    });

    return newMsg;
  },

  markConversationRead: (convId) => {
    set(state => {
      const nextConvs = state.conversations.map(c => (c.id === convId ? { ...c, unreadCount: 0 } : c));
      localStorage.setItem(STORAGE_CONV_KEY, JSON.stringify(nextConvs));
      return { conversations: nextConvs };
    });
  },

  addDiscussion: (discussionData) => {
    const newDisc = {
      id: `disc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      pinned: false,
      replies: [],
      ...discussionData
    };
    set(state => {
      const next = [newDisc, ...state.discussions];
      localStorage.setItem(STORAGE_DISC_KEY, JSON.stringify(next));
      return { discussions: next };
    });
    return newDisc;
  },

  addDiscussionReply: (discussionId, content, authorId = 'user-admin') => {
    const newReply = {
      id: `reply-${Date.now()}`,
      authorId,
      createdAt: new Date().toISOString(),
      content
    };
    set(state => {
      const next = state.discussions.map(d => {
        if (d.id === discussionId) {
          return { ...d, replies: [...(d.replies || []), newReply] };
        }
        return d;
      });
      localStorage.setItem(STORAGE_DISC_KEY, JSON.stringify(next));
      return { discussions: next };
    });
    return newReply;
  },

  resetMessages: () => {
    set({ conversations: demoConversations, discussions: demoDiscussions });
    localStorage.setItem(STORAGE_CONV_KEY, JSON.stringify(demoConversations));
    localStorage.setItem(STORAGE_DISC_KEY, JSON.stringify(demoDiscussions));
  }
}));
