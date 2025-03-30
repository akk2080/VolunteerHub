

let allOpp = [];
let filteredOpp = [];
let currPage = 'homePage';
let currUser = '';
let currUserData = [];
let savedOpp = [];
let upcomingEvents = [];
let volunteerHours = [];
let currUserName = '';


window.onload = () => {
    setCurrUser();
    
};

async function setCurrUser(){
    currUser = localStorage.getItem('userId') || '';

    if(currUser == '')
        window.location.replace('index.html');

    await getUserData();

    renderUpcoming();
    renderSaved();
    renderOverview();

}

document.addEventListener('DOMContentLoaded', ()=>{
    document.body.style.display = 'block';
    displayOpp(); setupEventListner(); });

async function getUserData(){
    try {

        let res = await fetch('https://volunteerhub-8f811-default-rtdb.firebaseio.com/users.json');
        if(!res.ok){
            console.log('in res');
            throw new Error(res.status);
        }
        let data = await res.json();

        console.log('here');    
        let temp = Object.entries(data).filter((d) => {
            return d[1].email == currUser;
        });

        currUserData = temp[0];

        // console.log(currUserData);

        savedOpp = currUserData[1].savedOpportunity || [];
        // console.log(currUserData[1].savedOpportunity);
        upcomingEvents = currUserData[1].upcomingEvents || [];
        volunteerHours = currUserData[1].volunteerHours || [];
        currUserName = currUserData[1].name || '';
        console.log("current user data: ", currUserData);
        
    } catch (error) {
        alert("failed to fetch user data");

    }
    
};




function setupEventListner(){
    document.getElementById('dashBoard').addEventListener('click', (e)=>{
        e.preventDefault();
        console.log('clicked');
        currPage = 'dashBoardPage';
       
        showDashBoard();
    });

   

    document.getElementById('homePage').addEventListener('click', (e)=>{
        e.preventDefault();
        console.log('clicked');
        currPage = 'homePage';
   
        showHomePage();
    });

    document.getElementById('searchBtn').addEventListener('click', (e)=>{
        e.preventDefault();
        console.log('clicked');
        renderOpp();
    });

    document.querySelectorAll('.sidebar-menu a').forEach(tab => {
        tab.addEventListener('click', (e)=> {
            e.preventDefault();
            
           
            document.querySelector('.sidebar-menu a.active').classList.remove('active');
            e.target.classList.add('active');
            
            
            const tabId = e.target.getAttribute('data-tab');
            // renderTab(tabId);
            
            document.querySelector('.tab-content.active').classList.remove('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // const logout = document.getElementById('logout');
    // logout.addEventListener('click', (e)=>{
    //     e.preventDefault();
    //     signOut(auth).then(()=>{
    //         localStorage.setItem('userId', '');
            
    //     }).then(()=>{
    //         window.location.replace('index.html');
    //     }).catch(e => {
    //         alert(e.message);
    //     });
    // });
};

async function displayOpp(){
    if(currPage !== 'homePage')
        return;
    //document.getElementById('content').style.display = 'none';
    document.getElementById('dashBoardPage').style.display = 'none';
   
    try {
        const res =  await fetch('https://volunteerhub-8f811-default-rtdb.firebaseio.com/opportunities.json');
        if(!res.ok){
            throw new Error(res.status);
        }
        const data = await res.json();
    
        for(let k in data){
            allOpp.push({fireBaseId: k, ...data[k]});
        }
        
        renderOpp();
        console.log(allOpp);
        
    } catch (error) {
        alert(error.message);
    }


};


function renderOpp(){
    document.getElementById('content').style.display = 'block';
    let container = document.getElementById('opportunities-list');
    container.innerHTML = '';
    let location = document.getElementById('location').value.trim();
    let cat = document.getElementById('category').value;
    let date = document.getElementById('date').value;
    
    
    if(cat != ''){
        filteredOpp = allOpp.filter((o => {
            return (o.category == cat);
         }));
    }else{
        filteredOpp = allOpp;
    }

    if(location != ''){
        filteredOpp = filteredOpp.filter((o => {
            return (o.location.toLowerCase().includes(location.toLowerCase()));
         }));
    }

    if(date != ''){
        filteredOpp = filteredOpp.filter((o => {
            return (o.date == date);
         }));
    }

    if(filteredOpp.length == 0){
        
        alert('Sorry No Opportunity to show for the given search');
        return;
    }

    filteredOpp.forEach(opportunity => {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.innerHTML = `
                            <div class="opportunity-content">
                                <h3>${opportunity.title}</h3>
                                <div class="opportunity-meta">
                                    <span>${opportunity.date}</span>
                                    <span>${opportunity.time}</span>
                                </div>
                                <p>${opportunity.description}</p>
                                <button class="btn" onclick="openOppDetails(${opportunity.id})">View Details</button>
                            </div>
                        `;
        container.appendChild(card);
    });
}

function openOppDetails(id){
    const oppPopup = document.getElementById('oppPopup');
    oppPopup.style.display = 'flex';

    let o = filteredOpp.find(o => {
       return o.id == id
    });

    document.getElementById('popupContent').innerHTML = `<div style='display:flex; justify-content:space-between'; align-items: center;'>
                                                            <h2>${o.title}</h2><button onclick='closepopup()' style='height:50%;'>&times;</button>
                                                        </div>
                                                        <h3>Organization: ${o.organization}</h3>
                                                        <h4>date: ${o.date}</h4>
                                                        <h4>Time: ${o.time}</h4>
                                                        <h4>Location: ${o.location}</h4>
                                                        <h4>Skills needed: ${o.skills}</h4>
                                                        <h3>Description</h3>
                                                        <p>${o.description}</p>
                                                        <div style='display:flex; justify-content:space-between'; align-items: center;'>
                                                           <button onclick='signUp(${o.id})' style='height:50%;'>SignUp</button> <button onclick='saveOpp(${o.id})' style='height:50%;'>Save</button>
                                                        </div>
                                                    `;

    

    
};

function closepopup(){
    const oppPopup = document.getElementById('oppPopup');
    oppPopup.style.display = 'none';
};

async function saveOpp(newId){
    let saved = savedOpp.filter(o => {
       return o.id == newId;
    });

    if(saved.length != 0)
        alert("already Signed up for this Event!!!!");
    else{
        savedOpp.push({id: newId});
        await renderSaved();
        alert('Event has been saved');
       
    }



    
};

async function signUp(newId){
    let saved = upcomingEvents.filter(o => {
       return o.id == newId;
    });

    if(saved.length != 0)
        alert("already Signed up for this Event!!!!");
    else{
        upcomingEvents.push({id: newId});
         await  renderUpcoming();
         alert('Signed Up For The Event');
            
    }

    
    
};

function renderTab(tabId){
    if(tabId == 'upcoming-events')
        renderUpcoming();
};

async function renderUpcoming(){
    let events = [];
    let eventId = [];
    
    console.log(upcomingEvents.length);
    
    for(let e of upcomingEvents){
        eventId.push(e.id);
        
    }

    events = allOpp.filter(o => {
        return eventId.includes(o.id);
    });

    

    let displayDiv = document.getElementById('upcoming-events');
    displayDiv.innerHTML = '';
    if(events.length == 0){
        displayDiv.innerHTML = `<p>No Upcoming Events to show</p>`;
        saveUserData();
        return;
    }
    saveUserData();
    events.forEach(opportunity => {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.innerHTML = `
                            <div class="opportunity-content">
                                <h3>${opportunity.title}</h3>
                                <div class="opportunity-meta">
                                    <span>${opportunity.date}</span>
                                    <span>${opportunity.time}</span>
                                </div>
                                <p>${opportunity.description}</p>
                                 <button onclick='cancel(${opportunity.id})' style='height:50%;'>cancel</button>
                            </div>
                        `;
        displayDiv.appendChild(card);
    });

    renderOverview();
    

    
}

async function renderSaved(){
    let events = [];
    let eventId = [];
    
    console.log(savedOpp.length);
    
    for(let e of savedOpp){
        eventId.push(e.id);
        
    }

    events = allOpp.filter(o => {
        return eventId.includes(o.id);
    });

    

    let displayDiv = document.getElementById('saved-opportunities');
    displayDiv.innerHTML = '';
    if(events.length == 0){
        displayDiv.innerHTML = `<p>No Saved Events to show</p>`;
        saveUserData();
        return;
    }

     saveUserData();
        
    events.forEach(opportunity => {
        const card = document.createElement('div');
        card.className = 'opportunity-card';
        card.innerHTML = `
                            <div class="opportunity-content">
                                <h3>${opportunity.title}</h3>
                                <div class="opportunity-meta">
                                    <span>${opportunity.date}</span>
                                    <span>${opportunity.time}</span>
                                </div>
                                <p>${opportunity.description}</p>
                                
                                <button onclick='remove(${opportunity.id})' style='height:50%;'>remove</button>
                            </div>
                        `;
        displayDiv.appendChild(card);
    });

    renderOverview();
    

    
}

function remove(oppId){
    savedOpp = savedOpp.filter((o) => {
        return o.id != oppId;
    });
    renderSaved();
    
}

function cancel(oppId){
    upcomingEvents = upcomingEvents.filter((o) => {
        return o.id != oppId;
    });
    renderUpcoming();
}



function renderOverview(){
   let disDiv = document.getElementById('overview');
   let thours = 0;
   let noOrg = volunteerHours.length;
   let saved = savedOpp.length;
   let upEvents = upcomingEvents.length;
    
   volunteerHours.forEach(v => {
        thours += v.hours;
    });
   
    disDiv.innerHTML = `<h3>Welcome back ${currUserName}, here's your volunteering overview:</h3>
                        <hr>
                        <h4>Total Hours: ${thours}</h4>
                        <br>
                        <h4>Upcoming Events: ${upEvents}</h4>
                        <br>
                        <h4>Number of events you've completed: ${noOrg}</h4>
                        <br>
                        <h4>Saved Events: ${saved}</h4>`;

}

async function saveUserData(){
    let userId = currUserData[0];
    currUserData[1].savedOpportunity = savedOpp;
    currUserData[1].upcomingEvents = upcomingEvents;

    let url = "https://volunteerhub-8f811-default-rtdb.firebaseio.com/users/" + userId + ".json";

    console.log(url);

    console.log(currUserData[1]);
    let data = currUserData[1];
    
    
    try {
        let res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
    
        if (!res.ok) { 
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
    
       
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
    



}




function showDashBoard(){
    document.getElementById('content').style.display = 'none';
    console.log('hello');
    document.getElementById('dashBoardPage').style.display = 'block';
    

};

function showHomePage(){
   
    document.getElementById('dashBoardPage').style.display = 'none';
    console.log('hello');
    document.getElementById('content').style.display = 'block';
    

};

