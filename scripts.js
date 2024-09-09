const videoPlayer = document.getElementById('videoPlayer');
const audioPlayer = document.getElementById('audioPlayer');
const locationLabel = document.getElementById('locationLabel');
const progressBar = document.getElementById('progressBar');
const videoContainer = document.getElementById('videoContainer');
const progressContainer = document.querySelector('.progress-container');
const controlsArea = document.querySelector('.controls-area');
const musicButton = document.getElementById('musicButton');
const notification = document.getElementById('notification');
const centeredNotification = document.getElementById('centeredNotification');

let cursorTimeout;
let hideCursorTimeout;
let isMusicPlaying = false;

function getRandomVideo() {
    const assets = videoData.assets;
    return assets[Math.floor(Math.random() * assets.length)];
}

function loadRandomVideo() {
    const randomVideo = getRandomVideo();
    videoPlayer.src = randomVideo['url-4K-SDR-240FPS-mov'];
    locationLabel.textContent = `Location: ${randomVideo['accessibilityLabel']}`;
    videoPlayer.load();
    videoPlayer.play().catch(error => {
        console.error('Error playing video:', error);
    });

    showLocationLabel();
}

function showLocationLabel() {
    locationLabel.style.opacity = '1';
    setTimeout(() => {
        if (!videoPlayer.paused) {
            locationLabel.style.opacity = '0';
        }
    }, 15000);
}

function showNotification(message) {
    notification.textContent = message;
    notification.style.opacity = '1';
    notification.style.visibility = 'visible';
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.visibility = 'hidden';
    }, 5000);
}

function showCenteredNotification() {
    centeredNotification.style.opacity = '1';
    centeredNotification.style.visibility = 'visible';
    setTimeout(() => {
        centeredNotification.style.opacity = '0';
        centeredNotification.style.visibility = 'hidden';
    }, 10000);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function togglePlayPause() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        controlsArea.style.opacity = '0';
        locationLabel.style.opacity = '0';
    } else {
        videoPlayer.pause();
        controlsArea.style.opacity = '1';
        locationLabel.style.opacity = '1';
    }
}

function showControls() {
    controlsArea.style.opacity = '1';
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(() => {
        if (!videoPlayer.paused) {
            controlsArea.style.opacity = '0';
        }
    }, 3000);
}

function toggleMusic() {
    if (isMusicPlaying) {
        audioPlayer.pause();
        isMusicPlaying = false;
        musicButton.textContent = '🎵';
    } else {
        audioPlayer.play();
        isMusicPlaying = true;
        musicButton.textContent = '🔇';
        showNotification('Now Playing New South Wales 94.5');
    }
}

videoPlayer.addEventListener('timeupdate', () => {
    const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

progressContainer.addEventListener('click', (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const duration = videoPlayer.duration;
    const newTime = (clickX / width) * duration;
    videoPlayer.currentTime = newTime;
});

videoPlayer.addEventListener('ended', loadRandomVideo);

videoContainer.addEventListener('click', (event) => {
    if (!controlsArea.contains(event.target)) {
        togglePlayPause();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        loadRandomVideo();
    } else if (event.code === 'Enter') {
        event.preventDefault();
        toggleFullscreen();
    }
});

videoContainer.addEventListener('mousemove', showControls);

musicButton.addEventListener('click', toggleMusic);

function hideCursor() {
    videoContainer.style.cursor = 'none';
}

function showCursor() {
    videoContainer.style.cursor = 'auto';
    clearTimeout(hideCursorTimeout);
    hideCursorTimeout = setTimeout(hideCursor, 2000);
}

loadRandomVideo();

window.onload = () => {
    hideCursorTimeout = setTimeout(hideCursor, 2000);
    showCenteredNotification();
};