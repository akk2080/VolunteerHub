import {auth} from "./FireBaseAuthConfig.js";
import {onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

let currUser = '';

function setCurrUser(){
    currUser = localStorage.getItem('userId') || '';

    if(currUser == '')
        window.location.replace('index.html');

    onAuthStateChanged(auth, (user) => {
        if (!user) {
  
            window.location.replace('index.html');
        }
    });


}

document.addEventListener('DOMContentLoaded', ()=>{
    

const logout = document.getElementById('logout');
    logout.addEventListener('click', (e)=>{
        e.preventDefault();
        signOut(auth).then(()=>{
            localStorage.setItem('userId', '');
            
        }).then(()=>{
            window.location.replace('index.html');
        }).catch(e => {
            alert(e.message);
        });
    });});

setCurrUser();