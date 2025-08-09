// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const getTodosLocalStorage = () => {
    return JSON.parse(localStorage.getItem("todos")) || [];
};

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
    // garante que id seja string
    todos.push({ text: todo.text, done: !!todo.done, id: String(todo.id) });
    localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (id) => {
    const todos = getTodosLocalStorage();
    const filtered = todos.filter(todo => String(todo.id) !== String(id));
    localStorage.setItem("todos", JSON.stringify(filtered));
};

const updateTodoLocalStorage = (id, newText) => {
    const todos = getTodosLocalStorage().map(todo => {
        if (String(todo.id) === String(id)) {
            return { ...todo, text: newText };
        }
        return todo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
};

const toggleDoneStatus = (id) => {
    const todos = getTodosLocalStorage().map(todo => {
        if (String(todo.id) === String(id)) {
            return { ...todo, done: !todo.done };
        }
        return todo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
};

const saveTodo = (text, done = false, save = true, id = Date.now()) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.dataset.id = String(id);

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);

    if (done) {
        todo.classList.add("done");
    }

    if (save) {
        saveTodoLocalStorage({ text, done, id: String(id) });
    }

    todoList.appendChild(todo);
    todoInput.value = "";
    todoInput.focus();
};

const toggleForms = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
};

const updateTodo = (text, id) => {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
        if (String(todo.dataset.id) === String(id)) {
            todo.querySelector("h3").innerText = text;
            updateTodoLocalStorage(id, text);
        }
    });
};

const getSearchTodos = (search) => {
    const todos = document.querySelectorAll(".todo");
    const q = search.toLowerCase();
    todos.forEach((todo) => {
        const title = todo.querySelector("h3").innerText.toLowerCase();
        todo.style.display = title.includes(q) ? "flex" : "none";
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
    switch (filterValue) {
        case "all":
            todos.forEach((t) => t.style.display = "flex");
            break;
        case "done":
            todos.forEach((t) => t.classList.contains("done") ? (t.style.display = "flex") : (t.style.display = "none"));
            break;
        case "todo":
            todos.forEach((t) => !t.classList.contains("done") ? (t.style.display = "flex") : (t.style.display = "none"));
            break;
    }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = todoInput.value.trim();
    if (inputValue) {
        saveTodo(inputValue);
    }
});

// Delegação de eventos robusta (funciona mesmo quando clica no <i>)
document.addEventListener("click", (e) => {
    const target = e.target;
    const todoEl = target.closest(".todo");
    if (!todoEl) return;

    const todoId = todoEl.dataset.id;

    if (target.closest(".finish-todo")) {
        todoEl.classList.toggle("done");
        toggleDoneStatus(todoId);
        return;
    }

    if (target.closest(".remove-todo")) {
        todoEl.remove();
        removeTodoLocalStorage(todoId);
        return;
    }

    if (target.closest(".edit-todo")) {
        toggleForms();
        editInput.value = todoEl.querySelector("h3").innerText;
        oldInputValue = todoId;
        return;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = editInput.value.trim();
    if (val) updateTodo(val, oldInputValue);
    toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
    getSearchTodos(e.target.value);
});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
    filterTodos(e.target.value);
});

const loadTodos = () => {
    const todos = getTodosLocalStorage();
    todos.forEach(todo => {
        // aqui não salvamos de novo (save = false)
        saveTodo(todo.text, todo.done, false, todo.id);
    });
};

// Inicializa
loadTodos();
