/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable spaced-comment */
"use strict";
// this function is strict...

let form = document.querySelector('#form');
let input = document.querySelector('#taskInput');
let ul = document.querySelector('#tasksList');
let btnAllremove = document.querySelector('#removeDoneTasks');

let isDone = false;

form.addEventListener('submit', e => {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
});

ul.addEventListener('click', e => {
    let currentEl = e.target;
    let currentTaskItem = currentEl.closest('.task-item');
    let valueOfDataAttr = currentEl.getAttribute('data-action');


    if (valueOfDataAttr == 'done') {
        toggleBtnCompletedTask(currentEl);
        toggleCompletedTask(currentTaskItem);
    }
    if (valueOfDataAttr == 'delete') {
        deleteTask(currentTaskItem);
    }
    sendTaskToStorage();
});

btnAllremove.addEventListener('click', deleteAllCompletedTasks);


function addTask(task, classItem, classBtn) {
    let li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'task-item', `${classItem}`);
    li.innerHTML = `
                <span class="task-title">${task}</span>
                <div class="task-item__buttons">
                    <button type="button" data-action="done" class="btn-action ${classBtn}">
                        <img src="./img/tick.svg" alt="Done" width="18" height="18">
                    </button>
                    <button type="button" data-action="delete" class="btn-action">
                        <img src="./img/cross.svg" alt="Done" width="18" height="18">
                    </button>
                </div>
    `;
    ul.append(li);
    sendTaskToStorage();
}


function deleteTask(task) {
    task.remove();
    sendTaskToStorage();
}

function toggleCompletedTask(task) {
    task.classList.toggle('task-title--done');
}

function toggleBtnCompletedTask(buttonNode) {
    buttonNode.classList.toggle('btn-done-complete');
}


function deleteAllCompletedTasks() {
    let taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(el => {
        if (el.classList.contains('task-title--done')) {
            el.remove();
        }
    });
    sendTaskToStorage();
}

function getAllTitles() {
    let taskTitles = document.querySelectorAll('.task-title');
    let arrOfTitles = [];
    taskTitles.forEach(title => {
        if (title.parentElement.classList.contains('task-title--done')) {
            isDone = true
        } else {
            isDone = false;
        }
        arrOfTitles.push({title: `${title.innerText}`, isCompleted: isDone})
    });
    return JSON.stringify(arrOfTitles);
}

function sendTaskToStorage() {
    localStorage.setItem('titles', getAllTitles());
    checkEmptyStorage();
}

function checkEmptyStorage() {
    let emptyList = document.querySelector('.empty-list__title');   
    if (localStorage.getItem('titles') == '[]') {
        emptyList.innerText = 'Вы сделали все дела! Идите спать';
    } else {
        emptyList.innerText = 'Список дел';
    }
}


function renderTasks() {
    let titlesArr = JSON.parse(localStorage.getItem('titles'));
    titlesArr.forEach(item => {
        if (item.isCompleted) {
            addTask(item.title, 'task-title--done', 'btn-done-complete');
        } else {
            addTask(item.title);
        }
    });
}

renderTasks();

