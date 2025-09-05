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
import { useState } from "react";

// Mock user data
const mockUser = {
  id: "123456789",
  username: "dr_zhang",
  realName: "张医生",
  idType: "identity_card",
  idNumber: "510***********1234",
  education: "phd",
  title: "主治医师",
  field: "心血管内科",
  institution: "四川大学华西医院",
  phone: "138****5678",
  email: "zhang.doctor@email.com",
  role: "registered_researcher",
  createdAt: "2023-06-15",
  lastLogin: "2024-01-15 14:30"
};

// Mock activities
const mockApplications = [
  { id: "1", dataset: "冠心病队列研究数据集", status: "approved", date: "2024-01-10" },
  { id: "2", dataset: "糖尿病患者生物标志物数据", status: "under_review", date: "2024-01-12" },
  { id: "3", dataset: "脑卒中康复随访数据", status: "submitted", date: "2024-01-14" }
];

const mockOutputs = [
  { id: "1", title: "基于机器学习的心血管风险预测", type: "paper", date: "2024-01-05" },
  { id: "2", title: "糖尿病并发症早期识别算法", type: "paper", date: "2024-01-03" }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: mockUser.title,
    field: mockUser.field,
    phone: mockUser.phone,
    email: mockUser.email
  });

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

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating profile:", editForm);
    setIsEditDialogOpen(false);
    // Handle profile update
  };

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
              {roleLabels[mockUser.role as keyof typeof roleLabels]}
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
                        <Button type="submit">
                          保存
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
                      <div className="col-span-2">{mockUser.username}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">真实姓名</Label>
                      <div className="col-span-2">{mockUser.realName}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">身份证号</Label>
                      <div className="col-span-2">{mockUser.idNumber}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">学历</Label>
                      <div className="col-span-2">
                        {educationLabels[mockUser.education as keyof typeof educationLabels]}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">职称</Label>
                      <div className="col-span-2">{mockUser.title}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">专业领域</Label>
                      <div className="col-span-2">{mockUser.field}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">所属机构</Label>
                      <div className="col-span-2">{mockUser.institution}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">联系电话</Label>
                      <div className="col-span-2">{mockUser.phone}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">邮箱地址</Label>
                      <div className="col-span-2">{mockUser.email}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Label className="text-muted-foreground">注册时间</Label>
                      <div className="col-span-2">{mockUser.createdAt}</div>
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
                  {mockApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{application.dataset}</h4>
                        <p className="text-sm text-muted-foreground">申请时间：{application.date}</p>
                      </div>
                      <Badge 
                        variant="secondary"
                        className={statusLabels[application.status as keyof typeof statusLabels].color}
                      >
                        {statusLabels[application.status as keyof typeof statusLabels].label}
                      </Badge>
                    </div>
                  ))}
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
                  {mockOutputs.map((output) => (
                    <div key={output.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{output.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {output.type === "paper" ? "论文" : "专利"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">提交时间：{output.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                      最后登录：{mockUser.lastLogin}
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