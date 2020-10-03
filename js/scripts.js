const audioElement = new Audio("singleclap.wav");

    const audioContext = new AudioContext();
    const audioSource = audioContext.createMediaElementSource(audioElement);

    const gainNode = audioContext.createGain();
    const gainNodeL = new GainNode(audioContext);
    const gainNodeR = new GainNode(audioContext);
    const delayNodeL = new DelayNode(audioContext);
    const delayNodeR = new DelayNode(audioContext);     

    const channelsCount = 2; 

    //will split mono into two one-channel copies and merge into one two-channel output
    const splitterNode = new ChannelSplitterNode(audioContext, { numberOfOutputs: channelsCount });
    const mergerNode = new ChannelMergerNode(audioContext, { numberOfInputs: channelsCount });
    
    //takes input from volume and delay sliders
    const volumeControl = document.querySelector('#volume');
    volumeControl.addEventListener('input', function() {
        gainNode.gain.value = this.value;
    }, false);
    const volumeControlL = document.querySelector('#Lvolume');
    volumeControlL.addEventListener('input', function() {
        gainNodeL.gain.value = this.value;
    }, false);
    const volumeControlR = document.querySelector('#Rvolume');
    volumeControlR.addEventListener('input', function() {
        gainNodeR.gain.value = this.value;
    }, false);
    const delayL = document.querySelector('#DelayL');
    delayL.addEventListener('input', function() {
        delayNodeL.delayTime.value = this.value;
    }, false);
        const delayR = document.querySelector('#DelayR');
    delayR.addEventListener('input', function() {
        delayNodeR.delayTime.value = this.value;
    }, false);

    audioSource.connect(gainNode).connect(splitterNode)

    splitterNode.connect(gainNodeL, 0); // connect OUTPUT channel 0
    splitterNode.connect(gainNodeR, 1); // connect OUTPUT channel 1

    gainNodeL.connect(delayNodeL);
    gainNodeR.connect(delayNodeR);
    delayNodeL.connect(mergerNode, 0, 0); // connect INPUT channel 0
    delayNodeR.connect(mergerNode, 0, 1); // connect INPUT channel 1

    mergerNode.connect(audioContext.destination);


    let isPlaying; // playpause button
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