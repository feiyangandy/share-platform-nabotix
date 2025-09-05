import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatasetUpload } from "@/components/upload/DatasetUpload";
import { Search, Filter, Calendar, Users, Database, Download, Upload } from "lucide-react";
import { useState } from "react";
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";

// Type mappings for database enum values
const typeLabels = {
  cohort: '队列研究',
  case_control: '病例对照研究', 
  cross_sectional: '横断面研究',
  rct: '随机对照试验',
  registry: '登记研究',
  biobank: '生物样本库',
  omics: '组学数据',
  wearable: '可穿戴设备'
};

const Datasets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  
  const { data: datasets, loading } = useRealtimeQuery('datasets', {
    select: '*, users(real_name), research_subjects(name)',
    order: ['created_at', { ascending: false }]
  });

  const filteredDatasets = datasets.filter((dataset: any) => {
    const matchesSearch = dataset.title_cn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (dataset.keywords || []).some((keyword: string) => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || typeLabels[dataset.type as keyof typeof typeLabels] === selectedType || dataset.type === selectedType;
    const matchesCategory = selectedCategory === "all" || dataset.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">数据集目录</h1>
            <p className="text-muted-foreground">
              浏览已发布的临床研究数据集，支持按研究类型、学科领域筛选查找
            </p>
          </div>
          <Button onClick={() => setShowUpload(!showUpload)} className="gap-2">
            <Upload className="h-4 w-4" />
            {showUpload ? '隐藏上传' : '上传数据集'}
          </Button>
        </div>

        {/* Upload Component */}
        {showUpload && (
          <DatasetUpload onSuccess={() => setShowUpload(false)} />
        )}

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="搜索数据集标题或关键词..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="研究类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="cohort">队列研究</SelectItem>
                  <SelectItem value="cross_sectional">横断面研究</SelectItem>
                  <SelectItem value="case_control">病例对照研究</SelectItem>
                  <SelectItem value="rct">随机对照试验</SelectItem>
                  <SelectItem value="registry">登记研究</SelectItem>
                  <SelectItem value="biobank">生物样本库</SelectItem>
                  <SelectItem value="omics">组学数据</SelectItem>
                  <SelectItem value="wearable">可穿戴设备</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="学科领域" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部领域</SelectItem>
                  <SelectItem value="心血管疾病">心血管疾病</SelectItem>
                  <SelectItem value="内分泌代谢">内分泌代谢</SelectItem>
                  <SelectItem value="神经系统疾病">神经系统疾病</SelectItem>
                  <SelectItem value="肿瘤学">肿瘤学</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            找到 {filteredDatasets.length} 个数据集
          </p>
        </div>

        {/* Dataset Grid */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : filteredDatasets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无符合条件的数据集</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDatasets.map((dataset: any) => (
              <Card key={dataset.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight">{dataset.title_cn}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {typeLabels[dataset.type as keyof typeof typeLabels] || dataset.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(dataset.keywords || []).map((keyword: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {dataset.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{dataset.record_count?.toLocaleString() || '未知'} 条记录</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span>{dataset.variable_count || '未知'} 个变量</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{dataset.start_date || '未设置'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span>{dataset.search_count || 0} 次查看</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {dataset.users?.real_name || '未知提供者'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        发布于 {new Date(dataset.created_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      申请数据
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Datasets;