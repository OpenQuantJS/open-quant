import { MongoClient } from 'mongodb';
import { format } from 'date-fns'

import { Config, Stock, StockInfo } from './types';

let conn: MongoClient

export async function list(config: Config) {
  if (conn === undefined) {
    conn = await MongoClient.connect(config.url, { useNewUrlParser: true })
  }
  const db = conn.db(config.db)
  return db.collection(config.allStocks).find<StockInfo>({}).toArray()
}

export async function query(config: Config, code: string, start?: string, end?: string) {
  if (conn === undefined) {
    conn = await MongoClient.connect(config.url, { useNewUrlParser: true })
  }
  const db = conn.db(config.db)
  const _start = start || '1990-01-01'
  const _end = end || format(new Date(), 'YYYY-MM-DD')

  return db.collection(config.historyData).find<Stock>({
    code,
    date: { $gte: _start, $lte: _end },
  }).sort({ date: 1 }).toArray()
}
