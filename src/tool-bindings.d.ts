import type { CategoryId, ToolKind } from "./types";

export type ToolPublicationState = "published" | "hidden";

export interface ToolCodeBinding {
  toolBindingId: string;
  registryToolId: string;
  canonicalSlug: string;
  kind: ToolKind;
  categoryId: CategoryId;
  icon: string;
  publicationState: ToolPublicationState;
  componentKey: string;
}

export interface ToolCodeBindingResolver {
  hasToolBinding(toolBindingId: string): boolean;
  resolveToolBinding(toolBindingId: string): ToolCodeBinding | null;
  listToolBindings(): ToolCodeBinding[];
}

export const TOOL_CODE_BINDINGS: readonly ToolCodeBinding[];

export function listToolCodeBindings(): ToolCodeBinding[];
export function listPublishedToolCodeBindings(): ToolCodeBinding[];
export function createToolBindingResolver(bindings?: Iterable<ToolCodeBinding>): ToolCodeBindingResolver;
export function resolveToolBinding(toolBindingId: string): ToolCodeBinding | null;
