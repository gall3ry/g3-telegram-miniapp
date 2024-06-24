import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ConfigModuleOptions } from './g3-telegram-bot-service-module.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
