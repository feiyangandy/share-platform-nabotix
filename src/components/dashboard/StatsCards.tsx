import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileText, Users, Trophy } from "lucide-react";

const stats = [
  {
    title: "数据集总数",
    title_en: "Total Datasets", 
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Database,
  },
  {
    title: "活跃研究者",
    title_en: "Active Researchers",
    value: "3,428", 
    change: "+8%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "申请审核中",
    title_en: "Applications Pending",
    value: "156",
    change: "-4%", 
    changeType: "negative" as const,
    icon: FileText,
  },
  {
    title: "研究成果",
    title_en: "Research Outputs",
    value: "892",
    change: "+23%",
    changeType: "positive" as const,
    icon: Trophy,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className={`text-xs flex items-center gap-1 ${
              stat.changeType === "positive" 
                ? "text-emerald-600" 
                : "text-red-600"
            }`}>
              <span>{stat.change}</span>
              <span className="text-muted-foreground">较上月</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}