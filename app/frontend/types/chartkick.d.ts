declare module 'chartkick' {
  export function useChart(): any; 
  export const ColumnChart: React.ComponentType<{
    data: Record<string, number> | [string, number][];
    xtitle?: string;
    ytitle?: string;
    height?: string
  }>;
}