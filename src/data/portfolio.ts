export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "EdTech" | "E-Commerce" | "Branding" | "B2B Services";
  description: string;
  features: string[];
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  gradient: string;
  accentColor: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  highlights: string[];
}

export interface PortfolioData {
  developer: {
    name: string;
    role: string;
    tagline: string;
    bio: string;
    status: {
      isAvailable: boolean;
      text: string;
    };
  };
  projects: Project[];
  services: Service[];
  skills: {
    category: string;
    items: string[];
  }[];
  contacts: {
    telegram: string;
    telegramDisplay: string;
    email: string;
    github: string;
    vk?: string;
  };
}

export const portfolioData: PortfolioData = {
  developer: {
    name: "Илья",
    role: "Frontend & Product Developer",
    tagline: "Разработка современных веб-сервисов и интеллектуальных чат-ботов",
    bio: "Специализируюсь на создании высокопроизводительных веб-интерфейсов на Next.js/React и разработке умных чат-ботов под ключ для Telegram, ВКонтакте и платформы MAX. Превращаю сложные бизнес-процессы в быстрые и понятные цифровые продукты.",
    status: {
      isAvailable: true,
      text: "Доступен для новых проектов и MVP",
    },
  },
  projects: [
    {
      id: "children-school",
      title: "Маленький Гений",
      subtitle: "Детский развивающий центр",
      category: "EdTech",
      description: "Современная платформа детского центра развития с удобной онлайн-записью на занятия, презентацией программ и преподавателей. Продуманный UX с упором на комфорт родителей и максимальную конверсию.",
      features: [
        "Интерактивная запись на пробные уроки",
        "Каталог направлений и возрастных групп",
        "Адаптивный мобильный интерфейс и быстрая загрузка",
      ],
      liveUrl: "https://children-school-zeta.vercel.app/",
      tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "UX/UI"],
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      accentColor: "#f59e0b",
    },
    {
      id: "children-shop",
      title: "Lille Atelier",
      subtitle: "Магазин премиальной детской одежды",
      category: "E-Commerce",
      description: "Эстетичный онлайн-бутик премиальной детской одежды. Минималистичный скандинавский стиль, плавный каталог коллекций, адаптивная корзина и оптимизация скорости работы на смартфонах.",
      features: [
        "Интерактивный лукбук и фильтрация коллекций",
        "Быстрый просмотр товаров и корзина",
        "Плавные микроанимации и высокая скорость отклика",
      ],
      liveUrl: "https://children-shoop.vercel.app/",
      tags: ["React", "E-Commerce", "Tailwind CSS", "Framer Motion", "Vercel"],
      gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
      accentColor: "#f43f5e",
    },
    {
      id: "wedding-agency",
      title: "MONOCHROME",
      subtitle: "Премиальное свадебное агентство",
      category: "Branding",
      description: "Концептуальный сайт свадебного агентства в строгой монохромной эстетике. Презентация портфолио авторских торжеств, визуальный сторителлинг и форма персонального бронирования дат.",
      features: [
        "Курируемая галерея свадебных кейсов",
        "Атмосферная типографика и темный монохром",
        "Интерактивная форма брифа и консультации",
      ],
      liveUrl: "https://wedding-agency-amber.vercel.app/",
      tags: ["Next.js", "Creative Design", "Minimalism", "Tailwind CSS"],
      gradient: "from-zinc-400/20 via-neutral-500/10 to-transparent",
      accentColor: "#a1a1aa",
    },
    {
      id: "landing-auto",
      title: "MONOLITH TRUCK",
      subtitle: "Сервис тяжелых грузовых автомобилей",
      category: "B2B Services",
      description: "Индустриальный B2B-лендинг для сервисного центра грузового и коммерческого транспорта. Структурированный каталог услуг, калькулятор ТО и экспресс-заявка на эвакуацию и ремонт.",
      features: [
        "Каталог услуг по ремонту спецтехники и тягачей",
        "Кнопка экстренной связи и онлайн-расчет",
        "Строгий индустриальный дизайн высокой контрастности",
      ],
      liveUrl: "https://landing-auto-one.vercel.app/",
      tags: ["React", "B2B Landing", "Tailwind CSS", "Responsive"],
      gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
      accentColor: "#0ea5e9",
    },
  ],
  services: [
    {
      id: "frontend",
      title: "Веб-разработка & MVP",
      description: "Создание быстрых, адаптивных веб-приложений, сервисов и лендингов с конверсией. Полный цикл от архитектуры интерфейса до деплоя на Vercel.",
      icon: "Code2",
      badge: "Core Stack",
      highlights: [
        "Next.js (App Router), React, TypeScript",
        "Интерактивные 3D элементы и Framer Motion анимации",
        "Tailwind CSS, адаптивность под мобильные устройства",
        "PageSpeed 95+ и чистый поддерживаемый код",
      ],
    },
    {
      id: "chatbots",
      title: "Чат-боты & Автоматизация",
      description: "Разработка многофункциональных ботов для бизнеса и стартапов. Автоматизация продаж, поддержки, воронки прогрева и интеграции с CRM.",
      icon: "Bot",
      badge: "Automation",
      highlights: [
        "Telegram боты и Telegram Web Apps (TWA/Mini Apps)",
        "Чат-боты ВКонтакте (VK API) для сообществ и магазинов",
        "Интеграция с корпоративной платформой MAX",
        "Прием платежей, рассылки, базы данных и вебхуки",
      ],
    },
    {
      id: "product-support",
      title: "Продуктовое сопровождение",
      description: "Помощь фаундерам в проверке продуктовых гипотез, доработке существующего функционала, рефакторинге и масштабировании.",
      icon: "Rocket",
      badge: "Partnership",
      highlights: [
        "Быстрый запуск первой версии (MVP за 2–3 недели)",
        "Аудит производительности и SEO оптимизация",
        "Техническая поддержка и интеграция сторонних API",
      ],
    },
  ],
  skills: [
    {
      category: "Frontend & Web",
      items: ["Next.js", "React", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 / CSS3", "Framer Motion", "Three.js / R3F"],
    },
    {
      category: "Боты & Бэкенд",
      items: ["Telegram Bot API", "Telegram Mini Apps", "VK API", "MAX Platform", "Node.js", "REST APIs", "Webhooks"],
    },
    {
      category: "Инструменты & Деплой",
      items: ["Vercel", "Git / GitHub", "VS Code", "Figma", "Postman", "npm / pnpm"],
    },
  ],
  contacts: {
    telegram: "https://t.me/telegram_username",
    telegramDisplay: "@telegram_username",
    email: "ilya.dev@example.com",
    github: "https://github.com/",
    vk: "https://vk.com/",
  },
};
