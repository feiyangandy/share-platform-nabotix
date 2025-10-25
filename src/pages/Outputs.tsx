import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Award, BookOpen, TrendingUp, ExternalLink, Plus, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Mock data for research outputs
const mockOutputs = [
  {
    id: "1",
    title: "基于多中心数据的心血管风险预测模型",
    abstract: "利用冠心病队列研究数据，构建基于机器学习的心血管事件风险预测模型，AUC达到0.89，为临床决策提供重要参考。",
    type: "paper",
    journal: "Circulation",
    citationCount: 12,
    patentNumber: null,
    datasetTitle: "冠心病队列研究数据集",
    submitterName: "张医生",
    submittedAt: "2024-01-05",
    publicationUrl: "https://example.com/paper1"
  },
  {
    id: "2",
    title: "糖尿病并发症早期识别算法研究",
    abstract: "基于生物标志物数据开发的早期识别算法，能够提前6个月预测糖尿病肾病的发生，准确率达85%。",
    type: "paper",
    journal: "Diabetes Care",
    citationCount: 8,
    patentNumber: null,
    datasetTitle: "糖尿病患者生物标志物数据",
    submitterName: "李教授",
    submittedAt: "2024-01-03",
    publicationUrl: "https://example.com/paper2"
  },
  {
    id: "3",
    title: "智能康复评估系统",
    abstract: "基于脑卒中康复数据开发的智能评估系统，能够自动评估患者康复进程并推荐个性化治疗方案。",
    type: "patent",
    journal: null,
    citationCount: 0,
    patentNumber: "CN202410001234.5",
    datasetTitle: "脑卒中康复随访数据",
    submitterName: "王主任",
    submittedAt: "2023-12-28",
    publicationUrl: null
  }
];

const Outputs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOutput, setNewOutput] = useState({
    title: "",
    abstract: "",
    type: "paper",
    journal: "",
    patentNumber: "",
    datasetId: "",
    publicationUrl: "",
    pubmedId: "",
    authors: "",
    citationCount: 0
  });

  const [isLoadingPubmed, setIsLoadingPubmed] = useState(false);
  const [pubmedError, setPubmedError] = useState("");

  const filteredOutputs = mockOutputs.filter(output => {
    const matchesSearch = output.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         output.abstract.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || output.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const fetchPubMedData = async (pubmedId: string) => {
    if (!pubmedId.trim()) {
      setPubmedError("");
      return;
    }

    setIsLoadingPubmed(true);
    setPubmedError("");

    try {
      const { data, error } = await supabase.functions.invoke('fetch-pubmed', {
        body: { pubmedId: pubmedId.trim() }
      });

      if (error) {
        setPubmedError("无法获取PubMed数据，请检查ID是否正确");
        return;
      }

      if (data) {
        setNewOutput(prev => ({
          ...prev,
          title: data.title || prev.title,
          abstract: data.abstract || prev.abstract,
          journal: data.journal || prev.journal,
          authors: data.authors || prev.authors,
          citationCount: data.citationCount || prev.citationCount,
          publicationUrl: data.publicationUrl || prev.publicationUrl
        }));
      }
    } catch (error) {
      setPubmedError("获取PubMed数据时出现错误");
      console.error('PubMed fetch error:', error);
    } finally {
      setIsLoadingPubmed(false);
    }
  };

  const handlePubmedIdChange = (value: string) => {
    setNewOutput(prev => ({ ...prev, pubmedId: value }));
    
    // Auto-fetch when ID looks complete (typically 8 digits)
    if (value.length >= 7 && /^\d+$/.test(value)) {
      fetchPubMedData(value);
    }
  };

  const handleSubmitOutput = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting output:", newOutput);
    setIsDialogOpen(false);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">研究成果</h1>
            <p className="text-muted-foreground">
              基于平台数据产生的学术论文、专利等研究成果展示
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                提交成果
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>提交研究成果</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitOutput} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pubmedId">PubMed ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pubmedId"
                      value={newOutput.pubmedId}
                      onChange={(e) => handlePubmedIdChange(e.target.value)}
                      placeholder="输入PubMed ID自动获取论文信息"
                    />
                    {isLoadingPubmed && <Loader2 className="h-5 w-5 animate-spin self-center" />}
                  </div>
                  {pubmedError && (
                    <p className="text-sm text-destructive">{pubmedError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outputTitle">成果标题 *</Label>
                  <Input
                    id="outputTitle"
                    value={newOutput.title}
                    onChange={(e) => setNewOutput(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="请输入论文或专利标题"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outputType">成果类型 *</Label>
                  <Select value={newOutput.type} onValueChange={(value) => 
                    setNewOutput(prev => ({ ...prev, type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project">项目/课题</SelectItem>
                      <SelectItem value="paper">论文</SelectItem>
                      <SelectItem value="invention_patent">发明专利</SelectItem>
                      <SelectItem value="utility_patent">实用新型专利</SelectItem>
                      <SelectItem value="software_copyright">软件著作权</SelectItem>
                      <SelectItem value="other_award">其他获奖</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataset">关联数据集 *</Label>
                  <Select value={newOutput.datasetId} onValueChange={(value) => 
                    setNewOutput(prev => ({ ...prev, datasetId: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="选择使用的数据集" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">冠心病队列研究数据集</SelectItem>
                      <SelectItem value="2">糖尿病患者生物标志物数据</SelectItem>
                      <SelectItem value="3">脑卒中康复随访数据</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newOutput.type === "paper" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="journal">发表期刊</Label>
                      <Input
                        id="journal"
                        value={newOutput.journal}
                        onChange={(e) => setNewOutput(prev => ({ ...prev, journal: e.target.value }))}
                        placeholder="期刊名称"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="authors">作者</Label>
                      <Input
                        id="authors"
                        value={newOutput.authors}
                        onChange={(e) => setNewOutput(prev => ({ ...prev, authors: e.target.value }))}
                        placeholder="作者姓名"
                      />
                    </div>

                    {newOutput.citationCount > 0 && (
                      <div className="space-y-2">
                        <Label>引用次数</Label>
                        <p className="text-sm text-muted-foreground">{newOutput.citationCount} 次引用</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="patentNumber">专利号</Label>
                    <Input
                      id="patentNumber"
                      value={newOutput.patentNumber}
                      onChange={(e) => setNewOutput(prev => ({ ...prev, patentNumber: e.target.value }))}
                      placeholder="专利申请号或授权号"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="abstract">摘要 *</Label>
                  <Textarea
                    id="abstract"
                    rows={4}
                    value={newOutput.abstract}
                    onChange={(e) => setNewOutput(prev => ({ ...prev, abstract: e.target.value }))}
                    placeholder="简要描述研究内容、方法和主要发现"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">链接</Label>
                  <Input
                    id="url"
                    value={newOutput.publicationUrl}
                    onChange={(e) => setNewOutput(prev => ({ ...prev, publicationUrl: e.target.value }))}
                    placeholder="论文DOI或专利查询链接"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit">
                    提交成果
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-xs text-muted-foreground">研究成果总数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">67</p>
                  <p className="text-xs text-muted-foreground">学术论文</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">22</p>
                  <p className="text-xs text-muted-foreground">专利成果</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">342</p>
                  <p className="text-xs text-muted-foreground">总引用次数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="搜索成果标题或摘要..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="成果类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="project">项目/课题</SelectItem>
                  <SelectItem value="paper">论文</SelectItem>
                  <SelectItem value="invention_patent">发明专利</SelectItem>
                  <SelectItem value="utility_patent">实用新型专利</SelectItem>
                  <SelectItem value="software_copyright">软件著作权</SelectItem>
                  <SelectItem value="other_award">其他获奖</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {filteredOutputs.map((output) => (
            <Card key={output.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{output.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={output.type === "paper" ? "default" : "secondary"}>
                            {output.type === "project" && "项目/课题"}
                            {output.type === "paper" && "论文"}
                            {output.type === "invention_patent" && "发明专利"}
                            {output.type === "utility_patent" && "实用新型专利"}
                            {output.type === "software_copyright" && "软件著作权"}
                            {output.type === "other_award" && "其他获奖"}
                            {output.type === "patent" && "专利"}
                          </Badge>
                          {output.journal && (
                            <span className="text-sm text-muted-foreground">
                              发表于 {output.journal}
                            </span>
                          )}
                          {output.patentNumber && (
                            <span className="text-sm text-muted-foreground">
                              专利号: {output.patentNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        {output.citationCount > 0 && (
                          <div className="text-center">
                            <p className="font-bold text-lg">{output.citationCount}</p>
                            <p className="text-xs text-muted-foreground">引用</p>
                          </div>
                        )}
                        {output.publicationUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={output.publicationUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{output.abstract}</p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>基于数据集：{output.datasetTitle}</span>
                        <span>提交者：{output.submitterName}</span>
                        <span>提交时间：{output.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Outputs;