"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Button: () => Button,
  GlassCard: () => GlassCard,
  GlassInput: () => GlassInput,
  buttonVariants: () => buttonVariants,
  cn: () => cn,
  glassCardVariants: () => glassCardVariants,
  glassInputVariants: () => glassInputVariants
});
module.exports = __toCommonJS(index_exports);

// src/utils/cn.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/Button.tsx
var import_react = require("react");
var import_class_variance_authority = require("class-variance-authority");
var buttonVariants = (0, import_class_variance_authority.cva)(
  "inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lg hover:shadow-brand-400/40 hover:-translate-y-0.5 hover:shadow-xl",
        glass: "bg-white/20 backdrop-blur-lg border border-white/30 text-gray-800 hover:bg-white/30 shadow-glass",
        "glass-primary": "bg-brand-500/20 backdrop-blur-lg border border-brand-400/30 text-brand-700 hover:bg-brand-500/30 shadow-green-glow",
        secondary: "bg-white/80 backdrop-blur-lg text-gray-700 hover:bg-white/90 border border-gray-200/50",
        ghost: "hover:bg-white/20 backdrop-blur-sm",
        danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg"
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-xl",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg rounded-3xl"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);
var Button = (0, import_react.forwardRef)(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        disabled: loading || props.disabled,
        ...props
      },
      loading && /* @__PURE__ */ React.createElement("div", { className: "mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" }),
      children
    );
  }
);
Button.displayName = "Button";

// src/components/GlassCard.tsx
var import_react2 = require("react");
var import_class_variance_authority2 = require("class-variance-authority");
var glassCardVariants = (0, import_class_variance_authority2.cva)(
  "backdrop-blur-lg border rounded-3xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white/10 border-white/20 shadow-glass",
        heavy: "bg-white/20 border-white/30 shadow-glass-lg",
        brand: "bg-brand-500/10 border-brand-400/20 shadow-green-glow",
        dark: "bg-black/10 border-black/20 shadow-lg"
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-xl",
        glow: "hover:shadow-green-glow hover:border-brand-400/40",
        scale: "hover:scale-[1.02]"
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10"
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
      padding: "md"
    }
  }
);
var GlassCard = (0, import_react2.forwardRef)(
  ({ className, variant, hover, padding, children, ...props }, ref) => {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: cn(glassCardVariants({ variant, hover, padding, className })),
        ref,
        ...props
      },
      children
    );
  }
);
GlassCard.displayName = "GlassCard";

// src/components/GlassInput.tsx
var import_react3 = require("react");
var import_class_variance_authority3 = require("class-variance-authority");
var glassInputVariants = (0, import_class_variance_authority3.cva)(
  "flex w-full backdrop-blur-lg border transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white/20 border-white/30 rounded-2xl px-4 py-3 hover:bg-white/30 focus:bg-white/40",
        search: "bg-white/60 border-white/40 rounded-full px-6 py-3 hover:bg-white/70 focus:bg-white/80",
        minimal: "bg-transparent border-gray-300 rounded-lg px-3 py-2 hover:border-brand-400 focus:border-brand-500"
      },
      size: {
        sm: "h-8 text-sm",
        md: "h-10 text-sm",
        lg: "h-12 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);
var GlassInput = (0, import_react3.forwardRef)(
  ({ className, variant, size, type, ...props }, ref) => {
    return /* @__PURE__ */ React.createElement(
      "input",
      {
        type,
        className: cn(glassInputVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
GlassInput.displayName = "GlassInput";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Button,
  GlassCard,
  GlassInput,
  buttonVariants,
  cn,
  glassCardVariants,
  glassInputVariants
});
