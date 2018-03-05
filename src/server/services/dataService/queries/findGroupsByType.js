import r from '../r'

export default function findGroupsByType(type) {
  return r.table('groups').filter(group => group('type').eq(type))
}
