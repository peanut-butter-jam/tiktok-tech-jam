import * as yup from "yup";

export const createTerminologySchema = yup.object().shape({
  key: yup.string().required("Key is required"),
  value: yup.string().required("Value is required"),
});