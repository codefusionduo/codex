'use client';

import { useState } from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Code2, Send } from 'lucide-react';

export function DrawingView({ onCancel }: { onCancel: () => void }) {
  const [instructions, setInstructions] = useState('');

  const handleSendDrawing = () => {
    // Placeholder for future AI integration
    alert('This feature is not yet connected to the AI.');
  };

  return (
    <div className="w-full h-dvh flex flex-col bg-muted/30">
      <header className="flex shrink-0 items-center justify-between p-2 md:p-3 border-b bg-background shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Code2 className="h-6 w-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-headline">Nova App Maker</h1>
        </div>
        <Button onClick={onCancel}>Cancel</Button>
      </header>
      <main className="flex-1 relative">
        <Tldraw>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10">
                <Card className="p-3 flex items-center gap-2 shadow-lg">
                    <Input 
                        placeholder="Additional instructions (optional)" 
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                    <Button onClick={handleSendDrawing}>
                        Send Drawing
                        <Send className="ml-2 h-4 w-4" />
                    </Button>
                </Card>
            </div>
        </Tldraw>
      </main>
    </div>
  );
}
