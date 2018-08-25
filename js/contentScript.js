document.addEventListener('copy', function(e){
    let selection = window.getSelection().toString();
    chrome.runtime.sendMessage({id: "copyText", copyText: selection}, function(response) {
    });
});