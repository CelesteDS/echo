/* eslint-env mocha */
/* global expect, testContext */
/* eslint-disable prefer-arrow-callback, no-unused-expressions */
import nock from 'nock'

import factory from 'src/test/factories'
import {resetDB, runGraphQLQuery, useFixture, mockIdmUsersById} from 'src/test/helpers'

import getRetrospectiveSurveyQuestion from '../getRetrospectiveSurveyQuestion'

const fields = {getRetrospectiveSurveyQuestion}

describe(testContext(__filename), function () {
  useFixture.buildSurvey()

  beforeEach(resetDB)

  describe('Retrospective queries', function () {
    beforeEach('Setup Retrospective Survey Data', async function () {
      const teamQuestion = await factory.create('question', {
        responseType: 'relativeContribution',
        subjectType: 'team'
      })
      const memberQuestion = await factory.create('question', {
        body: 'What is one thing {{subject}} did well?',
        responseType: 'text',
        subjectType: 'member'
      })
      await this.buildSurvey({questionRefs: [
        {questionId: teamQuestion.id, subjectIds: () => this.project.memberIds},
        {questionId: memberQuestion.id, subjectIds: () => [this.project.memberIds[1]]},
      ]})
      this.currentUser = await factory.build('user', {id: this.project.memberIds[0]})
      await mockIdmUsersById(this.project.memberIds)
    })

    afterEach(function () {
      nock.cleanAll()
    })

    it('gets a single question from the survey by index', async function () {
      const questionNumber = 2 // <-- 1-based arg
      const questionIndex = 1 // <-- 0-based index
      const context = {currentUser: this.currentUser}
      const variables = {questionNumber}
      const query = `
        query($questionNumber: Int!) {
          getRetrospectiveSurveyQuestion(questionNumber: $questionNumber) {
            id subjectType responseType body
            subjects { id name handle }
          }
        }
      `
      const result = await runGraphQLQuery(fields, query, context, variables)
      expect(result.data.getRetrospectiveSurveyQuestion)
        .to.have.property('id', this.survey.questionRefs[questionIndex].questionId)
    })

    it('accepts a projectName parameter', async function () {
      const questionNumber = 2 // <-- 1-based arg
      const questionIndex = 1 // <-- 0-based index
      const context = {currentUser: this.currentUser}
      const variables = {questionNumber, projectName: this.project.name}
      const query = `
        query($questionNumber: Int!, $projectName: String) {
          getRetrospectiveSurveyQuestion(questionNumber: $questionNumber, projectName: $projectName) {
            id
          }
        }
      `
      const result = await runGraphQLQuery(fields, query, context, variables)
      expect(result.data.getRetrospectiveSurveyQuestion)
        .to.have.property('id', this.survey.questionRefs[questionIndex].questionId)
    })
  })
})
