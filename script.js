// ----------------------
// ELEMENTS
// ----------------------

const startBtn = document.getElementById("startBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const card = document.querySelector(".card");
const question = document.querySelector(".question");
const calendar = document.querySelector(".calendar");
const finalScreen = document.querySelector(".final");

const confirmDate = document.getElementById("confirmDate");
const selectedDate = document.getElementById("selectedDate");


// ----------------------
// START
// ----------------------

startBtn.addEventListener("click", () => {

    card.classList.add("hidden");

    question.classList.remove("hidden");

});


// ----------------------
// FUNNY NO BUTTON
// ----------------------

const messages = [

    "No 🙄",

    "Are you sure? 😶",

    "Think again 👀",

    "Wrong answer 😂",

    "Cats disagree 🐈",

    "Bruhhh",

    "Try YES 😌",

    "Still No? 😭",

    "You're fast 👀",

    "Impossible!!"

];

let moveCount = 0;

function moveButton(){

    const maxX = window.innerWidth - noBtn.offsetWidth - 30;

    const maxY = window.innerHeight - noBtn.offsetHeight - 30;

    const randomX = Math.random() * maxX;

    const randomY = Math.random() * maxY;

    noBtn.style.position = "fixed";

    noBtn.style.left = randomX + "px";

    noBtn.style.top = randomY + "px";

    noBtn.innerText = messages[moveCount % messages.length];

    moveCount++;

}

noBtn.addEventListener("mouseover", moveButton);

noBtn.addEventListener("click", moveButton);


// ----------------------
// YES
// ----------------------

yesBtn.addEventListener("click", () => {

    question.classList.add("hidden");

    calendar.classList.remove("hidden");

    confetti({

        particleCount:250,

        spread:120,

        origin:{y:0.6}

    });

});


// ----------------------
// CALENDAR
// ----------------------

flatpickr("#datePicker",{

    minDate:"today",

    dateFormat:"F j, Y"

});


// ----------------------
// CONFIRM DATE
// ----------------------

confirmDate.addEventListener("click",()=>{

    const value = document.getElementById("datePicker").value;

    if(value===""){

        alert("Pick a date first 😤");

        return;

    }

    calendar.classList.add("hidden");

    // show final screen and then prompt for place selection
    finalScreen.classList.remove("hidden");
    selectedDate.innerHTML="📅 "+value;

    // create place chooser UI inside final screen
    promptPlaceSelection(value);



// Places list (added one more: Rooftop Bar)
const placesList = ['Cafe','Park','Mall','Rooftop Bar','Custom Place'];

function promptPlaceSelection(dateValue){
    // clear any previous chooser
    const existing = document.getElementById('place-chooser');
    if(existing) existing.remove();

    const chooser = document.createElement('div');
    chooser.id = 'place-chooser';
    chooser.style.marginTop = '18px';
    chooser.style.display = 'flex';
    chooser.style.flexDirection = 'column';
    chooser.style.alignItems = 'center';

    const label = document.createElement('p');
    label.textContent = "Where should we hangout?";
    label.style.fontWeight = '700';
    chooser.appendChild(label);

    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.gap = '10px';
    buttons.style.flexWrap = 'wrap';
    buttons.style.justifyContent = 'center';
    chooser.appendChild(buttons);

    let selectedPlace = null;

    placesList.forEach(place=>{
        const b = document.createElement('button');
        b.textContent = place;
        b.style.padding = '10px 14px';
        b.style.borderRadius = '10px';
        b.style.border = '1px solid rgba(0,0,0,0.08)';
        b.style.background = '#fff';
        b.style.cursor = 'pointer';
        b.addEventListener('click', ()=>{
            // handle active state
            Array.from(buttons.children).forEach(ch=>ch.style.boxShadow='');
            b.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
            selectedPlace = place;
            if(place === 'Custom Place'){
                if(!document.getElementById('custom-place-input')){
                    const inp = document.createElement('input');
                    inp.id = 'custom-place-input';
                    inp.placeholder = 'Enter custom place';
                    inp.style.marginTop = '12px';
                    inp.style.padding = '10px';
                    inp.style.borderRadius = '10px';
                    inp.style.border = '1px solid rgba(0,0,0,0.08)';
                    chooser.appendChild(inp);
                    inp.addEventListener('input', ()=>{ selectedPlace = inp.value; });
                    // focus the input so she can type immediately
                    setTimeout(()=>{ inp.focus(); },50);
                    // allow pressing Enter to confirm
                    inp.addEventListener('keydown',(e)=>{ if(e.key === 'Enter'){ e.preventDefault(); confirm.click(); } });
                }
            } else {
                const inp = document.getElementById('custom-place-input'); if(inp) inp.remove();
            }
        });
        buttons.appendChild(b);
    });

    const confirm = document.createElement('button');
    confirm.textContent = 'Confirm Place';
    confirm.style.marginTop = '14px';
    confirm.style.padding = '12px 22px';
    confirm.style.borderRadius = '18px';
    confirm.style.background = '#ff5c8a';
    confirm.style.color = 'white';
    confirm.style.border = 'none';
    confirm.style.cursor = 'pointer';
    chooser.appendChild(confirm);

    confirm.addEventListener('click', ()=>{
        if(!selectedPlace || selectedPlace.trim()===''){
            alert('Please choose or type a place.');
            return;
        }

        // persist the filled answer so you can see what she filled
        const report = { date: dateValue, place: selectedPlace, timestamp: new Date().toISOString() };
        // save to localStorage (append)
        try{
            const arr = JSON.parse(localStorage.getItem('cat_committee_reports') || '[]');
            arr.push(report);
            localStorage.setItem('cat_committee_reports', JSON.stringify(arr));
        }catch(e){ console.warn('storage failed',e); }

        // copy to clipboard
        try{ navigator.clipboard.writeText(JSON.stringify(report)).catch(()=>{}); }catch(e){}

        // create download file
        const blob = new Blob([JSON.stringify(report, null, 2)], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'mission_report.json'; a.click(); URL.revokeObjectURL(url);

        // show in final screen summary
        const placeDisplay = document.createElement('p'); placeDisplay.style.marginTop='12px'; placeDisplay.style.fontWeight='700'; placeDisplay.textContent = '📍 '+ selectedPlace;
        // append once
        const old = document.getElementById('final-place-display'); if(old) old.remove(); placeDisplay.id='final-place-display'; finalScreen.appendChild(placeDisplay);

        confetti({particleCount:200,spread:100,origin:{y:0.6}});
        alert('Place saved. You can view responses in localStorage (key: cat_committee_reports) or the downloaded file.');
        chooser.remove();
    });

    finalScreen.appendChild(chooser);
}
});


// ----------------------
// RANDOM CAT MESSAGES
// ----------------------

const catMessages=[

"🐈 Meow approves.",

"🐈 This cat ships us.",

"🐈 Relationship audit passed.",

"🐈 Nice choice human.",

"🐈 Give me treats.",

"🐈 10/10 decision."

];

document.querySelectorAll(".cat").forEach(cat=>{

    cat.addEventListener("click",()=>{

        const random=Math.floor(Math.random()*catMessages.length);

        alert(catMessages[random]);

    });

});


// ----------------------
// ESC EASTER EGG
// ----------------------

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        alert("Escape unsuccessful 😂");

    }

});


// ----------------------
// IDLE MESSAGE
// ----------------------

setTimeout(()=>{

    if(!question.classList.contains("hidden")){

        alert("🐈 The cats are getting impatient...");

    }

},30000);


// ----------------------
// SCATTER & RESIZE CATS
// ----------------------
function scatterCats(){
    const cats = document.querySelectorAll('.cat');
    cats.forEach((cat,i)=>{
        // random size between 120 and 240px
        const size = Math.floor(Math.random()*120)+120;
        cat.style.width = size + 'px';
        cat.style.height = 'auto';
        // random-ish positions but keep them inside viewport (5% - 80%)
        const left = (Math.random()*75)+5; // vw
        const top = (Math.random()*75)+5; // vh
        cat.style.position = 'fixed';
        cat.style.left = left + 'vw';
        cat.style.top = top + 'vh';
        cat.style.transition = 'transform .45s, left .9s ease, top .9s ease';
        cat.style.zIndex = 1;
        // random rotation and animation speed
        cat.style.transform = `rotate(${(Math.random()*10)-5}deg)`;
        const dur = (Math.random()*6)+6;
        cat.style.animation = `float ${dur}s ease-in-out ${Math.random()*3}s infinite`;
    });
}

// Debounced resize
let resizeTimer;
window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=>{ scatterCats(); }, 220);
});

// scatter once on load
document.addEventListener('DOMContentLoaded', ()=>{ scatterCats(); });