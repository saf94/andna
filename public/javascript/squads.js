const exportButton = document.getElementsByClassName("export");

for (let i = 0; i < exportButton.length; i++) {
  exportButton[i].addEventListener("click", function() {
    let nameToExport = exportButton[i];
    console.log(nameToExport);
  });
}
