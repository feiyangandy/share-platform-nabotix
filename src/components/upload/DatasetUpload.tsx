import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DatasetUploadProps {
  onSuccess?: () => void;
}

export function DatasetUpload({ onSuccess }: DatasetUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title_cn: '',
    description: '',
    type: '',
    category: '',
    start_date: '',
    end_date: '',
    keywords: [] as string[],
    record_count: '',
    variable_count: '',
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [dictFile, setDictFile] = useState<File | null>(null);

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
      .from('datasets')
      .upload(filePath, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataFile) {
      toast.error('请选择数据文件');
      return;
    }

    setUploading(true);

    try {
      // Upload files
      const dataFilePath = await uploadFile(dataFile, 'data');
      if (!dataFilePath) {
        throw new Error('数据文件上传失败');
      }

      let dictFilePath = null;
      if (dictFile) {
        dictFilePath = await uploadFile(dictFile, 'dictionaries');
        if (!dictFilePath) {
          throw new Error('数据字典文件上传失败');
        }
      }

      // Create dataset record
      const { error } = await supabase.from('datasets').insert({
        title_cn: formData.title_cn,
        description: formData.description,
        type: formData.type as any,
        category: formData.category || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        keywords: formData.keywords.length > 0 ? formData.keywords : null,
        record_count: formData.record_count ? parseInt(formData.record_count) : null,
        variable_count: formData.variable_count ? parseInt(formData.variable_count) : null,
        file_url: dataFilePath,
        data_dict_url: dictFilePath,
        provider_id: (await supabase.auth.getUser()).data.user?.id || '',
      });

      if (error) throw error;

      toast.success('数据集上传成功');
      
      // Reset form
      setFormData({
        title_cn: '',
        description: '',
        type: '',
        category: '',
        start_date: '',
        end_date: '',
        keywords: [],
        record_count: '',
        variable_count: '',
      });
      setDataFile(null);
      setDictFile(null);
      
      onSuccess?.();
    } catch (error) {
      console.error('Error uploading dataset:', error);
      toast.error('上传失败: ' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          上传数据集
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">基本信息</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">数据集标题 *</Label>
              <Input
                id="title"
                value={formData.title_cn}
                onChange={(e) => setFormData(prev => ({ ...prev, title_cn: e.target.value }))}
                placeholder="请输入数据集标题"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">数据集描述 *</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="详细描述数据集内容、采集方法、质量控制等"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">研究类型 *</Label>
                <Select value={formData.type} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="选择研究类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cohort">队列研究</SelectItem>
                    <SelectItem value="case_control">病例对照研究</SelectItem>
                    <SelectItem value="cross_sectional">横断面研究</SelectItem>
                    <SelectItem value="rct">随机对照试验</SelectItem>
                    <SelectItem value="registry">登记研究</SelectItem>
                    <SelectItem value="biobank">生物样本库</SelectItem>
                    <SelectItem value="omics">组学数据</SelectItem>
                    <SelectItem value="wearable">可穿戴设备</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">学科领域</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="如：心血管疾病、肿瘤学等"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">研究开始日期</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">研究结束日期</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recordCount">记录数量</Label>
                <Input
                  id="recordCount"
                  type="number"
                  value={formData.record_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, record_count: e.target.value }))}
                  placeholder="样本/患者数量"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="variableCount">变量数量</Label>
                <Input
                  id="variableCount"
                  type="number"
                  value={formData.variable_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, variable_count: e.target.value }))}
                  placeholder="数据字段数量"
                />
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">关键词</h3>
            
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="添加关键词"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              />
              <Button type="button" onClick={addKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="gap-1">
                    {keyword}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">文件上传</h3>
            
            <div className="space-y-2">
              <Label htmlFor="dataFile">数据文件 * (CSV, Excel, etc.)</Label>
              <Input
                id="dataFile"
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={(e) => setDataFile(e.target.files?.[0] || null)}
                required
              />
              {dataFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <File className="h-4 w-4" />
                  {dataFile.name} ({(dataFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dictFile">数据字典文件 (可选)</Label>
              <Input
                id="dictFile"
                type="file"
                accept=".pdf,.doc,.docx,.csv,.xlsx"
                onChange={(e) => setDictFile(e.target.files?.[0] || null)}
              />
              {dictFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <File className="h-4 w-4" />
                  {dictFile.name} ({(dictFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" disabled={uploading}>
              保存草稿
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? '上传中...' : '提交审核'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}