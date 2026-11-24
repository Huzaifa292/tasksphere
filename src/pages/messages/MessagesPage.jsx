import React, { useState } from 'react';
import { useMessageStore } from '../../store/messageStore';
import { useAuthStore } from '../../store/authStore';
import { useTeamStore } from '../../store/teamStore';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { timeAgo } from '../../utils/dateUtils';
import {
  Send,
  Search,
  MessageSquare,
  Users,
  Smile,
  Paperclip,
  CheckCheck
} from 'lucide-react';

export const MessagesPage = () => {
  const user = useAuthStore(state => state.user);
  const team = useTeamStore(state => state.members);

  const conversations = useMessageStore(state => state.conversations);
  const activeConversationId = useMessageStore(state => state.activeConversationId);
  const setActiveConversation = useMessageStore(state => state.setActiveConversation);
  const sendMessage = useMessageStore(state => state.sendMessage);
  const markConversationRead = useMessageStore(state => state.markConversationRead);

  const [inputMessage, setInputMessage] = useState('');
  const [search, setSearch] = useState('');

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  const handleSelectConversation = (id) => {
    setActiveConversation(id);
    markConversationRead(id);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputMessage.trim(), user?.id || 'user-admin');
    setInputMessage('');
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-8 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
          Team Messages & Chats
        </h2>
        <p className="text-xs text-slate-400">
          Direct messaging and group sprint channels with real-time demo updates
        </p>
      </div>

      <div className="flex-1 rounded-2xl border border-slate-200/80 dark:border-brand-darkBorder bg-white dark:bg-brand-indigo overflow-hidden shadow-subtle flex">
        {/* Left: Conversation List */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 bg-slate-50/40 dark:bg-slate-900/20">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredConversations.map(conv => {
              const isSelected = conv.id === activeConv?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-violet/10 dark:bg-brand-violet/15'
                      : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Avatar src={conv.avatar} name={conv.name} size="md" status={conv.isGroup ? null : 'online'} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-brand-violet' : 'text-slate-900 dark:text-white'}`}>
                        {conv.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {conv.lastMessageAt ? timeAgo(conv.lastMessageAt) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && !isSelected && (
                    <span className="w-5 h-5 rounded-full bg-brand-violet text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Window */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-brand-indigo">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={activeConv.avatar} name={activeConv.name} size="md" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-heading">
                    {activeConv.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {activeConv.isGroup ? `${activeConv.participantIds.length} members in channel` : 'Direct Messaging'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConv.messages.map(msg => {
                const isMe = msg.senderId === user?.id;
                const sender = team.find(m => m.id === msg.senderId);

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <Avatar src={sender?.avatar} name={sender?.name} size="xs" />
                    )}

                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-xs ${
                        isMe
                          ? 'bg-brand-violet text-white rounded-br-xs shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                      }`}
                    >
                      {!isMe && (
                        <p className="text-[10px] font-bold text-slate-400 mb-1">
                          {sender?.name || 'Alexander Wright'}
                        </p>
                      )}
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <div className={`text-[9px] mt-1 text-right ${isMe ? 'text-white/80' : 'text-slate-400'}`}>
                        {timeAgo(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message ${activeConv.name}...`}
                className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
              />
              <Button type="submit" size="sm" variant="primary" icon={Send}>
                Send
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
