let ope = document.getElementsByClassName("operator");
let num = document.getElementsByClassName("number");
let output = document.getElementById("output");
let clear = document.getElementById("clear");
let ni = document.getElementById("ni");
let clean = document.getElementById("clean");

let temp = output.innerHTML;
Array.from(num).forEach(function (item){
   item.addEventListener('click', function(eve) {
      output.innerHTML += item.innerHTML;
   });
});

clean.onclick = function (eve){
   output.innerHTML = '';
};

clear.onclick = function(eve) {
   temp = output.innerHTML;
   output.innerHTML = temp.slice(0, temp.length-1);
}

ni.onclick = function (eve){
   let text = '9×(9÷3(5+1))-(1-0)';//output.innerHTML;
   output.innerHTML = Calculation(text);
}

// main fn
function Calculation(queue) {
   if(queue.indexOf('(') !== -1) {
      queue = solveBracket(queue);
   
   }
   return basicCalculation(queue);
}

//solve Parentheses
function solveBracket(string) {
   let queue = string.slice();
   let bra = countParentheses(queue);

   if (bra.length === 0) {
      return string;
   } 

   for (let i=0; i<bra.length; i+=2) {
      if (bra[i] === '(' && bra[i+2] === ')') {
         let temp = string.slice(bra[i+1]+1, bra[i+3]);
         let res = basicCalculation(temp).toString();

         // check if there is an operator before
         if (!isNaN(string[bra[i+1]-1])) {
            res = '×'+res;
         }

         queue = queue.replace(`(${temp})`, res);// replace() don't touch the origin, so...
      }      
   }
   return solveBracket(queue);
}

function countParentheses(str) {
   let array = [], c = 0;
   for (let i of str) {
      if (i === '(' || i === ')') {
         array.push(i, c);
      }
      c++;
   }
   return array;
}

// basic operations
function basicCalculation(queue) {
   array = queue.replace(/\+|-|×|÷/g, ',').split(',');
   operator = Array.from(queue).filter((f) =>isNaN(f) === true && f != '.');

   if(operator.indexOf('÷') !== -1 || operator.indexOf('×') !== -1) {
      multiDiv(operator.length, array, operator);
   }

   array = array.filter((f) => f !== '$');
   operator = operator.filter((f) => f !== '$');

   if(operator.indexOf('+') !== -1 || operator.indexOf('-') !== -1) {
      addSub(operator.length, array, operator);
   }

   return array.pop();
}

// multiply and divide
function multiDiv(len, ary, operator) {
   let res;

   for(i=0; i<len; i++) {
      if (operator[i] === '×') {
         res = isDec(ary[i]) * isDec(ary[i+1]);
         update(res, ary, operator);
      }

      else if (operator[i] === '÷') {
         res = isDec(ary[i]) / isDec(ary[i+1]);
         update(res, ary, operator);
      }
   }
}

// add and subtract
function addSub(len, ary, operator) {
   let res;

   for(i=0; i<len; i++) {
      if (operator[i] === '+') {
         res = isDec(ary[i]) + isDec(ary[i+1]);
         update(res, ary, operator);
      }

      else if (operator[i] === '-') {
         res = isDec(ary[i]) - isDec(ary[i+1]); 
         update(res, ary, operator);
      }
   }
}

// check if a string is a whole or decimal
function isDec(n) {
   if (n.indexOf('.') !== -1) {
      return parseFloat(n);
   }
   return parseInt(n)
}

function update(res, ary, operator) {
   ary[i+1] = res.toString();
   ary.splice(i, 1, '$');
   operator.splice(i, 1, '$');
}