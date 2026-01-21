// Local Business Structured Data Ultra Otimizado
// Estratégia: Schema LocalBusiness para Google My Business + Local SEO

export const localBusinessSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "LocalBusiness",
            "@id": "https://getnexo.com.br/#local-business",
            "name": "GetNexo - IA para WhatsApp Business",
            "alternateName": "GetNexo Tecnologia",
            "description": "Plataforma brasileira de IA especializada em WhatsApp Business API. Automação completa de vendas e atendimento para e-commerce e empresas.",
            "url": "https://getnexo.com.br",
            "logo": {
                "@type": "ImageObject",
                "url": "https://getnexo.com.br/assets/logo-getnexo.png",
                "width": 400,
                "height": 400
            },
            "image": [
                "https://getnexo.com.br/assets/og-poster.jpg",
                "https://getnexo.com.br/assets/dashboard-preview.jpg"
            ],

            // Informações de contato detalhadas
            "telephone": "+55-11-99999-9999",
            "email": "contato@getnexo.com.br",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-11-99999-9999",
                "contactType": "customer service",
                "availableLanguage": ["Portuguese", "English"],
                "hoursAvailable": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "09:00",
                    "closes": "18:00"
                }
            },

            // Localização física (escritório)
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rua Example, 123",
                "addressLocality": "São Paulo",
                "addressRegion": "SP",
                "postalCode": "01234-567",
                "addressCountry": "BR"
            },

            // Área de atuação geográfica
            "areaServed": [
                {
                    "@type": "Country",
                    "name": "Brazil"
                },
                {
                    "@type": "State",
                    "name": "São Paulo"
                },
                {
                    "@type": "City",
                    "name": "São Paulo"
                }
            ],

            // Serviços oferecidos
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Soluções GetNexo",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Automação WhatsApp Business",
                            "description": "IA completa para atendimento e vendas 24/7"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Integração ERP WhatsApp",
                            "description": "Conexão com Bling, Tiny, Sankhya e outros ERPs"
                        }
                    },
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Consultoria WhatsApp",
                            "description": "Implementação e otimização de estratégias"
                        }
                    }
                ]
            },

            // Informações da empresa
            "foundingDate": "2024",
            "founder": {
                "@type": "Person",
                "name": "Equipe GetNexo"
            },
            "employee": {
                "@type": "QuantitativeValue",
                "value": "10+"
            },

            // Reviews e avaliações
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "150",
                "bestRating": "5",
                "worstRating": "1"
            },

            // Organizações parceiras
            "hasCredential": [
                {
                    "@type": "EducationalOccupationalCredential",
                    "name": "Meta Business Partner",
                    "credentialCategory": "certification"
                },
                {
                    "@type": "EducationalOccupationalCredential",
                    "name": "LGPD Compliance",
                    "credentialCategory": "certification"
                }
            ],

            // Redes sociais
            "sameAs": [
                "https://www.linkedin.com/company/getnexo",
                "https://github.com/lelebrr",
                "https://wa.me/5511999999999"
            ],

            // Informações técnicas
            "knowsAbout": [
                "WhatsApp Business API",
                "Inteligência Artificial",
                "Automação de Vendas",
                "E-commerce",
                "CRM Integration",
                "ERP Systems"
            ],

            // Horários de funcionamento
            "openingHoursSpecification": [
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "Monday",
                    "opens": "09:00",
                    "closes": "18:00"
                },
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "Tuesday",
                    "opens": "09:00",
                    "closes": "18:00"
                },
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "Wednesday",
                    "opens": "09:00",
                    "closes": "18:00"
                },
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "Thursday",
                    "opens": "09:00",
                    "closes": "18:00"
                },
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "Friday",
                    "opens": "09:00",
                    "closes": "18:00"
                },
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": "Saturday",
                    "opens": "09:00",
                    "closes": "12:00"
                }
            ],

            // Métodos de pagamento aceitos
            "paymentAccepted": ["Credit Card", "Debit Card", "Bank Transfer", "PIX"],
            "currenciesAccepted": "BRL",

            // Preços e faixas
            "priceRange": "$$"
        },

        // Organization Schema adicional
        {
            "@type": "Organization",
            "@id": "https://getnexo.com.br/#organization",
            "name": "GetNexo Tecnologia Ltda",
            "legalName": "GetNexo Tecnologia Ltda",
            "taxID": "12.345.678/0001-90",
            "url": "https://getnexo.com.br",
            "logo": "https://getnexo.com.br/assets/logo-getnexo.png",
            "foundingDate": "2024",
            "foundingLocation": {
                "@type": "City",
                "name": "São Paulo",
                "addressRegion": "SP",
                "addressCountry": "BR"
            },

            // Informações de contato da organização
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-11-99999-9999",
                "contactType": "customer service",
                "areaServed": "BR",
                "availableLanguage": "pt-BR",
                "hoursAvailable": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "09:00",
                    "closes": "18:00"
                }
            },

            // Endereço comercial
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rua Example, 123 - Sala 456",
                "addressLocality": "São Paulo",
                "addressRegion": "SP",
                "postalCode": "01234-567",
                "addressCountry": "BR"
            }
        },

        // WebSite Schema para SEO local
        {
            "@type": "WebSite",
            "@id": "https://getnexo.com.br/#website",
            "url": "https://getnexo.com.br",
            "name": "GetNexo - IA para WhatsApp Business",
            "description": "Plataforma brasileira de automação WhatsApp com IA. Self-hosted, sem mensalidade básica, API oficial Meta.",
            "publisher": {
                "@id": "https://getnexo.com.br/#organization"
            },
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://getnexo.com.br/busca?q={search_term_string}",
                "query-input": "required name=search_term_string"
            },
            "inLanguage": "pt-BR",

            // Breadcrumbs estruturado
            "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://getnexo.com.br"
                    }
                ]
            }
        },

        // GeoCoordinates para localização
        {
            "@type": "GeoCoordinates",
            "latitude": "-23.550520",
            "longitude": "-46.633308",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Rua Example, 123",
                "addressLocality": "São Paulo",
                "addressRegion": "SP",
                "addressCountry": "BR"
            }
        }
    ]
};

// Geo-targeting keywords por região
export const geoTargetingKeywords = {
    saoPaulo: [
        "WhatsApp Business São Paulo",
        "Automação WhatsApp SP",
        "IA WhatsApp São Paulo",
        "Consultoria WhatsApp capital",
        "WhatsApp e-commerce São Paulo"
    ],
    rioDeJaneiro: [
        "WhatsApp Business Rio",
        "Automação WhatsApp RJ",
        "IA WhatsApp Rio de Janeiro",
        "Consultoria WhatsApp Rio",
        "WhatsApp e-commerce Rio"
    ],
    beloHorizonte: [
        "WhatsApp Business BH",
        "Automação WhatsApp Minas",
        "IA WhatsApp Belo Horizonte",
        "Consultoria WhatsApp MG",
        "WhatsApp e-commerce Minas"
    ],
    // Adicionar mais regiões conforme necessário
};

// Local business FAQs para featured snippets
export const localBusinessFAQs = [
    {
        question: "GetNexo atende em São Paulo?",
        answer: "Sim! Temos escritório em São Paulo/SP e atendemos clientes presencialmente na capital e região metropolitana."
    },
    {
        question: "Como agendar consultoria GetNexo?",
        answer: "Agende sua consultoria gratuita através do WhatsApp (11) 99999-9999 ou pelo formulário de contato no site."
    },
    {
        question: "GetNexo é empresa brasileira?",
        answer: "Completamente! GetNexo é 100% brasileira, desenvolvida em São Paulo, com suporte em português e compliance LGPD."
    },
    {
        question: "Qual o endereço da GetNexo?",
        answer: "Nosso escritório fica na Rua Example, 123 - São Paulo/SP. Atendemos também remotamente em todo Brasil."
    }
];