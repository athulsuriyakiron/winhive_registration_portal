// src/types/gtag.d.ts
export interface GtagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

export interface GtagConfig {
  page_path?: string;
  page_title?: string;
  page_location?: string;
  [key: string]: any;
}

export interface EventParams {
  [key: string]: any;
}

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: GtagConfig | EventParams
    ) => void;
    dataLayer: any[];
  }
}

export {};