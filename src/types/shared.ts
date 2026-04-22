export interface Lead {
  name: string;
  email: string;
  company: string;
  size: string;
  timestamp?: any;
  answers?: Record<string, number>;
  score: number;
  level: string;
}

export interface DiagnosticRequest {
  email: string;
  name: string;
  company: string;
  size: string;
  imd: number;
  level: string;
  answers: Record<string, number>;
  gdprConsent: boolean;
  gdprTimestamp?: number;
}
