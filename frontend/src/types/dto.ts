import { type components } from "./api";

// Regulation Endpoints
export type RegulationDTO = components["schemas"]["RegulationDTO"];
export type RegulationCreateDTO = components["schemas"]["RegulationCreateDTO"];
export type RouDTO = components["schemas"]["RouDto"];

// Feature Endpoints
export type FeatureDTOWithCheck = components["schemas"]["FeatureDTOWithCheck"];
export type FeatureCreateDTO = components["schemas"]["FeatureCreateDTO"];
export type FeatureUpdateDTO = components["schemas"]["FeatureUpdateDTO"];
export type Mapping = components["schemas"]["Mapping"];
export type CheckDTO = components["schemas"]["CheckDTO"];
export type EvalResultDTO = components["schemas"]["EvalResultDTO"];
export type FlagType = components["schemas"]["FlagType"];
export type Status = components["schemas"]["Status"];

// Terminology Endpoints
export type TerminologyDTO = components["schemas"]["TerminologyDTO"];
export type TerminologyCreateDTO = components["schemas"]["TerminologyCreateDTO"];
