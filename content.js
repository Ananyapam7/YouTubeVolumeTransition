function decayVolumeOverTime(duration) {
    const video = document.querySelector('video');
    if (!video) return;

    const V0 = video.volume;    // Initial volume
    const lambda = -Math.log(0.01) / duration;  // Adjusted for the specified duration
    let startTime = Date.now();

    function adjustVolume() {
        const elapsedTime = (Date.now() - startTime) / 1000;  // Convert to seconds
        const newVolume = V0 * Math.exp(-lambda * elapsedTime);
        video.volume = newVolume;

        if (newVolume > 0.01) {  // Stop when volume is close to 0
            requestAnimationFrame(adjustVolume);
        } else {
            video.volume = 0;  // Ensure volume is set to 0 at the end
        }
    }

    requestAnimationFrame(adjustVolume);
}

const durationInSeconds = 1;

chrome.storage.local.get(["extensionEnabled"], function(result) {
    let isEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
    if (isEnabled) {
        document.addEventListener('click', function(event) {
            // Check if the clicked element is a video link
            if (event.target.closest('a.ytd-thumbnail') || event.target.closest('a.ytd-grid-video-renderer')) {
                // Prevent immediate navigation
                event.preventDefault();
                event.stopPropagation();
        
                decayVolumeOverTime(durationInSeconds);
        
                // Capture the URL of the clicked video
                const videoUrl = event.target.closest('a').href;
        
                // Wait for 1 second (1000 milliseconds)
                setTimeout(function() {
                    window.location.href = videoUrl;
                }, 1000);
            }
        }, true);  // Using capture phase to ensure the event is caught before any other potential handlers        
    }
});