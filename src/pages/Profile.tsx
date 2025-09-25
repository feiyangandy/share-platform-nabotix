import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Building, FileText, Download, Settings, Edit, Shield, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  
  const [editForm, setEditForm] = useState({
    title: "",
    field: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "错误",
          description: "获取用户信息失败",
          variant: "destructive",
        });
      } else if (data) {
        setUserProfile(data);
        setEditForm({
          title: data.title || "",
          field: data.field || "",
          phone: data.phone || "",
          email: data.email || ""
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusLabels = {
    submitted: { label: "已提交", color: "bg-blue-100 text-blue-800" },
    under_review: { label: "审核中", color: "bg-yellow-100 text-yellow-800" },
    approved: { label: "已批准", color: "bg-green-100 text-green-800" },
    rejected: { label: "已拒绝", color: "bg-red-100 text-red-800" }
  };

  const roleLabels = {
    public_visitor: "公众访客",
    registered_researcher: "注册研究者",
    data_provider: "数据提供方",
    platform_admin: "平台管理员"
  };

  const educationLabels = {
    bachelor: "本科",
    master: "硕士",
    phd: "博士",
    postdoc: "博士后"
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;

    setUpdating(true);
    console.log("Updating profile:", editForm);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          title: editForm.title,
          field: editForm.field,
          phone: editForm.phone,
          email: editForm.email
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUserProfile(prev => ({
        ...prev,
        title: editForm.title,
        field: editForm.field,
        phone: editForm.phone,
        email: editForm.email
      }));

      toast({
        title: "更新成功",
        description: "个人信息已更新",
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "更新失败",
        description: "更新个人信息时发生错误",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6">
          <div className="text-center">加载中...</div>
        </main>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">请先登录</h1>
            <p>您需要登录才能查看个人信息</p>
          </div>
        </main>
      </div>
    );
  }

  // Show profile not found if no profile data
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">个人信息不完整</h1>
            <p>请联系管理员完善您的个人信息</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">个人中心</h1>
            <p className="text-muted-foreground">
              管理您的个人信息、查看申请状态和研究成果
            </p>
          </div>
          
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary"
                className="bg-primary/10 text-primary"
              >
                {roleLabels[userProfile.role as keyof typeof roleLabels] || userProfile.role}
              </Badge>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              个人信息
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="h-4 w-4" />
              我的申请
            </TabsTrigger>
            <TabsTrigger value="outputs" className="gap-2">
              <Download className="h-4 w-4" />
              我的成果
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              账户设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  基本信息
                </CardTitle>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      编辑
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>编辑个人信息</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">职称</Label>
                        <Input
                          id="title"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field">专业领域</Label>
                        <Input
                          id="field"
                          value={editForm.field}
                          onChange={(e) => setEditForm(prev => ({ ...prev, field: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">联系电话</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱地址</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          取消
                        </Button>
                        <Button type="submit" disabled={updating}>
                          {updating ? "保存中..." : "保存"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">用户名</Label>
                      <div className="col-span-2">{userProfile.username}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">真实姓名</Label>
                      <div className="col-span-2">{userProfile.real_name}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">身份证号</Label>
                      <div className="col-span-2">{userProfile.id_number?.replace(/(\d{6})\d*(\d{4})/, '$1****$2')}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">学历</Label>
                      <div className="col-span-2">
                        {educationLabels[userProfile.education as keyof typeof educationLabels] || userProfile.education}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">职称</Label>
                      <div className="col-span-2">{userProfile.title || "未填写"}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">专业领域</Label>
                      <div className="col-span-2">{userProfile.field || "未填写"}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">所属机构</Label>
                      <div className="col-span-2">{userProfile.institution_id || "未填写"}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">联系电话</Label>
                      <div className="col-span-2">{userProfile.phone || "未填写"}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">邮箱地址</Label>
                      <div className="col-span-2">{userProfile.email || user.email}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">注册时间</Label>
                      <div className="col-span-2">{new Date(userProfile.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>数据申请记录</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground">
                    <p>申请记录功能正在开发中...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outputs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>我的研究成果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground">
                    <p>研究成果功能正在开发中...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  账户安全
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">修改密码</h4>
                    <p className="text-sm text-muted-foreground">
                      最后修改时间：2024-01-01
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Key className="h-4 w-4" />
                    修改密码
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">登录记录</h4>
                    <p className="text-sm text-muted-foreground">
                      最后登录：{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "未知"}
                    </p>
                  </div>
                  <Button variant="outline">
                    查看详情
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>通知设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">申请状态更新</h4>
                    <p className="text-sm text-muted-foreground">
                      当数据申请状态发生变化时通知我
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    已开启
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">新数据集发布</h4>
                    <p className="text-sm text-muted-foreground">
                      有新的数据集发布时通知我
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    已开启
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;