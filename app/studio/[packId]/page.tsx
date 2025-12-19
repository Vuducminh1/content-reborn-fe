import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Save, Send, Sparkles, CheckCircle2, Copy, Download, History } from 'lucide-react';
import { store } from '../../../lib/store';
import { RebornPack, ContentItem, ToneType, FormatType } from '../../../lib/types';
import { Button, Textarea, Input, Label, Select, Badge, Card, CardContent, Checkbox, Tabs, TabsList, TabsTrigger, Switch, CardHeader, CardTitle } from '../../../components/ui/primitives';
import { useApp } from '../../../lib/contexts';
import { downloadFile, copyToClipboard } from '../../../lib/utils';

export default function StudioPage() {
  const { packId } = useParams();
  const { t } = useApp();
  
  // State
  const [pack, setPack] = useState<RebornPack | null>(null);
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assetsText, setAssetsText] = useState("");

  // Load Data
  useEffect(() => {
    if (packId) {
      const p = store.getPack(packId);
      if (p) {
        setPack(p);
        setAssetsText(p.assets.urls.join('\n'));
        const c = store.getContent(p.contentId);
        setContent(c);
      }
    }
    setLoading(false);
  }, [packId]);

  if (loading || !pack || !content) {
    return <div className="p-8 text-center">{t('loading')}</div>;
  }

  // Actions
  const handleSave = () => {
    store.updatePack(pack.id, {
        ...pack,
        assets: { urls: assetsText.split('\n').filter(s => s.trim() !== '') }
    });
    // Add version only if text changed? For MVP just add version manually via button
    alert(t('saved'));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
        const updated = store.generateDraft(pack.id, pack.formatType, pack.controls);
        setPack(updated);
        setIsGenerating(false);
    }, 800);
  };

  const handleSaveVersion = () => {
      const updated = store.addPackVersion(pack.id, pack.draftText);
      setPack(updated);
  };

  const handleStatusChange = (status: any) => {
      const updated = store.setPackStatus(pack.id, status);
      setPack(updated);
  };

  const handleChecklistChange = (key: keyof typeof pack.checklist) => {
      const updated = store.updatePack(pack.id, {
          checklist: { ...pack.checklist, [key]: !pack.checklist[key] }
      });
      setPack(updated);
  };

  const canApprove = Object.values(pack.checklist).every(Boolean) && pack.draftText.length > 0;
  const canExport = (pack.status === 'APPROVED' || canApprove) && pack.draftText.length > 0;

  // Helper to get Status label
  const getStatusLabel = (status: string) => {
      if (status === 'DRAFT') return t('drafts');
      if (status === 'IN_REVIEW') return t('inReview');
      if (status === 'APPROVED') return t('approved');
      if (status === 'PUBLISHED') return t('published');
      return status;
  }

  // Helper for risks
  const getRiskLabel = (risk: string) => {
      const key = `risk${risk.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`;
      const translation = t(key as any);
      return translation !== key ? translation : risk;
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b shrink-0">
        <div className="flex items-center gap-4">
            <Link to="/library">
                <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> {t('backToLib')}
                </Button>
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <div>
                <h1 className="font-bold text-lg truncate max-w-[400px]">{content.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                    <Badge variant={pack.status === 'APPROVED' ? 'default' : 'secondary'}>{getStatusLabel(pack.status)}</Badge>
                    <span className="text-xs text-muted-foreground">{pack.formatType}</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} className="gap-2">
                <Save className="w-4 h-4" /> {t('save')}
            </Button>
            {pack.status === 'DRAFT' && (
                <Button variant="outline" onClick={() => handleStatusChange('IN_REVIEW')} className="gap-2">
                    <Send className="w-4 h-4" /> {t('sendReview')}
                </Button>
            )}
            {pack.status === 'IN_REVIEW' && (
                <Button 
                    className="gap-2 bg-green-600 hover:bg-green-700 text-white" 
                    disabled={!canApprove}
                    onClick={() => handleStatusChange('APPROVED')}
                >
                    <CheckCircle2 className="w-4 h-4" /> {t('approve')}
                </Button>
            )}
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 pt-6 overflow-hidden min-h-0">
          
          {/* Left: Source */}
          <div className="col-span-3 flex flex-col gap-4 overflow-y-auto pr-2">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('source')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="text-sm">
                          <Label className="text-xs text-muted-foreground">{t('originalTitle')}</Label>
                          <div className="font-medium mt-1">{content.title}</div>
                      </div>
                      <div className="text-sm">
                          <Label className="text-xs text-muted-foreground">{t('excerpt')}</Label>
                          <div className="mt-1 p-2 bg-muted/50 rounded-md text-xs italic">{content.excerpt}</div>
                      </div>
                      <a href={content.url} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                          {t('openOriginal')} <ExternalLink className="w-3 h-3" />
                      </a>
                      
                      <div className="space-y-2 pt-2 border-t">
                         <Label className="text-xs">{t('complianceRisks')}</Label>
                         <div className="flex flex-wrap gap-1">
                             {content.risks.map(r => <Badge key={r} variant="destructive" className="text-[10px]">{getRiskLabel(r)}</Badge>)}
                             {content.risks.length === 0 && <span className="text-xs text-muted-foreground">{t('noRisks')}</span>}
                         </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t">
                          <Label className="text-xs">{t('assets')}</Label>
                          <Textarea 
                            className="text-xs font-mono h-32" 
                            placeholder="https://image-url.com..." 
                            value={assetsText}
                            onChange={e => setAssetsText(e.target.value)}
                          />
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Center: Workspace */}
          <div className="col-span-6 flex flex-col gap-4 min-h-0">
              {/* Controls */}
              <div className="bg-card border p-4 rounded-lg space-y-4 shrink-0 shadow-sm">
                  <Tabs defaultValue={pack.formatType} onValueChange={(v) => setPack({...pack, formatType: v as FormatType})}>
                      <TabsList className="w-full grid grid-cols-2">
                          <TabsTrigger value="SHORT_VIDEO">{t('shortVideo')}</TabsTrigger>
                          <TabsTrigger value="CAROUSEL">{t('carousel')}</TabsTrigger>
                      </TabsList>
                  </Tabs>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                          <Label className="text-xs">{t('tone')}</Label>
                          <Select 
                            value={pack.controls.tone} 
                            onChange={(e) => setPack({...pack, controls: {...pack.controls, tone: e.target.value as ToneType}})}
                          >
                              <option value="NEUTRAL">{t('toneNeutral')}</option>
                              <option value="GENZ">{t('toneGenZ')}</option>
                              <option value="ANALYTICAL">{t('toneAnalytical')}</option>
                          </Select>
                      </div>
                      <div className="space-y-1.5">
                          <Label className="text-xs">{t('audience')}</Label>
                          <Input 
                            value={pack.controls.audience} 
                            onChange={(e) => setPack({...pack, controls: {...pack.controls, audience: e.target.value}})}
                          />
                      </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                      {isGenerating ? <Sparkles className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                      {t('generateDraft')}
                  </Button>
              </div>

              {/* Editor */}
              <div className="flex-1 flex flex-col min-h-0 border rounded-lg bg-card shadow-sm overflow-hidden">
                   <div className="p-2 border-b bg-muted/20 flex justify-between items-center">
                       <span className="text-xs font-medium text-muted-foreground ml-2">{t('editor')}</span>
                       <div className="flex gap-2">
                           <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={handleSaveVersion}>
                               <History className="w-3 h-3 mr-1" /> {t('saveVersion')}
                           </Button>
                       </div>
                   </div>
                   <Textarea 
                      className="flex-1 resize-none border-0 rounded-none p-4 focus-visible:ring-0 text-base leading-relaxed font-mono"
                      value={pack.draftText}
                      onChange={(e) => setPack({...pack, draftText: e.target.value})}
                      placeholder={t('draftPlaceholder')}
                   />
              </div>
          </div>

          {/* Right: Compliance & Export */}
          <div className="col-span-3 flex flex-col gap-4 overflow-y-auto pl-2">
               {/* Checklist */}
               <Card>
                   <CardHeader>
                       <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('checklist')}</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                       <div className="flex items-center justify-between">
                           <Label className="text-sm">{t('factCheck')}</Label>
                           <Switch checked={pack.checklist.factCheck} onChange={() => handleChecklistChange('factCheck')} />
                       </div>
                       <div className="flex items-center justify-between">
                           <Label className="text-sm">{t('rights')}</Label>
                           <Switch checked={pack.checklist.rights} onChange={() => handleChecklistChange('rights')} />
                       </div>
                       <div className="flex items-center justify-between">
                           <Label className="text-sm">{t('sensitive')}</Label>
                           <Switch checked={pack.checklist.sensitive} onChange={() => handleChecklistChange('sensitive')} />
                       </div>
                       <div className="flex items-center justify-between pt-2 border-t">
                           <Label className="text-sm font-bold">{t('editorFinal')}</Label>
                           <Switch checked={pack.checklist.editorFinal} onChange={() => handleChecklistChange('editorFinal')} />
                       </div>
                   </CardContent>
               </Card>

               {/* Versions */}
               <Card className="flex-1 min-h-[200px] flex flex-col">
                   <CardHeader className="pb-2">
                       <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('versionHistory')}</CardTitle>
                   </CardHeader>
                   <CardContent className="flex-1 overflow-y-auto space-y-2">
                       {pack.versions.length === 0 && <p className="text-xs text-muted-foreground">{t('noVersions')}</p>}
                       {pack.versions.map((v, idx) => (
                           <div key={v.id} className="p-2 border rounded bg-muted/10 text-xs hover:bg-muted cursor-pointer group" onClick={() => setPack({...pack, draftText: v.text})}>
                               <div className="flex justify-between font-medium">
                                   <span>{v.note || `Version ${pack.versions.length - idx}`}</span>
                                   <span className="text-muted-foreground opacity-0 group-hover:opacity-100">{t('load')}</span>
                               </div>
                               <div className="text-[10px] text-muted-foreground mt-1">
                                   {new Date(v.createdAt).toLocaleTimeString()}
                               </div>
                           </div>
                       ))}
                   </CardContent>
               </Card>

               {/* Export */}
               <Card>
                   <CardHeader>
                       <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('export')}</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-2">
                       <Button variant="secondary" className="w-full justify-start" onClick={() => copyToClipboard(pack.draftText)}>
                           <Copy className="w-4 h-4 mr-2" /> {t('copyDraft')}
                       </Button>
                       <Button 
                            className="w-full justify-start" 
                            disabled={!canExport}
                            onClick={() => downloadFile(`pack-${pack.id}.json`, JSON.stringify(store.exportPack(pack.id), null, 2))}
                        >
                           <Download className="w-4 h-4 mr-2" /> {t('downloadJson')}
                       </Button>
                       {!canExport && <p className="text-[10px] text-destructive text-center mt-2">{t('finishChecklist')}</p>}
                   </CardContent>
               </Card>
          </div>
      </div>
    </div>
  );
}