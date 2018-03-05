import r from '../r'

export default function findGroupsForLeader(leaderId) {
  return r.table('groups').filter(row => row('leaderId').eq(leaderId))
}
