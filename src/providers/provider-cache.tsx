import { cookies } from "next/headers";

import { Providers } from "@/providers/providers";
import { THEME_COOKIE_NAME } from "@/theme/theme-color.provider";

export const ProviderCache = async ({ children }: React.PropsWithChildren) => {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get(THEME_COOKIE_NAME)?.value;

  return <Providers activeThemeValue={activeThemeValue}>{children}</Providers>;
};
