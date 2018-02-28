export default function groupModel (thinky) {
  const {r, type: {string}} = thinky

  return {
    Name: 'Group',
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
      Group.hasAndBelongsToMany(models.Member, 'members', 'id', 'id', { init: false })
    }
  }
}
