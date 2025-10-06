import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { linkedinUrl } = await request.json();

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Extract username from LinkedIn URL
    const usernameMatch = linkedinUrl.match(/linkedin\.com\/in\/([^/]+)/);
    const linkedinUsername = usernameMatch ? usernameMatch[1] : "user";

    // Mock scraped data
    const mockProfile = {
      name: linkedinUsername
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase()),
      headline: "Full Stack Developer | React & Node.js Specialist",
      location: "San Francisco, CA",
      bio: "Passionate software engineer with 5+ years of experience building scalable web applications. Specialized in modern JavaScript frameworks and cloud technologies.",
      email: `${linkedinUsername}@example.com`,
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Corp",
          duration: "2022 - Present",
          description:
            "Leading development of microservices architecture and mentoring junior developers.",
        },
        {
          title: "Software Engineer",
          company: "StartupXYZ",
          duration: "2019 - 2022",
          description:
            "Built and maintained customer-facing web applications using React and Node.js.",
        },
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          school: "University of Technology",
          year: "2019",
        },
      ],
      techStack: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "PostgreSQL",
        "AWS",
        "Docker",
        "GraphQL",
      ],
    };

    return NextResponse.json(mockProfile);
  } catch {
    return NextResponse.json(
      { error: "Error processing LinkedIn profile" },
      { status: 500 }
    );
  }
}
