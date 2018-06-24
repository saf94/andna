// var newExp = document.getElementById("experience").cloneNode(true);
// // var addButton = document.getElementById("addExp");

// document.getElementById("addExp").addEventListener("click", function() {
//     document.getElementById("newExperience").appendChild(newExp);
//     // document.getElementById("newExperience").appendChild(addButton);

// })
var expId = 2;
var skillsID = 1;
var toolsID = 1;
var skillsChosen;
var toolsChosen;

if (window.location.href === "http://localhost:3000/formSubmit") {
  document.getElementById("formFeedback").classList.remove("notSubmitted");
}

function removeElement(id) {
  var expDiv = document.getElementById("experience" + id);
  expDiv.parentNode.removeChild(expDiv);
  expId--;
  return false;
}

function removeSkill(id) {
  var skillDiv = document.getElementById("skill" + id);
  skillDiv.parentNode.removeChild(skillDiv);
  skillsID--;
  return false;
}

function removeTool(id) {
  var toolDiv = document.getElementById("tool" + id);
  toolDiv.parentNode.removeChild(toolDiv);
  toolsID--;
  return false;
}

document.getElementById("addExp").addEventListener("click", function() {
  if (document.getElementsByClassName("sectionBackground").length < 6) {
    document.getElementById("newExperience").innerHTML +=
      '<section class="sectionBackground" id="experience' +
      expId +
      '"><h3>Experiences:</h3><div class="form-group"><label for="email">Role:</label><input type="role" class="form-control" id="role" placeholder="Scrum master/PA/PD" name="role' +
      expId +
      '"></div><div class="form-group"><label for="title">Location</label><input type="location" class="form-control" id="location' +
      expId +
      '" placeholder="E.g. Avios/Halfords/BA" name="location' +
      expId +
      '"></div><div class="form-group"><label for="LinkedIn">Summary</label><input type="roleSummary" class="form-control" id="roleSummary" placeholder="Summary of responsibilities" name="roleSummary' +
      expId +
      '"><button type="button" id="deleteExp" onclick="removeElement()"> - </button></section>';
    expId++;
  }
});

function addSkill(skillSelected, skillName) {
  skillSelected.addEventListener("click", function(event) {
    event.preventDefault();
    if (document.getElementsByClassName("skillsHolder").length < 11) {
      document.getElementById("skillz").innerHTML +=
        '<div class="skill" id="skill' +
        skillsID +
        '"><p>' +
        skillName +
        '</p> <button type="button" id="skilly" onclick="removeSkill(' +
        skillsID +
        ')"> X </button></div>';
      skillsID++;
      // document.getElementById("myInput").reset();
      if (skillsID < 3) {
        skillsChosen = skillName;
      } else {
        skillsChosen += ", " + skillName;
      }
    }
  });
}

document.getElementById("formyForm").addEventListener("submit", function(e) {
  e.preventDefault(); //stop form from submitting
  document.forms["formyForm"].elements["skills"].value = skillsChosen;
  document.forms["formyForm"].elements["tools"].value = toolsChosen;
  document.getElementById("formyForm").submit();
});

function addTool(toolSelected, toolName) {
  toolSelected.addEventListener("click", function() {
    if (document.getElementsByClassName("toolzHolder").length < 9) {
      document.getElementById("toolz").innerHTML +=
        '<div class="tool" id="tool' +
        toolsID +
        '"><p>' +
        toolName +
        '</p> <button type="button" id="tooly" onclick="removeTool(' +
        toolsID +
        ')"> X </button></div>';
      toolsID++;
      // document.getElementById("myInput").reset();
      if (toolsID < 3) {
        toolsChosen = toolName;
      } else {
        toolsChosen += ", " + toolName;
      }
    }
  });
}

const skills = [
  "PHP",
  "C#",
  "C++",
  "Java",
  "React",
  "Angular JS",
  "JavaScript"
];
const tools = ["Wireframes", "Git", "TDD", "Scrum", "PSM1", "BDD"];

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        if (arr === skills) {
          addSkill(b, arr[i]);
        }
        if (arr === tools) {
          addTool(b, arr[i]);
        }
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}
