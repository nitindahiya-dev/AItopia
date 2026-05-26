import { useState, useRef, } from 'react';
import { Video, Languages, Captions, Download, ArrowLeft, Settings, Clock } from 'lucide-react';
import Link from 'next/link';

const LingoSync = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetLanguage,] = useState('en'); // default English; user can change
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (
      !e.target.files ||
      !e.target.files[0]
    ) return;

    const file =
      e.target.files[0];

    setVideoFile(file);
    setIsProcessing(true);

    try {

      /* STEP 1 */

      const videoFormData =
        new FormData();

      videoFormData.append(
        'video',
        file
      );

      const uploadRes =
        await fetch(

          `${process.env.NEXT_PUBLIC_API_BASE_URL}/tools/upload`,

          {
            method: 'POST',
            body: videoFormData
          }

        );

      const uploadData =
        await uploadRes.json();

      console.log(
        'Upload response:',
        uploadData
      );

      if (
        !uploadRes.ok
      ) {

        throw new Error(
          uploadData.error ||
          'Upload failed'
        );

      }

      /* STEP 2 */

      const audioURL =
        `http://localhost:5000/${uploadData.audioPath}`;

      console.log(
        'Fetching audio:',
        audioURL
      );

      const audioResponse =
        await fetch(audioURL);

      if (
        !audioResponse.ok
      ) {

        throw new Error(
          'Could not fetch extracted audio'
        );

      }

      const audioBlob =
        await audioResponse.blob();

      const audioFormData =
        new FormData();

      audioFormData.append(
        'audio',
        audioBlob,
        'extracted.wav'
      );

      /* STEP 3 */

      const asrRes =
        await fetch(

          `${process.env.NEXT_PUBLIC_API_BASE_URL}/tools/asr`,

          {
            method: 'POST',
            body: audioFormData
          }

        );

      const asrData =
        await asrRes.json();

      console.log(
        'ASR response:',
        asrData
      );

      if (
        !asrRes.ok
      ) {

        throw new Error(

          typeof asrData.error === 'string'

            ? asrData.error

            : JSON.stringify(
              asrData.error,
              null,
              2
            )

        );

      }

      if (
        !asrData.text
      ) {

        throw new Error(
          'No transcript returned'
        );

      }

      let transcript =
        asrData.text;

      /* STEP 4 */

      if (
        targetLanguage !== 'en'
      ) {

        const translationRes =
          await fetch(

            `${process.env.NEXT_PUBLIC_API_BASE_URL}/tools/translate`,

            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body: JSON.stringify({
                text: transcript,
                targetLanguage
              })
            }
          );

        const translationData =
          await translationRes.json();

        transcript =
          translationData
            .translatedText ||
          transcript;

      }

      setSubtitles(
        transcript
      );

    }
    catch (error) {

      console.error(
        'Video processing error:',
        error
      );

      if (
        error instanceof Error
      ) {

        setSubtitles(

          `ERROR:

${error.message}

Check backend logs.`

        );

      }

    }
    finally {

      setIsProcessing(false);

    }

  };

  const handleDownloadSRT = () => {
    const blob = new Blob([subtitles], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitles.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-custom-black">
      <main className="px-4 sm:px-0 sm:w-[90vw] md:w-[80vw] xl:w-[70vw] mx-auto py-20 space-y-16">
        {/* Navigation */}
        <Link href="/tools" className="flex items-center gap-2 text-orange hover:text-orange/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Tools
        </Link>

        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4">
            <Languages className="w-12 h-12 text-orange" />
            <h1 className="uppercase font-loos-wide text-4xl md:text-6xl font-bold text-orange">
              LingoSync Pro
            </h1>
          </div>
          <p className="font-aeroport text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            AI-powered multilingual subtitle generation with real-time translation and styling
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            <div className="backdrop-blur-lg h-full bg-white/5 border border-white/10 rounded-3xl p-8">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed h-full flex items-center justify-center border-white/20 rounded-3xl p-8 text-center hover:border-orange transition-all group">
                  <div className="space-y-6">
                    <Video className="w-16 h-16 mx-auto text-orange" />
                    <div className="space-y-2">
                      <h3 className="font-loos-wide text-2xl text-white">
                        {videoFile ? 'Video Ready' : 'Upload Video'}
                      </h3>
                      <p className="font-aeroport text-white/80">
                        {videoFile ? 'Click to change file' : 'MP4, MOV, AVI (max 500MB)'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Output Section */}
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <Settings className="w-16 h-16 animate-spin text-orange" />
                <p className="font-loos-wide text-2xl text-white">Processing Video...</p>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-orange h-2 rounded-full animate-progress" />
                </div>
              </div>
            ) : (
              <>
                <div className="aspect-video bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative">
                  <h3 className="font-loos-wide text-xl text-orange m-5">Video Preview</h3>
                  {videoFile && (
                    <video
                      ref={videoRef}
                      src={URL.createObjectURL(videoFile)}
                      className="w-full h-full object-contain"
                      controls
                    />
                  )}
                  {/* Subtitle Overlay: displays current subtitle in sync with video */}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-loos-wide text-xl text-orange">Generated Subtitles</h3>
                    <button
                      onClick={handleDownloadSRT}
                      className="text-orange hover:text-orange/80 flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download SRT
                    </button>
                  </div>
                  <textarea
                    value={subtitles}
                    onChange={(e) => setSubtitles(e.target.value)}
                    className="w-full h-64 bg-white/5 border border-white/10 rounded-xl p-6 text-white/80 font-mono text-sm focus:outline-none focus:border-orange resize-none"
                    placeholder="Subtitles will appear here..."
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="font-loos-wide text-3xl text-orange">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureStep
              icon={<Languages className="w-8 h-8" />}
              title="30+ Languages"
              description="Support for major global languages and dialects"
            />
            <FeatureStep
              icon={<Captions className="w-8 h-8" />}
              title="Smart Timing"
              description="Automatic speech detection and time syncing"
            />
            <FeatureStep
              icon={<Clock className="w-8 h-8" />}
              title="Real-time Preview"
              description="Instant preview with style adjustments"
            />
          </div>
        </div>
      </main>
    </div>
  );
};



const FeatureStep = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-orange/20 rounded-lg text-orange">{icon}</div>
      <div>
        <h3 className="font-loos-wide text-xl text-white">{title}</h3>
        <p className="font-aeroport text-white/80">{description}</p>
      </div>
    </div>
  </div>
);

export default LingoSync;
