import NavBar from "@/components/nav-bar";
import {
  Shield,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
} from "lucide-react";
import StatsCard from "@/components/stats-card";
import { useStats } from "@/hooks/use-stats";

const MainPage = () => {
  const { stats, loading, error } = useStats();

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
          {error && (
            <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              Error loading stats: {error}
            </div>
          )}
          {loading ? (
            <div className="space-y-6">
              {/* First row - loading skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map((index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex items-center space-x-4 animate-pulse min-h-[120px]"
                  >
                    <div className="h-12 w-12 bg-muted rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Second row - loading skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex items-center space-x-4 animate-pulse min-h-[120px]"
                  >
                    <div className="h-12 w-12 bg-muted rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* First row - Basic totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatsCard
                  title="Total Regulations"
                  logo={<FileText className="h-8 w-8 text-blue-600" />}
                  number={stats?.totalRegulations ?? 0}
                />
                <StatsCard
                  title="Total Features"
                  logo={<TrendingUp className="h-8 w-8 text-purple-600" />}
                  number={stats?.totalFeatures ?? 0}
                />
              </div>
              {/* Second row - Feature analysis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatsCard
                  title="Additional Logic Required"
                  logo={<AlertTriangle className="h-8 w-8 text-red-600" />}
                  number={stats?.featuresRequireAdditionalLogic ?? 0}
                />
                <StatsCard
                  title="No Violation"
                  logo={<CheckCircle className="h-8 w-8 text-green-600" />}
                  number={stats?.featuresDoNotRequireAdditionalLogic ?? 0}
                />
                <StatsCard
                  title="Human Review Required"
                  logo={<User className="h-8 w-8 text-amber-600" />}
                  number={stats?.featuresRequireHumanReview ?? 0}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MainPage;
