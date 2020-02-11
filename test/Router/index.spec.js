import { resolve } from 'path'
import { Nuxt, Builder } from 'nuxt'
import axios from 'axios';
jest.setTimeout(30000);
jest.mock('axios', () => {
  return {
    get: jest.fn(),
  };
});

// Init Nuxt.js and create a server listening on localhost:3001
describe('Nuxt testing', () => {
  let nuxt = null

  beforeAll(async () => {
    const rootDir = resolve(__dirname, '../..');
    let config = {};
    config = require(resolve(rootDir, 'nuxt.config.js'));
    config.dev = false;
    config.rootDir = rootDir;
    config.mode = 'universal';

    nuxt = new Nuxt(config);

    await new Builder(nuxt).build();
    nuxt.listen(3001, 'localhost');
  }, 20000);

  // Example of testing only generated html
  test('Route / exits and render HTML', async () => {
    const context = {}
    const { html } = await nuxt.renderRoute('/', context)
    expect(html.includes('<h4>Welcome to Currency Converter!</h4>')).toBeTruthy()
  })

  // Example of testing only generated html
  // test('Route /converter exits and render HTML', async () => {
  //   const context = {}
  //   const { html } = await nuxt.renderRoute('/converter', context)
  //   console.log(html)
  //   expect(html.includes('text-center')).toBeTruthy()
  // })

// Close server and ask nuxt to stop listening to file changes
  test('Closing server and nuxt.js', () => {
    nuxt.close()
  })
})


