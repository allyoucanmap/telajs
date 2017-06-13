
const tela = require('./components/main');
const geovector = require('./extensions/geovector/index');

tela.ext(geovector);
tela.set('tela');

tela.resize();

tela.play();

tela.on('scroll');
tela.on('move');
tela.on('drag');

console.warn(tela);

if (module.hot) {
    module.hot.accept();
}
