import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { store } from '../../lib/store';
import { ContentItem, ContentFilterParams } from '../../lib/types';
import { Input, Select } from '../../components/ui/primitives';
import ContentTable from '../../components/ContentTable';
import BreakdownPanel from '../../components/BreakdownPanel';
import { useApp } from '../../lib/contexts';

export default function LibraryPage() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [filters, setFilters] = useState<ContentFilterParams>({
    searchText: '',
    category: 'All',
    risk: 'All'
  });
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  // Load data
  useEffect(() => {
    const data = store.listContents(filters);
    setContents(data);
  }, [filters]); 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchText: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };
  
  const handleRiskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, risk: e.target.value as any }));
  };

  const handleReborn = (id: string) => {
    const pack = store.createPackFromContent(id);
    navigate(`/studio/${pack.id}`);
  };

  const categories = ["Economy", "Society", "Tech", "Sports", "Health", "Lifestyle", "Business", "Science", "Culture"];
  const risks = ["outdated", "sensitive", "rights", "fact_check"];

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card p-4 rounded-lg border shadow-sm shrink-0">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('searchPlaceholder')}
            className="pl-9"
            value={filters.searchText}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('category')}:</span>
            <Select 
              value={filters.category}
              onChange={handleCategoryChange}
              className="w-40"
            >
              <option value="All">{t('allCategories')}</option>
              {categories.map(c => (
                // Use i18n key like 'catEconomy', fallback to 'c' if not found
                <option key={c} value={c}>
                    {t(`cat${c}` as any) !== `cat${c}` ? t(`cat${c}` as any) : c}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('risk')}:</span>
             <Select 
              value={filters.risk}
              onChange={handleRiskChange}
              className="w-32"
            >
              <option value="All">{t('allRisks')}</option>
              {risks.map(r => (
                  <option key={r} value={r}>
                       {t(`risk${r.charAt(0).toUpperCase() + r.slice(1).replace('_', '')}` as any)}
                  </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-hidden rounded-lg border bg-card shadow-sm relative">
        <div className="absolute inset-0 overflow-auto">
             <ContentTable 
                data={contents} 
                onSelect={(item) => setSelectedItem(item)} 
             />
        </div>
      </div>

      {/* Slide-over Panel */}
      <BreakdownPanel 
        content={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onReborn={handleReborn}
      />
    </div>
  );
}