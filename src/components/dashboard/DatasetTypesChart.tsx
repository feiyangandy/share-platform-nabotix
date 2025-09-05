import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const chartData = [
  { type: "队列研究", value: 312, percentage: 25.0, color: "hsl(var(--chart-1))" },
  { type: "病例对照", value: 286, percentage: 23.0, color: "hsl(var(--chart-2))" },
  { type: "横断面", value: 187, percentage: 15.0, color: "hsl(var(--chart-3))" },
  { type: "RCT", value: 149, percentage: 12.0, color: "hsl(var(--chart-4))" },
  { type: "注册研究", value: 137, percentage: 11.0, color: "hsl(var(--chart-5))" },
  { type: "生物样本库", value: 99, percentage: 8.0, color: "hsl(210 78% 66%)" },
  { type: "组学数据", value: 50, percentage: 4.0, color: "hsl(150 60% 50%)" },
  { type: "可穿戴设备", value: 27, percentage: 2.0, color: "hsl(25 95% 63%)" },
];

const chartConfig = {
  value: {
    label: "数据集数量",
  },
} satisfies ChartConfig;

export function DatasetTypesChart() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">数据集类型分布</CardTitle>
        <CardDescription className="text-muted-foreground">
          不同研究类型的数据集统计
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percentage }) => `${type} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          {chartData.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">{item.type}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}