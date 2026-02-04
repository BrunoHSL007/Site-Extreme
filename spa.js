
function getOnlyHtml(html) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}

function addScripts(html) {
    const regex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = regex.exec(html)) !== null) {
        const code = match[1];

        const script = document.createElement("script");
        script.textContent = code;

        document.head.appendChild(script);
    }
}

async function go(page){

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
        const script = await res.text();
        const html = getOnlyHtml(script)        
        
        const pageDiv = document.createElement('div');
        pageDiv.setAttribute("id", page);
        pageDiv.innerHTML = html;
        document.getElementById("app").appendChild(pageDiv);
        history.pushState({}, "", `/${page}`);

        addScripts(script)
    }
}

window.onpopstate = () => {
    const page = location.pathname.replace("/", "") || "home";
    go(page);
};

go("home");
