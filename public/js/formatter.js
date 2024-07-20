function UriElement(url) {
    const lastPathSegment = url.pathname.split('/').pop();
    // Check if the last segment is an empty string
    if (!lastPathSegment) {
        return true;
    }

    // Use parseInt with radix 10 for base-10 conversion and isNaN to check for Not a Number
    if (!isNaN(parseInt(lastPathSegment))) {
        return parseInt(lastPathSegment);
    }
    return true;
}

// Function to handle copy functionality (reusable)
function copyText(buttonElement, data) {
    const keys = Object.keys(data);
    const buttonValue = parseInt(buttonElement.value); // Access custom attribute using dataset
    let text = data[keys[buttonValue]][0];

    navigator.clipboard.writeText(text.replace(/\n/g, '\n'))
        .then(() => {
            console.log('Button value:', buttonValue);
        })
        .catch(err => {
            console.error('Failed to copy text:', err);
        });
}

function formatHTMLSnippet(htmlSnippet) {
    // Replace newlines with a placeholder
    htmlSnippet = htmlSnippet.replace(/\n/g, '~');

    let counter = 1;
    let space = " ";
    let output = `<p><line><span class="code-num"><span>${counter}${space}</span></span>`;
    let inString = false;
    let inTag = false;
    let inSpaceAfterTag = false;

    for (const char of htmlSnippet) {
        if (counter > 8) { space = "" } else { space = " " }
        if (char === '=') {
            if (inSpaceAfterTag) {
                inSpaceAfterTag = false;
            }
            output += `<span class='grey'>${char}</span>`;
        } else if (char === "'" || char === '"') {
            inString = !inString;
            output += `<span class='green'>${char}</span>`;
        } else if (char === '<') {
            inTag = true;
            output += `<span class='grey'>${char}</span>`;
        } else if (char === '>') {
            inTag = false;
            output += `<span class='grey'>${char}</span>`;
        } else if (char === ' ') {
            if (inTag && !inString) {
                inSpaceAfterTag = true;
                output += `<span class='green'>${char}</span>`;
            } else if (inString) {
                output += `<span class='green'>${char}</span>`;
            } else {
                output += `<span class='grey'>${char}</span>`;
            }
        } else if (char === '~') {
            counter++
            output += `</line></p><p><line><span class="code-num"><span>${counter}${space}</span></span>`;
        } else {
            if (inSpaceAfterTag) {
                output += `<span class='yellow'>${char}</span>`;
            } else if (inTag && !inString) {
                if (char != "/") {
                    output += `<span class='blue'>${char}</span>`;
                } else {
                    output += `<span class='grey'>${char}</span>`;
                }
            } else if (inString) {
                output += `<span class='green'>${char}</span>`;
            } else {
                output += `<span class='text'>${char}</span>`;
            }
        }
    }

    return output + '</line></p>';
}


async function generateHTML_main(data, section, nav) {
    const formattedData = [];
    let counter = 0;
    for (const key in data) {
        formattedData.push({
            key,
            lang: data[key][1],
            lines: formatHTMLSnippet(data[key][0]),
            html: data[key][0],
            count: counter
        });
        counter += 1;
    }

    const htmlString_1 = formattedData.reduce((acc, item) => {
        return acc + `
        <div class="item" id="${item.key}">
          <div class="rep-card card border-light">
            <div class="rep-card-header card-header">
            ${item.key}
            <button type="button" class="btn btn-primary" value="${item.count}">Edit</button>
            </div>  
            <div class="preview">
            ${item.html}
            </div>
            <div class="rep-card-body card-body">
            <span class="lang">${item.lang}</span>
              <button class="copy-button" value="${item.count}">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyklEQVR4nO3VQUpCURgFYFtDOE0IdAM2yX1om3DuKAVbQYNIEWc6qAU0EXQLTQtqB7WFL364wS0er3wTHbwDh8t/Oedw/zO5jcYhgSaW2GRc4LRKWAtDjBJ3eEI/Y8zbTBP6s7+CO/jEA+aJz1jhAt10rtP9t+YRH2iXhd/gvmCTeOlbxphbv3Sz8JeF32G8R4u5dxz+OvwH6loKUddSiLqW46zlFtOK4dPwlwmu8IJLnO/BHl4xKAs/wQTv6Uf6L+MDuQ5/la0r4Qs9y/oXMFM9bQAAAABJRU5ErkJggg==">
              </button>
            </div>
            <div class="rep-card-footer card-footer">
              <div class="code">
                ${item.lines}
              </div>
            </div>
          </div>
        </div>
      `;
    }, '');

    const htmlString_2 = formattedData.reduce((acc, item) => {
        return acc + `
        <li class="nav-item">
            <a href="#${item.key}" class="btn btn-outline-primary" style="width: 100%;">
            ${item.key} 
            </a
        </li>
      `;
    }, '');

    section.innerHTML = htmlString_1;
    nav.innerHTML = htmlString_2;
}

async function generateHTML_edit(data, section, obj) {
    const formattedData = {};
    let counter = 0;
    for (const key in data) {
        console.log(counter);
        console.log(obj);
        if (obj == counter) {
            formattedData.key = key;
            formattedData.lang = data[key][1];
            formattedData.lines = formatHTMLSnippet(data[key][0]);
            formattedData.html = data[key][0];
            formattedData.count = counter;
        }
        counter += 1;
    }

    if (formattedData.key === undefined) {
        window.location.href = window.location.host;
    }

    console.log(formattedData);

    const htmlString = `
        <div class="item" id="${formattedData.key}">
          <div class="rep-card card border-light">
            <div class="rep-card-header card-header">
            ${formattedData.key}
            <button type="button" class="btn btn-primary" value="${formattedData.count}">Edit</button>
            </div>  
            <div class="preview">
            ${formattedData.html}
            </div>
            <div class="rep-card-body card-body">
            <span class="lang">${formattedData.lang}</span>
              <button class="copy-button" value="${formattedData.count}">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyklEQVR4nO3VQUpCURgFYFtDOE0IdAM2yX1om3DuKAVbQYNIEWc6qAU0EXQLTQtqB7WFL364wS0er3wTHbwDh8t/Oedw/zO5jcYhgSaW2GRc4LRKWAtDjBJ3eEI/Y8zbTBP6s7+CO/jEA+aJz1jhAt10rtP9t+YRH2iXhd/gvmCTeOlbxphbv3Sz8JeF32G8R4u5dxz+OvwH6loKUddSiLqW46zlFtOK4dPwlwmu8IJLnO/BHl4xKAs/wQTv6Uf6L+MDuQ5/la0r4Qs9y/oXMFM9bQAAAABJRU5ErkJggg==">
              </button>
            </div>
            <div class="rep-card-footer card-footer">
              <div class="code">
                ${formattedData.lines}
              </div>
            </div>
          </div>
        </div>
      `;

    section.innerHTML = htmlString;
}

const section = document.querySelector('section'); // Replace with the desired section element in your HTML
const nav = document.getElementById('nav_items');
const aside = document.getElementById('aside');


const url = new URL(window.location.href);

const data = {
    "Alerts": ["<div class='alert alert-primary' role='alert'>\nA simple primary alert—check it out!\n</div>", "HTML"],
    "Badge": ["<h1>Example heading <span class='badge text-bg-secondary'>New</span></h1>\n<h2>Example heading <span class='badge text-bg-secondary'>New</span></h2>\n<h3>Example heading <span class='badge text-bg-secondary'>New</span></h3>\n<h4>Example heading <span class='badge text-bg-secondary'>New</span></h4>\n<h5>Example heading <span class='badge text-bg-secondary'>New</span></h5>\n<h6>Example heading <span class='badge text-bg-secondary'>New</span></h6>", "HTML"],
    "List": ["<ol class='list-group list-group-numbered'>\n  <li class='list-group-item d-flex justify-content-between align-items-start'>\n    <div class='ms-2 me-auto'>\n<div class='fw-bold'>Subheading</div>\nContent for list item\n    </div>\n    <span class='badge text-bg-primary rounded-pill'>14</span>\n  </li>\n  <li class='list-group-item d-flex justify-content-between align-items-start'>\n    <div class='ms-2 me-auto'>\n<div class='fw-bold'>Subheading</div>\nContent for list item\n    </div>\n    <span class='badge text-bg-primary rounded-pill'>14</span>\n  </li>\n  <li class='list-group-item d-flex justify-content-between align-items-start'>\n    <div class='ms-2 me-auto'>\n<div class='fw-bold'>Subheading</div>\nContent for list item\n    </div>\n    <span class='badge text-bg-primary rounded-pill'>14</span>\n  </li>\n</ol>", "HTML"],
    "Buttons": ["<button type='button' class='btn btn-primary'>Primary</button>\n<button type='button' class='btn btn-secondary'>Secondary</button>\n<button type='button' class='btn btn-success'>Success</button>\n<button type='button' class='btn btn-danger'>Danger</button>\n<button type='button' class='btn btn-warning'>Warning</button>\n<button type='button' class='btn btn-info'>Info</button>\n<button type='button' class='btn btn-light'>Light</button>\n<button type='button' class='btn btn-dark'>Dark</button>\n\n<button type='button' class='btn btn-link'>Link</button>", "HTML"]
}

async function main(data, section, nav, aside, url) {
    const URI = UriElement(url);
    if (URI === true) {
        await generateHTML_main(data, section, nav);
    } else {
        document.body.style.display = "block";
        aside.style.display = "none";
        await generateHTML_edit(data, section, URI);
    }
}

main(data, section, nav, aside, url);

// Select all buttons with the "copy-button" class
const copyButtons = document.querySelectorAll('.copy-button');

copyButtons.forEach(button => {
    button.addEventListener('click', function () {
        copyText(this, data); // Pass the clicked button element to the copyText function
    });
});