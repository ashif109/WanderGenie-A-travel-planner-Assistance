
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { chat, ChatOutput } from '@/ai/flows/chat';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: data.message };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const result: ChatOutput = await chat({ message: data.message });
      const assistantMessage: Message = { role: 'assistant', content: result.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error with chat flow:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      // remove the user message if the call fails
       setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-border/80 rounded-xl h-[70vh] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-4 text-3xl font-headline font-bold text-foreground">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bot className="h-7 w-7 text-primary" />
                </div>
                Chat with WanderGenie
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden p-6">
                <ScrollArea className="flex-grow h-full pr-4 -mr-4">
                    <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'assistant' && (
                                <Avatar className="border-2 border-primary/20">
                                    <AvatarFallback className="bg-primary/10"><Bot className="text-primary"/></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`rounded-xl p-4 max-w-md shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                                <p className="text-base">{msg.content}</p>
                            </div>
                             {msg.role === 'user' && (
                                <Avatar>
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                     {isLoading && (
                         <div className="flex items-start gap-4">
                            <Avatar className="border-2 border-primary/20">
                                <AvatarFallback className="bg-primary/10"><Bot className="text-primary"/></AvatarFallback>
                            </Avatar>
                             <div className="rounded-xl p-4 max-w-md bg-muted rounded-bl-none shadow-sm flex items-center space-x-2">
                                <span className="h-2.5 w-2.5 bg-primary/50 rounded-full animate-pulse delay-0" />
                                <span className="h-2.5 w-2.5 bg-primary/50 rounded-full animate-pulse delay-200" />
                                <span className="h-2.5 w-2.5 bg-primary/50 rounded-full animate-pulse delay-400" />
                             </div>
                        </div>
                     )}
                    </div>
              </ScrollArea>
              <div className="mt-auto pt-4 border-t">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder="Ask me about your travel plans..." {...field} autoComplete="off" className="h-12 text-lg rounded-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} size="icon" className="h-12 w-12 flex-shrink-0 rounded-full">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                    </Button>
                  </form>
                </Form>
              </div>
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
