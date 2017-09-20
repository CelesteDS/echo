import config from 'src/config'
import {getOwnerAndRepoFromGitHubURL} from 'src/common/util'
import {Chapter} from 'src/server/services/dataService'
import {getTeam, createTeam} from 'src/server/services/gitHubService'

export function start() {
  const jobService = require('src/server/services/jobService')
  jobService.processJobs('chapterCreated', processChapterCreated)
}

async function processChapterCreated(chapter) {
  const team = await createGitHubTeamWithAccessToGoalRepo(chapter)
  await addTeamIdToChapter(chapter, team)
  await createChapterChannel(chapter)
}

async function createGitHubTeamWithAccessToGoalRepo(chapter) {
  const {owner, repo} = getOwnerAndRepoFromGitHubURL(config.server.github.repos.crafts)

  const team = await getTeam(owner, chapter.channelName)
  if (team) {
    console.log(`Found GitHub team ${owner}/${chapter.channelName}`)
    return team
  }

  console.log(`Creating GitHub team ${owner}/${chapter.channelName}`)
  return await createTeam(chapter.channelName, chapter.name, owner, {
    repoNames: [repo],
    permission: 'push',
  })
}

async function addTeamIdToChapter(chapter, team) {
  console.log(`Adding GitHub team id (${team.id}) to chapter (${chapter.id})`)
  return Chapter.get(chapter.id).updateWithTimestamp({githubTeamId: team.id})
}

async function createChapterChannel(chapter) {
  const initializeChannel = require('src/server/actions/initializeChannel')

  console.log(`Creating chapter channel ${chapter.channelName}`)
  await initializeChannel(chapter.channelName, {topic: chapter.name, users: ['echo']})
}
