
'use client';

import { useState, useRef } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translateAndSpeak } from '@/ai/flows/translate-and-speak';
import { Loader2, Mic, MicOff, Languages, Volume2, Square, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Status = 'idle' | 'recording' | 'transcribing' | 'translating' | 'speaking' | 'error';

const languages = [
    { code: "en-US", name: "English" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "pt-BR", name: "Portuguese" },
    { code: "ru-RU", name: "Russian" },
    { code: "zh-CN", name: "Chinese (Mandarin)" },
    { code: "hi-IN", name: "Hindi" },
];

export default function TranslatorPage() {
    const [status, setStatus] = useState<Status>('idle');
    const [targetLanguage, setTargetLanguage] = useState<string>('Spanish');
    const [transcribedText, setTranscribedText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [audioDataUri, setAudioDataUri] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { toast } = useToast();

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                setStatus('transcribing');
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                
                // For simplicity, we are using browser's SpeechRecognition API for transcription
                // A more robust solution might use a dedicated Speech-to-Text API
                if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
                    handleError({message: 'Speech recognition is not supported in this browser.'}, 'Browser Not Supported');
                    return;
                }

                const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                recognition.lang = 'en-US'; // Assuming input is English for now
                recognition.interimResults = false;
                
                // This is a simplified way to get the text. We're not actually sending the blob.
                // In a real app, you'd send the audioBlob to a speech-to-text service.
                // For this prototype, we'll just re-prompt the user to speak into the recognizer.
                
                recognition.onresult = async (event) => {
                    const speechToText = event.results[0][0].transcript;
                    setTranscribedText(speechToText);
                    setStatus('translating');
                    try {
                        const result = await translateAndSpeak({ text: speechToText, targetLanguage });
                        setTranslatedText(result.translatedText);
                        setAudioDataUri(result.audioDataUri);
                        setStatus('speaking');
                    } catch (error) {
                        handleError(error, 'Translation/TTS Failed');
                    }
                };

                recognition.onerror = (event: any) => {
                     handleError(event, 'Speech recognition failed');
                };
                
                recognition.start();

                 // This part is a little bit of a hack for the prototype since we can't directly process the blob
                 // without a server-side STT API call. We are starting a new recognition process.
                 toast({ title: "Processing audio...", description: "Please wait while we transcribe your speech." });

            };

            mediaRecorderRef.current.start();
            setStatus('recording');
        } catch (error) {
            handleError(error, 'Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && status === 'recording') {
            mediaRecorderRef.current.stop();
        }
    };
    
    const handleError = (error: any, title: string) => {
        console.error(title, error);
        let description = 'An unknown error occurred. Please try again.';
        
        // Check for specific SpeechRecognition errors
        if (error && error.error) {
            if (error.error === 'no-speech') {
                title = 'No Speech Detected';
                description = 'I didn\'t hear anything. Please make sure your microphone is working and try speaking again.';
            } else if (error.error === 'not-allowed' || error.name === 'NotAllowedError') {
                title = 'Microphone Access Denied';
                description = 'Please allow microphone access in your browser settings to use the translator.';
            }
        } else if (error && error.message) {
            description = error.message;
        }


        toast({
            title: title,
            description: description,
            variant: 'destructive',
        });
        setStatus('error');
        // Reset to idle after a delay
        setTimeout(() => setStatus('idle'), 4000);
    }

    const getStatusInfo = () => {
        switch (status) {
            case 'recording': return { text: 'Recording your voice...', icon: <Mic className="animate-pulse text-red-500"/> };
            case 'transcribing': return { text: 'Transcribing speech to text...', icon: <Loader2 className="animate-spin" /> };
            case 'translating': return { text: `Translating to ${targetLanguage}...`, icon: <Loader2 className="animate-spin" /> };
            case 'speaking': return { text: 'Translation complete! Ready to play.', icon: <Volume2 /> };
            case 'error': return { text: 'An error occurred. Please try again.', icon: <Bot className="text-destructive"/> };
            default: return { text: 'Ready to translate your voice.', icon: <Mic /> };
        }
    }
    
    const statusInfo = getStatusInfo();

    return (
        <div className="flex flex-col min-h-screen bg-background font-body">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <Card className="shadow-lg border-border/80 rounded-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-4 text-3xl font-headline font-bold text-foreground">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Languages className="h-7 w-7 text-primary" />
                                </div>
                                Live Voice Translator
                            </CardTitle>
                            <CardDescription className="text-lg pt-1">
                                Speak naturally and get instant audio translations. Break down language barriers on your travels.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div className="space-y-2">
                                     <h3 className="font-semibold text-lg text-foreground">Translate to:</h3>
                                     <Select onValueChange={setTargetLanguage} defaultValue={targetLanguage}>
                                        <SelectTrigger className="w-full h-12 text-base">
                                            <SelectValue placeholder="Select a language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map(lang => (
                                                <SelectItem key={lang.code} value={lang.name} className="text-base">
                                                    {lang.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-center h-full">
                                    {status === 'recording' ? (
                                        <Button onClick={stopRecording} variant="destructive" size="lg" className="w-full h-16 text-xl gap-4">
                                            <Square /> Stop Recording
                                        </Button>
                                    ) : (
                                        <Button onClick={startRecording} size="lg" className="w-full h-16 text-xl gap-4" disabled={status !== 'idle' && status !== 'error' && status !== 'speaking'}>
                                            <Mic /> Start Recording
                                        </Button>
                                    )}
                                </div>
                            </div>
                            
                            <Alert className={status === 'idle' ? 'bg-muted/50' : 'bg-primary/5 border-primary/20'}>
                                <AlertTitle className="flex items-center gap-3 text-lg font-headline">
                                    {statusInfo.icon} Status
                                </AlertTitle>
                                <AlertDescription className="text-base pt-1">
                                    {statusInfo.text}
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-muted/30">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-headline">Your Speech</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground min-h-[60px]">{transcribedText || "..."}</p>
                                    </CardContent>
                                </Card>
                               <Card className="bg-muted/30">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-headline">Translated Speech</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground min-h-[60px]">{translatedText || "..."}</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {status === 'speaking' && audioDataUri && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg text-foreground">Listen to Translation:</h3>
                                     <audio ref={audioRef} src={audioDataUri} controls autoPlay className="w-full" />
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </main>
            <footer className="text-center p-8 text-muted-foreground">
                <p>Powered by WanderGenie</p>
            </footer>
        </div>
    );
}

// Add this to your global types or a declarations file if you have one
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

    