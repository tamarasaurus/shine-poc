import query from './query';

export default class Storage {
  insert({ commit, user, name, inspection}: { commit: string, user: string, name: string, inspection: any}) {
    return query(`
      INSERT INTO inspection (commit, github_user, name, repository, data)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      commit,
      user,
      name,
      'pim-community-dev',
      inspection
    ])
  }

  findByCommit(commit: string) {
    return query(`
      SELECT * from inspection
      WHERE commit = $1
    `, [ commit ])
  }

  findAll() {
    return query(` SELECT * from inspection`, [])
  }
}
