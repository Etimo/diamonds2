import { BaseGameObject } from './base';
import { BotGameObject } from '../bot/bot';
import { BaseProvider } from './base-provider';
import { Board } from 'src/gameengine/board';

let provider: BaseProvider;

beforeAll(() => {
    provider = new BaseProvider();
})

test("Creates base when bot joins", () => {
    const bot = new BotGameObject({x: 0, y: 0});
    provider.onGameObjectsAdded(null, [bot]);
    expect(bot.base).toBeDefined();
})

