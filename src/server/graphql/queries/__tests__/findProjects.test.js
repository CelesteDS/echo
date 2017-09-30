/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import nock from 'nock'
import factory from 'src/test/factories'
import {resetDB, runGraphQLQuery, useFixture} from 'src/test/helpers'
import {expectArraysToContainTheSameElements} from 'src/test/helpers/expectations'
import {Project} from 'src/server/services/dataService'

import findProjects from '../findProjects'

const fields = {findProjects}
const query = `
  query($identifiers: [String]) {
    findProjects(identifiers: $identifiers) {
      id
      chapter { id }
      cycle { id }
      phase { id number }
    }
  }
`

describe(testContext(__filename), function () {
  beforeEach(resetDB)

  beforeEach('Create current user', async function () {
    nock.cleanAll()
    this.currentUser = await factory.build('user')
    const member = await factory.create('member', {id: this.currentUser.id})
    const cycle = await factory.create('cycle', {chapterId: member.chapterId})
    this.phase = await factory.create('phase', {number: 2})
    this.projects = await factory.createMany('project', {cycleId: cycle.id, phaseId: this.phase.id}, 3)
  })

  it('returns correct projects for identifiers', async function () {
    const project = this.projects[0]
    const context = {currentUser: this.currentUser}
    const variables = {identifiers: [project.id]}
    const result = await runGraphQLQuery(fields, query, context, variables)
    const returnedProjects = result.data.findProjects
    const returnedProject = returnedProjects[0]
    expect(returnedProjects.length).to.equal(1)
    expect(returnedProject.id).to.equal(project.id)
    expect(returnedProject.chapter.id).to.equal(project.chapterId)
    expect(returnedProject.cycle.id).to.equal(project.cycleId)
    expect(returnedProject.phase.id).to.equal(project.phaseId)
    expect(returnedProject.phase.id).to.equal(this.phase.id)
  })

  it('returns all projects if no identifiers specified', async function () {
    const allProjects = await Project.run()
    useFixture.nockIDMGetUser(this.currentUser)
    const context = {currentUser: this.currentUser}
    const {data: {findProjects: result}} = await runGraphQLQuery(fields, query, context)
    expect(result.length).to.equal(allProjects.length)
    expectArraysToContainTheSameElements(allProjects.map(p => p.id), result.map(p => p.id))
  })

  it('returns no projects if no matching identifiers specified', async function () {
    const context = {currentUser: this.currentUser}
    const variables = {identifiers: ['']}
    const result = await runGraphQLQuery(fields, query, context, variables)
    expect(result.data.findProjects.length).to.equal(0)
  })

  it('throws an error if user is not signed-in', function () {
    const context = {currentUser: null}
    const result = runGraphQLQuery(fields, query, context)
    return expect(result).to.eventually.be.rejectedWith(/not authorized/i)
  })
})
