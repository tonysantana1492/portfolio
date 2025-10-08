type PrismaError = { code?: string; meta?: Record<string, unknown> };

export function mapPrismaToHttp(err: unknown): {
  status: number;
  title: string;
  detail?: unknown;
} {
  const e = err as PrismaError;

  switch (e?.code) {
    case "P2002":
      return {
        status: 409,
        title: "Unique constraint violated",
        detail: e.meta,
      };
    case "P2025":
      return { status: 404, title: "Record not found", detail: e.meta };
    default:
      return { status: 500, title: "Internal Server Error" };
  }
}
