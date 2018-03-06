/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import getGroupById from '../getGroupById'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  it('gets correct group', async function () {
    let createdGroup
    await factory.create('group')
            .then(group => {
              createdGroup = group
            })
    const queryResult = await getGroupById(createdGroup.id)
    expect(queryResult.id).to.equal(createdGroup.id)
    expect(queryResult.leaderId).to.equal(createdGroup.leaderId)
  })
})
