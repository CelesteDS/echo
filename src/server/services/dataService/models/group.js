export default function groupModel(thinky) {
  const {type: {string}} = thinky

  return {
    name: 'Group',
    table: 'groups',
    schema: {
      id: string()
        .uuid(4)
        .allowNull(false),
      name: string()
        .allowNull(false),
      leaderId: string()
        .uuid(4)
        .allowNull(false),
      type: string()
        .allowNull(false),
    },
    associate: (Group, models) => {
      Group.hasAndBelongsToMany(models.Member, 'members', 'id', 'id', {init: false})
    }
  }
}
