window.onload=main; //once the web page loads, the main function runs

//courses is a placeholder variable for the actual data we will get from the backend database of courses for each 
//major. 
const courses=new Map([
    ["CMSC131", 4],
    ["CMSC132", 4],
    ["CMSC216", 4],
    ["CMSC250", 4], 
    ["CMSC330", 3],
    ["CMSC351", 3]
]);

// sets the api URL to a variable
const apiUrl = 'https://api.umd.io/v1/courses?dept_id=CMSC&semester=202401';

// gets the course data from the api
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`); // throws error if no data is reached
    }
    return response.json(); // turns data into json
  })
  .then(data => { // extract course name and number of credits from the api
    const courseNames = data.map(course => ({courseName: course.course_id, credits: course.credits}));

    //save the courses to the global courses variable
    courses = updateCourses(courseNames);
      
    // output the course names and credits to the console
    console.log(courseNames);
    // if you have an HTML element with id 'output', you can update its content:
    // const outputElement = document.getElementById('output');
    // outputElement.textContent = courseNames.join('\n');
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

  // courseNames is the new data map

function main(){

    document.getElementById('four-year-plan').classList.add('hide'); //hides four year plan table until "Go" is pressed

    /*BUTTONS*/
    const addCourseButton = document.getElementById("add-course-button"); //get the Add Course button by its HTML id
    addCourseButton.onclick=addCourse; //when the Add Course button is clicked, the addCourse function is run

    const goButton = document.getElementById("main-button"); //get the Go button by its HTML id
    goButton.onclick=getCourses; //when the Go button is clicked, the getCourses function is run


    /*DRAG AND DROP*/
    const draggables = document.querySelectorAll('.draggable'); //selects all items in HTML with class draggable

    draggables.forEach(() => { //when a dragstart event occurs on a draggable item, run the dragStart function
      addEventListener('dragstart', dragStart);
    });
    
    //starts a drag event
    function dragStart(e){
        //note -- e.target is used to refer to the target being dragged
      e.dataTransfer.setData('text/plain', e.target.id); //sets the type and content of data to be dragged

    }
    
    const boxes = document.querySelectorAll('.box'); //select all boxes (which are drop targets in this case)
    
    //adds all necessary functions to all box elements
    boxes.forEach(box => { 
        box.addEventListener('dragenter', dragEnter);
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });
    
    //adds red dashed border to the object being hovered over
    function dragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over'); //when the drag-over class is added to this element's class list, the element is now styled by the .drag-over {} class in the CSS file
    }
    
    //adds red dashed border to the object being hovered over
    function dragOver(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }
    
    //removes red dashed border to the object being hovered over
    function dragLeave(e) {
        e.target.classList.remove('drag-over'); 
    }

    //completes drop event
    function drop(e) {
        const id = e.dataTransfer.getData('text/plain'); //get the data from the dragStart
        const draggable = document.getElementById(id); //gets the original dragged element id

        e.target.classList.remove('drag-over'); //removes the drop target's dashed red border
    
        e.target.innerHTML="\n"; //erases old data in drop target
          
        e.target.appendChild(draggable); //adds dragged item data to the drop target
                    
        draggable.classList.remove('hide'); //displays the draggable element

        //updates all semester credit counts 
        for(let i = 1; i < 9; i++){
          countCredits("semester" + i);
        }

        /* TO JUST UPDATE THE CURRENT SEMESTER
        let semester = extractSemester(String(e.target.classList));

        countCredits(semester);
        */
    }

}

/*Counts the number of credits for a given semester */
function countCredits(semester){
    let creditSum = 0;
    let allBoxes = document.querySelectorAll(`.${semester}`); //select all boxes for semester
    
    //loop through each box (aka course) in the semester
    allBoxes.forEach((box) => {

        let parentDiv = box; //outer div
        let creditsToAdd; //credit num for this box

        // determine if there is a course inside (parent div has child) or not, assign credit num based on that
        if (parentDiv.children.length > 0) {
            let childDiv = parentDiv.children[0];
            creditsToAdd = extractCreditNumber(childDiv.innerHTML);
        } else {
            creditsToAdd = 0;
        }

        creditSum += Number(creditsToAdd); //add this box's credit num to total

    });

    //update box with new number of credits
    let boxToUpdate = document.getElementById(semester + "credits");
    boxToUpdate.innerHTML = "Credit count: " + creditSum;

}

/*Isolate and return the semester# part of a string (used to get that class from a classList) */
function extractSemester(inputString) {
    let semesterPart = inputString.match(/semester\d+/);
    return semesterPart[0];
}

/*Isolate and return the number of credits part of a string (used to get the number of credits from ex. CMSC131 (4)) */
function extractCreditNumber(inputString) {
    var startIndex = inputString.indexOf('(');
    var endIndex = inputString.indexOf(')');
    var extractedNumber = inputString.slice(startIndex + 1, endIndex);
    return extractedNumber;
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

/*MAKING COURSELIST TABLE + REVEALING 4 YEAR PLAN INTERFACE.*/
function getCourses(){
    document.getElementById('four-year-plan').classList.remove('hide'); //reveals the four year plan table

    var myTableDiv = document.getElementById("generatedCoursesTable"); //gets the div in which to put the course list table
    myTableDiv.innerHTML=null;

    var table = document.createElement('TABLE'); //creates the table
  
    var tableBody = document.createElement('TBODY'); //creates the table body
    table.appendChild(tableBody); 
  
    var tr = document.createElement('TR'); //creates a table row
    tableBody.appendChild(tr); 

    var th = document.createElement('TH'); //creates table header
    th.appendChild(document.createTextNode("Courses Needed")); //creates text for table header

    tr.appendChild(th);

    //adds a table row for each course from the course list
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

// Updates the 'courses' variable with the fetched data
function updateCourses(newCourses) {
    // Clears existing courses
    courses.clear();
  
    // Adds the fetched courses to the 'courses' Map
    newCourses.forEach(course => {
      courses.set(course.courseName, course.credits);
    });
  }
