import { MongoClient } from 'mongodb';
import { format } from 'date-fns'

import { Config } from './types';

export async function list(config: Config) {
  const conn = await MongoClient.connect(config.url, { useNewUrlParser: true })
  const db = conn.db(config.db)
  return db.collection(config.allStocks).find({}).toArray()
}

export async function query(config: Config, code: string, start?: string, end?: string) {
  const conn = await MongoClient.connect(config.url, { useNewUrlParser: true })
  const db = conn.db(config.db)
  const _start = start || '1990-01-01'
  const _end = end || format(new Date(), 'YYYY-MM-DD')
  console.log(_start)
  console.log(_end)

  return db.collection(config.historyData).find({
    code,
    date: { $gte: _start, $lte: _end },
  }).toArray()
}
