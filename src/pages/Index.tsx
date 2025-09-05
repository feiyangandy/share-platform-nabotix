import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ResearchDirectionsChart } from "@/components/dashboard/ResearchDirectionsChart";
import { DatasetTypesChart } from "@/components/dashboard/DatasetTypesChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Database, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              临床研究数据
              <span className="text-primary">共享平台</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              安全、标准化、协作的临床研究数据集平台。遵循OMOP CDM准则，实施严格去标识化，提供内置描述性统计分析。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link to="/datasets">
                  浏览数据集
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/about">了解更多</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              平台概况
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              实时统计数据展示平台活跃度和研究成果
            </p>
          </div>
          <StatsCards />
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <ResearchDirectionsChart />
            <DatasetTypesChart />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              平台特色
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              为临床研究提供全方位的数据管理和协作解决方案
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border hover:shadow-card transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">数据安全</CardTitle>
                <CardDescription className="text-muted-foreground">
                  严格的去标识化协议，SSL/TLS加密传输，审计日志追踪
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-border hover:shadow-card transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">标准化管理</CardTitle>
                <CardDescription className="text-muted-foreground">
                  遵循OMOP CDM标准，统一数据格式，提高数据互操作性
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-border hover:shadow-card transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">智能分析</CardTitle>
                <CardDescription className="text-muted-foreground">
                  内置描述性统计，自动生成数据概览和可视化图表
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              开始您的研究之旅
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              加入我们的研究社区，探索丰富的临床数据集，推进医学研究进展
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link to="/register">
                  立即注册
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/datasets">浏览数据集</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;