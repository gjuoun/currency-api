export interface Rate {
  timestamp: number;
  source: "USD";
  quotes: {
    [propName:string]: number;
  }
}