const app = new PIXI.Application({ width: 800, height: 700, backgroundColor: 0xFFFFFF });
//добавляем отрисовщик в HTML документ
document.body.appendChild(app.view);
app.view.style.border = "5px dashed black";

// определяем количество фигур 
let figuresAmount = Math.floor(Math.random() * 4) + 6;
let circleAmount = Math.floor(Math.random() * 3) + 1;
let triangleAmount = Math.floor(Math.random() * 3) + 1;
let squareAmount = figuresAmount - circleAmount - triangleAmount;
// массив для записи 
let figuresArr = [];


// рандомный цвет ==============================
function randomColor() {
    let letters = '0123456789ABCDEF';
    let color = '0x';

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// функции движения фигуры ======================
function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;

    // проверка на касание по отпусканию кнопки
    if (boxesIntersect(this, circleTarget)) {
        checkOnHit(this, circleTarget);
    } else if (boxesIntersect(this, squareTarget)) {
        checkOnHit(this, squareTarget);
    } else if (boxesIntersect(this, triangleTarget)) {
        checkOnHit(this, triangleTarget);
    }
}

// ===========================================
function checkOnHit(fig, targ) {
    // проверка на совпадение фигур
    if (targ.text === fig.text) {
        // удаление фигуры
        fig.destroy();
        // уменьшение массива на 1
        figuresArr.pop();
        // проверка на наличие фигур
        if (figuresArr.length == 0) {
            let endText = new PIXI.Text('Grats!');
            endText.x = 350;
            endText.y = 350;
            app.stage.addChild(endText);
        }
    } else {
        fig.x = Math.floor(Math.random() * 350) + 100;
        fig.y = Math.floor(Math.random() * 350) + 100;
    }
}

// сравнение позиций цели и фигуры ======================
function boxesIntersect(target, figure)
{
    let targ = target.getBounds();
    let fig = figure.getBounds();

    return (targ.x + targ.width > fig.x) && (targ.x < fig.x + fig.width) && (targ.y + targ.height > fig.y) && (targ.y < fig.y + fig.height);
}

// функции прорисовки фигур ===============================
function drawCircle(x, y, radius) {
    let graph = new PIXI.Graphics();
    
    graph.lineStyle(2, randomColor());
    graph.beginFill(randomColor());
    graph.drawCircle(x, y, radius);
    graph.endFill();
    
    // текстура
    let texture = app.renderer.generateTexture(graph);
    // делаем спрайт из нарисованного
    const circle = new PIXI.Sprite(texture);
    
    // интерактивный режим
    circle.interactive = true;
    // меняем курсор при наведении
    circle.buttonMode = true;
    circle.cursor = 'grab';
    
    // выравнивание элемента по центру
    circle.anchor.set(0.5);
    // события на мышь
    circle
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    // перемещаем на заданные координаты
    circle.x = x;
    circle.y = y;
    circle.text = 'circle';
    // добавляем в массив для подсчета
    figuresArr.push('circle');

    app.stage.addChild(circle);
}

function drawSquare(x, y, heiWid, rotation) {
    let graph = new PIXI.Graphics();

    graph.lineStyle(2, randomColor());
    graph.beginFill(randomColor());
    graph.drawRect(x, y, heiWid, heiWid);
    graph.endFill();

    let texture = app.renderer.generateTexture(graph);
    const square = new PIXI.Sprite(texture);
    
    square.interactive = true;
    square.buttonMode = true;
    square.cursor = 'grab';
    square.anchor.set(0.5);
    square
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    square.rotation = rotation;
    square.x = x;
    square.y = y;
    square.text = 'square';

    figuresArr.push('square');

    app.stage.addChild(square);
}

function drawTriangle(x, y, rotation) {
    let graph = new PIXI.Graphics();

    let rand = Math.floor(Math.random() * 50) + 50;

    graph.lineStyle(2, randomColor());
    graph.beginFill(randomColor());
    graph.moveTo(x, y);
    graph.lineTo(x + rand, y + rand);
    graph.lineTo(x + rand, y - rand);
    graph.closePath();
    graph.endFill();

    let texture = app.renderer.generateTexture(graph);
    const triangle = new PIXI.Sprite(texture);

    triangle.interactive = true;
    triangle.buttonMode = true;
    triangle.cursor = 'grab';
    triangle.anchor.set(0.5);
    triangle.rotation = rotation;
    triangle
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);
    triangle.x = x;
    triangle.y = y;
    triangle.text = 'triangle';

    figuresArr.push('triangle');

    app.stage.addChild(triangle);
}

// рисуем фигуры нужное количество раз ========================
for (let i = 0; i < circleAmount; i++) {
    drawCircle(
        Math.floor(Math.random() * 700) + 50,
        Math.floor(Math.random() * 450) + 50,
        Math.floor(Math.random() * 40) + 40
    );
}

for(let i = 0; i < squareAmount; i++) {
    drawSquare(
        Math.floor(Math.random() * 700) + 50,
        Math.floor(Math.random() * 450) + 50,
        Math.floor(Math.random() * 60) + 40,
        Math.floor(Math.random() * 25)
    );
}

for(let i = 0; i < triangleAmount; i++) {
    drawTriangle(
        Math.floor(Math.random() * 700) + 50,
        Math.floor(Math.random() * 450) + 50,
        Math.floor(Math.random() * 25)
    );
}

// цели для фигур ========================================
// круг =====
let graphicsCirc = new PIXI.Graphics();
graphicsCirc.lineStyle(2, 0x000000);
graphicsCirc.beginFill(0xFFFFFF);
graphicsCirc.drawCircle(700, 630, 50);
graphicsCirc.endFill(); 

let textureCirc = app.renderer.generateTexture(graphicsCirc);
let circleTarget = new PIXI.Sprite(textureCirc);
circleTarget.text = 'circle';
circleTarget.x = 650;
circleTarget.y = 550;
app.stage.addChild(circleTarget);

// квадрат =====
let graphicsSqr = new PIXI.Graphics();
graphicsSqr.lineStyle(2, 0x000000);
graphicsSqr.beginFill(0xFFFFFF);
graphicsSqr.drawRect(350, 550, 100, 100);
graphicsSqr.endFill(); 

let textureSqr = app.renderer.generateTexture(graphicsSqr);
let squareTarget = new PIXI.Sprite(textureSqr);
squareTarget.text = 'square';
squareTarget.x = 350;
squareTarget.y = 550;
app.stage.addChild(squareTarget);

// треугольник =====
let graphicsTr = new PIXI.Graphics();
graphicsTr.lineStyle(2, 0x000000);
graphicsTr.beginFill(0xFFFFFF);
graphicsTr.moveTo(100, 550);
graphicsTr.lineTo(150, 650);
graphicsTr.lineTo(50, 650);
graphicsTr.closePath();
graphicsTr.endFill(); 

let textureTr = app.renderer.generateTexture(graphicsTr);
let triangleTarget = new PIXI.Sprite(textureTr);
triangleTarget.text = 'triangle';
triangleTarget.x = 50;
triangleTarget.y = 550;
app.stage.addChild(triangleTarget);