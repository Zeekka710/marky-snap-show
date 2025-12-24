export interface MetricCard {
  metric_name: string;
  value: number;
  change_percentage: number;
  change_direction: 'up' | 'down' | 'stable';
  previous_period_value: number;
  tooltip: string;
  sparkline_data?: number[];
  color?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface DashboardFilters {
  dateRange: { start: Date; end: Date };
  ageRange: string;
  region: string;
  province: string;
  occupation: string;
}

export interface ProvinceData {
  rank: number;
  name: string;
  value: number;
}

export interface OccupationData {
  rank: number;
  name: string;
  userCount: number;
}

export interface AgeDistributionData {
  ageRange: string;
  registeredUsers: number;
  activePercentage: number;
}

export interface OccupationDistributionData {
  occupation: string;
  registeredUsers: number;
  activePercentage: number;
}
