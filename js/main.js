(function () {
  let originalPositions = [];
  let daElements = document.querySelectorAll("[data-da]");
  let daElementsArray = [];
  let daMatchMedia = [];
  //Заполняем массивы
  if (daElements.length > 0) {
    let number = 0;
    for (let index = 0; index < daElements.length; index++) {
      const daElement = daElements[index];
      const daMove = daElement.getAttribute("data-da");
      if (daMove != "") {
        const daArray = daMove.split(",");
        const daPlace = daArray[1] ? daArray[1].trim() : "last";
        const daBreakpoint = daArray[2] ? daArray[2].trim() : "767";
        const daType = daArray[3] === "min" ? daArray[3].trim() : "max";
        const daDestination = document.querySelector("." + daArray[0].trim());
        if (daArray.length > 0 && daDestination) {
          daElement.setAttribute("data-da-index", number);
          //Заполняем массив первоначальных позиций
          originalPositions[number] = {
            parent: daElement.parentNode,
            index: indexInParent(daElement),
          };
          //Заполняем массив элементов
          daElementsArray[number] = {
            element: daElement,
            destination: document.querySelector("." + daArray[0].trim()),
            place: daPlace,
            breakpoint: daBreakpoint,
            type: daType,
          };
          number++;
        }
      }
    }
    dynamicAdaptSort(daElementsArray);

    //Создаем события в точке брейкпоинта
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daBreakpoint = el.breakpoint;
      const daType = el.type;

      daMatchMedia.push(
        window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)")
      );
      daMatchMedia[index].addListener(dynamicAdapt);
    }
  }
  //Основная функция
  function dynamicAdapt(e) {
    for (let index = 0; index < daElementsArray.length; index++) {
      const el = daElementsArray[index];
      const daElement = el.element;
      const daDestination = el.destination;
      const daPlace = el.place;
      const daBreakpoint = el.breakpoint;
      const daClassname = "_dynamic_adapt_" + daBreakpoint;

      if (daMatchMedia[index].matches) {
        //Перебрасываем элементы
        if (!daElement.classList.contains(daClassname)) {
          let actualIndex = indexOfElements(daDestination)[daPlace];
          if (daPlace === "first") {
            actualIndex = indexOfElements(daDestination)[0];
          } else if (daPlace === "last") {
            actualIndex = indexOfElements(daDestination)[
              indexOfElements(daDestination).length
            ];
          }
          daDestination.insertBefore(
            daElement,
            daDestination.children[actualIndex]
          );
          daElement.classList.add(daClassname);
        }
      } else {
        //Возвращаем на место
        if (daElement.classList.contains(daClassname)) {
          dynamicAdaptBack(daElement);
          daElement.classList.remove(daClassname);
        }
      }
    }
    customAdapt();
  }

  //Вызов основной функции
  dynamicAdapt();

  //Функция возврата на место
  function dynamicAdaptBack(el) {
    const daIndex = el.getAttribute("data-da-index");
    const originalPlace = originalPositions[daIndex];
    const parentPlace = originalPlace["parent"];
    const indexPlace = originalPlace["index"];
    const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
    parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
  }
  //Функция получения индекса внутри родителя
  function indexInParent(el) {
    var children = Array.prototype.slice.call(el.parentNode.children);
    return children.indexOf(el);
  }
  //Функция получения массива индексов элементов внутри родителя
  function indexOfElements(parent, back) {
    const children = parent.children;
    const childrenArray = [];
    for (let i = 0; i < children.length; i++) {
      const childrenElement = children[i];
      if (back) {
        childrenArray.push(i);
      } else {
        //Исключая перенесенный элемент
        if (childrenElement.getAttribute("data-da") == null) {
          childrenArray.push(i);
        }
      }
    }
    return childrenArray;
  }
  //Сортировка объекта
  function dynamicAdaptSort(arr) {
    arr.sort(function (a, b) {
      if (a.breakpoint > b.breakpoint) {
        return -1;
      } else {
        return 1;
      }
    });
    arr.sort(function (a, b) {
      if (a.place > b.place) {
        return 1;
      } else {
        return -1;
      }
    });
  }
  //Дополнительные сценарии адаптации
  function customAdapt() {
    //const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }
})();

const menuBurger = document.querySelector(".header__burger svg");
const menuList = document.querySelector(".header__nav-list");

menuBurger.addEventListener("click", morphMenu);

function morphMenu() {
  menuBurger.classList.toggle("open");
  menuList.classList.toggle("header__nav-list--active");
  document.body.classList.toggle("scroll-hidden");
}

//slider
let position = 0;
const slidesToShow = 1;
const slidesToScroll = 1;
const sliderContainer = document.querySelector(".header__slider");
const track = document.querySelector(".header__slider-row");
const btnPrev = document.querySelector(".button-prev");
const btnNext = document.querySelector(".button-next");
const items = document.querySelectorAll(".header__slider-item");
const itemsCount = items.length;
const itemWidth = sliderContainer.clientWidth / slidesToShow;
const movePosition = slidesToScroll * itemWidth;

items.forEach((item) => {
  item.style.minWidth = `${itemWidth}px`;
});

btnNext.addEventListener("click", () => {
  const itemsLeft =
    itemsCount - (Math.abs(position) + slidesToShow * itemWidth) / itemWidth;

  position -=
    itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth;

  setPosition();
  checkBtns();
});

btnPrev.addEventListener("click", () => {
  const itemsLeft = itemsCount - Math.abs(position) / itemWidth;

  position +=
    itemsLeft >= slidesToScroll ? movePosition : itemsLeft * itemWidth;

  setPosition();
  checkBtns();
});

const setPosition = () => {
  track.style.transform = `translateX(${position}px)`;
};

const checkBtns = () => {
  btnPrev.disabled = position === 0;
  btnNext.disabled = position <= -(itemsCount - slidesToShow) * itemWidth;
};
checkBtns();

//services slider

function servicesSlider() {
  let position = 0;
  let movePosition = 234;
  const slider = document.querySelector(".services__slider");
  const sliderRow = document.querySelector(".services__slider-row");
  const sliderItems = document.querySelectorAll(".services__slider-item");
  const btnPrev = document.querySelector(".services__button-prev");
  const btnNext = document.querySelector(".services__button-next");
  const lastPoint = (sliderItems.length - 1) * movePosition;

  if (document.body.offsetWidth <= 420) {
    let timer;
    position = 0;
    autoSlider();
    function autoSlider() {
      timer = setTimeout(function () {
        if (position === -lastPoint) {
          position = 0;
        }
        position -= movePosition;
        sliderRow.style.left = position + "px";
        autoSlider();
      }, 7000);
    }
  }

  btnPrev.onclick = function () {
    if (position === 0) {
      btnPrev.disabled;
    } else {
      position += movePosition;
      sliderRow.style.left = position + "px";
    }
  };

  btnNext.onclick = function () {
    if (slider.clientWidth <= 250) {
      if (position === -lastPoint) {
        btnNext.disabled;
      } else {
        position -= movePosition;
        sliderRow.style.left = position + "px";
      }
    } else if (slider.clientWidth <= 480) {
      if (position === -lastPoint + movePosition) {
        btnNext.disabled;
      } else {
        position -= movePosition;
        sliderRow.style.left = position + "px";
      }
    } else if (slider.clientWidth <= 715) {
      if (position === -lastPoint + movePosition * 2) {
        btnNext.disabled;
      } else {
        position -= movePosition;
        sliderRow.style.left = position + "px";
      }
    } else if (slider.clientWidth > 715) {
      if (position === -lastPoint + movePosition * 3) {
        btnNext.disabled;
      } else {
        position -= movePosition;
        sliderRow.style.left = position + "px";
      }
    } else if (slider.clientWidth > 960) {
      if (position === -lastPoint + movePosition * 4) {
        btnNext.disabled;
      } else {
        position -= movePosition;
        sliderRow.style.left = position + "px";
      }
    }
  };
}
// position -= movePosition;
// sliderRow.style.left = position + "px";
servicesSlider();

function teamSlider() {
  let position = 0;
  let movePosition = 300;
  const slider = document.querySelector(".team__slider");
  const sliderRow = document.querySelector(".team__slider-row");
  const sliderItems = document.querySelectorAll(".team__slider-item");
  const btnPrev = document.querySelector(".team__slider-button-prev");
  const btnNext = document.querySelector(".team__slider-button-next");
  const lastPoint = (sliderItems.length - 1) * movePosition;

  btnPrev.onclick = function () {
    if (position === 0) {
      btnPrev.disabled;
    } else {
      position += movePosition;
      sliderRow.style.left = position + "px";
    }
  };

  if (document.body.offsetWidth <= 380) {
    let timer;
    position = 0;
    autoSlider();
    function autoSlider() {
      timer = setTimeout(function () {
        if (position === -lastPoint) {
          position = 0;
        }
        position -= movePosition;
        sliderRow.style.left = position + "px";
        autoSlider();
      }, 5000);
    }
  }

  btnNext.onclick = function () {
    if (document.body.offsetWidth > 380 && document.body.offsetWidth <= 680) {
      if (position === -lastPoint) {
        nextBtn.disabled;
      } else {
        position -= movePosition;
        sliderRow.style.left = position + "px";
      }
    } else if (
      document.body.offsetWidth > 680 &&
      document.body.offsetWidth <= 978
    ) {
      if (position === -lastPoint + movePosition) {
        nextBtn.disabled;
      } else {
        position -= movePosition;
        sliderRow.style.left = position + "px";
      }
    } else if (document.body.offsetWidth > 978) {
      if (position === -lastPoint + movePosition * 2) {
        nextBtn.disabled;
      } else {
        position -= movePosition;
        sliderRow.style.left = position + "px";
      }
    }
  };
}

teamSlider();
