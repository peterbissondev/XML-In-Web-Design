window.onload = function() {
    // Show a message to confirm the script is loaded and working
    alert("XML page and scripts.js are connected!\nWelcome to your default XML page.");
    
    // Optionally, update the heading to show script is running
    var headings = document.getElementsByTagName("heading");
    if (headings.length > 0) {
        headings[0].textContent += " (JavaScript Active)";
    }
};
