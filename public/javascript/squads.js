const exportButton = document.getElementsByClassName("export");

for (let i = 0; i < exportButton.length; i++) {
  exportButton[i].addEventListener("click", function() {
    let nameToExport =
      exportButton[i].parentNode.previousSibling.previousSibling.previousSibling
        .previousSibling.previousSibling.previousSibling.textContent;
    console.log(nameToExport);
    window.open("http://localhost:3000/export/" + nameToExport);
    // quickstart(nameToExport);
  });
}
