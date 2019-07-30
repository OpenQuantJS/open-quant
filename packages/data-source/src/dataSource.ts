import { Config } from './types';
import { list as listMongo, query as queryMongo } from './mongodb'

export function dataSource() {
  let c: Config

  const config = (_config: Config) => c = _config

  const list = async () => {
    switch (c.type) {
      case 'mongodb':
        return listMongo(c)
      default:
        return;
    }
  }

  const query = async (code: string, start?: string, end?: string) => {
    switch (c.type) {
      case 'mongodb':
        return queryMongo(c, code, start, end)
      default:
        return;
    }
  }

  return {
    config,
    list,
    query,
  }
}

export type DataSource = ReturnType<typeof dataSource>
