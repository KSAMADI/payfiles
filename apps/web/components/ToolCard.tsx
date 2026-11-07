import Link from "next/link";
import { localizedTool, toolPath, type Locale, type ToolDef } from "@/lib/tools";

export default function ToolCard({ tool, locale }: { tool: ToolDef; locale: Locale }) {
  const v = localizedTool(tool, locale);
  return (
    <Link className="card tool-card" href={toolPath(tool, locale)}>
      <i className={`bi bi-${tool.icon}`} aria-hidden="true" />
      <div>
        <h3>{v.displayName}</h3>
        <p>{v.displayDesc}</p>
      </div>
    </Link>
  );
}
