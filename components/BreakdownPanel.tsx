import React from 'react';
import { X, ExternalLink, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ContentItem } from '../lib/types';
import { Button, Badge } from './ui/primitives';
import { formatDate } from '../lib/utils';
import { useApp } from '../lib/contexts';

interface BreakdownPanelProps {
  content: ContentItem | null;
  onClose: () => void;
  onReborn: (id: string) => void;
}

export default function BreakdownPanel({ content, onClose, onReborn }: BreakdownPanelProps) {
  const { t } = useApp();

  if (!content) return null;

  // Helper to translate risks
  const getRiskLabel = (risk: string) => {
      const key = `risk${risk.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`;
      const translation = t(key as any);
      return translation !== key ? translation : risk;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-card">
           <div>
             <h2 className="text-lg font-semibold">{t('breakdownTitle')}</h2>
             <p className="text-sm text-muted-foreground">{t('analysisForResurfacing')}</p>
           </div>
           <Button variant="ghost" size="icon" onClick={onClose}>
             <X className="w-5 h-5" />
           </Button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {/* Header Info */}
           <div className="space-y-3">
             <div className="flex gap-2">
                <Badge variant="secondary">
                     {t(`cat${content.category}` as any) !== `cat${content.category}` ? t(`cat${content.category}` as any) : content.category}
                </Badge>
                <span className="text-xs text-muted-foreground self-center">
                  Published {formatDate(content.publishedAt)}
                </span>
             </div>
             <h1 className="text-xl font-bold leading-tight">{content.title}</h1>
             <a href={content.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
               {t('source')} <ExternalLink className="w-3 h-3" />
             </a>
           </div>

           {/* Score Card */}
           <div className="bg-secondary/30 p-4 rounded-lg flex items-center gap-4 border">
              <div className={`
                 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0
                 ${content.resurfaceScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'}
              `}>
                {content.resurfaceScore}
              </div>
              <div>
                <div className="font-semibold text-foreground">{t('resurfaceScore')}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t('calcBasedOn')}</div>
              </div>
           </div>

           {/* Reasons */}
           <div>
             <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
               <Sparkles className="w-4 h-4 text-purple-500" /> {t('whyReborn')}
             </h3>
             <ul className="space-y-2">
               {content.reasons.map((reason, i) => (
                 <li key={i} className="flex gap-2 text-sm text-foreground bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/50 p-2.5 rounded-md">
                   <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                   {reason}
                 </li>
               ))}
             </ul>
           </div>

           {/* Excerpt */}
           <div>
              <h3 className="text-sm font-semibold mb-2">{t('excerpt')}</h3>
              <p className="text-sm text-muted-foreground italic border-l-2 pl-3 py-1">
                "{content.excerpt}"
              </p>
           </div>

           {/* Risks */}
           <div>
             <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
               <AlertTriangle className="w-4 h-4 text-destructive" /> {t('complianceRisks')}
             </h3>
             {content.risks.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {content.risks.map(risk => (
                   <Badge key={risk} variant="destructive">
                     {getRiskLabel(risk)}
                   </Badge>
                 ))}
               </div>
             ) : (
               <div className="text-sm text-muted-foreground flex items-center gap-2 p-2 border rounded-md border-dashed">
                 <CheckCircle2 className="w-4 h-4 text-green-500" /> {t('noRisks')}
               </div>
             )}
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-muted/10">
          <Button 
            className="w-full gap-2 text-base h-11" 
            size="lg"
            onClick={() => onReborn(content.id)}
          >
            <Sparkles className="w-4 h-4" />
            {t('rebornWithThis')}
          </Button>
        </div>
      </div>
    </>
  );
}