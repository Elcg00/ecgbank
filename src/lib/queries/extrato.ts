import "server-only";

export type ExtratoFilters = {
  group: string | null;
  member: string | null;
  type: "entrada" | "saida" | null;
  from: string | null;
  to: string | null;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseExtratoFilters(searchParams: RawSearchParams): ExtratoFilters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || null;
  const type = one(searchParams.type);

  return {
    group: one(searchParams.group),
    member: one(searchParams.member),
    type: type === "entrada" || type === "saida" ? type : null,
    from: one(searchParams.from),
    to: one(searchParams.to),
  };
}

export function hasActiveFilters(filters: ExtratoFilters): boolean {
  return Boolean(filters.group || filters.member || filters.type || filters.from || filters.to);
}
