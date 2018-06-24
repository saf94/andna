const exportButton = document.getElementsByClassName("export");
const url = "http://localhost:3000/profile";
let existingProfiles = [];

function getExistingProfiles() {
  return new Promise((resolve, reject) => {
    $.getJSON("/profile", function(data) {
      data.forEach(profile => {
        existingProfiles.push(profile.name);
      });

      resolve(existingProfiles);
      return;
    });
  });
}

getExistingProfiles().then(profiles => {
  console.log(profiles);
  for (let i = 0; i < exportButton.length; i++) {
    const nameToExport =
      exportButton[i].parentNode.previousSibling.previousSibling.previousSibling
        .previousSibling.previousSibling.previousSibling.textContent;

    profiles.forEach(profile => {
      if (nameToExport == profile) {
        exportButton[i].removeAttribute("disabled");
      }
    });

    exportButton[i].addEventListener("click", function() {
      console.log(nameToExport);
      window.open("http://localhost:3000/export/" + nameToExport);
      // quickstart(nameToExport);
    });
  }
});
