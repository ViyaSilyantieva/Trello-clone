function renderTask(array, element, build) {
    const html = array.reduce((total, item) => {
        const template = build(item)
        return total + template
    }, '')
    
    element.innerHTML = html
}

class taskTodo {
    constructor (title, description, user) {
        this.title = title
        this.description = description
        this.user = user
        this.id = Date.now()
        this.createdAt = new Date().toLocaleString()
    }
} 

export { renderTask, taskTodo  }  
