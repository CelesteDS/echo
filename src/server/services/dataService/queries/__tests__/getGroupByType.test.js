/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import factory from 'src/test/factories'
import {resetDB} from 'src/test/helpers'

import getGroupsByType from '../getGroupsByType'

describe.only(testContext(__filename), function () {
  beforeEach(resetDB)

  it('returns the correct group type', async function () {
    const groupType = 'housquad'
    await factory.create('group', {type: groupType})
    const groupsByType = await getGroupsByType(groupType)
    expect(groupsByType[0].type).to.eq(groupType)
  })
})
