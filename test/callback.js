function doHomework(subject, callback) {
    console.log(`Starting my ${subject} homework.`);
    callback();
  }
  
  function alertFinished(){
    console.log('Finished my homework');
  }
  
  doHomework('math', alertFinished);