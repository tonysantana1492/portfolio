export type Certification = {
  title: string;
  issuer: string;
  issuerLogoURL?: string;
  issuerIconName?: string;
  issueDate: string;
  credentialID: string;
  credentialURL: string;
};

export const CERTIFICATIONS: Certification[] = [
  {
    title: "Certificate of Trademark Registration No. 543682",
    issuer: "Intellectual Property Office of Viet Nam",
    issuerLogoURL: "companies/ipvietnam.webp",
    issueDate: "2025-05-08",
    credentialID: "543682",
    credentialURL:
      "https://drive.google.com/file/d/1x7YzlK1kyz16h28ux9k3KAwnZFAabsvq/view?usp=sharing",
  },
  {
    title: "Google Code-in 2016",
    issuer: "Google",
    issuerIconName: "google",
    issueDate: "2017-01-16",
    credentialID: "",
    credentialURL:
      "https://drive.google.com/file/d/162RXtAVIZEvfx6LvP3xeBj-cSI9ZpPUX/view?usp=sharing",
  },
];
