// Helper: ngày hôm nay dạng yyyy-mm-dd
const today = () => new Date().toISOString().slice(0,10);

// DOM
const taskText = document.getElementById('taskText');
const startDate = document.getElementById('startDate');
const dueDate = document.getElementById('dueDate');
const addBtn = document.getElementById('addBtn');
const listEl = document.getElementById('list');
const filterEl = document.getElementById('filter');
const sortByEl = document.getElementById('sortBy');
const countsEl = document.getElementById('counts');
const clearCompletedBtn = document.getElementById('clearCompleted');
const clearAllBtn = document.getElementById('clearAll');
const toggleInputBtn = document.getElementById('toggleInput');

// Mặc định để ngày bắt đầu là hôm nay; hạn mặc định là hôm nay hoặc hôm sau
startDate.value = today();
// default due = today + 1
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10); }
dueDate.value = tomorrow();

// Lưu trữ trên localStorage
const STORAGE_KEY = 'todo_with_dates_v1';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); render(); }

function addTask(){
  const text = taskText.value.trim();
  const s = startDate.value;
  const d = dueDate.value;
  if(!text){ alert('Nhập việc cần làm.'); return; }
  if(!s || !d){ alert('Vui lòng chọn ngày bắt đầu và hạn.'); return; }
  if(s > d){ alert('Ngày bắt đầu không được sau hạn. Vui lòng chỉnh lại.'); return; }

  const newTask = {
    id: Date.now(),
    text,
    startDate: s,
    dueDate: d,
    createdAt: new Date().toISOString(),
    completed: false,
    completedAt: null
  };
  tasks.push(newTask);
  taskText.value='';
  startDate.value = s; // giữ lại start
  dueDate.value = d;
  save();
}

function toggleComplete(id, checked){
  const t = tasks.find(x=>x.id===id);
  if(!t) return;
  t.completed = checked;
  t.completedAt = checked ? (new Date().toISOString().slice(0,10)) : null;
  save();
}

function removeTask(id){
  if(!confirm('Xóa công việc này?')) return;
  tasks = tasks.filter(x=>x.id!==id); save();
}

function editTask(id){
  const t = tasks.find(x=>x.id===id); if(!t) return;
  const newText = prompt('Chỉnh sửa nội dung:', t.text); if(newText===null) return; // cancel
  const newStart = prompt('Ngày bắt đầu (YYYY-MM-DD):', t.startDate); if(newStart===null) return;
  const newDue = prompt('Hạn (YYYY-MM-DD):', t.dueDate); if(newDue===null) return;
  if(newStart > newDue){ alert('Ngày bắt đầu không được sau hạn. Hủy.'); return; }
  t.text = newText.trim() || t.text;
  t.startDate = newStart;
  t.dueDate = newDue;
  save();
}

function clearCompleted(){ if(!confirm('Xóa tất cả công việc đã hoàn thành?')) return; tasks = tasks.filter(x=>!x.completed); save(); }
function clearAll(){ if(!confirm('Xóa tất cả công việc?')) return; tasks = []; save(); }

function render(){
  // filter
  const f = filterEl.value;
  let filtered = tasks.slice();

  // detect overdue (chưa hoàn thành và due < today)
  const td = today();
  filtered.forEach(t=>{ t.isOverdue = (!t.completed) && (t.dueDate < td); });

  if(f==='active') filtered = filtered.filter(t=>!t.completed);
  if(f==='completed') filtered = filtered.filter(t=>t.completed);
  if(f==='overdue') filtered = filtered.filter(t=>t.isOverdue);

  // sort
  const sortBy = sortByEl.value;
  filtered.sort((a,b)=>{
    if(sortBy==='createdAt') return new Date(a.createdAt) - new Date(b.createdAt);
    if(a[sortBy] < b[sortBy]) return -1; if(a[sortBy] > b[sortBy]) return 1; return 0;
  });

  // render list
  listEl.innerHTML = '';
  if(filtered.length===0){ listEl.innerHTML = '<li class="small">Không có công việc nào.</li>'; }

  filtered.forEach(t=>{
    const li = document.createElement('li'); li.className='item';
    if(t.isOverdue) li.classList.add('overdue');
    if(t.completed) li.classList.add('completed');

    // checkbox
    const cb = document.createElement('input'); cb.type='checkbox'; cb.checked = !!t.completed;
    cb.addEventListener('change', ()=> toggleComplete(t.id, cb.checked));

    // content
    const content = document.createElement('div'); content.className='content';
    const title = document.createElement('div'); title.className='title'; title.textContent = t.text;
    const dates = document.createElement('div'); dates.className='dates';
    let dtxt = `Bắt đầu: ${t.startDate} • Hạn: ${t.dueDate}`;
    if(t.completedAt) dtxt += ` • Hoàn thành: ${t.completedAt}`;
    dates.textContent = dtxt;

    content.appendChild(title); content.appendChild(dates);

    // actions
    const actions = document.createElement('div'); actions.className='actions';
    const editBtn = document.createElement('button'); editBtn.className='btn ghost'; editBtn.innerHTML='<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', ()=> editTask(t.id));
    const delBtn = document.createElement('button'); delBtn.className='btn ghost'; delBtn.innerHTML='<i class="fas fa-trash"></i>';
    delBtn.addEventListener('click', ()=> removeTask(t.id));

    // tag: overdue/completed
    if(t.isOverdue){ const tag = document.createElement('span'); tag.className='tag'; tag.textContent='Quá hạn'; actions.appendChild(tag); }
    if(t.completed){ const tag = document.createElement('span'); tag.className='tag'; tag.textContent='Hoàn thành'; actions.appendChild(tag); }

    actions.appendChild(editBtn); actions.appendChild(delBtn);

    li.appendChild(cb); li.appendChild(content); li.appendChild(actions);
    listEl.appendChild(li);
  });

  // counts
  const total = tasks.length;
  const completed = tasks.filter(t=>t.completed).length;
  const overdue = tasks.filter(t=>(!t.completed) && (t.dueDate < today())).length;
  countsEl.textContent = `Tổng: ${total} • Hoàn thành: ${completed} • Quá hạn: ${overdue}`;
}

// Sự kiện
addBtn.addEventListener('click', addTask);
taskText.addEventListener('keydown', e=>{ if(e.key==='Enter') addTask(); });
filterEl.addEventListener('change', render);
sortByEl.addEventListener('change', render);
clearCompletedBtn.addEventListener('click', clearCompleted);
clearAllBtn.addEventListener('click', clearAll);
toggleInputBtn.addEventListener('click', ()=>{
  const c = document.querySelector('.controls'); c.style.display = c.style.display==='none'? 'flex': 'none';
  toggleInputBtn.innerHTML = c.style.display==='none' ? '<i class="fas fa-plus"></i> Mở' : '<i class="fas fa-minus"></i> Thu gọn';
});

// Khởi tạo
render();