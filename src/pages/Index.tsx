import { Navigation } from "@/components/Navigation";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ResearchDirectionChart } from "@/components/dashboard/ResearchDirectionChart";
import { DatasetTypeChart } from "@/components/dashboard/DatasetTypeChart";
import { Database, Users, FileText, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto py-6 space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            华西临床研究数据共享平台
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            安全、标准化、协作的临床研究数据集共享平台。遵循OMOP CDM规范，严格去标识化处理，内置描述性统计分析功能。
          </p>
        </div>

        {/* Statistics Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="数据集总数"
            value="156"
            description="已发布的数据集"
            icon={Database}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="注册用户"
            value="2,847"
            description="平台注册用户数"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="研究成果"
            value="89"
            description="基于平台数据发表的成果"
            icon={FileText}
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard
            title="数据申请"
            value="342"
            description="本月数据申请数量"
            icon={TrendingUp}
            trend={{ value: 23, isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-3">
          <ResearchDirectionChart />
          <DatasetTypeChart />
        </div>

        {/* Recent Activities */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">最新数据集</h2>
            <div className="space-y-3">
              {[
                { title: "冠心病队列研究数据集", date: "2024-01-15", type: "队列研究" },
                { title: "糖尿病患者生物标志物数据", date: "2024-01-12", type: "横断面研究" },
                { title: "脑卒中康复随访数据", date: "2024-01-10", type: "队列研究" },
              ].map((dataset, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{dataset.title}</h3>
                    <p className="text-sm text-muted-foreground">{dataset.type} • {dataset.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">最新研究成果</h2>
            <div className="space-y-3">
              {[
                { title: "基于多中心数据的心血管风险预测模型", journal: "Circulation", citations: 12 },
                { title: "糖尿病并发症早期识别算法研究", journal: "Diabetes Care", citations: 8 },
                { title: "脑卒中康复效果影响因素分析", journal: "Stroke", citations: 5 },
              ].map((output, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{output.title}</h3>
                    <p className="text-sm text-muted-foreground">{output.journal} • 引用数: {output.citations}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
