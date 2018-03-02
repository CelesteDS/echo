import faker from 'faker'

import {Group} from 'src/server/services/dataService'

export default function define(factory) {
  factory.define('group', Group, {
    id: cb => cb(null, faker.random.uuid()),
    name: factory.sequence(n => `group${n}`),
    leaderId: cb => cb(null, faker.random.uuid()),
    type: 'fakeGroupType'
  })
}
