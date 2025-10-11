const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');
const STORAGE_KEY = 'simple-todos-v1';

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function escapeHtml(str = '') {
  return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
                    .replaceAll('"','&quot;').replaceAll("'",'&#39;');
}

function render() {
  list.innerHTML = '';
  if (todos.length === 0) {
    const hint = document.createElement('li');
    hint.textContent = 'No tasks yet — add one above!';
    hint.style.opacity = '0.6';
    hint.style.padding = '8px 6px';
    list.appendChild(hint);
    return;
  }
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' done' : '');
    li.innerHTML = `
      <label>
        <input type="checkbox" data-id="${todo.id}" ${todo.done ? 'checked' : ''}>
        <span class="text">${escapeHtml(todo.text)}</span>
      </label>
      <button class="delete" data-id="${todo.id}" aria-label="Delete task">✕</button>
    `;
    list.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  const todo = { id: Date.now().toString(), text, done: false };
  todos.unshift(todo); // newest at top
  input.value = '';
  save();
  render();
});

list.addEventListener('change', e => {
  if (e.target.matches('input[type="checkbox"]')) {
    const id = e.target.dataset.id;
    const item = todos.find(t => t.id === id);
    if (item) {
      item.done = e.target.checked;
      save();
      render();
    }
  }
});

list.addEventListener('click', e => {
  if (e.target.matches('button.delete')) {
    const id = e.target.dataset.id;
    todos = todos.filter(t => t.id !== id);
    save();
    render();
  }
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

clearAllBtn.addEventListener('click', () => {
  if (!confirm('Clear ALL tasks?')) return;
  todos = [];
  save();
  render();
});

render();
