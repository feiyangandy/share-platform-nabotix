import { Header } from "@/components/layout/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">关于平台</h1>
        <p className="text-muted-foreground">平台介绍页面正在开发中...</p>
      </div>
    </div>
  );
};

export default About;