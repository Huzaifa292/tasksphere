export const demoDiscussions = [
  {
    id: 'disc-1',
    projectId: 'proj-1',
    title: 'Design System Semantic Tokens vs Hardcoded Values',
    authorId: 'user-4',
    createdAt: '2026-11-18T10:00:00Z',
    pinned: true,
    content: 'We need to strictly enforce semantic Tailwind class mappings (`brand-violet`, `brand-navy`, etc.) across all components to ensure light/dark consistency and prevent color drift. Please review the style guide before submitting pull requests!',
    replies: [
      {
        id: 'reply-1',
        authorId: 'user-member',
        createdAt: '2026-11-18T11:20:00Z',
        content: 'Agreed! I added the ESLint rule warning on arbitrary hex codes in JSX classes.'
      },
      {
        id: 'reply-2',
        authorId: 'user-admin',
        createdAt: '2026-11-18T14:45:00Z',
        content: 'Looks fantastic. Let’s make sure this is highlighted in the developer documentation as well.'
      }
    ]
  },
  {
    id: 'disc-2',
    projectId: 'proj-4',
    title: 'Salesforce Sandbox vs Production API Quota Architecture',
    authorId: 'user-3',
    createdAt: '2026-11-19T13:30:00Z',
    pinned: false,
    content: 'Salesforce sandbox instances cap our daily REST calls at 5,000 requests. We implemented a local token bucket limiter to batch update operations into composite graph calls. Production will support up to 100k requests/day.',
    replies: [
      {
        id: 'reply-3',
        authorId: 'user-7',
        createdAt: '2026-11-19T15:10:00Z',
        content: 'Tested the batching with 50 tasks in 1 composite call. Network overhead dropped by 82%!'
      }
    ]
  },
  {
    id: 'disc-3',
    projectId: 'proj-8',
    title: 'SOC2 Type II Audit Timeline & Evidence Submission Checklist',
    authorId: 'user-5',
    createdAt: '2026-11-20T09:15:00Z',
    pinned: true,
    content: 'All AWS root account actions must have documented Jira approval tickets. Auditor requests 90-day continuous CloudTrail logs with cryptographic hash integrity verification by December 10.',
    replies: [
      {
        id: 'reply-4',
        authorId: 'user-admin',
        createdAt: '2026-11-20T11:00:00Z',
        content: 'We will conduct a pre-audit dry run next Tuesday. Marcus, please review all operational procedures.'
      }
    ]
  },
  {
    id: 'disc-4',
    projectId: 'proj-3',
    title: 'Product Hunt Launch Day Roles and Shift Schedule',
    authorId: 'user-6',
    createdAt: '2026-11-21T16:00:00Z',
    pinned: false,
    content: 'On launch day (midnight PST), we will have 3 shifts covering 24 hours of live comments and social amplification. Please claim your preferred 4-hour window.',
    replies: [
      {
        id: 'reply-5',
        authorId: 'user-8',
        createdAt: '2026-11-21T17:30:00Z',
        content: 'I will take the morning slot (6 AM – 10 AM PST) to manage European early responses!'
      }
    ]
  }
];
