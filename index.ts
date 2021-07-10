function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function dispense(value: number, size = 20): Array<number> {
  const lis: Array<number> = [];

  for (let i = 0; i < size; i++) {
    const r = size - i; // 剩余个数
    if (r <= 1) {
      lis.push(value);
    } else {
      const min = 1;
      const max = (value / r) * 2;
      const _value = randomInt(min, max - 1);
      lis.push(_value);
      value -= _value;
    }
  }
  return lis;
}

const arr = Array(20).fill(0);

for (let i = 0; i < 10; i++) {
  const rand = randomInt(25, 35);
  const lis = dispense(rand, 20);
  const res = lis.reduce((pre, cur, index) => {
    arr[index] += cur;
    return pre + cur;
  }, 0);
  console.log(`rand: ${rand} sum: ${res}`, lis);
}

// console.log();
console.log(arr);
