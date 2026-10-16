import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next`, `/_vercel`
  // - … static files like images, favicon, robots.txt
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
