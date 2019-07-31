import async from 'async'
import { EventEmitter } from 'events'
import { DataSource } from 'open-quant-data-source'

import { ScanStrategy } from './types'

export enum RunnerEvent {
  ScanReceiveData = 'ScanReceiveData',
  ScanSkipData = 'ScanSkipData',
  ScanNoData = 'ScanNoData',
  ScanEnd = 'ScanEnd',
}

export class Runner extends EventEmitter {
  ds: DataSource

  constructor(ds: DataSource) {
    super()
    this.ds = ds
  }

  private _scan(strategy: ScanStrategy, codes: string[]) {
    const q = async.queue<string>((code, callback) => {
      this.ds.query(code).then(data => {
        if (data) {
          if (strategy(data, code)) {
            this.emit(RunnerEvent.ScanReceiveData, code, data)
          } else {
            this.emit(RunnerEvent.ScanSkipData, code, data)
          }
        } else {
          this.emit(RunnerEvent.ScanNoData, code)
        }
        callback()
      })
    }, 3)

    codes.forEach(code => {
      q.push(code)
    })

    q.drain(() => this.emit(RunnerEvent.ScanEnd))
  }

  scan(strategy: ScanStrategy, codes?: string[]) {
    if (!codes || codes.length === 0) {
      this.ds.list().then(allStocks => {
        if (allStocks) {
          codes = allStocks.map(stockInfo => stockInfo.code)
          this._scan(strategy, codes)
        }
      })
    } else {
      this._scan(strategy, codes)
    }
  }
}
