
/* eslint-env mocha */
/* global expect testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions, max-nested-callbacks */
import factory from 'src/test/factories'
import {truncateDBTables, useFixture} from 'src/test/helpers'
import {expectArraysToContainTheSameElements} from 'src/test/helpers/expectations'
import {GOAL_SELECTION} from 'src/common/models/cycle'

import importProject from '../importProject'

describe(testContext(__filename), function () {
  before(truncateDBTables)
  before(async function () {
    this.chapter = await factory.create('chapter')
    this.cycle = await factory.create('cycle', {chapterId: this.chapter.id, state: GOAL_SELECTION})
    this.players = await factory.createMany('player', {chapterId: this.chapter.id}, 3)
    this.goalNumber = 1
    this.users = this.players.map(player => ({
      id: player.id,
      active: true,
      handle: `handle_${player.id}`,
    }))
    this.importData = {
      chapterIdentifier: this.chapter.name,
      cycleIdentifier: this.cycle.cycleNumber,
      userIdentifiers: this.users.map(p => p.handle),
      goalIdentifier: this.goalNumber,
    }
  })
  beforeEach(function () {
    useFixture.nockClean()
  })

  describe('importProject()', function () {
    it('throws an error if chapterIdentifier is invalid', function () {
      useFixture.nockIDMFindUsers(this.users)
      useFixture.nockGetGoalInfo(this.goalNumber)
      const result = importProject({...this.importData, chapterIdentifier: 'fake.chapter.id'})
      return expect(result).to.eventually.be.rejectedWith(/Chapter not found/)
    })

    it('throws an error if cycleIdentifier is invalid', function () {
      useFixture.nockIDMFindUsers(this.users)
      useFixture.nockGetGoalInfo(this.goalNumber)
      const result = importProject({...this.importData, cycleIdentifier: 10101010})
      return expect(result).to.eventually.be.rejectedWith(/Cycle not found/)
    })

    it('throws an error if user identifiers list is invalid when importing a new project', function () {
      useFixture.nockIDMFindUsers(this.users)
      useFixture.nockGetGoalInfo(this.goalNumber)
      const result = importProject({...this.importData, userIdentifiers: null})
      return expect(result).to.eventually.be.rejectedWith(/must specify at least one user/)
    })

    it('creates a new project a projectIdentifier is not specified', async function () {
      useFixture.nockIDMFindUsers(this.users)
      useFixture.nockGetGoalInfo(this.goalNumber, {times: 3})

      const importedProject = await importProject(this.importData)

      expect(importedProject.goal.goalMetadata.goal_id).to.eq(this.goalNumber) // eslint-disable-line camelcase
      expect(importedProject.chapterId).to.eq(this.chapter.id)
      expect(importedProject.cycleId).to.eq(this.cycle.id)
      expectArraysToContainTheSameElements(importedProject.playerIds, this.players.map(p => p.id))
    })

    it('creates a new project with specified projectIdentifier when existing project not matched', async function () {
      useFixture.nockIDMFindUsers(this.users)
      useFixture.nockGetGoalInfo(this.goalNumber)

      const projectIdentifier = 'new-project'
      const modifiedImportData = Object.assign({}, this.importData, {projectIdentifier})
      const importedProject = await importProject(modifiedImportData)

      expect(importedProject.name).to.eq(modifiedImportData.projectIdentifier)
      expect(importedProject.goal.goalMetadata.goal_id).to.eq(modifiedImportData.goalIdentifier) // eslint-disable-line camelcase
    })

    it('updates goal and users when a valid project identifier is specified', async function () {
      const newProject = await factory.create('project', {chapterId: this.chapter.id, cycleId: this.cycle.id})
      const newPlayers = await factory.createMany('player', {chapterId: this.chapter.id}, 4)
      const newGoalNumber = 2

      useFixture.nockIDMFindUsers(newPlayers)
      useFixture.nockGetGoalInfo(newGoalNumber)

      const importedProject = await importProject({
        ...this.importData,
        projectIdentifier: newProject.name,
        userIdentifiers: newPlayers.map(p => p.id),
        goalIdentifier: newGoalNumber,
      })

      expect(importedProject.id).to.eq(newProject.id)
      expect(importedProject.chapterId).to.eq(this.chapter.id)
      expect(importedProject.cycleId).to.eq(this.cycle.id)
      expect(importedProject.playerIds.length).to.eq(newPlayers.length)
      expect(importedProject.goal.goalMetadata.goal_id).to.eq(newGoalNumber) // eslint-disable-line camelcase
      expectArraysToContainTheSameElements(importedProject.playerIds, newPlayers.map(p => p.id))
    })
  })
})
