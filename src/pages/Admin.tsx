import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, Database, FileText, Building2, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication and admin authorization
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Check if user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          toast({
            title: "未授权",
            description: "请先登录以访问管理面板。",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        // Check if user is admin using the secure RPC function
        const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin');
        
        if (roleError) {
          console.error('Role check error:', roleError);
          toast({
            title: "授权检查失败",
            description: "无法验证管理员权限。",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (!isAdmin) {
          toast({
            title: "访问被拒绝",
            description: "您没有访问管理面板的权限。",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Authorization check failed:', error);
        toast({
          title: "错误",
          description: "授权检查失败。",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthorization();
  }, [navigate, toast]);

  const { data: users, loading: usersLoading } = useRealtimeQuery('users', {
    select: 'id, real_name, email, role, created_at, institution_id'
  });

  const { data: datasets, loading: datasetsLoading } = useRealtimeQuery('datasets', {
    select: 'id, title_cn, type, provider_id, approved, published, created_at, users!datasets_provider_id_fkey(real_name)'
  });

  const { data: applications, loading: applicationsLoading } = useRealtimeQuery('applications', {
    select: 'id, project_title, status, submitted_at, applicant_id, dataset_id, users!applications_applicant_id_fkey(real_name), datasets(title_cn)'
  });

  const { data: institutions, loading: institutionsLoading } = useRealtimeQuery('institutions', {
    select: 'id, full_name, short_name, type, verified, created_at'
  });

  const handleApproveDataset = async (datasetId: string) => {
    try {
      const { error } = await supabase
        .from('datasets')
        .update({ approved: true, published: true })
        .eq('id', datasetId);

      if (error) throw error;

      toast({
        title: "数据集已批准",
        description: "数据集已批准并发布。",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "批准数据集失败。",
        variant: "destructive",
      });
    }
  };

  const handleRejectDataset = async (datasetId: string) => {
    try {
      const { error } = await supabase
        .from('datasets')
        .update({ approved: false, published: false })
        .eq('id', datasetId);

      if (error) throw error;

      toast({
        title: "数据集已拒绝",
        description: "数据集已被拒绝。",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "拒绝数据集失败。",
        variant: "destructive",
      });
    }
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString(),
          reviewed_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "申请已批准",
        description: "申请已被批准。",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "批准申请失败。",
        variant: "destructive",
      });
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: 'denied',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "申请已拒绝", 
        description: "申请已被拒绝。",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "拒绝申请失败。",
        variant: "destructive",
      });
    }
  };

  const handleVerifyInstitution = async (institutionId: string) => {
    try {
      const { error } = await supabase
        .from('institutions')
        .update({ verified: true })
        .eq('id', institutionId);

      if (error) throw error;

      toast({
        title: "机构已验证",
        description: "机构已被验证。",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "验证机构失败。",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">已批准</Badge>;
      case 'denied':
        return <Badge variant="destructive">已拒绝</Badge>;
      case 'under_review':
        return <Badge variant="secondary">审查中</Badge>;
      case 'submitted':
        return <Badge variant="secondary">待审核</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Show loading state while checking authorization
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">正在验证权限...</p>
        </div>
      </div>
    );
  }

  // Only render admin panel if authorized
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">管理员仪表板</h1>
            <p className="text-muted-foreground">管理用户、数据集和平台操作</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              用户
            </TabsTrigger>
            <TabsTrigger value="datasets" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              数据集
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              申请
            </TabsTrigger>
            <TabsTrigger value="institutions" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              机构
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>用户管理</CardTitle>
                <CardDescription>
                  查看和管理所有注册用户
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div>正在加载用户...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>姓名</TableHead>
                        <TableHead>邮箱</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>注册时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.real_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>数据集审批</CardTitle>
                <CardDescription>
                  审查和批准数据集发布
                </CardDescription>
              </CardHeader>
              <CardContent>
                {datasetsLoading ? (
                  <div>正在加载数据集...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>标题</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>提供者</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {datasets.map((dataset) => (
                        <TableRow key={dataset.id}>
                          <TableCell className="font-medium">{dataset.title_cn}</TableCell>
                          <TableCell>{dataset.type}</TableCell>
                          <TableCell>{dataset.users?.real_name}</TableCell>
                          <TableCell>
                            {dataset.approved && dataset.published ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">已发布</Badge>
                            ) : dataset.approved ? (
                              <Badge variant="secondary">已批准</Badge>
                            ) : (
                              <Badge variant="outline">待审批</Badge>
                            )}
                          </TableCell>
                          <TableCell className="space-x-2">
                            {!dataset.approved && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApproveDataset(dataset.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  批准
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectDataset(dataset.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  拒绝
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>申请审查</CardTitle>
                <CardDescription>
                  审查和管理数据访问申请
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div>正在加载申请...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>项目标题</TableHead>
                        <TableHead>申请人</TableHead>
                        <TableHead>数据集</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>提交时间</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">{application.project_title}</TableCell>
                          <TableCell>{application.users?.real_name}</TableCell>
                          <TableCell>{application.datasets?.title_cn}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell>{new Date(application.submitted_at).toLocaleDateString()}</TableCell>
                          <TableCell className="space-x-2">
                            {application.status === 'submitted' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApproveApplication(application.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  批准
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectApplication(application.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  拒绝
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="institutions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>机构管理</CardTitle>
                <CardDescription>
                  验证和管理机构
                </CardDescription>
              </CardHeader>
              <CardContent>
                {institutionsLoading ? (
                  <div>正在加载机构...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>全称</TableHead>
                        <TableHead>简称</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {institutions.map((institution) => (
                        <TableRow key={institution.id}>
                          <TableCell className="font-medium">{institution.full_name}</TableCell>
                          <TableCell>{institution.short_name}</TableCell>
                          <TableCell>{institution.type}</TableCell>
                          <TableCell>
                            {institution.verified ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                已验证
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                待审核
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{new Date(institution.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {!institution.verified && (
                              <Button 
                                size="sm" 
                                onClick={() => handleVerifyInstitution(institution.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                验证
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;