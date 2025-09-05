import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const chartData = [
  { direction: "心血管", count: 186, searches: 320 },
  { direction: "肿瘤学", count: 245, searches: 445 },
  { direction: "神经科学", count: 124, searches: 280 },
  { direction: "内分泌", count: 98, searches: 190 },
  { direction: "免疫学", count: 156, searches: 275 },
  { direction: "感染病", count: 87, searches: 165 },
];

const chartConfig = {
  count: {
    label: "数据集数量",
    color: "hsl(var(--primary))",
  },
  searches: {
    label: "搜索次数", 
    color: "hsl(var(--accent-foreground))",
  },
} satisfies ChartConfig;

export function ResearchDirectionsChart() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">研究方向分布</CardTitle>
        <CardDescription className="text-muted-foreground">
          按搜索频次排名的热门研究领域
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="direction" 
                className="fill-muted-foreground text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                className="fill-muted-foreground text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}