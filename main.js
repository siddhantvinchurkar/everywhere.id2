/*********************************************** 
This is the controlling JS file for xdata-fire. 
************************************************/

/* Global Variables*/
var developer = true;	// TODO: Change this value to false before pushing to production.
var loadTimeError = false;
var theme = true;
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
var consoleStyle4 = ['background-color:#222222',
			'color:#FFFF00',
			'display:inline',
			'text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)',
			'text-align:center',
			'font-size:1.1em',
			'font-weight:bold'].join(';');
var consoleStyle5 = ['background-color:#222222',
			'color:#9999FF',
			'display:inline',
			'text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)',
			'text-align:center',
			'font-size:1.1em',
			'font-weight:bold'].join(';');
var githubUsername = 'unknown';
var githubUser = 'unknown';
var githubAccessToken = 'unknown';

/* Make page interactive to allow for better performance scores on Lighthouse. */
//window.onkeypress = function(e){e = e || window.event;console.log('\n%c ACTION %c ' + 'You pressed key with code ' + e.keyCode + '\n', consoleStyle5, consoleStyle3);}

window.onload = function(){
	setFadeInitialState();
	setTimeout(function(){
		/* Everything must get executed only after the page has finished loading and there are no errors plus one second. */
		if(!loadTimeError){
			/* Register the service worker if it doesn't yet exist. */
			if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').then(function(){console.log('\n%c OK %c ' + 'Service worker registered.' + '\n', consoleStyle1, consoleStyle3);});}
			onAppLoad();
		}
	}, 2000);
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

function applyStyles(styles){
	/* This function changes the app's styling information. */
	switch(styles){
		case 'error':
			document.getElementById('loading-indicator').innerHTML = 'दाल में कुछ काला है । Maybe hit <span style="box-sizing: border-box;border:5px solid #FFFFFF;padding:5px;">F5</span> ?';
			$('#loading-indicator').fadeIn();
			$('#clouds').fadeIn();
			$('#skeleton').fadeOut();
			break;
		default:
			document.getElementById('loading-indicator').innerHTML = 'Hello from Data Fire!<br /><span style="font-size:0.5em;text-shadow: 0px 1px 2px #FF0000;">Sign in with your </span><img id="sign-in-button" height="100px" src="images/logos/github_logo_white.png" style="cursor:pointer;" alt="Unable to load image!"></img><span style="font-size:0.5em;text-shadow: 0px 1px 2px #FF0000;"> account.</span>';
			$('#loading-indicator').fadeIn();
			break;
	}
}

function changeAppState(appState, message){
	switch(appState){
		case 'ready':
			applyStyles();
			onAppStateChanged(appState, message);
			break;
		case 'error':
			applyStyles('error');
			onAppStateChanged(appState, message);
			break;
		default: /* What are you trying to do, Sid? */ break;
	}
}

function injectHTML(data, element){
	/* This function will inject code (and overwrite any existing code) in the document. */
	document.getElementById(element).innerHTML = '';
	document.getElementById(element).innerHTML = data;
}

function load(url, method, element, returnId){
	/* This function will asynchronously pull fetch data from the given URL. */
	if(developer) console.log('\n%c ' + method + ' %c '+ url +'\n', consoleStyle4, consoleStyle3);
	const xhr = new XMLHttpRequest();
	if(element == null) xhr.responseType = 'json';
	else xhr.responseType = 'text';
	xhr.onreadystatechange = function(){if(xhr.readyState == XMLHttpRequest.DONE){onLoad(url, element, xhr.response, returnId);}}
	xhr.open(method, url);
	try{xhr.send();}catch(error){/* Change app state to errored. */console.log(error);changeAppState('error', error);onLoad(url, element, null, returnId);}
}

function changeColor(col, amt){
	/* This function will lighten or darken the given color by a specified factor. */
	var usePound = false;
	if(col[0] == "#"){
		col = col.slice(1);
		usePound = true;
	}
	var num = parseInt(col,16);
	var r = (num >> 16) + amt;
	if(r > 255) r = 255;
	else if(r < 0) r = 0;
	var b = ((num >> 8) & 0x00FF) + amt;
	if(b > 255) b = 255;
	else if(b < 0) b = 0;
	var g = (num & 0x0000FF) + amt;
	if(g > 255) g = 255;
	else if(g < 0) g = 0;
	return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

function lightenAppBackground(){
	/* This function will gradually lighten the app's background to #F6F6F6. */
	if(theme){
	theme = false;
	var currentColor = '#FF6611';
	var m=0;
	var lightenInterval = setInterval(function(){
		if(m<28){
			m++;
			document.getElementById('body').style = 'background-color:' + changeColor(currentColor, (m/2)) + ';';
			currentColor = changeColor(currentColor, (m/2));
			if(developer) console.log('\n%c ACTION %c '+ 'Background color changed to ' + currentColor +'\n', consoleStyle5, ['background-color:'+currentColor,'color:#000000','display:inline','text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)','text-align:center','font-size:1.1em','font-weight:bold'].join(';'));
		}
		else{
			clearInterval(lightenInterval);
			currentColor = '#F6F6F6';
			document.getElementById('body').style = 'background-color:#F6F6F6;';
			if(developer) console.log('\n%c ACTION %c '+ 'Background color changed to ' + currentColor +'\n', consoleStyle5, ['background-color:'+currentColor,'color:#000000','display:inline','text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)','text-align:center','font-size:1.1em','font-weight:bold'].join(';'));
		}
	}, 100);
	}
	else darkenAppBackground();
}

function darkenAppBackground(){
	/* This function will gradually darken the app's background to #FF6611. */
	if(!theme){
	theme = true;
	var currentColor = '#FFAA66';
	var n=0;
	document.getElementById('body').style = 'background-color:#FFAA66;';
	if(developer) console.log('\n%c ACTION %c '+ 'Background color changed to ' + currentColor +'\n', consoleStyle5, ['background-color:'+currentColor,'color:#FFFFFF','display:inline','text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)','text-align:center','font-size:1.1em','font-weight:bold'].join(';'));
	var darkenInterval = setInterval(function(){
		if(n<16){
			n++;
			document.getElementById('body').style = 'background-color:' + changeColor(currentColor, -1*(n/3)) + ';';
			currentColor = changeColor(currentColor, -1*(n/3));
			if(developer) console.log('\n%c ACTION %c '+ 'Background color changed to ' + currentColor +'\n', consoleStyle5, ['background-color:'+currentColor,'color:#FFFFFF','display:inline','text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)','text-align:center','font-size:1.1em','font-weight:bold'].join(';'));
		}
		else{
			clearInterval(darkenInterval);
			document.getElementById('body').style = 'background-color:#FF6611;';
			currentColor = '#FF6611';
			if(developer) console.log('\n%c ACTION %c '+ 'Background color changed to ' + currentColor +'\n', consoleStyle5, ['background-color:'+currentColor,'color:#FFFFFF','display:inline','text-shadow:0 1px 0 rgba(0, 0, 0, 0.3)','text-align:center','font-size:1.1em','font-weight:bold'].join(';'));
		}
	}, 100);
	}
	else lightenAppBackground();
}

function setFadeInitialState(){
	/* This function will set the initial state of the elements that are planned to fade. */
	$('#loading-indicator').fadeIn();
	$('#loading-indicator').fadeOut();
	$('#continue-button').fadeOut();
	$('#skeleton').fadeOut();
}

/* Listeners */

function onLoad(url, element, data, returnId){
	if(element !== null) injectHTML(data, element);
	if(data !== null && developer) console.log('\n%c OK %c ' + 'Fetch complete.' + '\n', consoleStyle1, consoleStyle3);
	else console.log('\n%c ERROR %c '+ 'Failed to fetch resource at ' + url +'\n', consoleStyle2, consoleStyle3);
	switch(returnId){
		case 0: 
			document.getElementById('loading-indicator').innerHTML = '<span><img id="github-logo" height="100px" src="images/logos/github_logo_white.png" alt="Unable to load image!"></img><span style="font-size:0.5em;">/&emsp;<img id="github-avatar" height="100px" src="' + githubUser.photoURL + '" style="cursor:pointer; border-radius: 50%;" alt="Unable to load image!"></img>&emsp;<a href="https://github.com/' + githubUsername + '" target="_blank" style="color:#FFFFFF;text-shadow: 0px 1px 2px #FF0000;">' + githubUsername + '</a></span><br />' + '<span style="font-size:0.4em; text-shadow: 0px 1px 2px #FF0000; line-height:40%; margin-left:20px;">' + data.bio + '</span>';
			$('#loading-indicator').fadeIn();
			$('#continue-button').fadeIn();
			break;
		case 1:
			setTimeout(function(){$('#loading-indicator').fadeOut();$('#skeleton').fadeIn();}, 1000);
			lightenAppBackground();
			break;
		default:
			break;
	}
}

function onAppLoad(){
	/* This callback is triggered when the app has finished loading. */
	
	/* Change app state to ready. */
	changeAppState('ready', 'Data Fire is loaded and ready to go!');

	/* Inject some clouds into the root file (index.html) */
	load('components/index.clouds.html', 'GET', 'clouds');
	
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
	document.getElementById('sign-in-button').onclick = function(){
		$('#loading-indicator').fadeOut();
		var provider = new firebase.auth.GithubAuthProvider();
		/* TODO: Add these scopes when and if you need to use them. */
		//provider.addScope('user');
		//provider.addScope('repo');
		//provider.addScope('gist');
		firebase.auth().signInWithPopup(provider).then(function(result){onUserSignedIn(result.additionalUserInfo.username, result.user, result.credential.accessToken);}).catch(function(error){console.log(error);});
	}
	/* Handle sign in result */
	firebase.auth().getRedirectResult().then(function(result){if(result.credential)onUserSignedIn(result.user);}).catch(function(error){console.log(error);});
	/* Handle sign out result */
	firebase.auth().signOut().then(function(){onUserSignedOut();}).catch(function(error){console.log(error);});
	
	/* Handle continue button click */
	document.getElementById('continue-button').onclick = function(){
		$('#loading-indicator').fadeOut();
		setTimeout(function(){document.getElementById('loading-indicator').innerHTML = 'Getting things ready...';$('#loading-indicator').fadeIn();}, 1000);
		$('#continue-button').fadeOut();
		$('#clouds').fadeOut();
		$('#continue-button').fadeOut();
		/* Inject the page skeleton into the root file (index.html) */
		load('components/index.skeleton.html', 'GET', 'skeleton', 1);
	}
}

function onAppStateChanged(appState, message){
	/* This callback is triggered when the app changes it's state. */
	switch(appState){
		case 'ready':
			/* Let people know when Data Fire is ready. */
			console.log('\n%c OK %c ' + message + '\n', consoleStyle1, consoleStyle3);
			break;
		case 'error':
			/* Let people know when Data Fire is having trouble. */
			console.log('\n%c ERROR %c ' + message + '\n', consoleStyle2, consoleStyle3);
			break;
		default: /* What are you trying to do, Sid? */ break;
	}
}

function onUserSignedIn(username, user, accessToken){
	/* This callback is triggered when the user signs in. */
	githubUsername = username;
	githubUser = user;
	githubAccessToken = accessToken;
	console.log('\n%c OK %c ' + 'Signed in as ' + githubUser.displayName + '!\n', consoleStyle1, consoleStyle3);
	load('https://api.github.com/users/' + githubUsername, 'GET', null, 0);
}

function onUserSignedOut(){
	/* This callback is triggered when the user signs out. */
}
