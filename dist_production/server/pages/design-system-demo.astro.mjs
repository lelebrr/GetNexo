import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from "../assets/astro/server-MCYX8tFF.js";
import "piccolore";
import { $ as $$Layout } from "../assets/Layout-DScI-qCd.js";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import { T as ThemeProvider, u as useTheme, C as Card } from "../assets/Card-Dsq8OXHI.js";
import { I as Input, B as Button } from "../assets/Input-WBWOzuho.js";
import { T as ToastProvider, u as useToast, L as Loading } from "../assets/Toast-gh0ly6Nu.js";
import { S as SkipLinks } from "../assets/SkipLinks-CkCTahpm.js";
/* empty css                                             */
import { renderers } from "../renderers.mjs";
const designSystemUtils = {};
const CompleteFormExample = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nome é obrigatório";
    if (!formData.email) newErrors.email = "Email é obrigatório";
    if (!formData.phone) newErrors.phone = "Telefone é obrigatório";
    if (!formData.message) newErrors.message = "Mensagem é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      addToast("Formulário enviado com sucesso!", {
        type: "success",
        duration: 3e3
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      addToast("Erro ao enviar formulário!", {
        type: "error",
        duration: 5e3,
        action: {
          label: "Tentar novamente",
          onClick: handleSubmit
        }
      });
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "large",
      title: "Formulário de Contato",
      description: "Preencha o formulário abaixo para entrar em contato",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Nome Completo",
            placeholder: "Digite seu nome",
            value: formData.name,
            onChange: (e) => handleChange("name", e.target.value),
            error: errors.name,
            required: true,
            ariaRequired: true
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Email",
            placeholder: "Digite seu email",
            value: formData.email,
            onChange: (e) => handleChange("email", e.target.value),
            error: errors.email,
            required: true,
            ariaRequired: true
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Telefone",
            placeholder: "(XX) XXXXX-XXXX",
            value: formData.phone,
            onChange: (e) => handleChange("phone", e.target.value),
            error: errors.phone,
            required: true,
            ariaRequired: true
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Mensagem",
            placeholder: "Digite sua mensagem",
            value: formData.message,
            onChange: (e) => handleChange("message", e.target.value),
            error: errors.message,
            multiline: true,
            rows: 4,
            required: true,
            ariaRequired: true
          }
        ),
        loading ? /* @__PURE__ */ jsx(
          Loading,
          {
            variant: "spinner",
            text: "Enviando...",
            color: "primary"
          }
        ) : /* @__PURE__ */ jsx(
          Button,
          {
            variant: "primary",
            size: "large",
            onClick: handleSubmit,
            fullWidth: true,
            ariaLabel: "Enviar formulário",
            children: "Enviar Mensagem"
          }
        )
      ] })
    }
  );
};
const DashboardExample = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  React.useEffect(() => {
    setTimeout(() => {
      setData([
        { title: "Usuários", value: "1,234", change: "+12%", positive: true },
        { title: "Vendas", value: "R$ 45.678", change: "+8%", positive: true },
        { title: "Pedidos", value: "892", change: "-2%", positive: false },
        { title: "Receita", value: "R$ 123.456", change: "+15%", positive: true }
      ]);
      setLoading(false);
    }, 2e3);
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx(
      Loading,
      {
        variant: "spinner",
        text: "Carregando dashboard...",
        fullscreen: false
      }
    );
  }
  return /* @__PURE__ */ jsx(Card.Group, { columns: 4, gap: "medium", children: data.map((item, index) => /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "medium",
      title: item.title,
      description: item.value,
      children: /* @__PURE__ */ jsx("div", { style: {
        color: item.positive ? "#22c55e" : "#ef4444",
        fontWeight: "bold",
        fontSize: "1.125rem"
      }, children: item.change })
    },
    index
  )) });
};
const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = React.useRef(null);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  if (!isOpen) {
    return /* @__PURE__ */ jsx(Button, { variant: "primary", onClick: openModal, children: "Abrir Modal" });
  }
  return /* @__PURE__ */ jsx("div", { style: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1e3
  }, children: /* @__PURE__ */ jsx(
    Card,
    {
      ref: modalRef,
      variant: "elevated",
      size: "medium",
      title: "Confirmar Ação",
      description: "Tem certeza que deseja realizar esta ação?",
      footer: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "danger", size: "small", onClick: closeModal, children: "Cancelar" }),
        /* @__PURE__ */ jsx(Button, { variant: "primary", size: "small", onClick: () => {
          closeModal();
        }, children: "Confirmar" })
      ] }),
      children: "Esta ação não pode ser desfeita."
    }
  ) });
};
const ListExample = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const loadItems = () => {
    setLoading(true);
    setTimeout(() => {
      setItems([
        { id: 1, name: "Item 1", status: "ativo" },
        { id: 2, name: "Item 2", status: "inativo" },
        { id: 3, name: "Item 3", status: "ativo" }
      ]);
      setLoading(false);
      addToast("Itens carregados com sucesso!", { type: "success" });
    }, 1500);
  };
  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      name: `Novo Item ${items.length + 1}`,
      status: "ativo"
    };
    setItems([...items, newItem]);
    addToast("Item adicionado!", { type: "success" });
  };
  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    addToast("Item removido!", { type: "warning" });
  };
  return /* @__PURE__ */ jsxs(
    Card,
    {
      variant: "elevated",
      size: "medium",
      title: "Lista de Itens",
      description: "Gerencie sua lista de itens",
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "1rem", marginBottom: "1rem" }, children: [
          /* @__PURE__ */ jsx(Button, { variant: "primary", size: "small", onClick: loadItems, children: "Carregar Itens" }),
          /* @__PURE__ */ jsx(Button, { variant: "accent", size: "small", onClick: addItem, children: "Adicionar Item" })
        ] }),
        loading ? /* @__PURE__ */ jsx(Loading, { variant: "dots", text: "Carregando itens..." }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "0.5rem" }, children: items.length === 0 ? /* @__PURE__ */ jsx("div", { style: { color: "#71717a", textAlign: "center", padding: "2rem" }, children: 'Nenhum item encontrado. Clique em "Carregar Itens".' }) : items.map((item) => /* @__PURE__ */ jsx(
          Card,
          {
            variant: "outlined",
            size: "small",
            title: item.name,
            description: `Status: ${item.status}`,
            footer: /* @__PURE__ */ jsx(
              Button,
              {
                variant: "danger",
                size: "small",
                onClick: () => removeItem(item.id),
                children: "Remover"
              }
            )
          },
          item.id
        )) })
      ]
    }
  );
};
const AuthExample = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const handleLogin = async () => {
    if (!email || !password) {
      addToast("Preencha todos os campos!", { type: "error" });
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      addToast("Login realizado com sucesso!", { type: "success" });
      setEmail("");
      setPassword("");
    } catch (error) {
      addToast("Erro ao fazer login!", { type: "error" });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "medium",
      title: "Login",
      description: "Faça login para acessar o sistema",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Email",
            placeholder: "Digite seu email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            type: "email",
            required: true,
            ariaRequired: true
          }
        ),
        /* @__PURE__ */ jsx(
          Input.Password,
          {
            label: "Senha",
            placeholder: "Digite sua senha",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            ariaRequired: true
          }
        ),
        loading ? /* @__PURE__ */ jsx(Loading, { variant: "spinner", text: "Autenticando..." }) : /* @__PURE__ */ jsx(
          Button,
          {
            variant: "primary",
            size: "large",
            onClick: handleLogin,
            fullWidth: true,
            ariaLabel: "Fazer login",
            children: "Entrar"
          }
        )
      ] })
    }
  );
};
const ThemeExample = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { updateTheme } = designSystemUtils;
  const { addToast } = useToast();
  const handleToggleTheme = () => {
    toggleTheme();
    addToast(`Tema ${isDarkMode ? "claro" : "escuro"} ativado!`, { type: "info" });
  };
  const handleUpdatePrimaryColor = (color) => {
    updateTheme({ primaryColor: color });
    addToast("Cor primária atualizada!", { type: "success" });
  };
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "medium",
      title: "Configuração de Tema",
      description: "Personalize a aparência do sistema",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "1rem", alignItems: "center" }, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: isDarkMode ? "primary" : "outline",
              size: "medium",
              onClick: handleToggleTheme,
              ariaLabel: isDarkMode ? "Ativar tema claro" : "Ativar tema escuro",
              children: isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"
            }
          ),
          /* @__PURE__ */ jsxs("span", { style: { fontSize: "0.875rem", color: "#71717a" }, children: [
            "Modo atual: ",
            isDarkMode ? "Escuro" : "Claro"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { marginBottom: "0.5rem", fontWeight: 500 }, children: "Cor Primária:" }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "0.5rem" }, children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "primary",
                size: "small",
                onClick: () => handleUpdatePrimaryColor("primary"),
                children: "Azul"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "secondary",
                size: "small",
                onClick: () => handleUpdatePrimaryColor("secondary"),
                children: "Roxo"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "accent",
                size: "small",
                onClick: () => handleUpdatePrimaryColor("accent"),
                children: "Verde"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { fontSize: "0.875rem", color: "#71717a" }, children: [
          /* @__PURE__ */ jsx("strong", { children: "Configuração Atual:" }),
          /* @__PURE__ */ jsx("pre", { style: { marginTop: "0.5rem", background: "#f4f4f5", padding: "0.5rem", borderRadius: "4px" }, children: JSON.stringify(theme, null, 2) })
        ] })
      ] })
    }
  );
};
const AccessibleListExample = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Item 1", selected: false },
    { id: 2, name: "Item 2", selected: false },
    { id: 3, name: "Item 3", selected: false }
  ]);
  const toggleItem = (id) => {
    setItems(items.map(
      (item) => item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "medium",
      title: "Lista Acessível",
      description: "Lista com suporte completo a acessibilidade",
      children: /* @__PURE__ */ jsx("div", { role: "list", "aria-label": "Lista de itens", children: items.map((item) => /* @__PURE__ */ jsxs(
        "div",
        {
          role: "listitem",
          "aria-selected": item.selected,
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem",
            borderBottom: "1px solid #e4e4e7",
            background: item.selected ? "#f0fdf4" : "transparent"
          },
          children: [
            /* @__PURE__ */ jsx("span", { children: item.name }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: item.selected ? "success" : "outline",
                size: "small",
                onClick: () => toggleItem(item.id),
                ariaLabel: item.selected ? `Desmarcar ${item.name}` : `Marcar ${item.name}`,
                ariaPressed: item.selected,
                children: item.selected ? "✓" : "○"
              }
            )
          ]
        },
        item.id
      )) })
    }
  );
};
const RealTimeValidationExample = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email é obrigatório";
    if (!emailRegex.test(value)) return "Email inválido";
    return "";
  };
  const validatePassword = (value) => {
    if (!value) return "Senha é obrigatória";
    if (value.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    return "";
  };
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };
  const isValid = !errors.email && !errors.password && email && password;
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "medium",
      title: "Formulário com Validação em Tempo Real",
      description: "Validação instantânea dos campos",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Email",
            placeholder: "Digite seu email",
            value: email,
            onChange: handleEmailChange,
            error: errors.email,
            success: !errors.email && email ? "Email válido!" : "",
            type: "email",
            required: true,
            ariaRequired: true,
            ariaInvalid: !!errors.email
          }
        ),
        /* @__PURE__ */ jsx(
          Input.Password,
          {
            label: "Senha",
            placeholder: "Digite sua senha",
            value: password,
            onChange: handlePasswordChange,
            error: errors.password,
            success: !errors.password && password ? "Senha válida!" : "",
            required: true,
            ariaRequired: true,
            ariaInvalid: !!errors.password
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: isValid ? "primary" : "outline",
            size: "medium",
            disabled: !isValid,
            ariaDisabled: !isValid,
            children: isValid ? "Enviar" : "Preencha os campos"
          }
        )
      ] })
    }
  );
};
const SkeletonExample = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  React.useEffect(() => {
    setTimeout(() => {
      setData([
        { id: 1, title: "Título 1", description: "Descrição do item 1" },
        { id: 2, title: "Título 2", description: "Descrição do item 2" },
        { id: 3, title: "Título 3", description: "Descrição do item 3" }
      ]);
      setLoading(false);
    }, 3e3);
  }, []);
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "medium",
      title: "Lista com Skeleton Loading",
      description: "Exemplo de loading com skeleton",
      children: loading ? /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: /* @__PURE__ */ jsx(Loading.Skeleton, { count: 3, height: "80px", variant: "card" }) }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" }, children: data.map((item) => /* @__PURE__ */ jsx(
        Card,
        {
          variant: "outlined",
          size: "small",
          title: item.title,
          description: item.description
        },
        item.id
      )) })
    }
  );
};
const CompleteExample = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const { addToast } = useToast();
  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      addToast(`Passo ${step + 1} carregado!`, { type: "info" });
    } else {
      addToast("Formulário completo!", { type: "success" });
    }
  };
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const updateData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "large",
      title: "Formulário Multi-Passos",
      description: `Passo ${step} de 3`,
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "1.5rem" }, children: [
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "0.5rem", alignItems: "center" }, children: [1, 2, 3].map((i) => /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "100%",
              height: "4px",
              background: i <= step ? "#3b82f6" : "#e4e4e7",
              borderRadius: "2px",
              transition: "background 0.3s"
            },
            "aria-label": `Passo ${i} ${i <= step ? "completado" : "pendente"}`
          },
          i
        )) }),
        step === 1 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Input,
          {
            label: "Nome",
            placeholder: "Digite seu nome",
            value: formData.name || "",
            onChange: (e) => updateData("name", e.target.value),
            fullWidth: true
          }
        ) }),
        step === 2 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Input,
          {
            label: "Email",
            placeholder: "Digite seu email",
            value: formData.email || "",
            onChange: (e) => updateData("email", e.target.value),
            fullWidth: true
          }
        ) }),
        step === 3 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Input,
          {
            label: "Telefone",
            placeholder: "Digite seu telefone",
            value: formData.phone || "",
            onChange: (e) => updateData("phone", e.target.value),
            fullWidth: true
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "1rem", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "medium",
              onClick: prevStep,
              disabled: step === 1,
              ariaDisabled: step === 1,
              children: "Anterior"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "primary",
              size: "medium",
              onClick: nextStep,
              children: step === 3 ? "Finalizar" : "Próximo"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Card, { variant: "ghost", size: "small", title: "Dados Atuais", children: /* @__PURE__ */ jsx("pre", { style: { fontSize: "0.875rem", overflow: "auto" }, children: JSON.stringify(formData, null, 2) }) })
      ] })
    }
  );
};
const AllExamples = () => {
  const { computedTheme } = useTheme();
  return /* @__PURE__ */ jsx("div", { style: { padding: computedTheme.spacing.space[6] }, children: /* @__PURE__ */ jsx(
    Card,
    {
      variant: "elevated",
      size: "large",
      title: "Design System - Exemplos de Uso",
      description: "Coleção de exemplos práticos do Design System",
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: computedTheme.spacing.space[6] }, children: [
        /* @__PURE__ */ jsx(CompleteFormExample, {}),
        /* @__PURE__ */ jsx(DashboardExample, {}),
        /* @__PURE__ */ jsx(ModalExample, {}),
        /* @__PURE__ */ jsx(ListExample, {}),
        /* @__PURE__ */ jsx(AuthExample, {}),
        /* @__PURE__ */ jsx(ThemeExample, {}),
        /* @__PURE__ */ jsx(AccessibleListExample, {}),
        /* @__PURE__ */ jsx(RealTimeValidationExample, {}),
        /* @__PURE__ */ jsx(SkeletonExample, {}),
        /* @__PURE__ */ jsx(CompleteExample, {})
      ] })
    }
  ) });
};
const DesignSystemExamplesApp = () => {
  return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsxs(ToastProvider, { position: "top-right", duration: 3e3, children: [
    /* @__PURE__ */ jsx(SkipLinks, {}),
    /* @__PURE__ */ jsx(AllExamples, {})
  ] }) });
};
const $$DesignSystemDemo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Design System - Demo", "data-astro-cid-uszmew4l": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main data-astro-cid-uszmew4l> <div class="demo-container" data-astro-cid-uszmew4l> <header class="demo-header" data-astro-cid-uszmew4l> <h1 data-astro-cid-uszmew4l>Design System - Demonstração</h1> <p data-astro-cid-uszmew4l>Exemplos práticos de uso do Design System Neuro</p> </header> <div class="demo-content" data-astro-cid-uszmew4l> ${renderComponent($$result2, "DesignSystemExamplesApp", DesignSystemExamplesApp, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/lele/usenexo/getnexo-site/src/design-system/examples/ExampleUsage", "client:component-export": "DesignSystemExamplesApp", "data-astro-cid-uszmew4l": true })} </div> </div> </main> ` })} `;
}, "/home/lele/usenexo/getnexo-site/src/pages/design-system-demo.astro", void 0);
const $$file = "/home/lele/usenexo/getnexo-site/src/pages/design-system-demo.astro";
const $$url = "/design-system-demo";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$DesignSystemDemo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page,
  renderers
};
