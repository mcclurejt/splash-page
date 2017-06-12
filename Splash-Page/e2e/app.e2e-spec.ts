import { SplashPagePage } from './app.po';

describe('splash-page App', () => {
  let page: SplashPagePage;

  beforeEach(() => {
    page = new SplashPagePage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
