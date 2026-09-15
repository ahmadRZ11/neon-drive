import { Briefcase, GitBranch, PenTool, type LucideIcon } from "lucide-react";

/**
 * Lucide v1 removed brand icons (Github, Linkedin, Figma) for trademark
 * reasons, so these are semantic stand-ins. Swapping in a brand-icon package
 * later means changing only this map.
 */
export const SOCIAL_ICONS: Record<string, LucideIcon> = {
  github: GitBranch,
  figma: PenTool,
  linkedin: Briefcase,
};
