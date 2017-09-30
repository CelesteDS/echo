import {GraphQLNonNull} from 'graphql'

import {CreatedIdList, SurveyResponseInput} from 'src/server/graphql/schemas'
import {resolveSaveRetrospectiveSurveyResponses} from 'src/server/graphql/resolvers'

export default {
  type: CreatedIdList,
  args: {
    response: {
      description: 'The response to save',
      type: new GraphQLNonNull(SurveyResponseInput)
    }
  },
  async resolve(source, {response}, context) {
    return resolveSaveRetrospectiveSurveyResponses(source, {responses: [response]}, context)
  }
}
