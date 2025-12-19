import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../lib/contexts';
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle, Badge, Avatar } from '../../components/ui/primitives';
import { User, Shield, CheckCircle2, AlertCircle, Loader2, Key, Camera, X } from 'lucide-react';

export default function ProfilePage() {
    const { user, updateProfile, changePassword, t } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Profile State
    const [name, setName] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);

    // Password State
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passLoading, setPassLoading] = useState(false);
    const [passError, setPassError] = useState('');
    const [passSuccess, setPassSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setAvatarPreview(user.avatar);
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileSuccess(false);
        await updateProfile(name, avatarPreview);
        setProfileLoading(false);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
    };

    const resetPassForm = () => {
        setShowPasswordForm(false);
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setPassError('');
    }

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassError('');
        setPassSuccess(false);

        if (newPass !== confirmPass) {
            setPassError(t('passwordsDoNotMatch'));
            return;
        }

        if (newPass.length < 6) {
             setPassError("Password must be at least 6 characters");
             return;
        }

        setPassLoading(true);
        const success = await changePassword(currentPass, newPass);
        setPassLoading(false);

        if (success) {
            setPassSuccess(true);
            setTimeout(() => {
                setPassSuccess(false);
                resetPassForm();
            }, 2000);
        } else {
            setPassError(t('incorrectPassword'));
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6" /> {t('profile')}
            </h1>

            <Card className="overflow-hidden">
                {/* Header Gradient */}
                <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                
                <CardContent className="relative pt-0">
                    {/* Avatar Upload */}
                    <div className="absolute -top-12 left-6">
                        <div className="relative group">
                            <Avatar 
                                src={avatarPreview} 
                                fallback={name.substring(0,2).toUpperCase()} 
                                className="w-24 h-24 border-4 border-background text-2xl"
                            />
                            <div 
                                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {/* Basic Info Header */}
                    <div className="ml-32 pt-4 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">{name}</h2>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                        <Badge variant="secondary" className="mt-1">Editor</Badge>
                    </div>

                    <div className="mt-8 space-y-6">
                        {/* Profile Form */}
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('fullName')}</Label>
                                    <Input 
                                        id="name" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('email')}</Label>
                                    <Input id="email" value={user?.email || ''} disabled className="bg-muted opacity-70" />
                                    <p className="text-[10px] text-muted-foreground">{t('emailCannotChange')}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Button type="submit" disabled={profileLoading}>
                                    {profileLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                    {t('saveChanges')}
                                </Button>
                                {profileSuccess && (
                                    <span className="flex items-center gap-2 text-green-600 text-sm animate-in fade-in">
                                        <CheckCircle2 className="w-4 h-4" /> {t('saved')}
                                    </span>
                                )}
                            </div>
                        </form>

                        <hr />

                        {/* Security Section Toggle */}
                        <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                 <div>
                                     <h3 className="text-lg font-medium">{t('security')}</h3>
                                     <p className="text-sm text-muted-foreground">{t('managePassword')}</p>
                                 </div>
                                 {!showPasswordForm && (
                                     <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
                                         <Key className="w-4 h-4 mr-2" />
                                         {t('changePassword')}
                                     </Button>
                                 )}
                             </div>

                             {/* Collapsible Password Form */}
                             {showPasswordForm && (
                                 <div className="bg-muted/30 border rounded-lg p-4 animate-in slide-in-from-top-2 fade-in duration-300">
                                     <div className="flex justify-between items-center mb-4">
                                         <h4 className="font-medium text-sm flex items-center gap-2">
                                             <Shield className="w-4 h-4 text-primary" /> {t('setNewPassword')}
                                         </h4>
                                         <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={resetPassForm}>
                                             <X className="w-4 h-4" />
                                         </Button>
                                     </div>
                                     
                                     <form onSubmit={handleChangePassword} className="space-y-3">
                                         <div className="space-y-2">
                                            <Label htmlFor="currentPass" className="text-xs">{t('currentPassword')}</Label>
                                            <Input 
                                                id="currentPass" 
                                                type="password" 
                                                value={currentPass}
                                                onChange={(e) => setCurrentPass(e.target.value)}
                                                required
                                            />
                                         </div>
                                         <div className="grid grid-cols-2 gap-4">
                                             <div className="space-y-2">
                                                <Label htmlFor="newPass" className="text-xs">{t('newPassword')}</Label>
                                                <Input 
                                                    id="newPass" 
                                                    type="password" 
                                                    value={newPass}
                                                    onChange={(e) => setNewPass(e.target.value)}
                                                    required
                                                />
                                             </div>
                                             <div className="space-y-2">
                                                <Label htmlFor="confirmPass" className="text-xs">{t('confirmPassword')}</Label>
                                                <Input 
                                                    id="confirmPass" 
                                                    type="password" 
                                                    value={confirmPass}
                                                    onChange={(e) => setConfirmPass(e.target.value)}
                                                    required
                                                />
                                             </div>
                                         </div>

                                         {passError && (
                                            <div className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 p-2 rounded">
                                                <AlertCircle className="w-3 h-3" /> {passError}
                                            </div>
                                         )}
                                        
                                         {passSuccess && (
                                            <div className="flex items-center gap-2 text-green-600 text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded justify-center">
                                                <CheckCircle2 className="w-3 h-3" /> {t('passwordChanged')}
                                            </div>
                                         )}

                                         <div className="pt-2 flex justify-end gap-2">
                                             <Button type="button" variant="ghost" size="sm" onClick={resetPassForm}>{t('cancel')}</Button>
                                             <Button type="submit" size="sm" disabled={passLoading || passSuccess}>
                                                 {passLoading && <Loader2 className="w-3 h-3 animate-spin mr-2" />}
                                                 {t('updatePassword')}
                                             </Button>
                                         </div>
                                     </form>
                                 </div>
                             )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}