const unaryOps = [
  '!',
  '~',
  '+',
  '-',
];

const binaryOps = [
  '**',
  '*',
  '/',
  '%',
  '+',
  '-',
  '<<',
  '>>',
  '<',
  '==',
  '!=',
  '&',
  '^',
  '|',
  '&&',
  '||',
];

const symmetricBinaryOps = [
  '*',
  '+',
  '==',
  '!=',
  '&',
  '^',
  '|',
];

function findSolutions(input, output, maxLevel) {
  console.log('goal: ', output)
  let best = {distance: input.length, term: ''};
  for (const level of [...Array(maxLevel+1).keys()]) {
    console.log('level', level);
    for (const term of iterTerms(level)) {
      const o = input.map(i => eval(term));
      const distance = output.reduce((s,v,i)=>s+(v!=o[i]),0);

      if (distance > best.distance) {
        continue;
      }
      if (distance > 0 && distance === best.distance && term.length >= best.term.length) {
        continue;
      }

      best = {distance, term};
      console.log(`${distance}: "${term}" => ${o}`);
    }
  }

  function* iterTerms(level) {
    yield 'i';
    for (let i=input.length; i--;) {
      yield ''+i;
    }

    if (level === 0) {
      return;
    }

    for (const op of unaryOps) {
      for (const a of iterTerms(level - 1)) {
        const term = `${op}(${a})`;
        if (isUsable(term)) {
          yield term;
        }
      }
    }

    for (const op of binaryOps) {
      for (const a of iterTerms(level - 1)) {
        for (const b of iterTerms(level - 1)) {
          const term = `(${a})${op}(${b})`;
          if ((!symmetricBinaryOps.includes(op) || a <= b) && isUsable(term)) {
            yield term;
          }
        }
      }
    }

    for (const a of iterTerms(level - 1)) {
      for (const b of iterTerms(level - 1)) {
        for (const c of iterTerms(level - 1)) {
          const term = `(${a})?(${b}):(${c})`;
          if (isUsable(term)) {
            yield term;
          }
        }
      }
    }
  }

  function isUsable(term) {
    const first = ((i) => ''+eval(term))(0);
    return input.some(i=>''+eval(term) != first);
  }
}

const input = [0,1,2,3,4,5,6,7,8];
const output = input.map(i => '457690681'[i]);
//const output = input.map(i => '457690681'[i]&3);
//const output = input.map(i => '457690681'[i]>>2);
//const output = input.map(i => '457690681'[i]).reverse();
//const output = input.map(i => '457690681'[i]&3).reverse();
//const output = input.map(i => '457690681'[i]>>2).reverse();

findSolutions(input, output, 6);
