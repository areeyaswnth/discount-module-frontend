export interface FixedAmountPayload {
    discountAmount: number;
  }
  
  export interface PercentageAmountPayload {
    discountPercent: number;
  }
  
  export interface PointsPayload {
    maxPercent: number;
    discountAmount: number;
  }
  
  export interface CategoryPricePayload {
    category: string;
    discountPercent: number;
  }
  export interface SeasonalPricePayload {
    countPerPrice: number;
    discountAmount: number;
  }
  
  export type DiscountPayload =
    | FixedAmountPayload
    | PercentageAmountPayload
    | PointsPayload
    | CategoryPricePayload
    | SeasonalPricePayload;
  