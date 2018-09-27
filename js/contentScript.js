document.addEventListener('copy', function(e){
    let selection = window.getSelection().toString();
    if (!selection || selection === "" || selection.trim() === "") {
        return;
    }
    chrome.runtime.sendMessage({id: "copyText", copyText: selection}, function(response) {
    });
});