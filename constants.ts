
import { ReceiptRow } from './types';

export const PRIMARY_RED = '#b32d2e';
export const STAMP_BLUE = '#1a4299';

export const DEFAULT_ROWS: ReceiptRow[] = [
  { label: 'સભાસદ દાખલ ફી...', amount: 0 },
  { label: 'શેર ફાળા પેટે...', amount: 0 },
  { label: 'ડેવલપમેન્ટ ફાળા ખાતે...', amount: 0 },
  { label: 'વહીવટી ફાળા પેટે...', amount: 0 },
  { label: 'બાકી / વ્યાજ / દંડ...', amount: 0 },
];

export const STORAGE_KEY = 'nilkanth_receipts_v1';
