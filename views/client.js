//On page load, display top stories
window.onload = function(){
populateTopStories();
displayBookmarks();
}

//general function to make post requests to server.
function postRequest(url,data,callback){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState===4 && this.status===200){
			var receivedData = JSON.parse(this.responseText);

			if(callback){
			callback(receivedData);
			}
		}
	}

	xhttp.open("POST", "http://localhost:3000/"+url, true);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

	if(data!==""){
		xhttp.send(JSON.stringify(data));
	}

	else{
		xhttp.send();
	}

}


//get top stories from server
function populateTopStories(){
	$('#newws').html('Client side js test2');

	event.preventDefault();
	clearTable();
	postRequest('showFrontPage',"",function(data){
		console.log(data);
		generateTable(data);
	})
}

//Get all time top stories from server
function showAllTimeTop(){
	event.preventDefault();
	clearTable();
	postRequest('showAlltimePopular',"",function(data){
		console.log(data);
		generateTable(data);
	})
}

//Search a particular keyword
function searchStories(){
	clearTable();
	var search = $('#search').val();
	var obj={
		"searchData" : search
	};
	
	postRequest('searchStories',obj,function(data){
		console.log(data);
		generateTable(data);
	})
}

//stories from last 24 hrs
function lastXhrs(){
	event.preventDefault();
	clearTable();
	postRequest('last24hrs',"",function(data){
		console.log(data);
		generateTable(data);
	})
}

//Clear Table
function clearTable() {
	$('#populatedata tr').remove();	
}
//display results on html
function generateTable(obj){

    if (obj.length === 0) {
        $('#placeholder').css('display', 'block');
        clearTable();
        $('#placeholder').html('No stories matching the keyword');

    }

    else {
        var tr;
        $('#populatedata').css('display', 'block');
        clearTable();
		$('#placeholder').css('display', 'none');
        for (var i = 0; i < obj.length; i++) {
            let url = obj[i].url;
            let title=obj[i].title;
            let objID = obj[i].objectID;
            tr = $('<tr/>');
            tr.append("<td class=col-md-1 style=color:green>"+ obj[i].points + "</td>");
            tr.append("<td class=col-md-2>"+ obj[i].created_at + "</td>");
            tr.append("<td class=col-md-8>"+'<a href="' + url + '" target="_blank">' + title + '</a>' +"</td>");
            tr.append("<td class=col-md-2>"+ "<input name=check type=checkbox onclick=createBookMarks()>" + "</td>");
            $('table').append(tr);
        }
    }


}

//Set selected URL to local storage
function createBookMarks(){
var values = new Array();

$.each($("input[name='check']:checked").parents("td").siblings(),
       function () {
            values.push($(this).html());
       });
		var k = localStorage.length;
	//every third value is <a href=""...
	for(var i=2;i<values.length;i=i+3){
		localStorage.setItem('url'+k, JSON.stringify(extractText(values[i])));
		
	}
}


// extract url between two ""
function extractText(str){
	var ret = "";
	if (/"/.test(str)){
    	ret = str.match( /"(.*?)"/ )[1];
  		} else {
    	ret = str;
 	 }

  	return ret;
}

//Display bookmarks on HTML
function displayBookmarks(){
	
	if(localStorage.length===0){
		$('#hideBookmark').css("display","none");
		$('#bookmark').html("No links bookmarked yet, select a checkbox to bookmark");
		
	}
	else{
	var tr;
	$('#hideBookmark').css("display","block");
	for(var i=0;i<localStorage.length;i++){
		tr = $('<tr/>');
        tr.append("<td class=col-md-1>"+ (i+1) + "</td>");
        tr.append("<td>"+ "<a href="+localStorage.getItem('url'+i)+" target=_blank>"+ localStorage.getItem('url'+i)+"</a>"+"</td>");
        $('#bookmark').append(tr);
		}
	}

}

//Clear bookmarks
function clearBookmarks(){
	$('#bookmark tr').remove();
	localStorage.clear();
}