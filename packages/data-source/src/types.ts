export interface Config {
  type: 'mongodb'
  url: string
  db: string
  allStocks: string
  historyData: string
}
export interface Stock {
  code: string
  date: string
  open: number
  close: number
  low: number
  high: number
  preclose: number
  volume: number
  amount: number
  adjustflag: number
  turn: number
  tradestatus: number
  isST: number
}
// TODO: clean the input data, unify the property names
export interface StockInfo {
  code: string
  tradeStatus: number
  code_name: string
}
