import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../lib/contexts';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '../../components/ui/primitives';
import { Sparkles, Loader2, Info } from 'lucide-react';

export default function LoginPage() {
    const { login, t } = useApp();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const success = await login(email, password);
        setLoading(false);
        if (success) {
            navigate('/dashboard');
        } else {
            setError(t('invalidCredentials'));
        }
    };

    const fillDemo = () => {
        setEmail('admin@demo.com');
        setPassword('123456');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-1">
                    <div className="flex justify-center mb-2">
                         <div className="w-10 h-10 bg-primary text-primary-foreground rounded flex items-center justify-center">
                             <Sparkles className="w-6 h-6" />
                         </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">{t('welcomeBack')}</CardTitle>
                    <p className="text-sm text-muted-foreground">Content Reborn MVP</p>
                </CardHeader>
                <CardContent>
                    <div 
                        className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded border border-blue-200 dark:border-blue-800 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={fillDemo}
                        title="Click to auto-fill"
                    >
                        <div className="flex items-center gap-2 font-bold mb-1">
                            <Info className="w-3 h-3" /> {t('demoCredentials')}
                        </div>
                        <div>Email: <span className="font-mono">admin@demo.com</span></div>
                        <div>Pass: <span className="font-mono">123456</span></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="name@example.com" 
                                required 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">{t('password')}</Label>
                                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                                    {t('forgotPassword')}
                                </Link>
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        
                        {error && <div className="text-xs text-destructive font-medium">{error}</div>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {t('login')}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        {t('noAccount')} <Link to="/register" className="text-primary hover:underline font-medium">{t('register')}</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}