
export interface ReceiptRow {
  label: string;
  amount: number;
}

export interface ReceiptData {
  id: string;
  receiptNo: string;
  date: string;
  houseNo: string;
  name: string;
  payer: string;
  rows: ReceiptRow[];
  total: number;
  words: string;
  checkDetails: string;
  createdAt: number;
}

export interface Stats {
  totalCollection: number;
  totalReceipts: number;
}
