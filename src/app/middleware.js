import { withAuth } from "next-auth/middleware";

export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/admin/sales",
    "/admin/sales/new",
    "/admin/sales/return",
    "/admin/users",
    "/admin/users/edit",
    "/admin/users/new"


  ],
};

