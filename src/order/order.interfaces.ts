export interface IAdminReportData {
  bestsellers: IAdminReportItem[],
  earningsCount: number,
  totalSoldCount: number
}

export interface IAdminReportItem {
  soldCount: number,
  productId: string,
  moneyGained: number,
  name: string;
}