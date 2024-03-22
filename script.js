const input = document.querySelector("#input");
const res = document.querySelector("#result");
const clear = document.querySelector("#clear");
const copy = document.querySelector("#copy");
const copySpan = copy.querySelector("#copy span");
const mySwitchNbsp = document.getElementById('mySwitchNbsp');
const mySwitchQuotes = document.getElementById('mySwitchQuotes');

let isBnsp = false;
let isQuetes = false;

document.addEventListener('DOMContentLoaded', function () {
  const switchBnsp = localStorage.getItem('switchBnsp');
  const switchQuotes = localStorage.getItem('switchQuotes');

  if (switchBnsp === 'true') {
    mySwitchNbsp.checked = true;
    isBnsp = true;
  }

  if (switchQuotes === 'true') {
    mySwitchQuotes.checked = true;
    isQuetes = true;
  }
});


function translit(str) {
  if (isBnsp) {
    str = str.replace("&nbsp;", " ");
  }

  if (isQuetes) {
    str = str.replace(/«|»|""|''/g, '');
  }


  const ru = new Map([
    ["а", "a"],
    ["б", "b"],
    ["в", "v"],
    ["г", "g"],
    ["д", "d"],
    ["е", "e"],
    ["є", "e"],
    ["ё", "e"],
    ["ж", "j"],
    ["з", "z"],
    ["и", "i"],
    ["ї", "yi"],
    ["й", "i"],
    ["к", "k"],
    ["л", "l"],
    ["м", "m"],
    ["н", "n"],
    ["о", "o"],
    ["п", "p"],
    ["р", "r"],
    ["с", "s"],
    ["т", "t"],
    ["у", "u"],
    ["ф", "f"],
    ["х", "h"],
    ["ц", "c"],
    ["ч", "ch"],
    ["ш", "sh"],
    ["щ", "shch"],
    ["ы", "y"],
    ["э", "e"],
    ["ю", "u"],
    ["я", "ya"],
  ]);

  str = str.replace(/[ъь]+/g, "").toLocaleLowerCase().trim();

  return str
    .split("")
    .reduce(
      (s, l) =>
        s +
        (ru.get(l) ??
          ((ru.get(l) === undefined && l) || String(ru.get(l)).toUpperCase())),
      "",
    ).split(" ").join("-")
}

input.addEventListener("input", (e) => {
  res.textContent = translit(e.target.value)
})

clear.addEventListener("click", (e) => {
  input.value = ""
  res.textContent = ""
  input.focus()
})

const copyFn = (text) => {
  if (typeof text !== "string") return;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log('then')
      copySpan.textContent = "Скопировано"
      copy.classList.add("copied")
      setTimeout(() => {
        copySpan.textContent = "Скопировать текст"
        copy.classList.remove("copied")
      }, 200)
    })
    .catch((err) => {
      console.log('erorr')
    });
};

copy.addEventListener("click", (e) => {
  if (res.textContent === "") {
    input.focus()
    return
  };

  copyFn(res.textContent)
})

const pasteButton = document.getElementById('paste');

pasteButton.addEventListener('click', () => {
  navigator.clipboard.readText()
    .then(text => {
      input.value = text;
      console.log('Текст успешно добавлен в инпут');
      res.textContent = translit(text)
    })
    .catch(err => {
      console.error('Ошибка при чтении текста из буфера обмена: ', err);
    });
});


mySwitchNbsp.addEventListener('change', function () {
  if (this.checked) {
    isBnsp = true;
    localStorage.setItem('switchBnsp', 'true');
  } else {
    isBnsp = false;
    localStorage.setItem('switchBnsp', 'false');
  }

  if (input.value.length > 0) {
    res.textContent = translit(input.value)
  }
});

mySwitchQuotes.addEventListener('change', function () {
  if (this.checked) {
    isQuetes = true;
    localStorage.setItem('switchQuotes', 'true');
  } else {
    isQuetes = false;
    localStorage.setItem('switchQuotes', 'false');
  }

  if (input.value.length > 0) {
    res.textContent = translit(input.value)
  }
});