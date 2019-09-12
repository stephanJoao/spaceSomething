<!DOCTYPE html>
<html lang="pt">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Semana 04</title>
    <script src="Sprite.js"></script>
    <script src="Scene.js"></script>
</head>

<body>
    <canvas></canvas>
    <script>
        var canvas = document.querySelector("canvas");
        canvas.width = 700;
        canvas.height = 880;
        var ctx = canvas.getContext("2d");
        var teclas = {
            esquerda: 0,
            cima: 0,
            direita: 0,
            baixo: 0,
            espaco: 0
        }

        var cena1 = new Scene({ ctx: ctx, w: canvas.width, h: canvas.height });

        var score = 0;
        var dtInimigos = 0;
        var tempo = 0;

        //ADICIONA ESTRELAS
        for (var k = 0; k < 400; k++) {
            var tam = 4 * Math.random();
            cena1.adicionar(new Sprite({
                x: canvas.width * Math.random(),
                y: 0,
                h: tam,
                w: tam,
                vy: 200 + 300 * Math.random(),
                color: "white", props: { tipo: "star" }
            }));
        }

        //ADICIONA PC
        var pc = new Sprite({ x: canvas.width / 2, y: 800, h: 30, w: 40, vida: 300, color: "mediumvioletred", comportar: porTeclasDirecionais(teclas), props: { tipo: "pc" }, a: 3.14159 });
        cena1.adicionar(pc);

        //ADICAO DE INIMIGOS
        cena1.adicionar(new Sprite({ x: 460, y: 150, w: 15, va: 2, vm: 30, color: "green", comportar: persegueSpawn(pc), props: { tipo: "npc", spawn: 0 } }));

        for (var k = 0; k < 10; k++) {

            cena1.adicionar(new Sprite({
                x: 300 * Math.random(),
                y: 400 * Math.random(),
                h: 20,
                va: 2 * Math.random(),
                vm: 40 * Math.random(),
                color: "red", comportar: persegue(pc), props: { tipo: "npc" }
            }));

        }
        function persegue(alvo) {
            return function () {
                this.vx = 20 * Math.sign(alvo.x - this.x);
                this.vy = 20 * Math.sign(alvo.y - this.y);
            }
        }

        function persegue2(alvo) {
            return function () {
                var dx = alvo.x - this.x;
                var dy = alvo.y - this.y;
                var da = Math.sqrt(dx * dx + dy * dy);
                var adj = 1.5;
                var prod = (dx / da) * Math.cos(this.a + adj) +
                    (dy / da) * Math.sin(this.a + adj);

                this.va = 2 * (prod - 0);
                this.vm = 30;
            }
        }

        function persegue3(alvo) {
            return function () {
                var dx = alvo.x - this.x;
                var dy = alvo.y - this.y;
                var da = Math.sqrt(dx * dx + dy * dy);
                var adj = 1;
                var prod = (dx / da) * Math.cos(this.a + adj) +
                    (dy / da) * Math.sin(this.a + adj);

                this.va = 2 * (prod - 0);
                this.vm = 530;
            }
        }

        function persegueSpawn(alvo) {
            return function () {
                var dx = alvo.x - this.x;
                var dy = alvo.y - this.y;
                var da = Math.sqrt(dx * dx + dy * dy);
                var adj = 1.5;
                var prod = (dx / da) * Math.cos(this.a + adj) +
                    (dy / da) * Math.sin(this.a + adj);

                this.va = 2 * (prod - 0);
                this.props.spawn -= (1 / 60);
                if (this.props.spawn <= 0) {
                    this.props.spawn = 2;
                    var novo = new Sprite({
                        x: this.x, y: this.y,
                        vm: 100 * Math.random(),
                        props: { tipo: "npc" },
                        comportar: persegue2(alvo)
                    });
                    this.scene.adicionar(novo);
                }
                //this.vm = 30;
            }
        }
        //ACABA ADICAO DE INIMIGOS

        function porTeclasDirecionais(teclas) {
            return function () {
                if (teclas.esquerda && this.x > 25) {
                    this.vx = -320;
                }
                if (teclas.direita && this.x < canvas.width - 25) {
                    this.vx = +320;
                }
                if (teclas.esquerda === teclas.direita) {
                    this.vx = 0;
                }
                if (teclas.cima && this.y > 30) {
                    this.vy = -220;
                }
                if (teclas.baixo && this.y < canvas.height - 80) {
                    this.vy = +420;
                }
                if (teclas.cima === teclas.baixo) {
                    this.vy = 0;
                }

                if (teclas.espaco && this.cooldown <= 0) {
                    var tiro = new Sprite({
                        x: this.x, y: this.y,
                        a: 3.14159 / 2 + this.a - 0.1 + 0.2 * Math.random(),
                        vm: 240, color: "green", w: 15, h: 15,
                        props: { tipo: "tiro" }
                    });
                    this.scene.adicionar(tiro);
                    this.cooldown = 0.1;
                }
            }
        }
        addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 32:
                    teclas.espaco = 1;
                    break;
                case 37:
                    teclas.esquerda = 1;
                    break;
                case 38:
                    teclas.cima = 1;
                    break;
                case 39:
                    teclas.direita = 1;
                    break;
                case 40:
                    teclas.baixo = 1;
                    break;
            }
        });
        addEventListener("keyup", function (e) {
            switch (e.keyCode) {
                case 32:
                    teclas.espaco = 0;
                    break;
                case 37:
                    teclas.esquerda = 0;
                    break;
                case 38:
                    teclas.cima = 0;
                    break;
                case 39:
                    teclas.direita = 0;
                    break;
                case 40:
                    teclas.baixo = 0;
                    break;
            }
        });

        function passo(t) {
            dt = (t - anterior) / 1000;
            dtInimigos = dtInimigos - dt;
            tempo = tempo + dt;
            cena1.passo(dt);
            anterior = t;
            ctx.font = "bold 12px Trebuchet";
            ctx.fillStyle = "white";
            ctx.fillText(1 / dt, 10, 20);
            ctx.fillText(tempo, 10, 30);
            ctx.fillText(dtInimigos, 10, 40);
            ctx.fillText(score, 500, 800);
            requestAnimationFrame(passo);
        }

        var dt, anterior = 0;
        requestAnimationFrame(passo);


    </script>
</body>

</html>
