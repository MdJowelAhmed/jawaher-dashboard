export const communities = [
  {
    id: 'com_001', name: 'Freej Family Quiz', description: 'A friendly group for families playing Freej Trivia together.', creatorId: 'usr_001', creatorName: 'Fatima Al Maktoum', memberCount: 48, activity: 'High', status: 'active', createdAt: '2025-11-20T10:00:00.000Z',
    members: [
      { userId: 'usr_001', name: 'Fatima Al Maktoum', role: 'Creator', joinedAt: '2025-11-20T10:00:00.000Z', status: 'active' },
      { userId: 'usr_002', name: 'Omar Hassan', role: 'Admin', joinedAt: '2025-11-21T12:00:00.000Z', status: 'active' },
      { userId: 'usr_005', name: 'Noor Khalifa', role: 'Member', joinedAt: '2026-01-10T09:00:00.000Z', status: 'active' },
      { userId: 'usr_009', name: 'Sara Abdullah', role: 'Member', joinedAt: '2026-03-09T08:00:00.000Z', status: 'active' },
      { userId: 'usr_013', name: 'Hessa Al Falasi', role: 'Member', joinedAt: '2026-05-22T11:00:00.000Z', status: 'active' },
    ],
    activityFeed: [
      { id: 'ca_1', text: 'Fatima Al Maktoum created the community', at: '2025-11-20T10:00:00.000Z' },
      { id: 'ca_2', text: 'Omar Hassan joined as admin', at: '2025-11-21T12:00:00.000Z' },
      { id: 'ca_3', text: 'Noor Khalifa completed a community challenge', at: '2026-08-12T16:20:00.000Z' },
    ],
  },
  {
    id: 'com_002', name: 'Dubai Knowledge Club', description: 'Weekly trivia sessions for Dubai-based players.', creatorId: 'usr_004', creatorName: 'Ahmed Al Suwaidi', memberCount: 36, activity: 'Medium', status: 'active', createdAt: '2025-12-14T14:30:00.000Z',
    members: [
      { userId: 'usr_004', name: 'Ahmed Al Suwaidi', role: 'Creator', joinedAt: '2025-12-14T14:30:00.000Z', status: 'active' },
      { userId: 'usr_001', name: 'Fatima Al Maktoum', role: 'Member', joinedAt: '2025-12-15T10:00:00.000Z', status: 'active' },
      { userId: 'usr_008', name: 'Khalid Nasser', role: 'Member', joinedAt: '2026-02-20T18:00:00.000Z', status: 'active' },
    ],
    activityFeed: [
      { id: 'ca_5', text: 'Ahmed Al Suwaidi created the community', at: '2025-12-14T14:30:00.000Z' },
      { id: 'ca_7', text: 'Khalid Nasser played 3 games this week', at: '2026-08-13T19:00:00.000Z' },
    ],
  },
  {
    id: 'com_003', name: 'School Champions', description: 'Students competing in general knowledge quizzes.', creatorId: 'usr_003', creatorName: 'Layla Ibrahim', memberCount: 64, activity: 'High', status: 'active', createdAt: '2026-01-08T09:15:00.000Z',
    members: [
      { userId: 'usr_003', name: 'Layla Ibrahim', role: 'Creator', joinedAt: '2026-01-08T09:15:00.000Z', status: 'active' },
      { userId: 'usr_007', name: 'Mariam Al Hashimi', role: 'Admin', joinedAt: '2026-02-04T13:00:00.000Z', status: 'active' },
      { userId: 'usr_012', name: 'Daniel Park', role: 'Member', joinedAt: '2026-05-02T10:00:00.000Z', status: 'active' },
    ],
    activityFeed: [
      { id: 'ca_8', text: 'Layla Ibrahim created the community', at: '2026-01-08T09:15:00.000Z' },
      { id: 'ca_10', text: 'Daniel Park joined School Champions', at: '2026-05-02T10:00:00.000Z' },
    ],
  },
  {
    id: 'com_004', name: 'Weekend Trivia', description: 'Casual weekend games for returning players.', creatorId: 'usr_006', creatorName: 'Yusuf Rahman', memberCount: 22, activity: 'Low', status: 'active', createdAt: '2026-02-01T17:45:00.000Z',
    members: [
      { userId: 'usr_006', name: 'Yusuf Rahman', role: 'Creator', joinedAt: '2026-02-01T17:45:00.000Z', status: 'active' },
      { userId: 'usr_011', name: 'Aisha Qasim', role: 'Member', joinedAt: '2026-04-15T16:00:00.000Z', status: 'suspended' },
      { userId: 'usr_015', name: 'Amal Farid', role: 'Member', joinedAt: '2026-07-13T11:20:00.000Z', status: 'active' },
    ],
    activityFeed: [
      { id: 'ca_11', text: 'Yusuf Rahman created the community', at: '2026-02-01T17:45:00.000Z' },
      { id: 'ca_12', text: 'Amal Farid joined Weekend Trivia', at: '2026-07-13T11:20:00.000Z' },
    ],
  },
  {
    id: 'com_005', name: 'Science Lovers', description: 'Players who prefer science and nature categories.', creatorId: 'usr_008', creatorName: 'Khalid Nasser', memberCount: 19, activity: 'Medium', status: 'active', createdAt: '2026-03-16T08:00:00.000Z',
    members: [
      { userId: 'usr_008', name: 'Khalid Nasser', role: 'Creator', joinedAt: '2026-03-16T08:00:00.000Z', status: 'active' },
      { userId: 'usr_003', name: 'Layla Ibrahim', role: 'Member', joinedAt: '2026-03-17T09:00:00.000Z', status: 'active' },
      { userId: 'usr_010', name: 'Hassan Al Mazrouei', role: 'Member', joinedAt: '2026-03-28T12:00:00.000Z', status: 'active' },
    ],
    activityFeed: [
      { id: 'ca_13', text: 'Khalid Nasser created the community', at: '2026-03-16T08:00:00.000Z' },
    ],
  },
  {
    id: 'com_006', name: 'Gulf Quiz Masters', description: 'Competitive players from across the Gulf.', creatorId: 'usr_002', creatorName: 'Omar Hassan', memberCount: 11, activity: 'Low', status: 'disabled', createdAt: '2026-06-02T13:10:00.000Z',
    members: [
      { userId: 'usr_002', name: 'Omar Hassan', role: 'Creator', joinedAt: '2026-06-02T13:10:00.000Z', status: 'active' },
    ],
    activityFeed: [
      { id: 'ca_16', text: 'Community was disabled by an administrator', at: '2026-07-30T10:00:00.000Z' },
    ],
  },
]
