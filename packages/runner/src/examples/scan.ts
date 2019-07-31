import { DataSource, dataSource, Stock } from 'open-quant-data-source';
import {dropLast, gte, last, nth, takeLast} from 'ramda';
import { maF } from 'technical-indicator'

import { Runner, RunnerEvent } from '../runner'

export const CLOSE = (v: Stock) => v.close

const ds: DataSource = dataSource()
ds.config({
  type: 'mongodb',
  url: 'mongodb://localhost:27017',
  db: 'baostock',
  allStocks: 'all_stocks',
  historyData: 'history_k_data',
})

/**
 * ma70 > ma200
 * 前5日ma70和ma200有交叉
 */
const strategy = (data: Stock[], code: string) => {
  if (code.indexOf('sh.000') >= 0) {
    return false
  }
  const N = 5
  const ma70 = maF(CLOSE, 70)(data)
  const ma200 = maF(CLOSE, 200)(data)
  const lastNDays70 = dropLast(1, takeLast(N, ma70))
  const lastNDays200 = dropLast(1, takeLast(N, ma200))

  const p5 = nth(-5, ma70)
  if (p5 === undefined) {
    return false
  }

  return gte(last(ma70), last(ma200)) &&
    lastNDays70.some((x, i) => x < lastNDays200[i])
}

const runner = new Runner(ds)
runner.scan(strategy)

runner.on(RunnerEvent.ScanReceiveData, (code) => {
  console.log(code)
})
runner.on(RunnerEvent.ScanSkipData, (code) => {
  console.log('SKIP: ', code)
})
