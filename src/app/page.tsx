'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Download, Loader2, Code2, RefreshCw } from 'lucide-react';
import { generateAppCode } from '@/ai/flows/generate-app-code';
import { useToast } from '@/hooks/use-toast';

export default function NovaAppMakerPage() {
    const [description, setDescription] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
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

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-[minmax(400px,_1fr)_2fr] h-dvh bg-background text-foreground">
            <aside className="p-4 md:p-6 flex flex-col gap-6 overflow-y-auto border-r border-border h-full">
                <header className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                        <Code2 className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold font-headline">Nova App Maker</h1>
                </header>

                <Card className="flex flex-col shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Describe Your App</CardTitle>
                            <CardDescription>Enter a description of the application you want to build. Be as detailed as you like.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setDescription('')} aria-label="Clear prompt" className="shrink-0">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 flex">
                        <Textarea
                            placeholder="e.g., A simple to-do list app with a field to add tasks and a button to mark them as complete."
                            className="flex-1 resize-none font-code"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={10}
                        />
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleGenerate} disabled={isLoading || !description} className="w-full sm:w-auto flex-1 sm:flex-none">
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Generate App
                        </Button>
                        <Button onClick={handleDownload} variant="outline" disabled={!generatedCode || isLoading} className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Download Code
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            More features will be added here soon.
                        </p>
                    </CardContent>
                </Card>
            </aside>

            <main className="flex-1 flex items-center justify-center p-4 md:p-6 bg-muted/30 h-full overflow-hidden">
                <div className="relative w-full h-full rounded-xl bg-white shadow-inner border border-border overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground animate-in fade-in duration-500">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="text-lg font-semibold">Generating your masterpiece...</p>
                            <p className="text-sm">The AI is warming up. This may take a moment.</p>
                        </div>
                    ) : generatedCode ? (
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
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground p-8 animate-in fade-in duration-500">
                           <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center border-8 border-accent/20">
                             <Sparkles className="h-12 w-12 text-accent" />
                           </div>
                           <h2 className="text-2xl font-semibold">App Preview</h2>
                           <p className="max-w-md text-center text-sm">
                                Your generated app will appear here. Describe your vision on the left, click 'Generate App', and watch it come to life.
                           </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
