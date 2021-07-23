let addButton = document.getElementById('add')    
let inputTask = document.getElementById('new-task')
let inputSearch = document.getElementById('search')
let unfinishedTasks = document.getElementById('unfinished-tasks') 
let prior = document.getElementById('priority')
let NewTodoArr = [];
let priority;
let unfinishedTasksUp = document.getElementById('unfinished-tasks-up') 
let unfinishedTasksDown = document.getElementById('unfinished-tasks-down') 

fetch('http://127.0.0.1:3000/items')
    .then(response => response.json())
    .then(result => {
        NewTodoArr = result;
        newSaveTask(result);
     });
     
function sendTask () {
    fetch('http://127.0.0.1:3000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            text: inputTask.value, 
            priority: prior.value,
            date: new Date().toLocaleString(),
            status: "active",
        })
      })
        .then((resp) => resp.json())
        .then((data) => {
            NewTodoArr.push(data);   //добавляет элемент в начало массива и возвращает новую длину
            newSaveTask(NewTodoArr);
        })
        .catch(err => {
            console.error(err)
          })
}
//ДОБАВЛЕНИЕ ЗАДАЧИ 
function addTask () {
    if (inputTask.value === ''){
        return alert ('Введите текст задачи!') 
    }
    sendTask ()
    inputTask.value = '';  //обнулим значение строки
}    
//ВЫВОД ПРИОРИТЕТА НА РУССКОМ ЯЗЫКЕ И С ЦВЕТОМ
function swap(task) { 
    switch (task.priority) {
        case 'under':
            priority = `<div class = "under-priority">низкий</div>`;
            break;

        case 'middle':
            priority = `<div class = "middle-priority">средний</div>`;
            break;
              
        case 'high':
            priority = `<div class = "high-priority">высокий</div>`;
            break;
    } 
} 
//HTML ВИД ЗАДАЧИ
function saveTask (task) {
    swap(task); 
    console.log(task);
    let div = document.createElement("div");
    div.classList.add('tasks');
    div.id = task.id;
    div.innerHTML = `
    <div class = "priors" id = "priorsColor"> ${priority}</div>
    <div class = "statusTask"> ${task.status} </div>
    <div class = "colorStatus active-task" id = "colorStatus">
        <div class = "text" id = "textColor" type = 'text' contenteditable="true"> ${task.text}</div>    
        <div class = "date"> ${task.date} </div>
        <div class= 'material-icons edit' onclick = "editTask(${div.id})">edit</div>
        <div class= 'material-icons checkbox' id = "iconsCheckbox" onclick="completedTask(${div.id})">check</div>
        <div class= 'material-icons close' id = "closeTask" onclick="closeTask(${div.id})">close</div> 
        <div class= 'material-icons delete' onclick = "deleteTask(${div.id})">delete</div>
    </div>`
    unfinishedTasks.appendChild(div);
}    
//ВЫВОД МАССИВА С ЗАДАЧАМИ
function newSaveTask(array) {
    unfinishedTasks.innerHTML = ''
    array.forEach((task) => {
        saveTask(task) 
        colorStatus(task.id, array)
    })   
}
//ЦВЕТ ЗАДАЧИ В ЗАВИСИМОСТИ ОТ СТАТУСА И УДАЛЕНИЕ КНОПКИ ПРИ НАЖАТИИ
function colorStatus (id, array) {
    let iconsCheckbox = document.querySelectorAll('.checkbox');
    let iconsClose = document.querySelectorAll('.close');
    let textColor = document.querySelectorAll('.colorStatus');
    let del = document.querySelectorAll('.tasks');
    let index = [...del].findIndex((node) => {
        return +node.id === id;
    })
    if (array[index].status == "completed") {
        textColor[index].classList.add('completed-task')
        iconsCheckbox[index].classList.add('checkboxOn')
    } else if (array[index].status == "close") {
        textColor[index].classList.add('close-task')
        iconsClose[index].classList.add('closeOn')
      }
}
//УДАЛЕНИЕ ЗАДАЧИ
function deleteTask(id) {
    if (confirm('Вы точно хотите удалить эту задачу?')) {
    let del = document.querySelectorAll('.tasks');
    let index = [...del].findIndex((node) => {
        return +node.id === id;
    })
    console.log(index);
    NewTodoArr.splice(index, 1);
    del[index].remove();
    if (NewTodoArr.length === 0) unfinishedTasks.innerHTML = ''; //если массив пустой, то удаляем и из визуала
    console.log(NewTodoArr);  
    
    fetch('http://127.0.0.1:3000/items/'+ id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      })
    .catch(err => {
       console.error(err)
     })
    } 
}
//ЗАВЕРШЕННЫЕ ЗАДАЧИ
function completedTask(id) {          
    let del = document.querySelectorAll('.tasks');
    let index = [...del].findIndex((node) => {
        return +node.id === id;
    })
    
    fetch('http://127.0.0.1:3000/items/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            status: "completed",
        })
      })
        .then((resp) => resp.json())
        .then((index) => {
            // NewTodoArr.splice(0, 0, NewTodoArr.splice(index, 1)[0]);   
            // newSaveTask(NewTodoArr);
        })
        .catch(err => {
            console.error(err)
          })

    NewTodoArr[index].status = "completed";
    NewTodoArr.splice(0, 0, NewTodoArr.splice(index, 1)[0]);  //добавляет элемент в начало массива и возвращает новую длину
    newSaveTask(NewTodoArr);
    console.log(NewTodoArr);
}
//ОТМЕНЕННЫЕ ЗАДАЧИ
function closeTask(id){               
    let del = document.querySelectorAll('.tasks');
    let index = [...del].findIndex((node) => {
        return +node.id === id;
    })

    fetch('http://127.0.0.1:3000/items/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            status: "close"
        })
    })
        .then((resp) => resp.json())
        .then((index) => {
            //NewTodoArr.push(NewTodoArr.splice(index, 1)[0]);
            //newSaveTask(NewTodoArr); 
            console.log('close');
        })
        .catch(err => {
            console.error(err)
          })

    NewTodoArr[index].status = "close";
    NewTodoArr.push(NewTodoArr.splice(index, 1)[0]);
    newSaveTask(NewTodoArr)
    console.log(NewTodoArr)
}
//ФИЛЬТРАЦИЯ ПО СТАТУСУ
function checkboxStatus() {         
    var selectedCheckBoxes = document.querySelectorAll('input[type="checkbox"]:checked'); //берем значения включенных чекбоксов
    var checkedValues = Array.from(selectedCheckBoxes).map(cb => cb.value);               //записываем эти значения в виде массива
    console.log(checkedValues)
    let ArrStatusTask =  NewTodoArr.filter((task) => checkedValues.includes(task.status))
    newSaveTask(ArrStatusTask)
    console.log(ArrStatusTask)
    if (checkedValues == ''){
        newSaveTask(NewTodoArr)
    }
}
//ПОИСК ПО ТЕКСТУ
document.querySelector('#search').oninput = function() {
    let search = this.value.trim();                                           //удаляет пробелы с начала и конца строки
    let ArrFilter = NewTodoArr.filter((task) => task.text.includes(search));  //создаем новый массив, значение которого равно отфильтрованному старому массиву 
                                                                              //фильтрация осуществляется по поиску в старом массиве введенного элемента
    if (search != '') {
        newSaveTask(ArrFilter)
    }else {
        newSaveTask(NewTodoArr)
    }
}
//ФИЛЬТРАЦИЯ ПО ПРИОРИТЕТУ
function priorsFiltr() {
    let select = document.getElementById('filters')
    let getValue = select.value;
    switch (getValue) {
        case 'filter-any':
            newSaveTask(NewTodoArr)
            console.log('любой');
            break;

        case 'filter-under':
            let ArrFilterUnder = NewTodoArr.filter((task) => task.priority.includes('under')) 
            newSaveTask(ArrFilterUnder);
            console.log(ArrFilterUnder);
            break;
              
        case 'filter-middle':
            let ArrFilterMiddle = NewTodoArr.filter((task) => task.priority.includes('middle'))
            newSaveTask(ArrFilterMiddle);
            console.log(ArrFilterMiddle);
            break;

        case 'filter-high':
            let ArrFilterHigh = NewTodoArr.filter((task) => task.priority.includes('high'))
            newSaveTask(ArrFilterHigh);
            console.log(ArrFilterHigh);
            break;
    } 
}
//СОРТИРОВКА ПО ДАТЕ
function sortDate() {
    let getValueDate = document.getElementById('sort-date').value;
    switch (getValueDate) {
        case 'date-increase':
            NewTodoArr.sort(function(a, b) {
                return b.date>a.date ? -1 : b.date<a.date ? 1 : 0; 
            });
            newSaveTask(NewTodoArr)
            console.log('по возрастанию');
            console.log(NewTodoArr);
            break;

        case 'date-decrease':
            NewTodoArr.sort(function(a, b) {
                return a.date>b.date ? -1 : a.date<b.date ? 1 : 0;
            });
            newSaveTask(NewTodoArr)
            console.log('по убыванию');
            console.log(NewTodoArr);
            break;     
    } 
}
//СОРТИРОВКА ПО ПРИОРИТЕТУ
function sortPrior() {
    if (document.getElementById('filters').value != 'filter-any'){
       return alert('Измените фильтр по приоритету на "любой".')
    }
    let getValuePriority = document.getElementById('sort-priority').value;
    switch (getValuePriority) {
        case 'priorit-increase':
            NewTodoArr.sort(function(a, b) {
                return a.priority>b.priority ? -1 : a.priority<b.priority ? 1 : 0; 
            });
            newSaveTask(NewTodoArr)
            console.log('по возрастанию');
            console.log(NewTodoArr);
            break;
        
        case 'priorit-decrease':
            NewTodoArr.sort(function(a, b) {
                return b.priority>a.priority ? -1 : b.priority<a.priority ? 1 : 0; 
            });
            newSaveTask(NewTodoArr)
            console.log('по убыванию');
            console.log(NewTodoArr);
            break; 
     }  
}
//РЕДАКТИРОВАНИЕ ТЕКСТA
 function editTask(id){ 
    let textEdit = document.querySelectorAll('.text')
    let del = document.querySelectorAll('.tasks');
    let index = [...del].findIndex((node) => {
        return +node.id === id;
    });
    console.log(textEdit[index].innerHTML)
     
    fetch('http://127.0.0.1:3000/items/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            text: textEdit[index].innerHTML,
        })
    })
        .then((resp) => resp.json())
        .catch(err => {
            console.error(err)
        })  
}