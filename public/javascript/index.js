console.log("hello world!");

// var newExp = document.getElementById("experience").cloneNode(true);
// // var addButton = document.getElementById("addExp");

// document.getElementById("addExp").addEventListener("click", function() {
//     document.getElementById("newExperience").appendChild(newExp);
//     // document.getElementById("newExperience").appendChild(addButton);

// })
var expId = 2;

function removeElement(id) {
    var expDiv = document.getElementById("experience" + id)
    expDiv.parentNode.removeChild(expDiv);
    expId--;
    return false;
}

document.getElementById("addExp").addEventListener("click", function() {
    if(document.getElementsByClassName("sectionBackground").length < 4) {
        document.getElementById("newExperience").innerHTML += '<section class="sectionBackground" id="experience' + expId + '"><h3>Experiences:</h3><div class="form-group"><label for="email">Role:</label><input type="role" class="form-control" id="role" placeholder="Scrum master/PA/PD" name="role"></div><div class="form-group"><label for="title">Location</label><input type="location" class="form-control" id="location" placeholder="E.g. Avios/Halfords/BA" name="location"></div><div class="form-group"><label for="LinkedIn">Summary</label><input type="roleSummary" class="form-control" id="roleSummary" placeholder="Summary of responsibilities" name="roleSummary"><button type="button" id="deleteExp" onclick="removeElement(' + expId + ')"> - </button></section>'
        expId++;
    }
    })


