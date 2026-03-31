export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/scan/:path*", "/dashboard/:path*", "/history/:path*", "/locations/:path*", "/admin/:path*"],
};
