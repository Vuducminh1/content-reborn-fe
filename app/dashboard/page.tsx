import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Package, CheckSquare, Clock, TrendingUp, TrendingDown, ArrowUpRight, Sparkles, MoreHorizontal, Plus } from 'lucide-react';
import { store } from '../../lib/store';
import { ContentItem, RebornPack } from '../../lib/types';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/primitives';
import { useApp } from '../../lib/contexts';
import { formatDate } from '../../lib/utils';

// --- Mini Chart Component (Sparkline) ---
const Sparkline = ({ color = "text-primary" }: { color?: string }) => (
  <svg className={`w-full h-12 ${color}`} viewBox="0 0 100 24" fill="none" preserveAspectRatio="none">
    <path
      d="M0 20 C 10 20, 15 10, 25 15 C 35 20, 40 5, 50 10 C 60 15, 65 5, 75 8 C 85 11, 90 2, 100 0"
      vectorEffect="non-scaling-stroke"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      className="opacity-50"
    />
    <path
      d="M0 20 C 10 20, 15 10, 25 15 C 35 20, 40 5, 50 10 C 60 15, 65 5, 75 8 C 85 11, 90 2, 100 0 V 24 H 0 Z"
      fill="currentColor"
      className="opacity-10"
    />
  </svg>
);

export default function DashboardPage() {
  const { t, user } = useApp();
  const [topContents, setTopContents] = useState<ContentItem[]>([]);
  const [packs, setPacks] = useState<RebornPack[]>([]);
  const [stats, setStats] = useState({ totalContent: 0, drafts: 0, approved: 0 });

  useEffect(() => {
    const allContents = store.listContents();
    setTopContents(allContents.slice(0, 5)); 

    const allPacks = store.listPacks();
    setPacks(allPacks);

    setStats({
      totalContent: allContents.length,
      drafts: allPacks.filter(p => p.status === 'DRAFT').length,
      approved: allPacks.filter(p => p.status === 'APPROVED').length
    });
  }, []);

  const greetings = () => {
      const hour = new Date().getHours();
      if(hour < 12) return "Good morning";
      if(hour < 18) return "Good afternoon";
      return "Good evening";
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                {greetings()}, {user?.name.split(' ')[0]} 
                <span className="text-2xl">👋</span>
              </h1>
              <p className="text-muted-foreground mt-1 text-base">Here's what's happening with your content pipeline today.</p>
          </div>
          <div className="flex items-center gap-3">
              <Button variant="outline" className="h-10 border-dashed border-border/80">
                  <FileText className="w-4 h-4 mr-2 text-muted-foreground" /> 
                  Import Content
              </Button>
              <Button className="h-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
              </Button>
          </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Metric 1 */}
        <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('totalContents')}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                 <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
                 <div className="text-3xl font-bold">{stats.totalContent}</div>
                 <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
                 </div>
            </div>
            <div className="mt-4 -mx-6 -mb-6">
                <Sparkline color="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('activePacks')}</CardTitle>
             <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                 <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
             <div className="flex items-baseline gap-2">
                 <div className="text-3xl font-bold">{stats.drafts}</div>
                 <span className="text-xs text-muted-foreground">in progress</span>
            </div>
            <div className="mt-4 -mx-6 -mb-6">
                <Sparkline color="text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="relative overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('readyToPublish')}</CardTitle>
            <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                 <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
             <div className="flex items-baseline gap-2">
                 <div className="text-3xl font-bold">{stats.approved}</div>
                 <div className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-full">
                    Needs action
                 </div>
            </div>
            <div className="mt-4 -mx-6 -mb-6">
                <Sparkline color="text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-7 h-[600px]">
        
        {/* Left Col: High Potential */}
        <Card className="md:col-span-4 h-full border-border/60 shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5 py-4">
             <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {t('topOpportunities')}
                </CardTitle>
             </div>
             <Link to="/library">
                <Button variant="ghost" size="sm" className="text-xs h-7">View Library</Button>
             </Link>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
               {topContents.map((item, i) => (
                 <div key={item.id} className="group flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/40 transition-colors cursor-pointer relative">
                    {/* Hover indicator strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex gap-4 items-center overflow-hidden flex-1">
                       <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border
                            ${i === 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-background border-border text-muted-foreground'}
                       `}>
                         #{i+1}
                       </div>
                       <div className="min-w-0 flex-1">
                         <div className="font-semibold truncate text-foreground/90 group-hover:text-primary transition-colors">{item.title}</div>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="uppercase tracking-wider font-medium text-[10px]">{item.category}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                            <span>{formatDate(item.publishedAt)}</span>
                         </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 pl-4">
                        <div className="flex flex-col items-end min-w-[60px]">
                             {/* Score Gauge Simulation */}
                             <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-12 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${item.resurfaceScore}%` }} />
                                </div>
                                <span className="text-xs font-bold">{item.resurfaceScore}</span>
                             </div>
                             <span className="text-[10px] text-muted-foreground mt-0.5">Potential</span>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    </div>
                 </div>
               ))}
          </CardContent>
        </Card>

        {/* Right Col: Work Queue */}
        <Card className="md:col-span-3 h-full border-border/60 shadow-sm flex flex-col bg-muted/5">
          <CardHeader className="py-4 border-b bg-background">
            <CardTitle>{t('workQueue')}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <Tabs defaultValue="DRAFT" className="h-full flex flex-col">
              <TabsList className="w-full grid grid-cols-3 mb-4 bg-background border shadow-sm h-10 p-1">
                <TabsTrigger value="DRAFT" className="text-xs">{t('drafts')}</TabsTrigger>
                <TabsTrigger value="IN_REVIEW" className="text-xs">{t('inReview')}</TabsTrigger>
                <TabsTrigger value="APPROVED" className="text-xs">{t('approved')}</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto pr-1 -mr-2">
              {["DRAFT", "IN_REVIEW", "APPROVED"].map(status => {
                const statusPacks = packs.filter(p => p.status === status);
                return (
                  <TabsContent key={status} value={status} className="mt-0 space-y-3">
                    {statusPacks.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm border-2 border-dashed border-border/60 rounded-xl bg-background/50">
                           <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                <Package className="w-5 h-5 opacity-40" />
                           </div>
                           <p>{t('noPacksStatus')}</p>
                           {status === 'DRAFT' && <Button variant="link" className="text-xs text-primary mt-1">Create one from Library</Button>}
                       </div>
                    ) : (
                       <>
                         {statusPacks.map(pack => {
                           const content = store.getContent(pack.contentId);
                           return (
                             <Link key={pack.id} to={`/studio/${pack.id}`}>
                               <div className="group p-4 rounded-xl border border-border bg-background shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                                  <div className="flex justify-between items-start mb-3">
                                     <Badge variant="outline" className="text-[10px] font-medium bg-secondary/50 border-secondary-foreground/10 text-secondary-foreground">
                                         {pack.formatType.replace('_', ' ')}
                                     </Badge>
                                     <Button size="icon" variant="ghost" className="h-6 w-6 -mr-2 -mt-2 opacity-0 group-hover:opacity-100">
                                         <MoreHorizontal className="w-4 h-4" />
                                     </Button>
                                  </div>
                                  
                                  <h4 className="font-semibold text-sm line-clamp-2 mb-3 leading-snug group-hover:text-primary transition-colors">
                                    {content?.title || t('unknownContent')}
                                  </h4>
                                  
                                  <div className="flex items-center justify-between pt-3 border-t border-border/40">
                                      <div className="flex -space-x-2">
                                          {/* Mock avatars */}
                                          <div className="w-6 h-6 rounded-full border-2 border-background bg-indigo-500 text-[8px] text-white flex items-center justify-center font-bold">
                                              {pack.assignee.charAt(0)}
                                          </div>
                                      </div>
                                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium bg-muted/50 px-2 py-0.5 rounded-md">
                                       <Clock className="w-3 h-3" /> {formatDate(pack.updatedAt)}
                                     </span>
                                  </div>
                               </div>
                             </Link>
                           );
                         })}
                       </>
                    )}
                  </TabsContent>
                );
              })}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}