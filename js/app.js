"use strict";

Array.from(document.getElementsByTagName('a')).forEach((el) => {
  el.id = el.innerText
  el.onclick = () => calculator.input(el);
});

function clear() {
  this.textContent = "";
}
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
    let id = el.id;
    let display = document.getElementById("display");
    if (display === undefined || display === null) throw new Error("display not defined");
    if (id === "=") {
      let val = calculator.calculate(this.exp);
      clear.apply(display);
      display.textContent = val;
      this.exp = val;
    } else if (id === "√x") {
      this.exp += ' ' + el.innerText[0];
      display.textContent = display.textContent.slice(0, display.textContent.lastIndexOf(" ") + 1) + ' ' + '√' + display.textContent.slice(display.textContent.lastIndexOf(" ") + 1)
    } else if (id === "x2") {
      this.exp += ' ^';
      display.textContent += ' ^ 2'
    } else if (id === "CE"){
      clear.apply(display);
      this.exp = '';
    }else if (id === "←"){
      if (this.exp.length>0) {
        if (this.exp.at(-1) === " " && this.exp.length>1) this.exp = this.exp.slice(0,this.exp.length-2);
        else this.exp = this.exp.slice(0,this.exp.length-1);
      }
      if(display.textContent.length > 0){
        if (display.textContent.at(-1) === " " && display.textContent.length>1) display.textContent = display.textContent.slice(0,length-2);
        else display.textContent = display.textContent.slice(0,display.textContent.length-1) ;
      }
    }else {
      this.exp += (((Number.isFinite(+el.innerText) || el.innerText === '.') && (Number.isFinite(+display.textContent.at(-1)) || display.textContent.at(-1) === '.')) || this.exp.length === 0) ? el.innerText : (" " + el.innerText);
      display.textContent += ((Number.isFinite(+el.innerText) || el.innerText === '.') && (Number.isFinite(+display.textContent.at(-1)) || display.textContent.at(-1) === '.')) ? el.innerText : (" " + el.innerText);
    }
  }

  calculate(str) {
    let exp = str.split(" ").filter((el) => el !== " ");
    exp.forEach(el => {
      if (!(Number.isFinite(+el) || this.methods[el])) return "NaN";
    });
    let ops = exp.filter((el) => this.methods[el]);
    let sort_ops = Array.from(ops);
    sort_ops = sort_ops.sort((a, b) => (this.methods[a].w - this.methods[b].w))
    let numbs = exp.filter((el) => Number.isFinite(+el)).map((el) => +el);
    let res = Array.from(numbs);
    sort_ops.forEach((op) => {
      let ids = ops.findIndex((el) => op === el);
      res.splice(ids, this.methods[op].length, ((this.methods[op])(...res.slice(ids, this.methods[op].length + ids))));
    })
    return (Math.round(res * 10000) / 10000) ?? str;
  }
}
let calculator = new Calculator();
