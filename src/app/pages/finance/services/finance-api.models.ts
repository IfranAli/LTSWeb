export type ApiFinanceItem = {
  accountId: number;
  amount: number;
  categoryType: number;
  date: string;
  time: string;
  id: number;
  name: string;
};

export type ApiFinanceSummary = {
  categoryName: string;
  total: string;
  items: ApiFinanceItem[];
};
