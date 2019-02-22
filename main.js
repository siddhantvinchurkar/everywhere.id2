/*********************************************** 
This is the controlling JS file for xdata-fire. 
************************************************/

/* Global Variables*/
var developer = true;
var loadTimeError = false;
var consoleStyle1 = ['background-color:#222222',
			'color:#BADA55',
			'display:inline',
			'text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)',
			'text-align:center',
			'font-size:1.1em',
			'font-weight:bold'].join(';');
var consoleStyle2 = ['background-color:#222222',
			'color:#FF2222',
			'display:inline',
			'text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)',
			'text-align:center',
			'font-size:1.1em',
			'font-weight:bold'].join(';');
var consoleStyle3 = ['background-color:#FF6611',
			'color:#FFFFFF',
			'display:inline',
			'text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)',
			'text-align:center',
			'font-size:1.1em',
			'font-weight:bold'].join(';');
var githubUser = 'unknown';

window.onload = function(){
	setTimeout(function(){
		/* Everything must get executed only after the page has finished loading and there are no errors plus one second. */
		if(!loadTimeError){
			/* Register the service worker if it doesn't yet exist. */
			//if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js');});}
			onAppLoad();
		}
	}, 1000);
}

// Reload app on error (This will ensure that all external JS libraries are loaded, cached and ready for use)
window.onerror = function(msg, url, lineNo, columnNo, error){
	/* Clear the console. */
	console.clear();
	/* In production builds, reload the page to solve load time errors */
	if(!developer) window.location.reload();
	/* During active development, print errors on the console. */
	else console.log('\nURL: ' + url + '\nLine And Column Number: ' + lineNo + ':' + columnNo + '\nError: ' + error + '\nMessage: ' + msg);
	/* Interrupt rendering and display error message */
	changeAppState('error', 'दाल में कुछ काला है । Maybe hit F5?');
}

/* Function Definitions */

function applyDefaultStyles(){
	/* This function sets the app's styling information to default. */
	document.getElementById('loading-indicator').innerHTML= 'Hello from Data Fire!<br /><span style="font-size:0.5em;">Sign in with your </span><img id="sign-in-button" height="100px" src="images/logos/github_logo_white.png" style="cursor:pointer;"></img><span style="font-size:0.5em;"> account.</span>';
	document.getElementById('skeleton').style.display = 'block';
}

function applyErrorStyles(){
	/* This function sets the app's styling information to default. */
	//document.getElementById('body').classList.add('loading-body');
	document.getElementById('loading-indicator').innerHTML= 'दाल में कुछ काला है । Maybe hit <span style="box-sizing: border-box;border:5px solid #FFFFFF;padding:5px;">F5</span> ?';
	document.getElementById('loading-indicator').style.display = 'block';
	document.getElementById('clouds').style.display = 'block';
	document.getElementById('skeleton').style.display = 'none';
}

function changeAppState(appState, message){
	switch(appState){
		case 'ready':
			applyDefaultStyles();
			onAppStateChanged(appState, message);
			break;
		case 'error':
			applyErrorStyles();
			onAppStateChanged(appState, message);
			break;
		default: /* What are you trying to do, Sid? */ break;
	}
}

function injectHTML(data, element){
	/* This function will inject code into the document. */
	document.getElementById(element).innerHTML = data;
}

function load(url, element){
	/* This function will asynchronously pull fetch data from the given URL. */
	document.getElementById(element).innerHTML = '';
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'text';
	xhr.onreadystatechange = function(){
		if(xhr.readyState == XMLHttpRequest.DONE){injectHTML(xhr.response, element);}
	}
	xhr.open("GET", url);
	try{xhr.send();}catch(error){/* Change app state to errored. */changeAppState('error', error);}
}

/* Listeners */

function onAppLoad(){
	/* This callback is triggered when the app has finished loading. */
	
	/* Change app state to ready. */
	changeAppState('ready', 'Data Fire is loaded and ready to go!');

	/* Inject some clouds into the root file (index.html) */	
	load('components/index.clouds.html', 'clouds');
	
	/* Inject the skeleton of the app into the root file (index.html) */
	load('components/index.skeleton.html', 'skeleton');
	
	/* Initialize Firebase */
	firebase.initializeApp({
		apiKey: 'AIzaSyCFtQlkJVHQj2HxLx8Ce_YoNDSjuuQ6EEM',
		authDomain: 'xdata-fire.firebaseapp.com',
		databaseURL: 'https://xdata-fire.firebaseio.com',
		projectId: 'xdata-fire',
		storageBucket: 'xdata-fire.appspot.com',
		messagingSenderId: '458048346214'
	});
	
	/* Data Handlers */
	
	/* Handle sign in button click */
	document.getElementById('sign-in-button').onclick = function(){firebase.auth().signInWithRedirect(new firebase.auth.GithubAuthProvider());}
	/* Handle sign in result */
	firebase.auth().getRedirectResult().then(function(result){if(result.credential)onUserSignedIn(result.user);}).catch(function(error){console.log(error);});
	/* Handle sign out result */
	firebase.auth().signOut().then(function(){onUserSignedOut();}).catch(function(error){console.log(error);});}

function onAppStateChanged(appState, message){
	/* This callback is triggered when the app changes it's state */
	switch(appState){
		case 'ready':
			/* Let people know when Data Fire is ready. */
			console.log('\n%c OK %c '+ message +'\n', consoleStyle1, consoleStyle3);
			break;
		case 'error':
			/* Let people know when Data Fire is having trouble. */
			console.log('\n%c ERROR %c '+ message +'\n', consoleStyle2, consoleStyle3);
			break;
		default: /* What are you trying to do, Sid? */ break;
	}
}

function onUserSignedIn(user){
	/* This callback is triggered when the user signs in. */
	githubUser = user;
	console.log(user + '\n\nSigned in!');
}

function onUserSignedOut(){
	/* This callback is triggered when the user signs out. */
}
