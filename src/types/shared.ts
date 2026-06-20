export interface Lead {
  name: string;
  email: string;
  company: string;
  size: string;
  timestamp?: number;
  answers?: Record<string, number>;
  score: number;
  level: string;
  gdprConsent?: boolean;
  gdprTimestamp?: number;
  id?: number;
  share_token?: string;
  diagnosticId?: number;
  shareToken?: string;
  shareUrl?: string;
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
