import type {
  Award,
  Certification,
  Experience,
  IProfile,
  SocialLink,
  TechStack,
} from "@/content/profile";
import { formatPhone } from "@/lib/libphonenumber";
import { formatPhoneNumber } from "@/lib/string";

const esc = (s?: string) => (s ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const b64 = (s?: string) => {
  if (!s) return "";
  try {
    return Buffer.from(s, "base64").toString("utf8");
  } catch {
    return s;
  }
};

const toBullets = (text?: string) => {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (l.startsWith("-") ? l : `- ${l}`));
};

const fmtDate = (s?: string) => {
  if (!s) return "";
  if (/^\d{2}\.\d{4}$/.test(s) || /^\d{4}-\d{2}$/.test(s) || /^\d{4}$/.test(s)) return s;
  const m = s.match(/^(\d{4})-(\d{2})(?:-\d{2})?/);
  if (m) return `${m[1]}-${m[2]}`;
  return s;
};

const fmtRange = (start?: string, end?: string) => {
  const a = fmtDate(start);
  const b = fmtDate(end);
  if (a && b) return `${a} – ${b}`;
  if (a && !b) return `${a} – Present`;
  return b || "";
};

function groupTechByCategory(items: TechStack[]) {
  const map = new Map<string, TechStack[]>();
  for (const t of items) {
    for (const c of t.categories ?? ["Other"]) {
      const arr = map.get(c) ?? [];
      arr.push(t);
      map.set(c, arr);
    }
  }
  return map;
}

function inlineLinks(techs: TechStack[]) {
  return techs.map((t) => (t.href ? `[${esc(t.title)}](${t.href})` : esc(t.title))).join(", ");
}

const mdxLink = (title: string, href?: string) => (href ? `[${esc(title)}](${href})` : esc(title));

export function cvToMdx(profile: IProfile) {
  const lines: string[] = [];

  // ===== Header =====
  lines.push("<Center>");
  lines.push(`# ${esc(profile.displayName || `${profile.firstName} ${profile.lastName}`)}`);

  const emailPlain = b64(profile.email);
  const phonePlain = b64(profile.phoneNumber);
  if (profile.jobTitle) lines.push(esc(profile.jobTitle));
  if (profile.address) lines.push(esc(profile.address));

  const metaParts: string[] = [];
  if (emailPlain) metaParts.push(`[${emailPlain}](mailto:${emailPlain})`);
  if (profile.githubUserName)
    metaParts.push(
      `[${profile.githubUserName.replace(
        /^https?:\/\//,
        ""
      )}](https://github.com/${profile.githubUserName})`
    );
  if (phonePlain)
    metaParts.push(
      `[${formatPhoneNumber(phonePlain)}](tel:${formatPhone(phonePlain, undefined, "e164")})`
    );
  if (metaParts.length) lines.push(metaParts.join(" • "));
  lines.push("</Center>");
  lines.push("");

  // ===== Summary / About =====
  if (profile.sections.about?.content?.trim()) {
    lines.push(`## ${esc(profile.sections.about.name || "About")}`);
    lines.push("");
    lines.push(`_${esc(profile.sections.about.content.trim())}_`);
    lines.push("");
  }

  // ===== Tech Stack =====
  const techSec = profile.sections?.techStack;
  if (techSec?.visible && techSec.items?.length) {
    lines.push(`## ${esc(techSec.name || "Tech Stack")}`);
    lines.push("");
    const grouped = groupTechByCategory(techSec.items);
    const cats = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));

    const catParts: string[] = [];

    for (const cat of cats) {
      const techs = grouped.get(cat) ?? [];
      catParts.push(`${esc(cat)}: ${techs.map((tech) => `**${tech.title}**`).join(", ")}`);
    }

    lines.push(catParts.join(" • "));
  }

  // ===== Experience (Company -> Positions) =====
  const expSec = profile.sections?.experiences;
  if (expSec?.visible && expSec.items?.length) {
    lines.push(`## ${esc(expSec.name || "Experience")}`);
    lines.push("");
    for (const company of expSec.items as Experience[]) {
      // const companyTitle = company.website
      //   ? `[${esc(company.companyName)}](${company.website})`
      //   : esc(company.companyName);

      const companyTitle = esc(company.companyName);

      for (const pos of company.positions ?? []) {
        const when = fmtRange(pos.employmentPeriod?.start, pos.employmentPeriod?.end);
        const rightBits = [when, pos.employmentType].filter(Boolean).join(" • ");

        lines.push(`### ${esc(companyTitle)}`);
        if (rightBits) lines.push(`<Right>${esc(rightBits)}</Right>`);
        lines.push(`_${esc(pos.title)}_`);
        lines.push("");

        const bullets = toBullets(pos.description);
        if (bullets.length) {
          lines.push(...bullets);
          lines.push("");
        }

        if (pos.skills?.length) {
          lines.push(`*Skills:* ${pos.skills.map(esc).join(", ")}`);
          lines.push("");
        }
      }
    }
  }

  // ===== Projects =====
  // const projSec = profile.sections?.projects;
  // if (projSec?.visible && projSec.items?.length) {
  //   lines.push(`## ${esc(projSec.name || "Projects")}`);
  //   lines.push("");
  //   for (const p of projSec.items as Project[]) {
  //     const title = mdxLink(p.title, p.link);
  //     const when = fmtRange(p.period?.start, p.period?.end);
  //     lines.push(`### ${title}`);
  //     if (when) lines.push(`<Right>${esc(when)}</Right>`);
  //     if (p.skills?.length)
  //       lines.push(`*Tech:* ${p.skills.map(esc).join(", ")}`);
  //     if (p.description?.trim()) {
  //       // keeps line breaks and bullets from the original description
  //       const descLines = p.description
  //         .split(/\r?\n/)
  //         .map((l) => (l.trim().startsWith("-") ? l : esc(l)));
  //       lines.push(...descLines);
  //     }
  //     lines.push("");
  //   }
  // }

  // ===== Education =====
  const eduSec = profile.sections?.educations;
  if (eduSec?.visible && eduSec.items?.length) {
    lines.push(`## ${esc(eduSec.name || "Education")}`);
    lines.push("");
    for (const ed of eduSec.items as Experience[]) {
      for (const pos of ed.positions ?? []) {
        const when = fmtRange(pos.employmentPeriod?.start, pos.employmentPeriod?.end);
        lines.push(`### ${esc(pos.title || ed.companyName)}`);
        if (when) lines.push(`<Right>${esc(when)}</Right>`);
        lines.push(`*${esc(pos.location)}*`);
        const bullets = toBullets(pos.description);
        if (bullets.length) {
          lines.push(...bullets);
        }
        if (pos.skills?.length) {
          lines.push(`*Focus:* ${pos.skills.map(esc).join(", ")}`);
        }
        lines.push("");
      }
    }
  }

  // ===== Certifications =====
  const certSec = profile.sections?.certifications;
  if (certSec?.visible && certSec.items?.length) {
    lines.push(`## ${esc(certSec.name || "Certifications")}`);
    lines.push("");
    for (const c of certSec.items as Certification[]) {
      const title = esc(c.title);
      const issuer = esc(c.issuer);
      lines.push(`### ${title}`);
      const right = [fmtDate(c.issueDate)].filter(Boolean).join(" · ");
      if (right) lines.push(`<Right>${right}</Right>`);
      lines.push(`_${issuer}_`);

      const id = c.credentialID ? `**ID:** ${esc(c.credentialID)}` : "";
      const url = c.credentialURL ? `**URL:** ${mdxLink("credential", c.credentialURL)}` : "";
      if (id || url) lines.push([id, url].filter(Boolean).join(" · "));
      lines.push("");
    }
  }

  // ===== Awards =====
  const awardsSec = profile.sections?.awards;
  if (awardsSec?.visible && awardsSec.items?.length) {
    lines.push(`## ${esc(awardsSec.name || "Awards & Honors")}`);
    lines.push("");
    for (const a of awardsSec.items as Award[]) {
      const head = `### ${esc(a.prize)}`;
      lines.push(head);
      const right = [fmtDate(a.date), esc(a.grade)].filter(Boolean).join(" · ");
      if (right) lines.push(`<Right>${right}</Right>`);
      lines.push(`_${esc(a.title)}_`);
      const bullets = toBullets(a.description);
      if (bullets.length) lines.push(...bullets);
      if (a.referenceLink) lines.push(`*Reference:* ${mdxLink("link", a.referenceLink)}`);
      lines.push("");
    }
  }

  // ===== Social Links =====
  const socialSec = profile.sections?.socialLinks;
  if (socialSec?.visible && socialSec.items?.length) {
    lines.push(`## ${esc(socialSec.name || "Social Links")}`);
    lines.push("");
    if (socialSec.separateLinks) {
      for (const s of socialSec.items as SocialLink[]) {
        const title = esc(s.title);
        const handle = s.description ? ` — ${esc(s.description)}` : "";
        lines.push(`- ${mdxLink(title, s.href)}${handle}`);
      }
    } else {
      // inline (except for social medias)
      lines.push(
        (socialSec.items as SocialLink[]).map((s) => mdxLink(s.title, s.href)).join(" • ")
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}
