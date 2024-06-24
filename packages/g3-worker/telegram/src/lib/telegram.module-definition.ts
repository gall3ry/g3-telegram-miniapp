import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ConfigModuleOptions } from './telegram-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
