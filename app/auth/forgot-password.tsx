import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../lib/contexts';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '../../components/ui/primitives';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const { t } = useApp();
    const [sent, setSent] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{t('resetPassword')}</CardTitle>
                </CardHeader>
                <CardContent>
                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('enterEmailReset')}</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="name@example.com" 
                                    required 
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                {t('sendLink')}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 py-4">
                            <div className="flex justify-center">
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t('resetSent')}
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center text-sm">
                        <Link to="/login" className="flex items-center justify-center gap-2 text-primary hover:underline font-medium">
                            <ArrowLeft className="w-3 h-3" /> {t('backToLogin')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}