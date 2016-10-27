// 2016 10 22 08:16pm Desk
// first find all the stored data stored in local storage
//Store key name as Date, Store value as appending to key name
//Add Date as Heading & <UL>, Add all under date as <LI>

/*TODO
>>setstamp returns TRUE if successfull
*/

//do the things required on every run
//set the date-picker to today's date automatically
document.getElementById("date").defaultValue = new Date().toISOString().slice(0,10);
var stamp = "LNT_"; //declare it globally
//console.log(stamp); //OK

//##########################################################################################
//read all local storage keys, & srore in array if matches with stamp, and display
//find all the stored data, add rows in tabel for that.
var len = localStorage.length;
// find the showcase div
var showcase = document.getElementById("showcase");
for ( var i=0; i<len; i++ ) {
	var key = thisKey(key, i);
	//console.log(key);
	if(key){
		var todo = JSON.parse(localStorage.getItem(key)); //console.log(todo); //string if one, object of multiple
		key = key.replace(stamp, ""); // console.log(key);
		
		var uldate=document.createElement("ul");
		var lidate = document.createElement("li"); lidate.setAttribute("class", "date"); //<li class="date">
		lidate.appendChild(makecheckbox(key));
		lidate.appendChild(document.createTextNode(key + " " + getDayName(key, 2))); //<li>2016-10-22</li> //3 = Day Name Length
		uldate.appendChild(lidate);
		var ultodo=document.createElement("ul");
		
		//find if todo is object/array or string?, if array, use loop
		if(Array.isArray(todo)!==false){
			for ( var j=0; j<todo.length; j++ ) {
				ultodo.appendChild(createlitodo(todo[j]));
		}
		} else {
			ultodo.appendChild(createlitodo(todo));
		}
	uldate.appendChild(ultodo);
	 //console.log(uldate); //OK //Assumption that LI is just text, what if it is an object?
	showcase.appendChild(uldate);
	} //if ends
	
} // for loop ends

//##########################################################################################
// return key name from local storage if it is of this project's && is not ts (timestamp)
// will return false if the key is not of this stamp OR is ts (timestamp)
function thisKey (key, i){
	key = localStorage.key(i); //key is already defined in function parameters
	var thiskey = key.search(stamp); //console.log(thiskey); //OK //Process
	var thists = key.search("ts"); //console.log(thists); //OK //No ts keys should be touched
	if(thiskey === 0 && thists !== 4){ //if key is of this project & is not timestamp
		return key;
	} else {
		return false;
	}
}

//##########################################################################################
// create a single list element with todo data
function createlitodo(todo){
	var litodo = document.createElement("li");
	litodo.setAttribute("class", "todo"); //<li class="todo">
	litodo.appendChild(document.createTextNode(todo)); //<li>ToDo01</li>
	return litodo;	
}

//##########################################################################################
//fetch data from form, stringyfy it, add to local storage
function addData(){
var todo = document.getElementById("todo").value; //console.log(todo);
if(todo === ""){ //if textarea is empty, do nothing
	return false;
}
var key = document.getElementById("date").value; //get date value

//check if date already exists in local storage? //NULL if not exists, notNULL is exists
var data = JSON.parse(localStorage.getItem(stamp+key));

if(data !== null){ //if date does exist
	if(typeof data === "string"){ //if only on entry in date
		data = [todo, data];
	}else if(typeof data === "object"){ //if 1+ entry
		data.unshift(todo);
	}
} else { // if date does not exist
	data = todo;
}

localStorage.setItem(stamp+key, JSON.stringify(data));
localStorage.setItem(stamp+"ts", timestamp());
window.location.reload();
}
//################################################################################
//delete data
function delData (){
var del = document.getElementsByName("del[]");
var delDays = [];
for (var i=0, l=del.length; i < l; i++) {
	if (del[i].checked) {
		//console.log(del[i].value); //OK
		delete window.localStorage[stamp + del[i].value];
	}
}
localStorage.setItem(stamp+"ts", timestamp());
window.location.reload();	
}

//################################################################################
// print page (amend title, send print, amend title back
function printPage(){
	var title = document.title; //console.log(title);
	var tempTitle = title + " - " + timestamp(true);
	document.title = tempTitle;
	window.print();
	document.title = title;
}

//################################################################################
// to return timestamp, to save the key for syncing with online store
// if passed true as param,eters, returns date as yyyyddmmhhmmssttt, otherwise as UNIX milliseconds stamp (default)
function timestamp(readable=false){
	var ts = new Date();
	//console.log(timestamp.getTime());
	if(readable){
		function pad(s) {
			return (s < 10) ? '0' + s : s;
		}
		return [ts.getFullYear(), pad(ts.getMonth()+1), pad(ts.getDate()), pad(ts.getHours()), pad(ts.getMinutes()), pad(ts.getSeconds()), pad(ts.getMilliseconds())].join("");
	}
	return ts.getTime();
}

//################################################################################
//return day name (1/2/3/full long, default false=full)
function getDayName(date, len=false){
var d = new Date(date);
var weekday = new Array(7);
	weekday[0]=  "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
var dayname = weekday[d.getDay()];
if(len){
	dayname = dayname.substring(0, len);
}
//console.log(dayname);
return (dayname);
}

//##########################################################################################
function makecheckbox(key, j=""){
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";    // make the element a checkbox
	checkbox.name = "del[]";      // give it a name we can check on the server side
	//checkbox.id = key+j; //ID for deleting, get date from this, & sequence from right
	checkbox.value = key+j;
	return checkbox;
}

//##########################################################################################
//toggle select all checkboxes
function toggle(source){
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] != source)
            checkboxes[i].checked = source.checked;
    }
}

//##########################################################################################
// give user a JSON file with all keys from this project's data
function downloadFile() {
	var len = localStorage.length;
	var string = {};
	for ( var i=0; i<len; i++ ) {
		var key = thisKey(key, i); //console.log(key);
		//var fullKey = stamp+key;
		if(key){ string[key] = JSON.parse(localStorage.getItem(key)); }
	}
	string[stamp + "ts"] = localStorage.getItem(stamp + "ts");
	string = JSON.stringify(string, null, 2); //console.log(string); return false;
	var link = document.createElement('a');
	link.download = stamp + timestamp(true) + ".json";
	var blob = new Blob([string], {type: 'text/plain'});
	link.href = window.URL.createObjectURL(blob);
	link.click();
}
