import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";
import { Users, Calendar, Database, TrendingUp, FileText } from "lucide-react";

interface DatasetDetailModalProps {
  dataset: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatasetDetailModal({ dataset, open, onOpenChange }: DatasetDetailModalProps) {
  const { data: statistics, loading: statsLoading } = useRealtimeQuery('dataset_statistics', {
    select: '*',
    eq: ['dataset_id', dataset?.id]
  });

  if (!dataset) return null;

  // 模拟统计数据结构 - 在实际应用中这些会来自数据库
  const demographicStats = [
    {
      variable: '种族',
      variableName: 'race',
      label: 'Race/Ethnicity',
      range: '汉族, 回族, 维吾尔族, 藏族, 其他',
      count: dataset.record_count,
      missingRate: 2.3
    },
    {
      variable: '年龄',
      variableName: 'age',
      label: 'Age (years)',
      range: '18-85岁 (平均: 58.4±12.7)',
      count: dataset.record_count,
      missingRate: 0.8
    },
    {
      variable: '性别',
      variableName: 'gender',
      label: 'Gender',
      range: '男性: 52.3%, 女性: 47.7%',
      count: dataset.record_count,
      missingRate: 0.1
    },
    {
      variable: '学历',
      variableName: 'education',
      label: 'Education Level',
      range: '小学及以下: 15%, 初中: 25%, 高中: 35%, 大专及以上: 25%',
      count: dataset.record_count,
      missingRate: 4.2
    }
  ];

  // 结局指标数据
  const outcomeVariables = [
    {
      variable: '主要心血管事件',
      variableName: 'mace',
      label: 'Major Adverse Cardiovascular Events',
      range: '发生率: 12.8%',
      count: dataset.record_count,
      missingRate: 1.2
    },
    {
      variable: '全因死亡',
      variableName: 'death',
      label: 'All-cause Mortality',
      range: '发生率: 8.4%',
      count: dataset.record_count,
      missingRate: 0.3
    },
    {
      variable: '生活质量评分',
      variableName: 'qol_score',
      label: 'Quality of Life Score',
      range: '0-100分 (平均: 72.6±18.3)',
      count: dataset.record_count,
      missingRate: 6.7
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{dataset.title_cn}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dataset.principal_investigator && (
                <div className="pb-2 border-b">
                  <p className="text-sm text-muted-foreground">首席研究员（PI）</p>
                  <p className="font-semibold">{dataset.principal_investigator}</p>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">样本量</p>
                    <p className="font-semibold">{dataset.record_count?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">变量数</p>
                    <p className="font-semibold">{dataset.variable_count}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">研究期间</p>
                    <p className="font-semibold text-sm">
                      {dataset.start_date} - {dataset.end_date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">查看次数</p>
                    <p className="font-semibold">{dataset.search_count}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 人口学特征统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                人口学特征统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>变量</TableHead>
                    <TableHead>范围/分布</TableHead>
                    <TableHead>样本数</TableHead>
                    <TableHead>缺失率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demographicStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{stat.variable}</p>
                          <p className="text-xs text-muted-foreground">{stat.variableName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{stat.range}</TableCell>
                      <TableCell>{stat.count?.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={stat.missingRate} className="w-16 h-2" />
                          <span className="text-sm">{stat.missingRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 结局指标统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                结局指标统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>指标名称</TableHead>
                    <TableHead>范围/分布</TableHead>
                    <TableHead>样本数</TableHead>
                    <TableHead>缺失率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outcomeVariables.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{stat.variable}</p>
                          <p className="text-xs text-muted-foreground">{stat.variableName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{stat.range}</TableCell>
                      <TableCell>{stat.count?.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={stat.missingRate} className="w-16 h-2" />
                          <span className="text-sm">{stat.missingRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Code Book */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                变量代码表 (Code Book)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>变量名</TableHead>
                    <TableHead>标签</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>说明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...demographicStats, ...outcomeVariables].map((variable, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">
                        {variable.variableName}
                      </TableCell>
                      <TableCell>{variable.label}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {variable.variable === '年龄' || variable.variable === '生活质量评分' ? '数值型' : '分类型'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {variable.variable === '年龄' ? '以年为单位的连续变量' :
                         variable.variable === '性别' ? '二分类变量：1=男，2=女' :
                         variable.variable === '种族' ? '多分类变量：1=汉族，2=回族，3=维吾尔族，4=藏族，5=其他' :
                         variable.variable === '学历' ? '有序分类：1=小学及以下，2=初中，3=高中，4=大专及以上' :
                         variable.variable === '主要心血管事件' ? '二分类结局：0=未发生，1=发生' :
                         variable.variable === '全因死亡' ? '二分类结局：0=存活，1=死亡' :
                         variable.variable === '生活质量评分' ? '0-100分连续评分，分值越高生活质量越好' : ''}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}