

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
            link: data[key][2],
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
            <div>
            <a href="${item.count}" type="button" class="btn btn-primary">Edit</a>
            <a href="${item.link}" type="button" class="btn btn-outline-info">
            Bootstrap
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
                <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
            </svg>
            </a>
            </div>
            </div>  
            <div class="preview">
            ${item.html}
            </div>
            <div class="rep-card-body card-body">
            <span class="lang">${item.lang}</span>
            <button class="copy-button" value="${item.count}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
            </svg>    
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"/>
            </svg>     
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
                <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
            </svg>
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
    const response = await fetch('https://content.justwaitforme.de/data/api/bootstrap.php'); // Replace with your actual API endpoint
    if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
    }
    const data = await response.json();
    return data["content"];
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
            <div class="edit-rep-card-header rep-card-header card-header">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
            </svg>     
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"/>
            </svg>      
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check-fill" viewBox="0 0 16 16">
                <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
            </svg>   
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

