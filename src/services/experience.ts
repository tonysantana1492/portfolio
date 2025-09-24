import type { Experience } from "@/content/profile";

export const getLastCompany = (experiences: Experience[]) => {
  return (
    experiences.find((job) => job.isCurrentEmployer) || experiences.slice(-1)[0]
  );
};
