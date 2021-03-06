// query track selection from user input
const trackSelection = document.getElementById("trackSelection");
trackSelection.addEventListener("change", function () {
    audioElement.pause(); // pause audio if track changed
    isPlaying = false;
    spatialDemo(this.value); // run audio spatialization function on selected track
});

// declare variables
let isPlaying;
let audioElement;
let audioContext;

spatialDemo(trackSelection.value);

// audio spatialization function
function spatialDemo(track) {
    audioElement = new Audio(track);

    audioContext = new AudioContext();
    const audioSource = audioContext.createMediaElementSource(audioElement);

    // declare nodes to be used
    const panNode = new StereoPannerNode(audioContext);
    const gainNodeL = new GainNode(audioContext);
    const gainNodeR = new GainNode(audioContext);
    const delayNodeL = new DelayNode(audioContext);
    const delayNodeR = new DelayNode(audioContext);
    const splitterNode = new ChannelSplitterNode(audioContext, { numberOfOutputs: 2 });
    const mergerNode = new ChannelMergerNode(audioContext, { numberOfInputs: 2 });

    //query user selected gain and delay
    const panControl = document.querySelector('#gainPan');
    panControl.addEventListener('input', function () {
        panNode.pan.value = this.value;
        panValue = this.value;
        if (panValue <= 0) {
            gainValueR.innerHTML = String(100 + Math.round(panValue * 100)) + "%";
            gainValueL.innerHTML = "100%"
        }
        if (panValue > 0) {
            gainValueR.innerHTML = "100%"
            gainValueL.innerHTML = String(100 - Math.round(panValue * 100)) + "%";
        }
    }, false)
    delayNodeL.delayTime.value = 0.001
    const delayL = document.querySelector('#DelayL');
    delayL.addEventListener('input', function () {
        delayNodeL.delayTime.value = this.value;
        if (this.value <= 0.001) {
            delayValueL.innerHTML = "0 ms"
            delayValueR.innerHTML = String((1 - (this.value * 1000)).toFixed(2)) + " ms"
        }
        if (this.value > 0.001) {
            delayValueR.innerHTML = "0 ms"
            delayValueL.innerHTML = String(((this.value * 1000) - 1).toFixed(2)) + " ms"
        }
    }, false);
    delayNodeR.delayTime.value = 0.001

    audioSource.connect(panNode, 0).connect(splitterNode); //take only channel 0 if source is stereo to make mono
    splitterNode.connect(delayNodeL, 0); // connect splitter output channel 0
    splitterNode.connect(delayNodeR, 1);

    // gainNodeL.connect(delayNodeL);
    // gainNodeR.connect(delayNodeR);
    delayNodeL.connect(mergerNode, 0, 0); // connect L to output channel 0
    delayNodeR.connect(mergerNode, 0, 1); // connect R to output channel 1

    mergerNode.connect(audioContext.destination);
}

// play/pause button function
function playPause() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    isPlaying = !isPlaying;
    if (isPlaying) {
        audioElement.play();
    } else {
        audioElement.pause();
    }
}