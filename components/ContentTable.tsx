import React from 'react';
import { ContentItem } from '../lib/types';
import { Badge, Button } from './ui/primitives';
import { calculateAgeInDays } from '../lib/utils';
import { Eye, TrendingUp, AlertCircle } from 'lucide-react';
import { useApp } from '../lib/contexts';

interface ContentTableProps {
  data: ContentItem[];
  onSelect: (item: ContentItem) => void;
}

export default function ContentTable({ data, onSelect }: ContentTableProps) {
  const { t } = useApp();

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
        <p>{t('searchPlaceholder')}</p>
      </div>
    );
  }

  // Helper to translate risks
  const getRiskLabel = (risk: string) => {
      const key = `risk${risk.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`;
      const translation = t(key as any);
      return translation !== key ? translation : risk;
  };

  return (
    <table className="w-full text-sm text-left">
      <thead className="text-xs font-semibold text-muted-foreground uppercase bg-muted/40 sticky top-0 z-10 backdrop-blur border-b">
        <tr>
          <th className="px-6 py-4 w-[100px] tracking-wider">{t('score')}</th>
          <th className="px-6 py-4 tracking-wider">{t('titleSummary')}</th>
          <th className="px-6 py-4 w-[140px] tracking-wider">{t('category')}</th>
          <th className="px-6 py-4 w-[100px] tracking-wider">{t('age')}</th>
          <th className="px-6 py-4 w-[180px] tracking-wider">{t('risk')}</th>
          <th className="px-6 py-4 text-right w-[80px] tracking-wider">{t('action')}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/60">
        {data.map((item) => (
          <tr 
            key={item.id} 
            className="bg-card hover:bg-muted/40 cursor-pointer transition-all duration-200 group"
            onClick={() => onSelect(item)}
          >
            <td className="px-6 py-4">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ring-4 ring-opacity-20 transition-transform group-hover:scale-110
                ${item.resurfaceScore >= 80 
                    ? 'bg-emerald-100 text-emerald-700 ring-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-300' 
                    : item.resurfaceScore >= 50 
                        ? 'bg-amber-100 text-amber-700 ring-amber-500 dark:bg-amber-900/40 dark:text-amber-300' 
                        : 'bg-zinc-100 text-zinc-700 ring-zinc-500 dark:bg-zinc-800 dark:text-zinc-300'}
              `}>
                {item.resurfaceScore}
              </div>
            </td>
            <td className="px-6 py-4 max-w-md">
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors truncate text-base" title={item.title}>
                {item.title}
              </div>
              <div className="text-xs text-muted-foreground truncate mt-1.5 leading-relaxed opacity-80">
                {item.excerpt}
              </div>
            </td>
            <td className="px-6 py-4">
              <Badge variant="secondary" className="font-normal text-muted-foreground bg-muted/50">
                  {t(`cat${item.category}` as any) !== `cat${item.category}` ? t(`cat${item.category}` as any) : item.category}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-muted-foreground font-mono text-xs">
               {calculateAgeInDays(item.publishedAt)}d
            </td>
            <td className="px-6 py-4">
               <div className="flex gap-1.5 flex-wrap">
                 {item.risks.length > 0 ? (
                   item.risks.map(r => (
                     <Badge key={r} variant="destructive" className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide">
                       {getRiskLabel(r)}
                     </Badge>
                   ))
                 ) : (
                   <span className="flex items-center gap-1 text-xs text-green-600/70 dark:text-green-400/70">
                       <CheckCircle2 className="w-3 h-3" /> Safe
                   </span>
                 )}
               </div>
            </td>
            <td className="px-6 py-4 text-right">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Eye className="w-4 h-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Added this icon import locally to avoid modifying imports at top just for one icon in fallback
function CheckCircle2(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
        </svg>
    )
}