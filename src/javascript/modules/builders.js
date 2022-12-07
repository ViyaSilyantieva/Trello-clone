// Создание шаблона 
function buildTaskTemplate (payload) {
    let date = payload.createdAt
    return `
            <div class = "trello-todo__container" data-action = "taskdone" id = ${payload.id}>
                <div class="trello-todo__actions">
                    <select id = "select" class="trello-todo__status" data-action = "status">
                        <option class="trello__status">Todo</option>
                        <option class="trello__status">In progress</option>
                        <option class="trello__status">Done</option>
                    </select>
                    <button class="trello-todo__edit" data-action = "edit">EDIT</button>
                    <button class="trello-todo__delete" data-action = "delete">Delete</button>
                </div>
                <div class="trello-todo__text">
                    <p class="trello-todo__tit">${payload.title}</p>
                    <p class="trello-todo__description">${payload.description}</p>
                </div>
                <div class="trello-todo__user">
                    <p class="trello-todo__liable">${payload.user}</p>
                    <p class="trello-todo__time">${date}</p>
                </div>
            </div>
            `
}

function builTaskInProgressTemplate(payload) {
    let date = payload.createdAt
    return `
            <div class = "trello-todo__container" id = ${payload.id}>
                <div class="trello-todo__actions">
                    <select id = "select" class="trello-todo__status__progress" data-action = "status__in__progress">
                        <option class="trello__status">Todo</option>
                        <option selected class="trello__status">In progress</option>
                        <option class="trello__status">Done</option>
                    </select>
                </div>
                <div class="trello-todo__text">
                    <p class="trello-todo__tit">${payload.title}</p>
                    <p class="trello-todo__description">${payload.description}</p>
                </div>
                <div class="trello-todo__user">
                    <p class="trello-todo__liable">${payload.user}</p>
                    <p class="trello-todo__time">${date}</p>
                </div>
            </div>
            `
}

function builTaskDoneTemplate(payload) {
    let date = payload.createdAt
    return `
            <div class = "trello-todo__container" id = ${payload.id}>
                <div class="trello-todo__actions">
                    <button class="trello-todo__delete__done" data-action = "delete__done">Delete</button>
                </div>
                <div class="trello-todo__text">
                    <p class="trello-todo__tit">${payload.title}</p>
                    <p class="trello-todo__description">${payload.description}</p>
                </div>
                <div class="trello-todo__user">
                    <p class="trello-todo__liable">${payload.user}</p>
                    <p class="trello-todo__time">${date}</p>
                </div>
            </div>
            `
}

export { buildTaskTemplate, builTaskInProgressTemplate, builTaskDoneTemplate }