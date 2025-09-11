import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users, Database, FileText, Building2, CheckCircle, XCircle, Clock } from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const { toast } = useToast();

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
        title: "Dataset approved",
        description: "The dataset has been approved and published.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve dataset.",
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
        title: "Dataset rejected",
        description: "The dataset has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject dataset.",
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
        title: "Application approved",
        description: "The application has been approved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve application.",
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
        title: "Application rejected", 
        description: "The application has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject application.",
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
        title: "Institution verified",
        description: "The institution has been verified.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify institution.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'denied':
        return <Badge variant="destructive">Denied</Badge>;
      case 'under_review':
        return <Badge variant="secondary">Under Review</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, datasets, and platform operations</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="datasets" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Datasets
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="institutions" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Institutions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div>Loading users...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Registered</TableHead>
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
                <CardTitle>Dataset Approval</CardTitle>
                <CardDescription>
                  Review and approve datasets for publication
                </CardDescription>
              </CardHeader>
              <CardContent>
                {datasetsLoading ? (
                  <div>Loading datasets...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
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
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>
                            ) : dataset.approved ? (
                              <Badge variant="secondary">Approved</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
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
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectDataset(dataset.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
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
                <CardTitle>Application Review</CardTitle>
                <CardDescription>
                  Review and manage data access applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div>Loading applications...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Title</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Dataset</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
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
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleRejectApplication(application.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
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
                <CardTitle>Institution Management</CardTitle>
                <CardDescription>
                  Verify and manage institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {institutionsLoading ? (
                  <div>Loading institutions...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Short Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
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
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
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
                                Verify
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