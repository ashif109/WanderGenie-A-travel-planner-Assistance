'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Trash2, File, Loader2 } from 'lucide-react';
import Header from '@/components/header';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; 
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    // This is a mock upload process.
    // In a real app, you would upload to a service like Firebase Storage.
    setTimeout(() => {
      const newDocuments: Document[] = Array.from(files).map(file => ({
        id: new Date().toISOString() + file.name,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      }));

      setDocuments(prevDocs => [...prevDocs, ...newDocuments]);
      setIsUploading(false);
    }, 1500);
  };

  const handleDelete = (docId: string) => {
    setDocuments(docs => docs.filter(doc => doc.id !== docId));
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
       <Header />
       <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-border/80 rounded-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-4 text-3xl font-headline font-bold text-foreground">
                        <div className="p-2 bg-primary/10 rounded-lg">
                           <FileText className="h-7 w-7 text-primary"/>
                        </div>
                        My Travel Documents
                    </CardTitle>
                    <CardDescription className="text-lg pt-1">
                        Keep your passport, tickets, and reservations safe in one place.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-6">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center justify-center">
                                <Upload className="h-12 w-12 text-muted-foreground mb-4"/>
                                <h3 className="text-xl font-semibold mb-2">Click to upload or drag and drop</h3>
                                <p className="text-muted-foreground">Supports PDF, PNG, JPG</p>
                            </div>
                            <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileUpload} disabled={isUploading}/>
                        </label>
                        {isUploading && (
                          <div className="flex items-center justify-center mt-4 text-primary">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Uploading...</span>
                          </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-2xl font-headline font-semibold">Uploaded Files</h3>
                        {documents.length > 0 ? (
                            <ul className="space-y-3">
                                {documents.map(doc => (
                                    <li key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border transition-all hover:shadow-md hover:bg-muted">
                                        <div className="flex items-center gap-4">
                                            <File className="h-8 w-8 text-primary"/>
                                            <div>
                                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{doc.name}</a>
                                                <p className="text-sm text-muted-foreground">{formatBytes(doc.size)} &bull; {doc.type}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)} aria-label="Delete document">
                                            <Trash2 className="h-5 w-5 text-destructive/70 hover:text-destructive"/>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                              <p>You haven't uploaded any documents yet.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
       </main>
       <footer className="text-center p-8 text-muted-foreground">
        <p>Powered by WanderGenie</p>
      </footer>
    </div>
  )
}
