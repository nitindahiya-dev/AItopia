import { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Download, ArrowLeft, Play, Pause, User, Settings, Music2 } from 'lucide-react';
import Link from 'next/link';

const VoiceCraft = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [processedAudio, setProcessedAudio] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('default');
  const [pitch, setPitch] = useState(50);
  // Default speed neutral value = 50 for a 1.0 multiplier
  const [speed, setSpeed] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update pitch and speed when selected voice model changes
  useEffect(() => {
    switch (selectedVoice) {
      case 'professional':
        setPitch(55);
        setSpeed(50);
        break;
      case 'cartoon':
        setPitch(60);
        setSpeed(55);
        break;
      case 'celebrity':
        setPitch(45);
        setSpeed(50);
        break;
      case 'default':
      default:
        setPitch(50);
        setSpeed(50);
        break;
    }
  }, [selectedVoice]);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);

      const formData = new FormData();
      formData.append('audio', file);
      formData.append('pitch', pitch.toString());
      formData.append('speed', speed.toString());
      formData.append('voiceModel', selectedVoice); // if supported

      setIsProcessing(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/tools/voicecraft`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          const processedUrl = URL.createObjectURL(blob);
          setProcessedAudio(processedUrl);
          // Create audio element and assign to ref
          const audio = new Audio(processedUrl);
          audioRef.current = audio;
          audio.onended = () => setIsPlaying(false);
        } else {
          console.error('Error processing audio');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      setIsProcessing(false);
    }
  };

  // Attach event listeners to the audio element once processedAudio is set
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      // Cleanup listeners on unmount or when audioRef changes
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [processedAudio]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!processedAudio) return;
    const link = document.createElement('a');
    link.href = processedAudio;
    link.download = 'modified-audio.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler to reapply voice settings on the original audio file.
const handleApplySettings = async () => {

  if (!audioFile) {
    alert('Please upload audio first');
    return;
  }

  setIsProcessing(true);

  try {

    const formData = new FormData();

    formData.append(
      'audio',
      audioFile
    );

    formData.append(
      'pitch',
      String(pitch)
    );

    formData.append(
      'speed',
      String(speed)
    );

    formData.append(
      'voiceModel',
      selectedVoice
    );

    console.log(
      'Applying settings:',
      {
        selectedVoice,
        pitch,
        speed
      }
    );

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tools/voicecraft`,
        {
          method:'POST',
          body:formData
        }
      );

    if (!response.ok) {

      throw new Error(
        'Voice processing failed'
      );

    }

    const blob =
      await response.blob();

    if (processedAudio) {
      URL.revokeObjectURL(
        processedAudio
      );
    }

    const processedUrl =
      URL.createObjectURL(
        blob
      );

    setProcessedAudio(
      processedUrl
    );

    if (
      audioRef.current
    ) {

      audioRef.current.pause();

    }

    const newAudio =
      new Audio(
        processedUrl
      );

    newAudio.onended =
      ()=>setIsPlaying(false);

    audioRef.current =
      newAudio;

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

  }

  catch(error){

    console.error(
      error
    );

    alert(
      'Failed to apply settings'
    );

  }

  finally{

    setIsProcessing(false);

  }

};

  return (
    <div className="min-h-screen bg-custom-black">
      {/* Navigation */}
      <Link href="/tools" className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back to Tools
      </Link>

      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <Volume2 className="w-12 h-12 text-orange" />
            <h1 className="uppercase font-loos-wide text-4xl md:text-6xl font-bold text-orange">
              VoiceCraft AI
            </h1>
          </div>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Transform voices with real-time cloning and advanced modulation capabilities
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Input & Settings Section */}
          <div className="space-y-8">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-white/20 rounded-3xl p-8 text-center hover:border-orange transition-all group">
                  <div className="space-y-6">
                    <Mic className="w-16 h-16 mx-auto text-orange" />
                    <div className="space-y-2">
                      <h3 className="font-loos-wide text-2xl text-white">
                        {audioFile ? 'Audio Ready' : 'Upload Audio'}
                      </h3>
                      <p className="font-aeroport text-white/80">
                        {audioFile ? 'Click to change file' : 'MP3 or WAV (max 25MB)'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </div>
              </label>
            </div>

            {/* Voice Settings */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <h2 className="font-loos-wide text-2xl text-orange">Voice Settings</h2>
              <div className="space-y-4">
                <label className="font-aeroport text-white/80">
                  Voice Model
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mt-2 focus:outline-none focus:border-orange"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  >
                    <option
                      className="bg-orange-100 text-black"
                      value="default"
                    >
                      Default Voice
                    </option>
                    <option
                      className="bg-orange-100 text-black"
                      value="professional"
                    >
                      Professional
                    </option>
                    <option
                      className="bg-orange-100 text-black"
                      value="cartoon"
                    >
                      Cartoon Character
                    </option>
                    <option
                      className="bg-orange-100 text-black"
                      value="celebrity"
                    >
                      Celebrity Voice
                    </option>
                  </select>
                </label>
                <label className="font-aeroport text-white/80">
                  Pitch Control
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pitch}
                      onChange={(e) => setPitch(Number(e.target.value))}
                      className="w-full range-orange"
                    />
                    <span className="font-loos-wide">{pitch}%</span>
                  </div>
                </label>
                <label className="font-aeroport text-white/80">
                  Speed Control
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full range-orange"
                    />
                    <span className="font-loos-wide">{speed}%</span>
                  </div>
                </label>
              </div>
              <button
                onClick={handleApplySettings}
                className="w-full bg-orange text-black font-loos-wide py-4 rounded-xl hover:bg-orange/80 transition-all flex items-center justify-center gap-3 mt-4"
              >
                <Settings className="w-5 h-5" />
                Apply Settings
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <Settings className="w-16 h-16 animate-spin text-orange" />
                <p className="font-loos-wide text-2xl text-white">Crafting Your Voice...</p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange h-2 rounded-full animate-progress" />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {processedAudio ? (
                  <>
                    <div className="aspect-square bg-white/5 rounded-2xl flex flex-col items-center justify-center">
                      <button
                        onClick={handlePlayPause}
                        className="p-6 bg-orange/20 rounded-full text-orange hover:bg-orange/30 transition-all"
                      >
                        {isPlaying ? <Pause className="w-12 h-12" /> : <Play className="w-12 h-12" />}
                      </button>
                      {/* Audio scrubber */}
                      <div className="w-full mt-4">
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          value={currentTime}
                          onChange={handleScrub}
                          className="w-full"
                        />
                        <div className="text-white text-sm mt-1">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="w-full bg-orange text-black font-loos-wide py-4 rounded-xl hover:bg-orange/80 transition-all flex items-center justify-center gap-3"
                    >
                      <Download className="w-5 h-5" />
                      Download Modified Audio
                    </button>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/40">
                    <p className="font-aeroport">Processed audio will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Demo Voices */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="font-loos-wide text-3xl text-orange">Sample Voices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <VoiceDemo
              title="Professional"
              description="Formal business presentation voice"
              icon={<User className="w-8 h-8" />}
            />
            <VoiceDemo
              title="Cartoon"
              description="Fun animated character voice"
              icon={<Music2 className="w-8 h-8" />}
            />
            <VoiceDemo
              title="Celebrity"
              description="Popular celebrity voice clone"
              icon={<Volume2 className="w-8 h-8" />}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const VoiceDemo = ({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-orange/20 rounded-lg text-orange">{icon}</div>
      <div>
        <h3 className="font-loos-wide text-xl text-white">{title}</h3>
        <p className="font-aeroport text-white/80">{description}</p>
      </div>
    </div>
    <button className="w-full mt-4 flex items-center justify-center gap-2 text-orange hover:text-orange/80 transition-colors">
      <Play className="w-4 h-4" />
      Play Sample
    </button>
  </div>
);

export default VoiceCraft;
