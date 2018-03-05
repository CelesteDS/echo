/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import faker from 'faker'

import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import findGroupsForLeader from '../findGroupsForLeader'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('finds all groups for given leader', async function () {
    const fakeLeaderId = faker.random.uuid()
    const numOfGroups = 3
    for (let i = 0; i < numOfGroups; i++) {
      await factory.create('group', {leaderId: fakeLeaderId})
    }
    const fakeLeadersGroups = await findGroupsForLeader(fakeLeaderId)
    expect(fakeLeadersGroups[0].leaderId).to.eql(fakeLeaderId)
    expect(fakeLeadersGroups.length).to.eql(numOfGroups)
  })
})
