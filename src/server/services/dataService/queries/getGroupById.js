import r from '../r'

export default function getGroupById(id) {
  return r.table('groups').get(id)
}
