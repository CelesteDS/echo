import r from '../r'

export default function getGroupsByType(type) {
  return r.table('groups').filter(group => group('type').eq(type))
}
