import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../lib/contexts';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from '../../components/ui/primitives';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const { register, t } = useApp();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError(t('passwordsDoNotMatch'));
            return;
        }

        setLoading(true);
        const success = await register(email, password);
        setLoading(false);
        if (success) {
            navigate('/dashboard');
        } else {
            setError(t('emailTaken'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{t('createAccount')}</CardTitle>
                </CardHeader>
                <CardContent>
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
                            <Label htmlFor="password">{t('password')}</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">{t('confirmPassword')}</Label>
                            <Input 
                                id="confirm" 
                                type="password" 
                                required 
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                            />
                        </div>
                        
                        {error && <div className="text-xs text-destructive font-medium">{error}</div>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {t('register')}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        {t('haveAccount')} <Link to="/login" className="text-primary hover:underline font-medium">{t('login')}</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}