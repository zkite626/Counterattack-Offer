export interface SaveSmtpSettingDto {
  host?: unknown;
  port?: unknown;
  secure?: unknown;
  username?: unknown;
  password?: unknown;
  fromName?: unknown;
  fromEmail?: unknown;
  isEnabled?: unknown;
}

export interface TestSmtpDto {
  toEmail?: unknown;
}

export interface SmtpSettingResponse {
  id: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  fromName: string;
  fromEmail: string;
  isEnabled: boolean;
  lastTestedAt: string | null;
  lastTestStatus: 'success' | 'failed' | null;
  updatedAt: string;
}

export interface SmtpTestResponse {
  message: string;
}

export interface ValidatedSmtpSettingInput {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  isEnabled: boolean;
}
