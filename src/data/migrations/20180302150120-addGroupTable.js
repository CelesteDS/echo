import config from 'src/config'

const createOptions = config.server.rethinkdb.tableCreation

exports.up = function (r, connection) {
  _createGroupsTable(r, connection)
}

exports.down = function (r, connection) {
  r.tableDrop('groups').run(connection)
}

function _createGroupsTable(r, connection) {
  return r.tableCreate('groups', createOptions).run(connection)
    .then(() => Promise.all([
      r.table('groups').indexCreate('leaderId').run(connection)
    ]))
}
