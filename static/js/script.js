var now = new Date();
document.querySelector("#year").innerText = now.getFullYear();

const draggableWindow = document.getElementById('draggable-window');
const titleBar = draggableWindow.querySelector('.title');
const trashCan = document.getElementById('desktop-trash');
const outline = document.querySelector('.window-outline');
let isDragging = false;
let startX;
let startY;
let xOffset;
let yOffset;

function updateOutlineSize() {
  const rect = draggableWindow.getBoundingClientRect();
  outline.style.width = rect.width + 'px';
  outline.style.height = rect.height + 'px';
}

updateOutlineSize();
outline.style.transform = window.getComputedStyle(draggableWindow).transform;
window.addEventListener('resize', updateOutlineSize);

titleBar.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
  if (e.target === titleBar || e.target.parentNode === titleBar) {
    isDragging = true;
    outline.style.display = 'block';

    if (xOffset === undefined) {
      xOffset = -draggableWindow.clientWidth / 2;
    }
    if (yOffset === undefined) {
      yOffset = -draggableWindow.clientHeight / 2;
    }

    startX = e.clientX - xOffset;
    startY = e.clientY - yOffset;
  }
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    xOffset = e.clientX - startX;
    yOffset = e.clientY - startY;
    setTranslate(xOffset, yOffset, outline);
  }
}

function removeWindow() {
  draggableWindow.style.animation = '';
  outline.style.display = 'block';

  const rect = outline.getBoundingClientRect();

  outline.style.transition = "transform 0.5s, width 0.5s, height 0.5s";
  outline.style.width = '0px';
  outline.style.height = '0px';
  outline.style.transform = `translate(calc(45vw), calc(-45vh))`;
  draggableWindow.style.display = 'none';
  const resetTransform = 'translate(-50%, -50%)';

  setTimeout(() => {
    outline.style.display = 'none';
    outline.style.transition = 'none';
    outline.style.transform = resetTransform;
    setTimeout(() => {
      draggableWindow.style.display = '';
      draggableWindow.style.transform = resetTransform;
      const contactDiv = draggableWindow.querySelector('.contact');
      const originalContent = contactDiv.innerHTML;
      contactDiv.innerHTML = "<div style='font-size: 1.2em; margin: 20px;'><br>Nice try! ;-)</div>";
      updateOutlineSize();
      xOffset = undefined;
      yOffset = undefined;
      setTimeout(() => {
        contactDiv.innerHTML = originalContent;
        updateOutlineSize();
        xOffset = undefined;
        yOffset = undefined;
      }, 1000);
    }, 2000);
  }, 450);
}

function dragEnd(e) {
  if (isDragging) {
    setTranslate(xOffset, yOffset, draggableWindow);
    outline.style.display = 'none';
  }
  isDragging = false;
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

const closeButton = document.getElementById('close-button');
closeButton.addEventListener('click', () => {
  removeWindow();
});

const menuItems = document.querySelectorAll('.menu-item');
let isMenuActive = false;

menuItems.forEach(item => {
  item.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isMenuActive = true;
    menuItems.forEach(mi => mi.classList.remove('active'));
    item.classList.add('active');
  });

  item.addEventListener('mouseenter', (e) => {
    if (isMenuActive) {
      menuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');
    }
  });
});

const dropdowns = document.querySelectorAll('.dropdown-item');
dropdowns.forEach(dropdownitem => {
  dropdownitem.addEventListener('mouseenter', (e) => {
    e.preventDefault();
      if (isMenuActive) {
        dropdowns.forEach(di => di.classList.remove('active'));
        dropdownitem.classList.add('active');
      }
  });
});

document.addEventListener('mouseup', () => {
  isMenuActive = false;
  menuItems.forEach(mi => mi.classList.remove('active'));
});

document.addEventListener('mousedown', (e) => {
  if (e.target.closest('#draggable-window')) {
    draggableWindow.classList.add('window-active');
  } else {
    draggableWindow.classList.remove('window-active');
  }
});

draggableWindow.classList.add('window-active');