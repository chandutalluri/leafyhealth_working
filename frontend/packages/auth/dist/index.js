"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DomainGuard: () => DomainGuard,
  PermissionButton: () => PermissionButton,
  PermissionsProvider: () => PermissionsProvider,
  hasPermission: () => hasPermission,
  useAuth: () => useAuth,
  useAuthStore: () => useAuthStore,
  usePermissions: () => usePermissions,
  withAuth: () => withAuth
});
module.exports = __toCommonJS(index_exports);

// src/authStore.ts
var import_zustand = require("zustand");
var import_middleware = require("zustand/middleware");
var useAuthStore = (0, import_zustand.create)()(
  (0, import_middleware.persist)(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token });
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
        }
      },
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
      },
      clearError: () => set({ error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: "leafyhealth-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// src/PermissionsProvider.tsx
var import_react = __toESM(require("react"));
var PermissionsContext = (0, import_react.createContext)(null);
function PermissionsProvider({ children }) {
  const [domains, setDomains] = (0, import_react.useState)([]);
  const [isLoading, setIsLoading] = (0, import_react.useState)(true);
  const { user, token } = useAuthStore();
  (0, import_react.useEffect)(() => {
    if (user && token) {
      fetchUserPermissions();
    } else {
      setDomains([]);
      setIsLoading(false);
    }
  }, [user, token]);
  const fetchUserPermissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
      } else {
        console.error("Failed to fetch permissions:", response.statusText);
        setDomains([]);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      setDomains([]);
    } finally {
      setIsLoading(false);
    }
  };
  const hasPermission2 = (domain, action) => {
    if (user?.role === "super_admin") {
      return true;
    }
    const domainPerms = domains.find((d) => d.domain === domain);
    return domainPerms?.actions.includes(action) ?? false;
  };
  const getAllowedDomains = () => {
    if (user?.role === "super_admin") {
      return [
        "catalog-management",
        "inventory-management",
        "order-management",
        "payment-processing",
        "notification-service",
        "customer-service",
        "employee-management",
        "accounting-management",
        "expense-monitoring",
        "analytics-reporting",
        "performance-monitor",
        "shipping-delivery",
        "marketplace-management",
        "compliance-audit",
        "content-management",
        "label-design",
        "integration-hub"
      ];
    }
    return domains.map((d) => d.domain);
  };
  const getDomainActions = (domain) => {
    if (user?.role === "super_admin") {
      return ["create", "read", "update", "delete"];
    }
    const domainPerms = domains.find((d) => d.domain === domain);
    return domainPerms?.actions || [];
  };
  const refreshPermissions = async () => {
    await fetchUserPermissions();
  };
  return /* @__PURE__ */ import_react.default.createElement(PermissionsContext.Provider, { value: {
    domains,
    hasPermission: hasPermission2,
    getAllowedDomains,
    getDomainActions,
    isLoading,
    refreshPermissions
  } }, children);
}
function usePermissions() {
  const context = (0, import_react.useContext)(PermissionsContext);
  if (!context) {
    throw new Error("usePermissions must be used within PermissionsProvider");
  }
  return context;
}

// src/DomainGuard.tsx
var import_react2 = __toESM(require("react"));
function DomainGuard({
  domain,
  action,
  children,
  fallback = null,
  showError = false
}) {
  const { hasPermission: hasPermission2, isLoading } = usePermissions();
  if (isLoading) {
    return /* @__PURE__ */ import_react2.default.createElement("div", { className: "animate-pulse bg-gray-200 rounded h-8 w-32" });
  }
  if (!hasPermission2(domain, action)) {
    if (showError) {
      return /* @__PURE__ */ import_react2.default.createElement("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 text-center" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "text-red-600 text-sm" }, "Access denied: You don't have permission to ", action, " ", domain));
    }
    return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, fallback);
  }
  return /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, children);
}

// src/PermissionButton.tsx
var import_react3 = __toESM(require("react"));
var PermissionButton = ({
  domain,
  action,
  children,
  className = "",
  onClick,
  disabled = false
}) => {
  const { hasPermission: hasPermission2 } = usePermissions();
  if (!hasPermission2(domain, action)) {
    return null;
  }
  return /* @__PURE__ */ import_react3.default.createElement(
    "button",
    {
      className: `px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors ${className}`,
      onClick,
      disabled
    },
    children
  );
};

// src/index.ts
var import_react4 = __toESM(require("react"));
var hasPermission = (user, requiredRole) => {
  if (!user) return false;
  const roleHierarchy = {
    customer: 0,
    staff: 1,
    manager: 2,
    admin: 3,
    super_admin: 4
  };
  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  return userLevel >= requiredLevel;
};
var useAuth = () => {
  const auth = useAuthStore();
  return {
    ...auth,
    hasPermission: (role) => hasPermission(auth.user, role),
    isRole: (role) => auth.user?.role === role,
    canAccess: (roles) => auth.user ? roles.includes(auth.user.role) : false
  };
};
var withAuth = (Component, requiredRole) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return null;
    }
    if (requiredRole && !hasPermission(user, requiredRole)) {
      return null;
    }
    return import_react4.default.createElement(Component, props);
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DomainGuard,
  PermissionButton,
  PermissionsProvider,
  hasPermission,
  useAuth,
  useAuthStore,
  usePermissions,
  withAuth
});
