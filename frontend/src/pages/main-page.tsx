import NavBar from "@/components/nav-bar";
import {
  Shield,
  FileText,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import StatsCard from "@/components/stats-card";

const MainPage = () => {
  return (
    <div>
      <NavBar />
      <section className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-10">
            <Shield className="h-20 w-20 mr-6" />
            <h1 className="text-6xl font-bold">Regulo</h1>
          </div>
          <p className="text-2xl mb-4 opacity-90">
            From Guesswork to Governance
          </p>
          <p className="text-xl opacity-80 max-w-3xl mx-auto">
            Automating Geo-Regulation compliance with AI-powered analysis and
            audit-ready traceability
          </p>
        </div>
      </section>
      <section className="bg-white text-foreground py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-12 text-left">
            Compliance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatsCard
              title="Total Regulations"
              logo={<FileText className="h-8 w-8 text-muted-foreground" />}
              number={stats.totalRegulations}
            />
            <StatsCard
              title="Total Features"
              logo={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
              number={stats.totalFeatures}
            />
            <StatsCard
              title="Compliant"
              logo={<CheckCircle className="h-8 w-8 text-success" />}
              number={stats.compliantFeatures}
            />
            <StatsCard
              title="Non-Compliant"
              logo={<AlertTriangle className="h-8 w-8 text-destructive" />}
              number={stats.nonCompliantFeatures}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const stats = {
  totalRegulations: 120,
  totalFeatures: 45,
  compliantFeatures: 30,
  nonCompliantFeatures: 15,
};

export default MainPage;
