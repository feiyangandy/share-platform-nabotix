import { Header } from "@/components/layout/Header";

const Datasets = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">数据集目录</h1>
        <p className="text-muted-foreground">数据集浏览功能正在开发中...</p>
      </div>
    </div>
  );
};

export default Datasets;