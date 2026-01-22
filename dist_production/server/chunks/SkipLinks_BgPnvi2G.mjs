import { jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { u as useTheme, c as useAccessibility } from "./Card_Dsq8OXHI.mjs";
const DEFAULT_SKIP_LINKS = [
  {
    id: "skip-to-content",
    label: "Ir para o conteúdo principal",
    target: "#main-content"
  },
  {
    id: "skip-to-navigation",
    label: "Ir para a navegação principal",
    target: "#main-navigation"
  },
  {
    id: "skip-to-search",
    label: "Ir para a busca",
    target: "#search"
  },
  {
    id: "skip-to-footer",
    label: "Ir para o rodapé",
    target: "#footer"
  }
];
const SkipLinkItem = ({ id, label, target, onClose }) => {
  const { computedTheme } = useTheme();
  const { getSkipLinkStyles } = useAccessibility();
  const [isVisible, setIsVisible] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.querySelector(target);
    if (element) {
      element.setAttribute("tabindex", "-1");
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        element.removeAttribute("tabindex");
      }, 100);
    }
    if (onClose) onClose();
  };
  const handleFocus = () => {
    setIsVisible(true);
  };
  const handleBlur = () => {
    setIsVisible(false);
  };
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: target,
      id,
      onClick: handleClick,
      onFocus: handleFocus,
      onBlur: handleBlur,
      style: {
        ...getSkipLinkStyles(),
        ...isVisible && {
          top: "0"
        }
      },
      "aria-label": label,
      children: label
    }
  );
};
const SkipLinks = ({ links = DEFAULT_SKIP_LINKS, className = "", style = {} }) => {
  const { computedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        zIndex: computedTheme.spacing.zIndex.max,
        pointerEvents: "none",
        ...style
      },
      className,
      "aria-hidden": "false",
      children: links.map((link) => /* @__PURE__ */ jsx(
        SkipLinkItem,
        {
          id: link.id,
          label: link.label,
          target: link.target
        },
        link.id
      ))
    }
  );
};
const useSkipLinks = () => {
  const [links, setLinks] = useState(DEFAULT_SKIP_LINKS);
  const addLink = (link) => {
    setLinks((prev) => [...prev, link]);
  };
  const removeLink = (id) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  };
  const updateLink = (id, updates) => {
    setLinks(
      (prev) => prev.map((link) => link.id === id ? { ...link, ...updates } : link)
    );
  };
  const clearLinks = () => {
    setLinks([]);
  };
  return {
    links,
    addLink,
    removeLink,
    updateLink,
    clearLinks,
    SkipLinks: ({ className, style }) => /* @__PURE__ */ jsx(SkipLinks, { links, className, style })
  };
};
export {
  SkipLinks as S,
  useSkipLinks as u
};
