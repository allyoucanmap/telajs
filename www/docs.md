tela is a javascript webGl playground

<script language="javascript" type="text/javascript" src="./tela.js">
</script>

<canvas id="tela" class="tela-canvas">
</canvas>

<script language="javascript" type="text/javascript">

  tela.set('tela');
  tela.resize();

  var model = tela.mod({ ty: 'CUB' });
  var time = 0;

  var cube = tela.ent({
    mod: model,
    c: [1.0, 0.0, 1.0],
    sp: [0.0, 1.0, 1.0],
    ma: 2
  });

  tela.play(function () {
    cube.rx(cube.rx() + 1.0);
    cube.ry(cube.ry() + 2.0);
    cube.sx(Math.sin(time) + 1);
    cube.sy(Math.cos(time) + 1);
    cube.sz(Math.tan(time) + 1);

    time+= 0.05;
  });

  tela.on('click', function() {
      tela.pause();
  });

</script>
