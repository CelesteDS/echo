import r from '../r'

export default function getGroupsForLeader(leaderId) {
  return r.table('groups').filter(row => row('leaderId').eq(leaderId))
}
