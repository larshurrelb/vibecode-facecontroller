const canvas = document.getElementById('canvas');
const message = document.getElementById('message');

// Resizing the canvas to fit the window
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resizeCanvas();

let currentInputs = null;
let ws; // make ws global if not already

const triggerMap = {
    '1': 'Idle',
    '2': 'PuppyEyes',
    '3': 'Staring',
    '4': 'Happy',
    '5': 'Panting',
    '6': 'Sighing',
    '7': 'Barking',
    '8': 'Woofing',
    '9': 'Bumping', 
    '0': 'Gaze to the right', 
    'ß': 'Gaze to the left',
    'i': 'StopAllSounds'
}; 

const connectWebSocket = () => {
    // use the correct protocol and host as before
    const url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
    const socket = new WebSocket(url);
    
    socket.onopen = () => {
        ws = socket;
        console.log('WebSocket connected');
    };
    
    socket.onclose = () => {
        console.warn('WebSocket disconnected, attempting reconnect in 5 seconds');
        setTimeout(connectWebSocket, 5000);
    };
    
    socket.onerror = (err) => {
        console.error('WebSocket error:', err);
    };
    
    // Preserve onmessage as defined in init
    socket.onmessage = (event) => {
        const message = event.data; 
        console.log('Received WebSocket message:', message);

        // Audio Elements
        const audioIdle = document.getElementById('soundSlowBreathing'); // Key : 1
        const audioPuppyEyes = document.getElementById('soundWhimpering'); // Key : 2
        const audioIntenseStare = document.getElementById('soundLowGrowling'); // Key : 3
        const audioHappy = document.getElementById('soundExcitedPanting'); // Key : 4
        const audioPanting = document.getElementById('soundPanting'); // Key : 5
        const audioSigh = document.getElementById('soundSigh'); // Key : 6
        const audioBarking = document.getElementById('soundBarking'); // Key : 7
        const audioWoofing = document.getElementById('soundWoofing'); // Key : 8
        const audioBumping = document.getElementById('soundImpatientGrowling'); // Key : 9
        const audioGazeToTheRight = document.getElementById('soundSneezeRight'); // Key : 0
        const audioGazeToTheLeft = document.getElementById('soundSneezeLeft'); // Key : ß

        // Sound for animation: Idle -> 1 
        if (message === 'play-idle-sound' || message === '1') {
            if (audioIdle) {

                // Stop any other currently playing sound
                if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioIntenseStare.paused) { 
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioSigh.paused) { 
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioBumping.paused) { 
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheRight.paused) { 
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                } else if (!audioGazeToTheLeft.paused) { 
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play idle sound
                const playAudio = () => {
                    audioIdle.currentTime = 0; 
                    audioIdle.play()
                        .then(() => console.log('Idle sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }

        // Sound for animation: PuppyEyes -> 2
        if (message === 'play-puppyeyes-sound' || message === '2') {
            if (audioPuppyEyes) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) { 
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioIntenseStare.paused) { 
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioSigh.paused) { 
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioBumping.paused) {
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheRight.paused) { 
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                } else if (!audioGazeToTheLeft.paused) { 
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play puppyEyes sound
                const playAudio = () => {
                    audioPuppyEyes.currentTime = 0; 
                    audioPuppyEyes.play()
                        .then(() => console.log('PuppyEyes sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }
        
        // Sound for animation: IntenseStare
        if (message === 'play-intensestare-sound' || message === '3') {
            if (audioIntenseStare) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) { 
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioSigh.paused) { 
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioBumping.paused) { 
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheRight.paused) { 
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                } else if (!audioGazeToTheLeft.paused) {
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play woofing sound
                const playAudio = () => {
                    audioIntenseStare.currentTime = 0; 
                    audioIntenseStare.play()
                        .then(() => console.log('IntenseStare sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }
        
        // Sound for animation: Happy
        if (message === 'play-happy-sound' || message === '4') {
            if (audioHappy) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) { 
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioIntenseStare.paused) {
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioSigh.paused) {
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioBumping.paused) { 
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheRight.paused) {
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                } else if (!audioGazeToTheLeft.paused) {
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play happy sound
                const playAudio = () => {
                    audioHappy.currentTime = 0; 
                    audioHappy.play()
                        .then(() => console.log('Happy sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }
        
        // Sound for animation: Panting
        if (message === 'play-panting-sound' || message === '5') {
            if (audioPanting) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) { 
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioIntenseStare.paused) { 
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioSigh.paused) { 
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioBumping.paused) { 
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheRight.paused) { 
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                } else if (!audioGazeToTheLeft.paused) { 
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play panting sound
                const playAudio = () => {
                    audioPanting.currentTime = 0; 
                    audioPanting.play()
                        .then(() => console.log('Panting sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }

        // Sound for animation: Sigh
        if (message === 'play-sigh-sound' || message === '6') {
            if (audioSigh) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) { 
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioIntenseStare.paused) { 
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioBumping.paused) { 
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheRight.paused) { 
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                } else if (!audioGazeToTheLeft.paused) { 
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play sigh sound
                const playAudio = () => {
                    audioSigh.currentTime = 0; 
                    audioSigh.play()
                        .then(() => console.log('Sigh sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }

        // Sound for animation: Barking
        if (message === 'play-barking-sound' || message === '7') {
            if (audioBarking) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) { 
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioIntenseStare.paused) { 
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioSigh.paused) { 
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioBumping.paused) { 
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheRight.paused) { 
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                } else if (!audioGazeToTheLeft.paused) { 
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play barking sound
                const playAudio = () => {
                    audioBarking.currentTime = 0; 
                    audioBarking.play()
                        .then(() => console.log('Barking sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }

        // Sound for animation: Woofing
        if (message === 'play-woofing-sound' || message === '8') {
            if (audioWoofing) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) { 
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioIntenseStare.paused) { 
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioSigh.paused) { 
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioBumping.paused) { 
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheRight.paused) { 
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                } else if (!audioGazeToTheLeft.paused) { 
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play woofing sound
                const playAudio = () => {
                    audioWoofing.currentTime = 0; 
                    audioWoofing.play()
                        .then(() => console.log('Woofing sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }

        // Sound for animation: Bumping
        if (message === 'play-bumping-sound' || message === '9') {
            if (audioBumping) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) { 
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioIntenseStare.paused) { 
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioSigh.paused) { 
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioGazeToTheRight.paused) { 
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                } else if (!audioGazeToTheLeft.paused) { 
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play bumping sound
                const playAudio = () => {
                    audioBumping.currentTime = 0; 
                    audioBumping.play()
                        .then(() => console.log('Bumping sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }

        // Sound for animation: GazeToTheRight
        if (message === 'play-gazetotheright-sound' || message === '0') {
            if (audioGazeToTheRight) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) {
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioIntenseStare.paused) { 
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioSigh.paused) {
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioBumping.paused) { 
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheLeft.paused) { 
                    audioGazeToTheLeft.pause();
                    audioGazeToTheLeft.currentTime = 0;
                    console.log('GazeToTheLeft sound paused');
                }

                // Play gazeToTheRight sound
                const playAudio = () => {
                    audioGazeToTheRight.currentTime = 0; 
                    audioGazeToTheRight.play()
                        .then(() => console.log('GazeToTheRight sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }

        // Sound for animation: GazeToTheLeft
        if (message === 'play-gazetotheleft-sound' || message === 'ß') {
            if (audioGazeToTheLeft) {

                // Stop any other currently playing sound
                if (!audioIdle.paused) { 
                    audioIdle.pause();
                    audioIdle.currentTime = 0;
                    console.log('Idle sound paused');
                } else if (!audioPuppyEyes.paused) { 
                    audioPuppyEyes.pause();
                    audioPuppyEyes.currentTime = 0;
                    console.log('PuppyEyes sound paused');
                } else if (!audioIntenseStare.paused) { 
                    audioIntenseStare.pause();
                    audioIntenseStare.currentTime = 0;
                    console.log('IntenseStare sound paused');
                } else if (!audioHappy.paused) { 
                    audioHappy.pause();
                    audioHappy.currentTime = 0;
                    console.log('Happy sound paused');
                } else if (!audioPanting.paused) { 
                    audioPanting.pause();
                    audioPanting.currentTime = 0;
                    console.log('Panting sound paused');
                } else if (!audioSigh.paused) { 
                    audioSigh.pause();
                    audioSigh.currentTime = 0;
                    console.log('Sigh sound paused');
                } else if (!audioBarking.paused) { 
                    audioBarking.pause();
                    audioBarking.currentTime = 0;
                    console.log('Barking sound paused');
                } else if (!audioWoofing.paused) { 
                    audioWoofing.pause();
                    audioWoofing.currentTime = 0;
                    console.log('Woofing sound paused');
                } else if (!audioBumping.paused) { 
                    audioBumping.pause();
                    audioBumping.currentTime = 0;
                    console.log('Bumping sound paused');
                } else if (!audioGazeToTheRight.paused) { 
                    audioGazeToTheRight.pause();
                    audioGazeToTheRight.currentTime = 0;
                    console.log('GazeToTheRight sound paused');
                }

                // Play gazeToTheLeft sound
                const playAudio = () => {
                    audioGazeToTheLeft.currentTime = 0; 
                    audioGazeToTheLeft.play()
                        .then(() => console.log('GazeToTheLeft sound playing'))
                        .catch(err => console.error('Audio playback failed:', err));
                }; 
                playAudio(); 
            } else {
                console.error('Audio element not found');
            }
        }

        // Stop all audio 
        if (message === 'stop-all-audio' || message === 'i') {
            if (!audioIdle.paused) {
                audioIdle.pause();
                audioIdle.currentTime = 0;
                console.log('Idle sound paused');
            } else if (!audioPuppyEyes.paused) {
                audioPuppyEyes.pause();
                audioPuppyEyes.currentTime = 0;
                console.log('PuppyEyes sound paused');
            } else if (!audioIntenseStare.paused) {
                audioIntenseStare.pause();
                audioIntenseStare.currentTime = 0;
                console.log('IntenseStaring sound paused');
            } else if (!audioHappy.paused) {
                audioHappy.pause();
                audioHappy.currentTime = 0;
                console.log('Happy sound paused');
            } else if (!audioPanting.paused) {
                audioPanting.pause();
                audioPanting.currentTime = 0;
                console.log('Panting sound paused');
            } else if (!audioSigh.paused) {
                audioSigh.pause();
                audioSigh.currentTime = 0;
                console.log('Sigh sound paused');
            } else if (!audioBarking.paused) {
                audioBarking.pause();
                audioBarking.currentTime = 0;
                console.log('Barking sound paused');
            } else if (!audioWoofing.paused) {
                audioWoofing.pause();
                audioWoofing.currentTime = 0;
                console.log('Woofing sound paused');
            } else if (!audioBumping.paused) {
                audioBumping.pause();
                audioBumping.currentTime = 0;
                console.log('Bumping sound paused');
            } else if (!audioGazeToTheRight.paused) {
                audioGazeToTheRight.pause();
                audioGazeToTheRight.currentTime = 0;
                console.log('GazeToTheRight sound paused');
            } else if (!audioGazeToTheLeft.paused) {
                audioGazeToTheLeft.pause();
                audioGazeToTheLeft.currentTime = 0;
                console.log('GazeToTheLeft sound paused');
            }
        }
        
        const trigger = message;
        if (triggerMap[trigger] && currentInputs) {
            const triggerInput = currentInputs.find(input => input.name === triggerMap[trigger]);
            if (triggerInput) {
                triggerInput.fire();
            }
        }
    };
};

const init = async () => {
    try {
        const enterFullscreen = () => {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        };

        document.addEventListener('touchend', function onFirstTouch() {
            enterFullscreen();
            document.removeEventListener('touchend', onFirstTouch);
        }, false);

        const r = new rive.Rive({
            src: 'dog_animations.riv',
            canvas: canvas,
            autoplay: true,
            stateMachines: "State Machine",
            onLoad: () => {
                message.style.display = 'none';
                currentInputs = r.stateMachineInputs('State Machine');
                r.resizeDrawingSurfaceToCanvas();
                console.log('Rive animation loaded successfully');
            },
            onError: (err) => {
                message.textContent = 'Failed to load animation';
                console.error(err);
            }
        });

        // Audio-Initialisierung
        document.getElementById('audioInitButton').addEventListener('click', () => {
            const audio = document.getElementById('audioTest');
            // Stummen Sound abspielen um Audio zu initialisieren
            audio.volume = 0;
            audio.play().then(() => {
                audio.pause();
                audio.volume = 1;
                console.log('Audio initialized');
                // Button ausblenden nach Initialisierung
                document.getElementById('audioInitButton').style.display = 'none';
            }).catch(err => console.error('Audio init failed:', err));
        });
        
        // Replace existing WebSocket creation with reconnect function
        connectWebSocket();

        window.addEventListener('resize', () => {
            resizeCanvas();
            r.resizeDrawingSurfaceToCanvas();
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                resizeCanvas();
                r.resizeDrawingSurfaceToCanvas();
            }, 100);
        });

        window.addEventListener('unload', () => {
            stopAllAudio();
            r.cleanup();
        });

    } catch (error) {
        message.textContent = 'Animation system failed to initialize';
        console.error(error);
    }
};

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (triggerMap[key] && currentInputs) {
        const trigger = currentInputs.find(input => input.name === triggerMap[key]);
        if (trigger) {
            trigger.fire();
        }
        switch (key) {
            case '1': 
                ws.send('play-idle-sound'); 
                console.log('Key 1 pressed, sending play-idle-sound message');
                break;
            case '2':
                ws.send('play-puppyeyes-sound');
                console.log('Key 2 pressed, sending play-puppyeyes-sound message');
                break;
            case '3':
                ws.send('play-intensestare-sound');
                console.log('Key 3 pressed, sending play-intensestare-sound message');
                break;
            case '4':
                ws.send('play-happy-sound');
                console.log('Key 4 pressed, sending play-happy-sound message');
                break;
            case '5':
                ws.send('play-panting-sound');
                console.log('Key 5 pressed, sending play-panting-sound message');
                break;
            case '6':
                ws.send('play-sigh-sound');
                console.log('Key 6 pressed, sending play-sigh-sound message');
                break;
            case '7':
                ws.send('play-barking-sound');
                console.log('Key 7 pressed, sending play-barking-sound message');
                break;
            case '8':
                ws.send('play-woofing-sound');
                console.log('Key 8 pressed, sending play-woofing-sound message');
                break;
            case '9':
                ws.send('play-bumping-sound');
                console.log('Key 9 pressed, sending play-bumping-sound message');
                break;
            case '0':
                ws.send('play-gazetotheright-sound');
                console.log('Key 0 pressed, sending play-gazetotheright-sound message');
                break;
            case 'ß':
                ws.send('play-gazetotheleft-sound');
                console.log('Key ß pressed, sending play-gazetotheleft-sound message');
                break;
            case 'i': 
                ws.send('stop-all-audio'); 
                console.log('Key s pressed, sending stop-all-audio message');
                break; 
        }
    }
});

document.addEventListener('DOMContentLoaded', init);
document.querySelectorAll('audio').forEach(audio => {
    audio.volume = 1.0;
});