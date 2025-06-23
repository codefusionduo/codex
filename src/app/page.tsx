'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Download, Loader2, Code2, RefreshCw, Wand2, Eye } from 'lucide-react';
import { generateAppCode } from '@/ai/flows/generate-app-code';
import { improveAppCode } from '@/ai/flows/improve-app-code';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NovaAppMakerPage() {
    const [description, setDescription] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const [mode, setMode] = useState<'generate' | 'improve'>('generate');
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
    const { toast } = useToast();

    const handleGenerate = useCallback(async () => {
        if (!description.trim()) {
            toast({
                title: 'Description is empty',
                description: 'Please describe the app you want to build.',
                variant: 'destructive',
            });
            return;
        }
        setIsLoading(true);
        setGeneratedCode(''); // Clear previous preview
        try {
            const result = await generateAppCode({ appDescription: description });
            setGeneratedCode(result.appCode);
            setPreviewKey(prev => prev + 1);
            setViewMode('preview');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error Generating App',
                description: 'An unexpected error occurred. Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [description, toast]);

    const handleImprove = useCallback(async () => {
        if (!description.trim()) {
            toast({
                title: 'Instructions are empty',
                description: 'Please describe the improvements you want to make.',
                variant: 'destructive',
            });
            return;
        }
        if (!generatedCode) {
            toast({
                title: 'No code to improve',
                description: 'Please generate an app first before trying to improve it.',
                variant: 'destructive',
            });
            return;
        }
        setIsLoading(true);
        try {
            const result = await improveAppCode({ appDescription: description, currentCode: generatedCode });
            setGeneratedCode(result.improvedCode);
            setPreviewKey(prev => prev + 1);
            setViewMode('preview');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error Improving App',
                description: 'An unexpected error occurred. Please try again later.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [description, generatedCode, toast]);

    const handleDownload = useCallback(() => {
        if (!generatedCode) return;
        const blob = new Blob([generatedCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nova-app.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [generatedCode]);
    
    const handleRefreshPreview = useCallback(() => {
        setPreviewKey(prev => prev + 1);
    }, []);

    const handleModeChange = (newMode: string) => {
        setMode(newMode as 'generate' | 'improve');
        setDescription('');
    }

    const handleToggleView = useCallback(() => {
        setViewMode(prev => {
            const newViewMode = prev === 'preview' ? 'code' : 'preview';
            if (newViewMode === 'code') {
                setMode('improve');
            } else {
                setMode('generate');
            }
            return newViewMode;
        });
    }, []);

    const currentHandler = mode === 'generate' ? handleGenerate : handleImprove;
    const buttonText = mode === 'generate' ? 'Generate App' : 'Improve App';
    const buttonIcon = mode === 'generate' ? <Sparkles className="mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />;
    const cardTitle = mode === 'generate' ? 'Describe Your App' : 'Describe Your Improvements';
    const cardDescriptionText = mode === 'generate' ? 'Enter a description of the application you want to build. Be as detailed as you like.' : 'Describe the changes you want to make to the current app.';
    const placeholderText = mode === 'generate' 
        ? "e.g., A simple to-do list app with a field to add tasks and a button to mark them as complete."
        : "e.g., Change the background color to dark blue and add a title.";

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-[minmax(400px,_1fr)_2fr] h-dvh bg-background text-foreground">
            <aside className="p-4 md:p-6 flex flex-col gap-6 overflow-y-auto border-r border-border h-full">
                <header className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                        <Code2 className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold font-headline">Nova App Maker</h1>
                </header>

                <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="generate">Generate</TabsTrigger>
                        <TabsTrigger value="improve" disabled={!generatedCode}>Improve</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Card className="flex flex-col shadow-sm flex-1">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>{cardTitle}</CardTitle>
                            <CardDescription>{cardDescriptionText}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setDescription('')} aria-label="Clear prompt" className="shrink-0">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 flex">
                        <Textarea
                            placeholder={placeholderText}
                            className="flex-1 resize-none font-code"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={10}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={currentHandler} disabled={isLoading || !description} className="w-full">
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                buttonIcon
                            )}
                            {buttonText}
                        </Button>
                    </CardFooter>
                </Card>
            </aside>

            <main className="flex-1 flex flex-col bg-muted/30 h-full overflow-hidden">
                <div className="p-4 md:p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            {viewMode === 'preview' ? 'App Preview' : 'Code View'}
                        </h2>
                        {generatedCode && (
                            <div className="flex items-center gap-2">
                                {mode === 'generate' && (
                                     <Button onClick={handleGenerate} variant="outline" size="sm" disabled={isLoading || !description}>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Regenerate
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoading}
                                    onClick={handleToggleView}
                                >
                                    {viewMode === 'preview' ? (
                                        <><Code2 className="mr-2 h-4 w-4" /> View Code</>
                                    ) : (
                                        <><Eye className="mr-2 h-4 w-4" /> View Preview</>
                                    )}
                                </Button>
                                <Button onClick={handleDownload} variant="outline" size="sm" disabled={!generatedCode || isLoading}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="relative w-full flex-1 rounded-xl shadow-inner border border-border overflow-hidden bg-transparent">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground animate-in fade-in duration-500">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                <p className="text-lg font-semibold">Working on it...</p>
                                <p className="text-sm">The AI is thinking. This may take a moment.</p>
                            </div>
                        ) : !generatedCode ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground p-8 animate-in fade-in duration-500">
                               <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center border-8 border-accent/20">
                                 <Sparkles className="h-12 w-12 text-accent" />
                               </div>
                               <h2 className="text-2xl font-semibold">App Preview</h2>
                               <p className="max-w-md text-center text-sm">
                                    Your generated app will appear here. Describe your vision, click 'Generate App', and watch it come to life.
                               </p>
                            </div>
                        ) : viewMode === 'preview' ? (
                            <>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={handleRefreshPreview} 
                                    className="absolute top-2 right-2 z-10"
                                    aria-label="Refresh preview"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <iframe
                                    srcDoc={generatedCode}
                                    title="App Preview"
                                    className="w-full h-full border-0 animate-in fade-in duration-500"
                                    sandbox="allow-scripts allow-same-origin"
                                    key={previewKey}
                                />
                            </>
                        ) : (
                            <ScrollArea className="h-full w-full bg-background rounded-xl">
                                <pre className="p-4 font-code text-sm text-foreground">
                                    <code>{generatedCode}</code>
                                </pre>
                            </ScrollArea>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
