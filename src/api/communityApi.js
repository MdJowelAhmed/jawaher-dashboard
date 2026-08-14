import { wait } from '../utils/delay'
import { communities } from '../data/community'
import { paginate, sortBy } from './helpers'

export async function getCommunities({ search = '', status = 'all', sortKey = 'createdAt', sortDir = 'desc', page = 1, pageSize = 8 } = {}) {
  await wait()
  const query = search.trim().toLowerCase()
  let result = communities.filter((item) => {
    const matchesStatus = status === 'all' || item.status === status
    const matchesQuery = !query || item.name.toLowerCase().includes(query) || item.creatorName.toLowerCase().includes(query)
    return matchesStatus && matchesQuery
  })
  result = sortBy(result, sortKey, sortDir).map((item) => ({ ...item }))
  return paginate(result, page, pageSize)
}

export async function getCommunityById(id) {
  await wait()
  const community = communities.find((item) => item.id === id)
  if (!community) throw new Error('Community not found')
  return { ...community, members: [...community.members], activityFeed: [...community.activityFeed] }
}

export async function updateCommunity(id, patch) {
  await wait()
  const community = communities.find((item) => item.id === id)
  if (!community) throw new Error('Community not found')
  Object.assign(community, patch)
  return { ...community }
}

export async function deleteCommunity(id) {
  await wait()
  const index = communities.findIndex((item) => item.id === id)
  if (index === -1) throw new Error('Community not found')
  communities.splice(index, 1)
  return { ok: true }
}

export async function removeCommunityMember(communityId, userId) {
  await wait()
  const community = communities.find((item) => item.id === communityId)
  if (!community) throw new Error('Community not found')
  community.members = community.members.filter((member) => member.userId !== userId)
  community.memberCount = Math.max(0, community.memberCount - 1)
  return { ok: true }
}
