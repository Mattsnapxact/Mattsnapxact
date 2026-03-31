export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/scan/:path*", "/dashboard/:path*", "/locations/:path*", "/admin/:path*"],
};
