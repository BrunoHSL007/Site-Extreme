let sheetsData = null;

async function getData(){
    console.log("Fetching sheets data...");
    if(sheetsData) return sheetsData;
    const res = await fetch("/.netlify/functions/getSheets");
    sheetsData = await res.json();
    return sheetsData;
}

js_files = ['agenda'];

async function go(page){
    if(js_files.includes(page)){
        var script = document.createElement('script');
        const scriptsrc = `src/js/${page}.js`;
        
        if(!document.head.querySelector(`script[src="${scriptsrc}"]`)){
            script.src = scriptsrc;
            document.head.appendChild(script);
        }   
    }

    const app = document.getElementById("app");
    const children = app.children

    for (let div of children) {
        div.style.display = 'none'
    }
    if(document.getElementById(`${page}`)){
        document.getElementById(`${page}`).style.display = 'block'
    }
    else{
        const res = await fetch(`src/pages/${page}.html`);
        const html = await res.text();
        const pageDiv = document.createElement('div');
        pageDiv.setAttribute("id", page);
        pageDiv.innerHTML = html;
        document.getElementById("app").appendChild(pageDiv);
        history.pushState({}, "", `/${page}`);
    }
    
}

window.onpopstate = () => {
    const page = location.pathname.replace("/", "") || "home";
    go(page);
};

go("home");
