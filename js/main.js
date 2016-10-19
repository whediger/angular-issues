
getData('https://api.github.com/repos/angular/angular/issues');

var page = 1;

var Angular = {
  issues: []
}

function getData(urlIn){
  httpGetAsync(urlIn, function(data){
    data = JSON.parse(data);
    filterResults(data);
    console.log(data);
  });
}

function filterResults(data){
    var issueIndex = Angular.issues.length;
    if(Angular.issues.length > 0)
      issueIndex -= 1;

  for(i in data){
      Angular.issues[issueIndex] = {
        title: data[i].title,
        body: data[i].body,
        user: data[i].user.login
      }
      issueIndex++;
      var d = new Date(data[i].created_at)
      var today = new Date();
      today = today.getTime();
      //7 days = 604800000
      if (Math.abs(today - d) < 43200000) {
        console.log("less than half day");
      } else {
        console.log("more than half day");
      }
  }
  //if less than 7 days page++
  //getData('https://api.github.com/repos/angular/angular/issues?page='+page);
  //if more call add div function
  console.log(Angular.issues);
  addIssueDivs(Angular.issues)
}

function addIssueDivs(issues){
  var issueContainer = document.getElementById("issuesContainer");
  for (var i in issues){
    var issueDiv = document.createElement('div');
    var user = document.createElement('h3');
    user.innerHTML = "user: " + issues[i].user;
    user.className = "issueDiv";
    issueDiv.appendChild(user);
    issueContainer.appendChild(issueDiv);
  }


}

function httpGetAsync(theUrl, callback){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
};
