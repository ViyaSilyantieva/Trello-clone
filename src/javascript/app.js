import { renderTask, taskTodo } from './modules/helpers.js'
import { buildTaskTemplate, builTaskInProgressTemplate, builTaskDoneTemplate } from './modules/builders.js'

let tasksTodo = []
let inProgress = []
let done = []

let lastEditedElementIndex = undefined
const timeElement = document.querySelector('.trello__time')
const addButtonElement = document.querySelector('.btn-add__todo')
const overlayElement = document.querySelector('.overlay')
const titleInputElement = document.querySelector('#todo__input')
const descriptionInputElement = document.querySelector('#todo__textarea')
const modalTodoElement = document.querySelector('#modal__add')
const cancelButtonElement = document.querySelector('#todo__cancel')
const confirmButtonElement = document.querySelector('#todo__confirm')
const titleEditInputElement = document.querySelector('#edit__input')
const descriptionEditInputElement = document.querySelector('#edit__textarea')
const modalEditEelement = document.querySelector('#modal__edit')
const cancelEditButtonElement = document.querySelector('#edit__cancel')
const confirmEditButtonElement = document.querySelector('#edit__confirm')
const selectUsersElement = document.querySelector('#todo__users')
const selectEditUsersElement = document.querySelector('#edit__users')
const todoContentElement = document.querySelector('.trello-todo__content')
const inProgressContentElement = document.querySelector('.trello-inprogress__content')
const doneContentElement = document.querySelector('.trello-done__content')
const warning1Element = document.querySelector('.warning1')
const warning1ButtonElement = document.querySelector ('.btn__warning1')
const deleteAllElement = document.querySelector ('.btn-delete__done')
const warning2Element = document.querySelector ('.warning2')
const cancelDoneElement = document.querySelector ('.btn__cancel')
const confirmDoneElement = document.querySelector ('.btn__confirm')


addButtonElement.addEventListener('click', openModal)
cancelButtonElement.addEventListener('click', closeModal)
confirmButtonElement.addEventListener('click', handleGetTask)
confirmEditButtonElement.addEventListener('click', confirmEdit)
cancelEditButtonElement.addEventListener('click', closeEditModal)
todoContentElement.addEventListener('click', deleteTaskTodo)
todoContentElement.addEventListener('click', editTaskTodo)
todoContentElement.addEventListener('change', transitionInProgress)
todoContentElement.addEventListener('change', transitionTodoToDone)
inProgressContentElement.addEventListener('change', transitionTodo)
inProgressContentElement.addEventListener('change', transitionDone)
doneContentElement.addEventListener('click', deleteTaskDoneTodo)
warning1ButtonElement.addEventListener('click', closeWarning1)
deleteAllElement.addEventListener('click', deleteDone)
cancelDoneElement.addEventListener('click', closeWarning2)
confirmDoneElement.addEventListener('click', deleteDoneTask)

///// получение времени
let time = setInterval(() => {
    let date = new Date()
    let options = {
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    timeElement.textContent = date.toLocaleString("ru", options)
}, 1000)

/////Модальное окно Add
// открытие и закрытие модального окна
function openModal () {
    modalTodoElement.style.visibility = 'visible'
    overlayElement.style.visibility = 'visible'
}

function closeModal () {
    modalTodoElement.style.visibility = 'hidden'
    overlayElement.style.visibility = 'hidden'
    titleInputElement.value = ''
    descriptionInputElement.value = ''
}

//Добавление пользователей в модальное окно
async function getUsers () {
    for(let i = 1; i < 11; i++) {
        let link = 'https://jsonplaceholder.typicode.com/users/'
        try {
            const response = await fetch(link +=i)
            const data = await response.json()
            renderUsersModal(data);
        } catch (error) {
            console.log(error);
        }
    }
}

getUsers()

function buildOption (data) {
    return `
        <option class="option__users">${data.name}</option>
    `
}

function renderUsersModal (data) {
    selectUsersElement.innerHTML += buildOption(data)
}

///// модальное окно Warning
function openWarning1() {
    if (inProgress.length > 2) {
        warning1Element.style.visibility = 'visible'
        overlayElement.style.visibility = 'visible'
    } 
}

function closeWarning1() {
    warning1Element.style.visibility = 'hidden'
    overlayElement.style.visibility = 'hidden'
}

function closeWarning2() {
    warning2Element.style.visibility = 'hidden'
    overlayElement.style.visibility = 'hidden'
}

function deleteDone() {
    warning2Element.style.visibility = 'visible'
    overlayElement.style.visibility = 'visible'
}

function deleteDoneTask() {
    done.length = 0
    localStorage.removeItem('done')
    renderTask(done, doneContentElement, builTaskDoneTemplate)
    closeWarning2()
    saveToLocalStorage()
}

///// Заполнение массива
function handleGetTask (event) {
    if(titleInputElement.value == ''|| descriptionInputElement.value=='' ||selectUsersElement.value=='') {
        alert('Введите данные')
        return
    }
    event.preventDefault()

    const todoInstance = new taskTodo(titleInputElement.value, descriptionInputElement.value, selectUsersElement.value)
    tasksTodo.push(todoInstance)
    saveToLocalStorage()
    renderTask(tasksTodo, todoContentElement, buildTaskTemplate)
    closeModal ()
}

///// Переход между массивами
function transitionInProgress (event) {
    if(inProgress.length > 2) {
        return 
    }

    if (event.target.dataset.action == 'status') {
        if (event.target.value == 'In progress') {
            const parentNode = event.target.closest('.trello-todo__container')
            const id = parentNode.id

            const foundIndex = tasksTodo.findIndex((task) => task.id == id);
            const foundTodo = tasksTodo.find((task) => task.id == id)

            tasksTodo.splice(foundIndex, 1)
            inProgress.push(foundTodo)
            saveToLocalStorage()
            renderTask(tasksTodo, todoContentElement, buildTaskTemplate)
            renderTask(inProgress, inProgressContentElement, builTaskInProgressTemplate)
        }
    }
    openWarning1()
}

function transitionTodo (event) {
    if (event.target.dataset.action == 'status__in__progress') {
        if (event.target.value == 'Todo') {
            const parentNode = event.target.closest('.trello-todo__container')
            const id = parentNode.id

            const foundIndex = inProgress.findIndex((task) => task.id == id);
            const foundTodo = inProgress.find((task) => task.id == id)

            inProgress.splice(foundIndex, 1)
            tasksTodo.push(foundTodo)
            saveToLocalStorage()
            renderTask(inProgress, inProgressContentElement, builTaskInProgressTemplate)
            renderTask(tasksTodo, todoContentElement, buildTaskTemplate)
        }
    }
}

function transitionDone (event) {
    if (event.target.dataset.action == 'status__in__progress') {
        if (event.target.value == 'Done') {
            const parentNode = event.target.closest('.trello-todo__container')
            const id = parentNode.id

            const foundIndex = inProgress.findIndex((task) => task.id == id);
            const foundTodo = inProgress.find((task) => task.id == id)
    
            inProgress.splice(foundIndex, 1)
            done.push(foundTodo)
            saveToLocalStorage()
            renderTask(inProgress, inProgressContentElement, builTaskInProgressTemplate)
            renderTask(done, doneContentElement, builTaskDoneTemplate)
        }
    }
}

function transitionTodoToDone (event) {
    if (event.target.dataset.action == 'status') {
        if (event.target.value == 'Done') {
            const parentNode = event.target.closest('.trello-todo__container')
            const id = parentNode.id

            const foundIndex = tasksTodo.findIndex((task) => task.id == id);
            const foundTodo = tasksTodo.find((task) => task.id == id)

            tasksTodo.splice(foundIndex, 1)
            done.push(foundTodo)
            saveToLocalStorage()
            renderTask(tasksTodo, todoContentElement, buildTaskTemplate)
            renderTask(done, doneContentElement, builTaskDoneTemplate)
        }
    }
}

///// удаление задания из tasksTodo
function deleteTaskTodo (event) {
    if (event.target.dataset.action === 'delete') {
    const parentNode = event.target.closest('.trello-todo__container')
    const id = parentNode.id
        
    const index = tasksTodo.findIndex((task) => task.id == id);
    tasksTodo.splice(index, 1)
    saveToLocalStorage()
    parentNode.remove()
    }
}

function deleteTaskDoneTodo (event) {
    if (event.target.dataset.action === 'delete__done') {
    const parentNode = event.target.closest('.trello-todo__container')
    const id = parentNode.id
        
    const index = done.findIndex((task) => task.id == id);
    done.splice(index, 1)
    saveToLocalStorage()
    parentNode.remove()
    }
}

///// Модальное окно Edit
// Добавление пользователей в окно редактирования
async function getEditUsers() {
    for(let i = 1; i < 11; i++) {
        let link = 'https://jsonplaceholder.typicode.com/users/'
        try {
            const response = await fetch(link +=i)
            const data = await response.json()
            renderUsersEdit(data);
        } catch (error) {
            console.log(error);
        }
    }
}

getEditUsers()

function buildOption (data) {
    return `
        <option class="option__users">${data.name}</option>
    `
}

function renderUsersEdit (data) {
    selectEditUsersElement.innerHTML += buildOption(data)
}

// Редактирование задачи
function editTaskTodo (event) {
    if (event.target.dataset.action === 'edit') {
        const parentNode = event.target.closest('.trello-todo__container')
        const id = parentNode.id
        tasksTodo.find((item => {
            titleEditInputElement.value = item.title
            descriptionEditInputElement.value = item.description
            
        }))
        openEditModal ()
        const index = tasksTodo.findIndex((task) => task.id == id);
        lastEditedElementIndex = index;
    }
}

function confirmEdit() {
    tasksTodo.splice(lastEditedElementIndex, 1)
    let item = new taskTodo(titleEditInputElement.value, descriptionEditInputElement.value, selectEditUsersElement.value)
    tasksTodo.splice(lastEditedElementIndex, 0, item)
    saveToLocalStorage()
    renderTask(tasksTodo, todoContentElement, buildTaskTemplate)
    closeEditModal()
}

// Открытие и закрытие окна Edit
function openEditModal () {
    modalEditEelement.style.visibility = 'visible'
    overlayElement.style.visibility = 'visible'
}

function closeEditModal() {
    modalEditEelement.style.visibility = 'hidden'
    overlayElement.style.visibility = 'hidden'
}

///// Local Storage
function getItemTodo() {
    let stored = localStorage.getItem('tasksTodo')
    if (JSON.stringify(stored) !== '{}' && JSON.stringify(stored) !== 'null') {
        tasksTodo = JSON.parse(stored)
        renderTask(tasksTodo, todoContentElement, buildTaskTemplate)
    }
}
getItemTodo()

function getItemInProgress() {
    let inProgressStored = localStorage.getItem('inProgress')
    if (JSON.stringify(inProgressStored) !== '{}' && JSON.stringify(inProgressStored) !== 'null') {
        inProgress = JSON.parse(inProgressStored)
        renderTask(inProgress, inProgressContentElement, builTaskInProgressTemplate)
    }
}

getItemInProgress()

function getItemDone() {
    let doneStored = localStorage.getItem('done')
    if (JSON.stringify(doneStored) !== '{}' && JSON.stringify(doneStored) !== 'null') {
        done = JSON.parse(doneStored)
        renderTask(done, doneContentElement, builTaskDoneTemplate)
    }
}

getItemDone()

function saveToLocalStorage() {
    localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo))
    localStorage.setItem('inProgress', JSON.stringify(inProgress))
    localStorage.setItem('done', JSON.stringify(done))
}