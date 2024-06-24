import { Test } from '@nestjs/testing';
import { G3TelegramBotServiceModule } from './g3-telegram-bot-service-module.module';
import { G3TelegramBotService } from './g3-telegram-bot-service-module.service';

describe('G3TelegramBotServiceModuleService', () => {
  let service: G3TelegramBotService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        G3TelegramBotServiceModule.register({
          botApiKey: '7464940388:AAEdazNEPvWGdBdG62to6dHY78fbEkr7v7A',
        }),
      ],
    }).compile();

    service = module.get<G3TelegramBotService>(G3TelegramBotService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
    expect(
      await service.setStickers([
        {
          cdnUrl: 'https://cdn.example.com/sticker1.png',
          stickerId: 1,
        },
        {
          cdnUrl: 'https://cdn.example.com/sticker2.png',
          stickerId: 2,
        },
      ])
    ).toEqual({
      changeme: 'changeme',
    });
  });
});
