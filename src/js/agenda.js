
function parseData(valor) {
if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
const [y, m, d] = valor.split("-");
return new Date(y, m - 1, d);
}

let posts = document.querySelector('.posts');
let cardtemplate = document.getElementById('card-template');
for(let i = 0; i < 10; i++) {
    posts.append(cardtemplate.content.cloneNode(true));
}

let sheetsData = null;

async function getData(){
    if(sheetsData) return sheetsData;
    console.log("Fetching data...");
    const res = await fetch("/.netlify/functions/getAgenda");
    sheetsData = await res.json();
    return sheetsData;
}

getData()
.then(data => {
    const postsDiv = document.querySelector('.posts');
    postsDiv.className = 'textwithenter';
    posts.innerHTML = '';

    data.map((item,count) => {
        
        const initialdate = parseData(item[3]);
        const finaldate = parseData(item[4]);
        const today = new Date();

        if ((initialdate !== null && initialdate > today) || (finaldate !== null && finaldate < today)) {
            return;
        }
        const title = document.createElement('h1');
        title.className = 'title';
        title.textContent = item[0];

        const scheduletitle = document.createElement('h1');
        scheduletitle.className = 'scheduletitle';
        scheduletitle.textContent = item[2];

        const titleItems = document.createElement('div');
        titleItems.className = 'titleItems';

        titleItems.appendChild(title);
        titleItems.appendChild(scheduletitle);
        postsDiv.appendChild(titleItems);

        const details = document.createElement('p');
        details.className = 'details';
        details.textContent = item[1];

        postsDiv.appendChild(details);

        if(item[5] && item[6]){
            const buttonDiv = document.createElement('button');
            buttonDiv.textContent = item[5];
            buttonDiv.className = 'btn';
            buttonDiv.onclick = () => {
                location.href = item[6];
            };
            postsDiv.appendChild(buttonDiv);
        }

        if(item[7]){
            const img = document.createElement('img');
            img.className = 'post';
            img.src = item[7];   
            img.onerror = function() {
                this.style.display = 'none';
            };
            postsDiv.appendChild(img);
        }                

        if(count < data.length - 1){
            const divider = document.createElement('div');
            divider.className = 'divider';
            postsDiv.appendChild(divider);
        }

    })
});