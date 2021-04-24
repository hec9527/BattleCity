/**
 * test 环境预设
 */

// game box
const gameBox = document.createElement('div');
gameBox.setAttribute('id', 'gameBox');
document.body.appendChild(gameBox);

const canvas = document.createElement('canvas');
canvas.setAttribute('id', 'game');
document.body.appendChild(canvas);

const el = document.createElement('h1');
const el1 = document.createElement('span');
const el2 = document.createElement('div');
el.innerHTML = 'h1';
el1.innerHTML = 'span';
el2.innerHTML = 'div';
el.id = 'h1';
el1.className = 'span';
el2.className = 'div';
document.body.appendChild(el);
document.body.appendChild(el1);
document.body.appendChild(el2.cloneNode());
document.body.appendChild(el2.cloneNode());
document.body.appendChild(el2.cloneNode());
