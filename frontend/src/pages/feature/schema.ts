import * as yup from "yup";

export const createFeatureSchema = yup.object({
  title: yup.string().min(2).max(100).required(),
  description: yup.string().min(2).max(500).required(),
});
