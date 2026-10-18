'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Sparkles,
    Download,
    Loader2,
    Code2,
    RefreshCw,
    Wand2,
    Eye,
    Copy,
    Check,
    ExternalLink,
    Zap,
    Terminal,
    Layers,
    Palette
} from 'lucide-react';
import { generateAppCode } from '@/ai/flows/generate-app-code';
import { improveAppCode } from '@/ai/flows/improve-app-code';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const STARTER_PROMPTS = [
    {
        title: '📋 Kanban Task Board',
        desc: 'Interactive Kanban board with To-Do, In Progress, Done columns, drag & drop feel, task priority badges, and localStorage saving.',
    },
    {
        title: '📊 Expense & Budget Tracker',
        desc: 'Modern financial tracker with balance overview cards, expense category pills, quick transaction form, and interactive summary charts.',
    },
    {
        title: '⏳ Pomodoro Focus Studio',
        desc: 'Sleek dark-mode Pomodoro timer with 25/5/15 minute modes, animated radial countdown, ambient sound toggles, and completed session streak counter.',
    },
    {
        title: '🛒 Mini E-Commerce Store',
        desc: 'Vibrant storefront with product cards, category filters, real-time search, cart slide-over drawer, and checkout confirmation modal.',
    },
];

const CODECRAFT_STEPS = [
    'CodeCraft is analyzing your prompt and planning architecture...',
    'CodeCraft is crafting the UI with modern Tailwind & Lucide icons...',
    'CodeCraft is writing JavaScript state management and event handlers...',
    'CodeCraft is polishing animations, responsive layouts & persistence...',
    'Finalizing standalone app and assembling preview...',
];

export default function NovaAppMakerPage() {
    const [description, setDescription] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStepIndex, setLoadingStepIndex] = useState(0);
    const [previewKey, setPreviewKey] = useState(0);
    const [mode, setMode] = useState<'generate' | 'improve'>('generate');
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
    const [copied, setCopied] = useState(false);
    const language = 'English';
    const { toast } = useToast();

    // Cycle through CodeCraft loading steps
    useEffect(() => {
        if (!isLoading) {
            setLoadingStepIndex(0);
            return;
        }
        const interval = setInterval(() => {
            setLoadingStepIndex((prev) => (prev + 1) % CODECRAFT_STEPS.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleGenerate = useCallback(async () => {
        if (!description.trim()) {
            toast({
                title: 'Description is empty',
                description: 'Please describe the application you want CodeCraft to build.',
                variant: 'destructive',
            });
            return;
        }
        setIsLoading(true);
        setGeneratedCode('');
        try {
            const result = await generateAppCode({ appDescription: description, language });
            setGeneratedCode(result.appCode);
            setPreviewKey((prev) => prev + 1);
            setViewMode('preview');
            toast({
                title: '⚡ CodeCraft built your app!',
                description: 'Your application is live in the preview window.',
            });
        } catch (error) {
            console.error('Error generating app code:', error);
            const errorMsg = error instanceof Error ? error.message : '';
            toast({
                title: 'Error Generating App',
                description: errorMsg || 'An unexpected error occurred. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [description, language, toast]);

    const handleImprove = useCallback(async () => {
        if (!description.trim()) {
            toast({
                title: 'Instructions are empty',
                description: 'Please describe the improvements or features you want CodeCraft to add.',
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
            const result = await improveAppCode({ appDescription: description, currentCode: generatedCode, language });
            setGeneratedCode(result.improvedCode);
            setPreviewKey((prev) => prev + 1);
            setViewMode('preview');
            toast({
                title: '✨ CodeCraft upgraded your app!',
                description: 'Your changes have been applied to the live preview.',
            });
        } catch (error) {
            console.error('Error improving app code:', error);
            toast({
                title: 'Error Improving App',
                description: error instanceof Error ? error.message : 'An unexpected error occurred.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [description, generatedCode, language, toast]);

    const handleCopyCode = useCallback(() => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        toast({
            title: 'Code Copied!',
            description: 'Standalone HTML code copied to your clipboard.',
        });
        setTimeout(() => setCopied(false), 2000);
    }, [generatedCode, toast]);

    const handleOpenNewTab = useCallback(() => {
        if (!generatedCode) return;
        const blob = new Blob([generatedCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }, [generatedCode]);

    const handleDownload = useCallback(() => {
        try {
            if (!generatedCode) return;
            const blob = new Blob([generatedCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'codecraft-app.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading app file:', error);
            toast({
                title: 'Download failed',
                description: 'Failed to download the generated file.',
                variant: 'destructive',
            });
        }
    }, [generatedCode, toast]);

    const handleRefreshPreview = useCallback(() => {
        setPreviewKey((prev) => prev + 1);
    }, []);

    const handleModeChange = (newMode: string) => {
        setMode(newMode as 'generate' | 'improve');
        setDescription('');
    };

    const handleToggleView = useCallback(() => {
        setViewMode((prev) => {
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
    const buttonText = mode === 'generate' ? 'Ask CodeCraft to Build' : 'Ask CodeCraft to Improve';
    const buttonIcon = mode === 'generate' ? <Sparkles className="mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />;
    const cardTitle = mode === 'generate' ? 'Describe Your App' : 'Describe Improvements';
    const cardDescriptionText =
        mode === 'generate'
            ? 'Tell CodeCraft what you want to create. Full UI, state logic & styling will be synthesized.'
            : 'Explain what features, colors, or logic CodeCraft should add or refine.';
    const placeholderText =
        mode === 'generate'
            ? 'e.g., A sleek crypto portfolio dashboard with dark mode, live simulated price fluctuations, watch list with search filter, and interactive profit/loss charts.'
            : 'e.g., Change theme to dark cyberpunk neon, add export to CSV button, and add sound effects when completing a task.';

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-[minmax(420px,_1fr)_2fr] h-dvh bg-background text-foreground">
            {/* Sidebar */}
            <aside className="p-4 md:p-6 flex flex-col gap-5 overflow-y-auto border-r border-border h-full bg-card/40">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden shadow-md ring-1 ring-border shrink-0 bg-neutral-900 flex items-center justify-center">
                            <img
                                src="/logo.jpg"
                                alt="CodeCraft Logo"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                }}
                            />
                            <Terminal className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight font-headline">CodeCraft</h1>
                                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center gap-1">
                                    <Zap className="h-2.5 w-2.5 fill-primary" /> By Suku
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">A Suku Company Product • Autonomous AI</p>
                        </div>
                    </div>
                </header>

                <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="generate">Generate New</TabsTrigger>
                        <TabsTrigger value="improve" disabled={!generatedCode}>
                            Iterate / Improve
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                <Card className="flex flex-col shadow-sm flex-1 border-border/60">
                    <CardHeader className="pb-3">
                        <div className="flex flex-row items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-base flex items-center gap-2">
                                    {cardTitle}
                                </CardTitle>
                                <CardDescription className="text-xs">{cardDescriptionText}</CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDescription('')}
                                aria-label="Clear prompt"
                                className="shrink-0 h-8 w-8"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col gap-3">
                        <Textarea
                            placeholder={placeholderText}
                            className="flex-1 resize-none font-code text-sm leading-relaxed p-3 focus-visible:ring-primary"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={8}
                        />

                        {/* Starter Prompt Chips */}
                        {mode === 'generate' && !description && (
                            <div className="space-y-2 pt-1">
                                <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                                    <Sparkles className="h-3 w-3 text-primary" /> Quick Architecture Starters
                                </p>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {STARTER_PROMPTS.map((prompt, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setDescription(prompt.desc)}
                                            className="text-left p-2 rounded-lg text-xs bg-muted/60 hover:bg-muted text-foreground/90 hover:text-foreground border border-border/50 transition-all hover:scale-[1.01]"
                                        >
                                            <span className="font-semibold block">{prompt.title}</span>
                                            <span className="text-[11px] text-muted-foreground line-clamp-1">{prompt.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="pt-2">
                        <Button
                            onClick={currentHandler}
                            disabled={isLoading || !description.trim()}
                            className="w-full font-semibold shadow-md transition-all"
                            size="lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> CodeCraft is Coding...
                                </>
                            ) : (
                                <>
                                    {buttonIcon}
                                    {buttonText}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </aside>

            {/* Main Preview Area */}
            <main className="flex-1 flex flex-col bg-muted/20 h-full overflow-hidden">
                <div className="p-4 md:p-6 flex flex-col h-full">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold tracking-tight">
                                {viewMode === 'preview' ? 'Live Interactive Preview' : 'Generated Code'}
                            </h2>
                            {generatedCode && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                                    Ready
                                </span>
                            )}
                        </div>

                        {generatedCode && (
                            <div className="flex items-center gap-1.5">
                                {mode === 'generate' && (
                                    <Button
                                        onClick={handleGenerate}
                                        variant="outline"
                                        size="sm"
                                        disabled={isLoading || !description}
                                        className="h-8 text-xs"
                                    >
                                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                                        Regenerate
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyCode}
                                    className="h-8 text-xs"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Code
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleOpenNewTab}
                                    className="h-8 text-xs"
                                    title="Open app in a full new browser tab"
                                >
                                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Fullscreen
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={isLoading}
                                    onClick={handleToggleView}
                                    className="h-8 text-xs"
                                >
                                    {viewMode === 'preview' ? (
                                        <>
                                            <Code2 className="mr-1.5 h-3.5 w-3.5" /> View Code
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="mr-1.5 h-3.5 w-3.5" /> View Preview
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleDownload}
                                    variant="outline"
                                    size="sm"
                                    disabled={!generatedCode || isLoading}
                                    className="h-8 text-xs"
                                >
                                    <Download className="mr-1.5 h-3.5 w-3.5" />
                                    Download .html
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Window Container */}
                    <div className="relative w-full flex-1 rounded-xl shadow-lg border border-border overflow-hidden bg-background">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-5 text-muted-foreground p-8 animate-in fade-in duration-300">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute w-20 h-20 rounded-full bg-primary/20 animate-ping" />
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-lg">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                </div>
                                <div className="text-center space-y-1.5 max-w-sm">
                                    <p className="text-base font-semibold text-foreground">CodeCraft is coding your app...</p>
                                    <p className="text-xs text-primary font-medium transition-all duration-300">
                                        {CODECRAFT_STEPS[loadingStepIndex]}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground pt-2">
                                        Crafting Tailwind CSS, Lucide icons & full interactive JS logic.
                                    </p>
                                </div>
                            </div>
                        ) : !generatedCode ? (
                            <div className="flex flex-col items-center justify-center h-full gap-5 text-muted-foreground p-8 animate-in fade-in duration-500">
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-xl ring-2 ring-primary/30 bg-neutral-900 flex items-center justify-center">
                                    <Zap className="h-10 w-10 text-primary animate-pulse" />
                                </div>
                                <div className="text-center space-y-2 max-w-md">
                                    <h2 className="text-2xl font-bold text-foreground">CodeCraft AI Studio</h2>
                                    <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider">
                                        A Suku Company Product • Trained from Zero
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                                        Type any application idea or choose a starter on the left. CodeCraft writes 100% complete HTML, CSS, and interactive JavaScript without placeholders.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground pt-2">
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border">
                                        <Palette className="h-3 w-3 text-primary" /> Tailwind CSS
                                    </span>
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border">
                                        <Sparkles className="h-3 w-3 text-primary" /> Lucide Icons
                                    </span>
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border">
                                        <Layers className="h-3 w-3 text-primary" /> LocalStorage State
                                    </span>
                                </div>
                            </div>
                        ) : viewMode === 'preview' ? (
                            <>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={handleRefreshPreview}
                                    className="absolute top-3 right-3 z-10 shadow-md h-8 w-8 bg-background/80 backdrop-blur border border-border hover:bg-background"
                                    aria-label="Refresh preview"
                                    title="Reload preview"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                                <iframe
                                    srcDoc={generatedCode}
                                    title="App Preview"
                                    className="w-full h-full border-0 animate-in fade-in duration-300 bg-white"
                                    sandbox="allow-scripts allow-same-origin allow-modals allow-popups"
                                    key={previewKey}
                                />
                            </>
                        ) : (
                            <ScrollArea className="h-full w-full bg-neutral-950 rounded-xl">
                                <pre className="p-5 font-code text-xs text-emerald-400/90 leading-relaxed overflow-x-auto">
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
