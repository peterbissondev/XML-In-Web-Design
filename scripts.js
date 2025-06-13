
/*
window.onload = function() {
    // Show a message to confirm the script is loaded and working
    alert("XML page and scripts.js are connected!\nWelcome to your default XML page.");
    
    // Optionally, update the heading to show script is running
    var headings = document.getElementsByTagName("heading");
    if (headings.length > 0) {
        headings[0].textContent += " (JavaScript Active)";
    }
};

*/

window.onload = () => {

    getthefile("page001.xml");
}

getthefile = (thefile) => {
    
    fetch('Files/' + thefile)
        .then(response => response.text())
        .then(data => {

            let cleanedData = cleanData(data);

            // If cleanedData is still meaningful, display it; otherwise, log a message
            if (cleanedData.trim().length > 0) {
                // alert("Final Secure Content:\n" + cleanedData);

            let parser = new window.DOMParser();
            let xmlData = parser.parseFromString(cleanedData, "application/xml");

            // Inject XML content into the "content" element
            document.querySelector("content").innerHTML = xmlData.querySelector("content").innerHTML;

            } else {
                console.log("No meaningful content after security filtering.");
            }
        })
        .catch(error => console.error('Error fetching the file:', error));
};


document.onclick = () => {

let a = window.getSelection();
let b = a.anchorNode.parentElement;
let c = b.parentElement.nodeName.toLowerCase();

 //   alert(b.nodeName);

    switch(c){

        case "content":
        const elem = document.querySelector('[contenteditable]'); // Select any element with contenteditable
        if (elem && elem.isContentEditable) {
            let data = elem.innerHTML;
            let sanitizedData = cleanData(data);
         //   elem.innerHTML = sanitizedData;
         //   alert(sanitizedData);
                    ;
        } else {
            console.log("No editable element found.");
        }
            break;

        case "preview": {
           // alert(b.nodeName);

           if(b.nodeName.toLowerCase() === "change"){
            let d = document.querySelector("dropmenu").className; 
              d = (d.toLowerCase() === "off")? "on":"off";
             
              document.querySelector("dropmenu").className = d;
           }
        }
            break;

        default:break;
    }
}



const cleanData = (data) => {
    // Remove unwanted elements such as <script>, <iframe>, <embed>, <object>
    let cleanedData = data.replace(/<(script|iframe|embed|object)[^>]*>.*?<\/\1>/gis, '');

    // Remove inline event handlers like onclick, onload, etc.
    cleanedData = cleanedData.replace(/\son\w+="[^"]*"/gis, '');

    // Sanitize dangerous attributes like javascript: in href or src
    cleanedData = cleanedData.replace(/\s(href|src)=["']javascript:[^"']*["']/gis, '');

    return cleanedData; // ✅ Return the cleaned data!
};
