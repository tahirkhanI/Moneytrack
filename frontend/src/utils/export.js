import api from '../api/client';
import { jsPDF } from 'jspdf';

export const exportCSV = async () => {
  const res = await api.get('/transactions/export/csv', { responseType: 'blob' });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
};

export const exportPDF = async (summary) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Financial Summary', 14, 20);
  doc.setFontSize(12);
  doc.text(`Total Income: $${summary.totalIncome.toFixed(2)}`, 14, 35);
  doc.text(`Total Expenses: $${summary.totalExpenses.toFixed(2)}`, 14, 45);
  doc.text(`Net Balance: $${summary.netBalance.toFixed(2)}`, 14, 55);
  doc.save('financial-summary.pdf');
};
