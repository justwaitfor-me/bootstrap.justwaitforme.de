

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
async function copyText(buttonElement, toast, url) {
    const buttonValue = parseInt(buttonElement.value); // Access custom attribute using dataset
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
    const URI = UriElement(url);
    let text = "";

    try {
        data = await fetchData(); // Fetch data and wait for resolution
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        // Handle potential errors during data fetching
        return; // Optionally exit the function if there's an error
    }

    if (URI === true) {
        const keys = Object.keys(data);
        text = data[keys[buttonValue]][0];
    } else {
        text = sessionStorage.getItem("code");
    }

    navigator.clipboard.writeText(text.replace(/\n/g, '\n'))
        .then(() => {
            console.log('Button value:', buttonValue);
            toastBootstrap.show()
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
    let output = `<p><span class="code-num"><span>${counter}${space}</span></span><line>`;
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
            output += `</line></p><p><span class="code-num"><span>${counter}${space}</span></span><line>`;
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

function removeHTMLTags(htmlString) {
    // Regular expression to match all HTML tags
    const regex = /<[^>]*>/g;

    // Replace all HTML tags with an empty string
    return htmlString.replace(regex, "");
}


async function generateHTML_main(data, section, nav) {
    const formattedData = [];
    let counter = 0;
    for (const key in data) {
        console.log(key);
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
            <a href="${item.count}" type="button" class="btn btn-primary">Edit</a>
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

function isNumber(value) {
    return typeof value === 'number';
}

async function fetchData() {
    try {
        const response = await fetch('https://content.justwaitforme.de/data/api/bootstrap.php'); // Replace with your actual API endpoint
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.status}`);
        }
        const data = await response.json();
        return data["content"];
    } catch (error) {
        console.error("Error:", error);
    }
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
        window.location.href = ".";
    }

    lines = formattedData.lines.replace(/<line>/g, "<line contenteditable>")

    const htmlString = `
        <div class="edit-item item" id="${formattedData.key}">
          <div class="edit-rep-card rep-card card border-light">
            <div class="rep-card-header card-header">
            ${formattedData.key}
            <a type="button" href="." class="btn btn-outline-light">Back</a>
            </div>  
            <div id="edit-preview-push" class="edit-preview preview">
            ${formattedData.html}
            </div>
            <p id='mutation-output'></p>
            <div class="rep-card-body card-body">
            <span class="lang">${formattedData.lang}</span>
              <button class="copy-button" value="${formattedData.count}">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAYAAADgKtSgAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyklEQVR4nO3VQUpCURgFYFtDOE0IdAM2yX1om3DuKAVbQYNIEWc6qAU0EXQLTQtqB7WFL364wS0er3wTHbwDh8t/Oedw/zO5jcYhgSaW2GRc4LRKWAtDjBJ3eEI/Y8zbTBP6s7+CO/jEA+aJz1jhAt10rtP9t+YRH2iXhd/gvmCTeOlbxphbv3Sz8JeF32G8R4u5dxz+OvwH6loKUddSiLqW46zlFtOK4dPwlwmu8IJLnO/BHl4xKAs/wQTv6Uf6L+MDuQ5/la0r4Qs9y/oXMFM9bQAAAABJRU5ErkJggg==">
              </button>
            </div>
            <div class="edit-rep-card-footer rep-card-footer card-footer">
              <div id="code-contenteditable" class="code">
                ${lines}
              </div>
            </div>
          </div>
        </div>
      `;

    section.innerHTML = htmlString;
}

async function listeners() {
// Select all buttons with the "copy-button" class
const copyButtons = document.querySelectorAll('.copy-button');
console.log(copyButtons);
copyButtons.forEach(button => {
    console.log("test2");
    button.addEventListener('click', function () {
        console.log("copying");
        copyText(this, toast, url); // Pass the clicked button element to the copyText function
    });
});



Array.from(document.querySelectorAll('[contenteditable]')).forEach(function (element) {

    // Initialize a variable to store combined content
    let combinedContent = "";

    // Loop through all contenteditable elements
    document.querySelectorAll('[contenteditable]').forEach(otherElement => {
        // Append the content of each element to the combined string
        combinedContent += otherElement.innerText + "\n"; // Add a newline for better readability
    });


    // Update the preview element with the combined content
    document.querySelector('#edit-preview-push').innerHTML = combinedContent.replace(/\n/g, ' ');
    sessionStorage.setItem(`code`, combinedContent);
    element.addEventListener('input', function (event) {

        // Get the current edited element's content
        const currentContent = event.target.innerHTML;

        // Initialize a variable to store combined content
        let combinedContent = "";

        // Loop through all contenteditable elements
        document.querySelectorAll('[contenteditable]').forEach(otherElement => {
            // Append the content of each element to the combined string
            combinedContent += otherElement.innerText + "\n"; // Add a newline for better readability
        });


        // Update the preview element with the combined content
        document.querySelector('#edit-preview-push').innerHTML = combinedContent.replace(/\n/g, ' ');
        sessionStorage.setItem(`code`, combinedContent);


    });
});

}



const section = document.querySelector('section'); // Replace with the desired section element in your HTML
const nav = document.getElementById('nav_items');
const aside = document.getElementById('aside');
const toast = document.getElementById('toast');
const wrapper = document.querySelector('main');

const url = new URL(window.location.href);

async function main(section, nav, aside, wrapper, url) {
    const URI = UriElement(url);

    try {
        data = await fetchData(); // Fetch data and wait for resolution
    } catch (error) {
        console.error("Error fetching data:", error);
        // Handle potential errors during data fetching
        return; // Optionally exit the function if there's an error
    }

    if (URI === true) {
        await generateHTML_main(data, section, nav);
    } else {
        document.body.style.display = "block";
        aside.style.display = "none";
        wrapper.style.height = "100%";
        await generateHTML_edit(data, section, URI);
    }

    await listeners();
}

main(section, nav, aside, wrapper, url);

