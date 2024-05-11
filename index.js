//Variables
let todoItems = []
let input = document.querySelector('.todo-input')
const completedTodoDiv = document.querySelector('.completed-todos')
const uncompletedTodoDiv = document.querySelector('.uncompleted-todo')
const audio = new Audio('images/mixkit-arcade-game-jump-coin-216.mp3.wav')

// Get todo list on first boot 
window.onload = () => {
    let StorageTodoItems = localStorage.getItem('todoItems')
    if(StorageTodoItems !== null){
       todoItems = JSON.parse(StorageTodoItems)
    }
    render()
}

// Get the content typed into the input
input.addEventListener("keyup", (e) => {
 let value = e.target.value.replace(/^\s+/,"")
 if (value && e.keyCode === 13) {
   addTodo(value) 
   input.value = ''
   input.focus()
 }
})

//Add todo 
function addTodo(text) {
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })
    saveandrender()
}

//remove todo
function removeTodo(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveandrender()
}
 
// Mark as completed 
function markAsCompleted(id){
    todoItems = todoItems.filter(todo => {
        if(todo.id == Number(id)){
            todo.completed = true
        }
        return todo
    })

    audio.play()
    saveandrender()
}

// Mark as uncompleted 
function markAsUncompleted(id) {
    todoItems = todoItems.filter(todo => {
        if(todo.id == Number(id)){
            todo.completed = false
        }
        return todo
    })
    saveandrender()
}

// Save in local Storage
 function save(){
    localStorage.setItem('todoItems',JSON.stringify(todoItems))
 }

 // Render
function render() {
    let unCompletedTodos = todoItems.filter(item => !item.completed)
    let CompletedTodos = todoItems.filter(item => item.completed)
    
    uncompletedTodoDiv.innerHTML = ''
    completedTodoDiv.innerHTML = ''
    
    
    if (unCompletedTodos.length > 0) {
        unCompletedTodos.forEach(todo => {
            uncompletedTodoDiv.append(createTodoElement(todo))
        })    
    }
    else 
    {
        const hml = `<div class='empty'>No uncompleted mission</div>`
        uncompletedTodoDiv.innerHTML = hml
    }
    if (CompletedTodos.length > 0) {
        const main = `<div class='completed-title'>Completed (${CompletedTodos.length} / ${todoItems.length})</div>`
        completedTodoDiv.innerHTML = main
        CompletedTodos.forEach(todo => {
            completedTodoDiv.append(createTodoElement(todo))
        })
     }
}

// Save and render
function saveandrender(){
    save();
    render();
}

// Create todo list item
function createTodoElement(todo) {
    // create todo List 
    const todoDiv = document.createElement('div')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    // Create todo item text
    const todoTextSpan = document.createElement('span')
    todoTextSpan.innerHTML = todo.text

    // Checkbox for list
    const todoInputCheckbox =document.createElement('input')
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.addEventListener('click',(e)=> {  
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)

    })



// Delete button for list 
const todoRemoveBtn = document.createElement('a')
todoRemoveBtn.href = '#'
todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M18 6l-12 12"></path>
                            <path d="M6 6l12 12"></path>
                            </svg>`
    todoRemoveBtn.addEventListener('click',(e)=> {  
        let id = e.target.closest('.todo-item').dataset.id
        removeTodo(id)
    }) 
todoTextSpan.prepend(todoInputCheckbox)
todoDiv.appendChild(todoTextSpan)
todoDiv.appendChild(todoRemoveBtn)
return todoDiv


}
