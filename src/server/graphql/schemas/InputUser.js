import {GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLList, GraphQLString} from 'graphql'
import {GraphQLInputObjectType} from 'graphql/type'

export default new GraphQLInputObjectType({
  name: 'InputUser',
  description: 'A user',
  fields: () => {
    return {
      id: {type: new GraphQLNonNull(GraphQLID), description: "The user's ID"},
      phaseNumber: {type: GraphQLInt, description: 'The Phase Number'},
      roles: {type: new GraphQLList(GraphQLString), description: "The user's roles"},
    }
  },
})
