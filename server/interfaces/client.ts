import { WebSocket } from "ws";
import { Bet } from "./bet";
import { Subscription } from "rxjs";

export interface Client extends WebSocket {
  uuid: string;
  stock: string;
  wallet: number;
  history: Bet[];
  bet: Bet;
  subscription: Subscription;
}
