import React, { useState } from 'react';
import { useMessageStore } from '../../store/messageStore';
import { useProjectStore } from '../../store/projectStore';
import { useTeamStore } from '../../store/teamStore';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { Modal } from '../../components/common/Modal';
import { timeAgo } from '../../utils/dateUtils';
import {
  MessageSquare,
  Plus,
  Pin,
  Send,
  CornerDownRight,
  Sparkles
} from 'lucide-react';

export const DiscussionsPage = () => {
  const user = useAuthStore(state => state.user);
  const team = useTeamStore(state => state.members);
  const projects = useProjectStore(state => state.projects);

  const discussions = useMessageStore(state => state.discussions);
  const addDiscussion = useMessageStore(state => state.addDiscussion);
  const addDiscussionReply = useMessageStore(state => state.addDiscussionReply);

  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || 'proj-1');
  const [newContent, setNewContent] = useState('');

  const [replyInputMap, setReplyInputMap] = useState({});

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addDiscussion({
      title: newTitle.trim(),
      projectId: newProjectId,
      content: newContent.trim(),
      authorId: user?.id || 'user-admin'
    });

    setNewTitle('');
    setNewContent('');
    setModalOpen(false);
  };

  const handleSendReply = (discId) => {
    const text = replyInputMap[discId];
    if (!text || !text.trim()) return;

    addDiscussionReply(discId, text.trim(), user?.id || 'user-admin');
    setReplyInputMap({ ...replyInputMap, [discId]: '' });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
            Project Discussions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Async architectural proposals, RFCs, and cross-team strategy threads
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          icon={Plus}
          variant="primary"
          className="shadow-sm"
        >
          New Discussion Thread
        </Button>
      </div>

      {/* Discussion Thread Cards */}
      <div className="space-y-6">
        {discussions.map(disc => {
          const project = projects.find(p => p.id === disc.projectId);
          const author = team.find(m => m.id === disc.authorId);
          const replies = disc.replies || [];

          return (
            <Card key={disc.id} className="space-y-4">
              {/* Thread Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Avatar src={author?.avatar} name={author?.name} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                        {disc.title}
                      </h3>
                      {disc.pinned && (
                        <span className="p-1 rounded bg-amber-500/10 text-amber-500" title="Pinned Thread">
                          <Pin className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{author?.name || 'Alexander Wright'}</span>
                      <span>•</span>
                      <span>{timeAgo(disc.createdAt)}</span>
                      {project && (
                        <>
                          <span>•</span>
                          <span className="text-brand-violet font-semibold">{project.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thread Main Content */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed pl-12">
                {disc.content}
              </p>

              {/* Replies Section */}
              <div className="pl-12 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                {replies.map(r => {
                  const replier = team.find(m => m.id === r.authorId);
                  return (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5 text-xs">
                      <Avatar src={replier?.avatar} name={replier?.name} size="xs" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 dark:text-white">
                            {replier?.name || 'Alexander Wright'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {timeAgo(r.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{r.content}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Reply Input Box */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={replyInputMap[disc.id] || ''}
                    onChange={(e) => setReplyInputMap({ ...replyInputMap, [disc.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply(disc.id);
                    }}
                    placeholder="Reply to this discussion thread..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
                  />
                  <Button
                    size="xs"
                    variant="primary"
                    icon={Send}
                    onClick={() => handleSendReply(disc.id)}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* New Discussion Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Start New Discussion Thread"
        subtitle="Post a question, architecture decision, or sprint RFC"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Topic Title *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Migration from REST to GraphQL API"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Related Project
            </label>
            <select
              value={newProjectId}
              onChange={(e) => setNewProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Discussion Content *
            </label>
            <textarea
              rows={4}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Detailed explanation, links, tradeoffs..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-indigo text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-violet/40"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Publish Thread
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
