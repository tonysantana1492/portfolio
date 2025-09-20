export type Award = {
  id: string;
  prize: string;
  title: string;
  date: string;
  grade: string;
  description?: string;
  referenceLink?: string;
};

export const AWARDS: Award[] = [
  {
    id: "a144bd19-3706-4e4c-ba22-0e0d8302642a",
    prize: "1st Prize",
    title: "Can Tho City Young Informatics Contest 2014",
    date: "2014-05",
    grade: "Grade 8",
    description:
      "- Field: Creative Software\n- Project: Website Hành Trình Khám Phá Miền Tây",
    referenceLink:
      "https://drive.google.com/file/d/16bia3XoeVbSlfvg4FzVapQf3LVI8wUA-/view?usp=sharing",
  },
  {
    id: "d9dc1a25-7976-47f8-925e-051285822d54",
    prize: "Consolation Prize",
    title: "National Young Informatics Contest 2014",
    date: "2014-09",
    grade: "Grade 8",
    description:
      "- Organized in Hanoi\n- Field: Creative Software\n- Project: Website Hành Trình Khám Phá Miền Tây",
    referenceLink:
      "https://drive.google.com/file/d/16OOVuKBxFAnROU-pmhkDFkbljkmeO-kc/view?usp=sharing",
  },
];
