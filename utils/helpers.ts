
// Import format from date-fns to handle date formatting for the CSV filename
import { format } from 'date-fns';
import { ReceiptData } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount).replace('₹', '₹ ');
};

export const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero Only';
  
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 !== 0 ? inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
    return '';
  };

  const amountInt = Math.floor(num);
  const amountDec = Math.round((num - amountInt) * 100);
  
  let result = inWords(amountInt) + 'Rupees ';
  if (amountDec > 0) {
    result += 'and ' + inWords(amountDec) + 'Paise ';
  }
  
  return result.trim() + ' Only';
};

export const exportToCSV = (data: ReceiptData[]) => {
  if (data.length === 0) return;

  // Use BOM for Excel to recognize UTF-8 (crucial for Gujarati names)
  const BOM = '\uFEFF';
  const headers = ['Date', 'Receipt No', 'Name', 'House No', 'Total Amount', 'Payer', 'Check Details'];
  const rows = data.map(r => [
    r.date,
    r.receiptNo,
    `"${r.name.replace(/"/g, '""')}"`,
    `"${r.houseNo.replace(/"/g, '""')}"`,
    r.total,
    `"${r.payer.replace(/"/g, '""')}"`,
    `"${r.checkDetails.replace(/"/g, '""')}"`
  ]);

  const csvContent = BOM + [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Nilkanth_Society_Report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};