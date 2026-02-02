export interface TooltipParam {
  seriesType: string;
  color: string;
  seriesName: string;
  value: number | string;
  name: string;
}

/** ECharts tooltip formatter callback param */
export interface TooltipCallbackParam {
  axisValue: string;
  value: number | string;
  marker: string;
  seriesName: string;
  seriesType: string;
  color: string;
  name: string;
}

/** Data point with value and optional itemStyle */
export interface DataPoint {
  value: number;
  itemStyle?: Record<string, unknown>;
}

/** Bar series item with data and itemStyle */
export interface BarSeriesItem {
  name: string;
  data: DataPoint[];
  type: string;
  stack?: string;
  barWidth?: number;
  emphasis?: Record<string, unknown>;
  itemStyle?: Record<string, unknown>;
  z?: number;
  [key: string]: unknown;
}

export interface Chart3Item {
  equipNo: string;
  equipName: string;
  equipNumber: number;
  equipRate: string;
  org: string;
}