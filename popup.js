let toggleSwitch = document.getElementById("toggleBtn");

toggleSwitch.addEventListener("change", function() {
    let isEnabled = this.checked;
    chrome.storage.local.set({"extensionEnabled": isEnabled});
});

// Initialize the switch state
chrome.storage.local.get(["extensionEnabled"], function(result) {
    let isEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
    toggleSwitch.checked = isEnabled;
});
