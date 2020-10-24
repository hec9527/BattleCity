function Ticker(tick = 30) {
  let cTick = 0;
  return (cb: AnyFunction) => (cTick >= tick ? ((cTick = 0), cb()) : cTick++);
}

const t = Ticker(60);

setInterval(() => {
  t(() => console.log(new Date().getSeconds()));
}, 16);
