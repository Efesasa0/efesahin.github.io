document.getElementById("year").textContent = new Date().getFullYear();

const terminal = document.querySelector('.terminal');
const bar = terminal.querySelector('.window-bar');
let offsetX, offsetY, isDragging = false;

function startDrag(e, term, barEl, setVars) {
  if (term.classList.contains('maximized')) return;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  setVars(clientX, clientY);
  barEl.style.cursor = 'grabbing';
  term.style.zIndex = ++topZ;
}

function doDrag(e, term, offX, offY) {
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  term.style.left = (clientX - offX) + 'px';
  term.style.top = (clientY - offY) + 'px';
}

function endDrag(barEl) {
  barEl.style.cursor = 'grab';
}

// Drag main terminal (mouse + touch)
bar.addEventListener('mousedown', e => {
  startDrag(e, terminal, bar, (x, y) => {
    isDragging = true;
    offsetX = x - terminal.offsetLeft;
    offsetY = y - terminal.offsetTop;
  });
});
bar.addEventListener('touchstart', e => {
  startDrag(e, terminal, bar, (x, y) => {
    isDragging = true;
    offsetX = x - terminal.offsetLeft;
    offsetY = y - terminal.offsetTop;
  });
});
document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  doDrag(e, terminal, offsetX, offsetY);
});
document.addEventListener('touchmove', e => {
  if (!isDragging) return;
  doDrag(e, terminal, offsetX, offsetY);
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  endDrag(bar);
});
document.addEventListener('touchend', () => {
  isDragging = false;
  endDrag(bar);
});

// Main terminal buttons
document.querySelector('.red').addEventListener('click', () => {
  terminal.classList.add('closed');
});
document.querySelector('.yellow').addEventListener('click', () => {
  terminal.classList.remove('maximized');
  terminal.classList.toggle('minimized');
});
document.querySelector('.green').addEventListener('click', () => {
  terminal.classList.remove('minimized');
  terminal.classList.toggle('maximized');
});

let topZ = 2; // Track window stacking

function spawnTerminal(contentHTML, title = "new@machine • bash") {
  const term = document.createElement('section');
  term.className = 'terminal spawned';
  term.style.top = '80px';
  term.style.left = '80px';
  term.style.zIndex = ++topZ;
  term.innerHTML = `
    <div class="window-bar">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="window-title">${title}</span>
    </div>
    <div class="window-screen">${contentHTML}</div>
  `;
  document.body.appendChild(term);

  // Render math in new window
  if (window.MathJax?.typesetPromise) {
    MathJax.typesetClear([term.querySelector('.window-screen')]);
    MathJax.typesetPromise([term.querySelector('.window-screen')])
      .catch(err => console.error("MathJax render error:", err));
  }

  // Button controls
  const redBtn = term.querySelector('.red');
  const yellowBtn = term.querySelector('.yellow');
  const greenBtn = term.querySelector('.green');
  const barNew = term.querySelector('.window-bar');

  redBtn.addEventListener('click', () => {
    term.classList.add('closed');
    term.addEventListener('transitionend', () => term.remove(), { once: true });
  });
  yellowBtn.addEventListener('click', () => {
    term.classList.remove('maximized');
    term.classList.toggle('minimized');
  });
  greenBtn.addEventListener('click', () => {
    term.classList.remove('minimized');
    term.classList.toggle('maximized');
    if (term.classList.contains('maximized')) {
      term.style.top = '0';
      term.style.left = '0';
    }
  });
  

  // Dragging for new terminal (mouse + touch)
  let dragX, dragY, dragging = false;
  function setDragVars(x, y) {
    dragging = true;
    dragX = x - term.offsetLeft;
    dragY = y - term.offsetTop;
  }
  barNew.addEventListener('mousedown', e => {
    if (term.classList.contains('maximized')) return;
    startDrag(e, term, barNew, setDragVars);
  });
  barNew.addEventListener('touchstart', e => {
    if (term.classList.contains('maximized')) return;
    startDrag(e, term, barNew, setDragVars);
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    doDrag(e, term, dragX, dragY);
  });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    doDrag(e, term, dragX, dragY);
  });
  document.addEventListener('mouseup', () => {
    dragging = false;
    endDrag(barNew);
  });
  document.addEventListener('touchend', () => {
    dragging = false;
    endDrag(barNew);
  });
  // Click to bring to front
  term.addEventListener('mousedown', () => {
    term.style.zIndex = ++topZ;
  });
}

document.addEventListener('click', e => {
  const link = e.target.closest('a');
  if (!link) return;

  // Only intercept .html links
  const href = link.getAttribute('href');
  if (!href || !href.endsWith('.html')) return;

  e.preventDefault();

  fetch(href)
    .then(res => res.text())
    .then(html => spawnTerminal(html, link.textContent.trim()))
    .catch(err => console.error("Failed to load:", err));
});


// Bring main terminal to front when clicked
terminal.addEventListener('mousedown', () => {
  terminal.style.zIndex = ++topZ;
});

const nightBtn = document.getElementById('nightlight-toggle');
nightBtn.addEventListener('click', () => {
  document.body.classList.toggle('nightlight');
  nightBtn.classList.toggle('active');
  nightBtn.textContent = document.body.classList.contains("nightlight") ? "ON" : "OFF";
});

// Open PDF directly on phone
document.addEventListener("DOMContentLoaded", () => {
  const cvLink = document.getElementById("cv-link");
  if (cvLink && window.innerWidth <= 784) {
    cvLink.setAttribute("href", "assets/efesahin.pdf");
    cvLink.setAttribute("target", "_blank"); // open in new tab
  }
});


