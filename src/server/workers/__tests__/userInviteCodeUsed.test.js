/* eslint-env mocha */
/* global expect testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import factory from 'src/test/factories'
import stubs from 'src/test/stubs'
import {resetDB} from 'src/test/helpers'

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach(function () {
    stubs.gitHubService.enable()
  })

  afterEach(function () {
    stubs.gitHubService.disable()
  })

  describe('processUserInviteCodeUsed', function () {
    const gitHubService = require('src/server/services/gitHubService')
    const {Member} = require('src/server/services/dataService')

    const {processUserInviteCodeUsed} = require('../userInviteCodeUsed')

    describe('when there is a new member', function () {
      beforeEach(async function () {
        const inviteCode = 'test'
        this.chapter = await factory.create('chapter', {inviteCodes: [inviteCode]})
        this.user = await factory.build('user', {inviteCode})
      })

      it('creates a member in the chapter for the invite code', async function () {
        await processUserInviteCodeUsed(this.user)
        const member = await Member.get(this.user.id)
        expect(member.chapterId).to.eq(this.chapter.id)
      })

      it('adds the member to the github team', async function () {
        await processUserInviteCodeUsed(this.user)
        expect(gitHubService.addUserToTeam).to.have.been
          .calledWith(this.user.handle, this.chapter.githubTeamId)
      })
    })
  })
})
