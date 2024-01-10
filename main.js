window.onload=main;
const courses=new Map([
    ["CMSC131", 4],
    ["CMSC132", 4],
    ["CMSC216", 4],
    ["CMSC250", 4]
]);

function main(){
    document.getElementById('four-year-plan').classList.add('hide'); //hide four year plan table until "Go" is pressed

    /*BUTTONS*/
    const addCourseButton = document.getElementById("add-course-button");
    addCourseButton.onclick=addCourse;

    const goButton = document.getElementById("main-button");
    goButton.onclick=getCourses;


    /*DRAG AND DROP*/
    const draggables = document.querySelectorAll('.draggable');

    draggables.forEach(() => {
      addEventListener('dragstart', dragStart);
    });
    
    function dragStart(e){
      e.dataTransfer.setData('text/plain', e.target.id);
      setTimeout(() => {
        e.target.classList.add('hide'); 
      }, 0);

    }
    
    const boxes = document.querySelectorAll('.box');
    
    boxes.forEach(box => {
        box.addEventListener('dragenter', dragEnter);
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });
    
    function dragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }
    
    function dragOver(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }
    
    function dragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function drop(e) {
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);

        e.target.classList.remove('drag-over');
    
        e.target.innerHTML="\n";
          
        // add it to the drop target
        e.target.appendChild(draggable);
                    
        // display the draggable element
        draggable.classList.remove('hide');
    }

}

/*Removes a course from the course list (courses) so it is no longer displayed*/
function addCourse(){
    document.getElementById('unneeded-courses').classList.remove('hide');

    const course=document.getElementById('class-input').value.toUpperCase().replace(/\s+/g, '');

    if(courses.has(course)){
        courses.delete(course);
        const p = document.createElement('P');
        p.innerHTML = course + "\n";
        document.getElementById('unneeded-courses').appendChild(p);

    }else{
        alert("invalid course");
    }

    document.getElementById('class-input').value="";
}

/*Makes a table of draggable elements from the course list.*/
function getCourses(){
    document.getElementById('four-year-plan').classList.remove('hide');

    var myTableDiv = document.getElementById("myDynamicTable");

    var table = document.createElement('TABLE');
  
    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
  
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);
    var th = document.createElement('TH');
    th.appendChild(document.createTextNode("Courses Needed"));
    tr.appendChild(th);

    courses.forEach(function (value, key){
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
    
        var td = document.createElement('TD');
        var div = document.createElement('DIV');
        td.appendChild(div);
        div.setAttribute("class", "draggable");
        div.setAttribute("draggable", "true");
        div.id=key;
        div.appendChild(document.createTextNode(key + " (" + value + ")"));
        tr.appendChild(td);
    });
    
    myTableDiv.appendChild(table);
}
