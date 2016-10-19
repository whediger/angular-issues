
getData('https://api.github.com/repos/angular/angular/issues');

var page = 1;

var Angular = {
  issues: []
}

function getData(urlIn){
  httpGetAsync(urlIn, function(data){
    data = JSON.parse(data);
    filterResults(data);
  });
}


function filterResults(data){

  var ifIn7days = true;
  var issueIndex = Angular.issues.length;
  if(Angular.issues.length > 0)
    issueIndex -= 1;

  for(i in data){
    //check if post is over 7 days old
    var d = new Date(data[i].created_at)
    var today = new Date();
    today = today.getTime();
    //.5 day = 43200000
    if (Math.abs(today - d) < 604800000) {
    } else {
      ifIn7days = false;
      break;
    }

    //convert mardown to html
    markdownConverter = new showdown.Converter();
    data[i].body = markdownConverter.makeHtml(data[i].body);

    Angular.issues[issueIndex] = {
      title: data[i].title,
      body: data[i].body,
      user: data[i].user.login,
      assignee: data[i].assignee
    }
    issueIndex++;
  }
  //if less than 7 days page++ and get more;
  if (ifIn7days){
    page++
    getData('https://api.github.com/repos/angular/angular/issues?page='+page);
  } else {
    return;
  }
  addIssueDivs(Angular.issues)
}

function addIssueDivs(issues){
  var issueContainer = document.getElementById("issuesContainer");
  for (var i in issues){
    var issueDiv = document.createElement('div');
    var user = document.createElement('h3');
    var assignee = document.createElement('h3');
    var title = document.createElement('h2');
    var line = document.createElement('hr');
    var body = document.createElement('p');

    issueDiv.className = "issueDiv";
    user.innerHTML = "<span class='issueKey'>user:</span> " + issues[i].user;
    if (issues[i].assignee == null){
      assignee.innerHTML = "<span class='issueKey'>assignee: </span>none";
    } else {
      assignee.innerHTML = "<span class='issueKey'>assignee: </span>" + issues[i].assignee;
    }
    title.innerHTML = "<span class='issueKey'>title:</span> " + issues[i].title;
    body.innerHTML = issues[i].body;

    //append childern +==}========>
    issueDiv.appendChild(user);
    issueDiv.appendChild(assignee);
    issueDiv.appendChild(title);
    issueDiv.appendChild(line);
    issueDiv.appendChild(body);
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
