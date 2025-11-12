import React from 'react';
import { GluestackUIProvider as Provider } from '@gluestack-ui/themed';
import { config } from '../_config/gluestack-ui.config';

export function GluestackUIProvider({ children }: { children: React.ReactNode }) {
  return <Provider config={config}>{children}</Provider>;
}

