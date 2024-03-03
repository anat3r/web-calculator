"use strict";
Array.from(document.getElementsByTagName('a')).forEach((el) => {
  el.id = el.innerText
  el.onclick = () => calculator.input(el);
});

class Calculator {
  exp = '';
  methods = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "√": (a) => Math.sqrt(a),
    "^": (a) => Math.pow(a, 2),
  };

  constructor() {
    let weight = {
      "+": 2,
      "-": 2,
      "*": 1,
      "/": 1,
      "√": 0,
      "^": 0,
    }
    for (let key of Object.keys(this.methods)) {
      this.methods[key].w = weight[key];
    }
  }

  input(el) {
    let clear = function () {
      this.textContent = "";
    }
    let display = document.getElementById("display");
    if (display === undefined || display === null) throw new Error("display not defined");
    switch (el.id) {
      case "=":
        let val = calculator.calculate(this.exp);
        clear.apply(display);
        display.textContent = val;
        this.exp = val;
        break;
      case "x2":
        this.exp += ' ^';
        display.textContent += '^2 ';
        break;
      case "√x":
        this.exp += ' ' + el.innerText[0];
        display.textContent = display.textContent.slice(0, display.textContent.lastIndexOf(" ") + 1) + ' ' + '√' + display.textContent.slice(display.textContent.lastIndexOf(" ") + 1)
        break;
      case "CE":
        clear.apply(display);
        this.exp = '';
        break;
      case "←":
        if (this.exp.length > 0) {
          if (this.exp.at(-1) === " " && this.exp.length > 1) this.exp = this.exp.slice(0, this.exp.length - 2);
          else this.exp = this.exp.slice(0, this.exp.length - 1);
        }
        if (display.textContent.length > 0) {
          if (display.textContent.at(-1) === " " && display.textContent.length > 1) display.textContent = display.textContent.slice(0, length - 2);
          else display.textContent = display.textContent.slice(0, display.textContent.length - 1);
        }
        break;
      default:
        this.exp += (((Number.isFinite(+el.innerText) || el.innerText === '.') && (Number.isFinite(+display.textContent.at(-1)) || display.textContent.at(-1) === '.')) || this.exp.length === 0) ? el.innerText : (" " + el.innerText);
        display.textContent += ((Number.isFinite(+el.innerText) || el.innerText === '.') && (Number.isFinite(+display.textContent.at(-1)) || display.textContent.at(-1) === '.')) ? el.innerText : (" " + el.innerText);
        break;
    }
  }

  calculate(str) {
    let exp = str.split(" ").filter((el) => el !== " ");
    exp.forEach(el => {
      if (!(Number.isFinite(+el) || this.methods[el])) {
        alert(el);
        alert(str);
        return "NaN";
      }
    });
    let ops = exp.filter((el) => this.methods[el]);
    let sort_ops = Array.from(ops);
    sort_ops.sort((a, b) => (this.methods[a].w - this.methods[b].w))
    let numbs = exp.filter((el) => Number.isFinite(+el)).map((el) => +el);
    let res = Array.from(numbs);
    sort_ops.forEach((op) => {
      let ids = ops.findIndex((el) => op === el);
      ops = Array(...ops.slice(0, ids), ...ops.slice(ids + 1));
      let tempRes = [(this.methods[op])(...res.slice(ids))]
      res.splice(ids, this.methods[op].length);
      res.unshift(...tempRes);
      /*      alert(`${res}; ${ids}; ${this.methods[op]}; ${this.methods[op](...res)}`);*/
    })
    return (Math.round(res[0] * 10000) / 10000) ?? str;
  }
}


let calculator = new Calculator();

function abc(el) {
  switch (el.key.toLowerCase()) {
    case "backspace":
    case "arrowleft":
      document.getElementById('←').onclick(this);
      break;
    case "delete":
      document.getElementById('CE').onclick(this);
      break;
    case "=":
    case "enter":
      document.getElementById('=').onclick(this);
      break;
    case '.':
    case ',':
      document.getElementById('.').onclick(this);
      break;
    case '^':
      abc.mes = '^';
      break;
    case '2':
      if (abc.mes === '^') {
        document.getElementById('x2').onclick(this);
        abc.mes = '';
      } else {
        document.getElementById('2').onclick(this);
      }
      break;
    default:
      try {
        if (abc.mes === '^') abc.mes = '';
        document.getElementById(el.key).onclick(this);
      } catch {
      }
  }
}

abc.mes = '';
document.addEventListener("keypress", (e) => {
  abc(e)
})

