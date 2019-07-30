import { Stock } from 'open-quant-data-source';

export type ScanStrategy = (date: Stock[]) => boolean
