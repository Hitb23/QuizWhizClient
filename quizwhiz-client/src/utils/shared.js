import { Route } from "react-router-dom";
import { Role, RoutePaths } from "./enum";

const NavigationItems = [
  {
    name: "UserDashboard",
    route: RoutePaths.UserDashboard,
    access: [Role.Contestant],
  },
  {
    name: "AdminDashboard",
    route: RoutePaths.AdminDashboard,
    access: [Role.Admin],
  },
];

const hasAccess = (pathname, user) => {
  const navItem = NavigationItems.find((navItem) =>
    pathname.includes(navItem.route)
  );
  if(navItem) {
    return (
      !navItem.access || !!(navItem.access && navItem.access.includes(user.roleId))
    );
  }
  return true;
};

export default {
  hasAccess,
  NavigationItems,
};
