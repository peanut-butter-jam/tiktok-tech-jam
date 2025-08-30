import { getAllFeatures } from "./feature-api/request";
import regulationApi from "./regulation";
import type { FeatureDTOWithCheck } from "@/types/dto";

export interface StatsData {
  totalRegulations: number;
  totalFeatures: number;
  featuresRequireAdditionalLogic: number;
  featuresDoNotRequireAdditionalLogic: number;
  featuresRequireHumanReview: number;
}

export const statsApi = {
  // Get dashboard stats
  getStats: async (): Promise<StatsData> => {
    try {
      // Fetch both regulations and features in parallel
      const [regulations, features] = await Promise.all([
        regulationApi.getAllRegulations(),
        getAllFeatures(),
      ]);

      // Calculate stats based on the new requirements
      const totalRegulations = regulations.length;
      const totalFeatures = features.length;

      // Count features based on their evaluation results
      let featuresRequireAdditionalLogic = 0;
      let featuresDoNotRequireAdditionalLogic = 0;
      let featuresRequireHumanReview = 0;

      features.forEach((feature: FeatureDTOWithCheck) => {
        // Get the most recent completed check
        const latestCompletedCheck =
          feature.checks && feature.checks.length > 0
            ? feature.checks
                .filter((check) => check.status === "completed")
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )[0]
            : null;

        if (latestCompletedCheck && latestCompletedCheck.eval_result) {
          const evalResult = latestCompletedCheck.eval_result;

          // Count features based on flag (whether they require geo-specific compliance logic)
          if (evalResult.flag === "yes") {
            featuresRequireAdditionalLogic++;
          } else if (evalResult.flag === "no") {
            featuresDoNotRequireAdditionalLogic++;
          }
          if (evalResult.flag === "unknown") {
            featuresRequireHumanReview++;
          }
        }
      });

      return {
        totalRegulations,
        totalFeatures,
        featuresRequireAdditionalLogic,
        featuresDoNotRequireAdditionalLogic,
        featuresRequireHumanReview,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  },
};

export default statsApi;
