// 2016 10 22 08:16pm Desk
// first find all the stored data stored in local storage
//Store key name as Date
//Store value as appending to key name
//Add Date as Heading & <UL>
//Add all under date as <LI>

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
var lines = [];
len = localStorage.length;
// find the showcase div
var showcase = document.getElementById("showcase");
for ( var i=0; i<len; i++ ) {
	var key = localStorage.key(i);
	//console.log(key);
	var thiskey = key.search(stamp); //console.log(thiskey); //OK //Process
	var thists = key.search("ts"); //console.log(thists); //OK //No ts keys should be touched
	if(thiskey==0){
		if(thists!=4){
			//if key is of this project & is not timestamp
			var todo = localStorage.getItem(key); //console.log(typeof todo);
			
			key = key.replace(stamp, ""); // console.log(key);
			
			var uldate=document.createElement("ul"); uldate.setAttribute("class", "date"); //<ul class="date">
			
				var lidate = document.createElement("li");
				lidate.appendChild(document.createTextNode(key + " " + getdayname(key, 3))); //<li>2016-10-22</li> //3 = Day Name Length
				uldate.appendChild(lidate);
				var ultodo=document.createElement("ul");
				
				//find if todo is object/array or string?, if array, use loop
				var multitodo = todo.search("~");// console.log(multitodo); //-1 if does not exist
				if(multitodo!=-1){
					todo = todo.split("~"); //console.log(todo); //OK
					var lentodo = todo.length; //console.log(len);
					//litodo = document.createElement("li"); 
					for ( var j=0; j<lentodo; j++ ) {
						var litodo = document.createElement("li");
						litodo.setAttribute("class", "todo"); //<li class="todo">
						litodo.appendChild(makecheckbox(key,j));
						litodo.appendChild(document.createTextNode(todo[j])); //<li>ToDo01</li>
						ultodo.appendChild(litodo);
					}
				} else {
					var litodo = document.createElement("li");
					litodo.setAttribute("class", "todo"); //<li class="todo">
					litodo.appendChild(makecheckbox(key,0));
					litodo.appendChild(document.createTextNode(todo)); //<li>ToDo01</li>
					ultodo.appendChild(litodo);
				}
				uldate.appendChild(ultodo);
			
			 //console.log(uldate); //OK //Assumption that LI is just text, what if it is an object?
			showcase.appendChild(uldate);
		} //if ends
	}
} // for loop ends


//##########################################################################################
//fetch data from form, stringyfy it, add to local storage
function addData(){
var date = document.getElementById("date").value; //get date value
var todo = document.getElementById("todo").value;
//check if date already exists in local storage? //NULL if not exists, notNULL is exists
var dateexists = localStorage.getItem(stamp + date);
//console.log(dateexists);
 if(dateexists != null){
	//console.log("1"); //yes, working
	todo = dateexists + "~" + todo; //console.log(todo); //OK
 }
localStorage.setItem(stamp + date, todo);
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
		//delDays.push(del[i].value);
		//console.log(del[i].value); //OK
		var keyfull = del[i].value;
		var key = keyfull.substring(0, 10); //console.log(key);
		var subkey = keyfull.substring(11, 10);
		var orgdata = localStorage.getItem(stamp+key); //orgINAL data because otherwise the sequence/place in array shifts with every itration of for loop
		var multitodo = orgdata.search("~");// console.log(multitodo); //-1 if does not exist ~
		if (multitodo!=-1){
			//console.log(orgdata);
			data = orgdata.split("~");
			var newdata = [];
			for (var j=0, m=data.length; j < m; j++){
				//console.log(typeof data[j]);
				//console.log(subkey);
				//console.log(j);
				if (j != subkey){
					newdata += data[j] + "~";
					//console.log(data[j]);
				}
			}
			//console.log(newdata);
			newdata = newdata.slice(0, -1);
			localStorage.setItem(stamp+key, newdata);
			//console.log(newdata);
			//console.log(key);
		} else{//no ~in value
			delete window.localStorage[stamp + key];
		}
	}
}
localStorage.setItem(stamp+"ts", timestamp());
window.location.reload();	
}


//################################################################################
// to return timestamp, to save the key for syncing with online store
function timestamp(){
	var ts = new Date();
	//console.log(timestamp.getTime());
	return ts.getTime();
}
//################################################################################
//return day name (1/2/3/full long, default false=full)
function getdayname(date, len=false){
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
function makecheckbox(key, j){
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";    // make the element a checkbox
	checkbox.name = "del[]";      // give it a name we can check on the server side
	checkbox.id = key+j; //ID for deleting, get date from this, & sequence from right
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

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################

//##########################################################################################