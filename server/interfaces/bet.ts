export interface Bet {
  stock: string;
  isWin: boolean;
  value: number;
  timestamp: string;
  open: number;
  openTimestamp: Date;
  close: number;
  closeTimestamp: Date;
  direction: string;
}
