import React from 'react';
import { TModelSpec, TStartupConfig } from 'librechat-data-provider';

export interface Endpoint {
  value: string;
  label: string;
  hasModels: boolean;
  /**
   * When set, represents a standalone agent associated with this endpoint.
   * Selecting the endpoint should automatically select this agent id.
   */
  agentId?: string;
  models?: Array<{ name: string; isGlobal?: boolean }>;
  icon: React.ReactNode;
  agentId?: string;
  agentNames?: Record<string, string>;
  assistantNames?: Record<string, string>;
  modelIcons?: Record<string, string | undefined>;
}

export interface SelectedValues {
  endpoint: string | null;
  model: string | null;
  modelSpec: string | null;
}

export interface ModelSelectorProps {
  startupConfig: TStartupConfig | undefined;
}
