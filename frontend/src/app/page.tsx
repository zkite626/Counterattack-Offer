"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useInView } from "@/hooks/useIntersectionObserver";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import ThemeToggle from "@/components/ui/ThemeToggle";
import "./home.css";

/* ── 痛点数据 ── */
const PAINS: { icon: IconName; title: string; desc: string }[] = [
  { icon: "target", title: "方向不清晰", desc: "不知道能投什么岗位，迷茫焦虑" },
  { icon: "document", title: "经历空白", desc: "简历空、没有亮点，不知道写什么" },
  { icon: "search", title: "盲目海投", desc: "不会匹配岗位，投了很多没有回音" },
  { icon: "pen", title: "表达薄弱", desc: "简历写成流水账，不会提炼价值" },
  { icon: "warning", title: "害怕面试", desc: "不知道会被问什么，紧张到语无伦次" },
  { icon: "trending", title: "不知如何提升", desc: "能力差距大，不知道从哪里开始" },
];

/* ── 六步流程数据 ── */
const STEPS: { icon: IconName; title: string; desc: string }[] = [
  { icon: "brain", title: "AI 求职画像", desc: "基于你的真实经历，构建个性化能力画像" },
  { icon: "swap", title: "经历能力转译", desc: "将日常经历翻译为岗位核心能力" },
  { icon: "briefcase", title: "岗位 JD 解析", desc: "AI 解析岗位要求，提取关键能力项" },
  { icon: "radar", title: "人岗匹配雷达", desc: "多维度雷达图展示你的匹配程度" },
  { icon: "sparkle", title: "可信简历优化", desc: "基于真实经历优化，杜绝注水" },
  { icon: "mic", title: "面试 + 能力计划", desc: "模拟追问 + 个性化提升路线" },
];

/* ── 功能卡片数据 ── */
const FEATURES: { icon: IconName; title: string; desc: string; link: string }[] = [
  { icon: "brain", title: "AI 求职画像", desc: "通过 5 个真实经历，AI 为你提炼出专业能力画像，发现你都没意识到的岗位优势。", link: "/profile" },
  { icon: "swap", title: "经历能力转译", desc: "不是编故事，而是帮你把社团、兼职、课堂项目翻译成企业认可的能力语言。", link: "/translation" },
  { icon: "radar", title: "人岗匹配雷达", desc: "上传目标 JD，多维度雷达图直观展示你的匹配度和差距项。", link: "/match" },
  { icon: "document", title: "可信简历优化", desc: "AI 基于你的真实经历优化简历表达，保持可信度的同时大幅提升亮点。", link: "/resume" },
  { icon: "mic", title: "面试模拟追问", desc: "AI 面试官根据你的简历进行深度追问，帮你提前准备真实面试场景。", link: "/interview" },
  { icon: "trending", title: "能力提升计划", desc: "针对匹配差距生成个性化提升路线图，按时间线推进你的求职竞争力。", link: "/plan" },
];

/* ── Hero 悬浮图标装饰 ── */
const HERO_FLOATERS: { icon: IconName; className: string }[] = [
  { icon: "document", className: "home-hero__floater--doc" },
  { icon: "briefcase", className: "home-hero__floater--briefcase" },
  { icon: "user-group", className: "home-hero__floater--group" },
  { icon: "clipboard", className: "home-hero__floater--clipboard" },
];

/* ── 导航栏组件 ── */
function HomeNav() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`home-nav ${scrolled ? "home-nav--scrolled" : ""}`}>
      <button
        className="home-nav__brand"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="返回首页顶部"
      >
        <picture>
          <source srcSet="/logo-wide-dark.webp" type="image/webp" />
          <img src="/logo-wide-dark.png" alt="逆袭Offer" className="home-nav__brand-image" />
        </picture>
      </button>
      <div className="home-nav__actions">
        <ThemeToggle />
        {isAuthenticated ? (
          <button
            className="home-nav__btn home-nav__btn--primary"
            onClick={() => router.push("/profile")}
          >
            进入工作台
          </button>
        ) : (
          <>
            <button
              className="home-nav__btn home-nav__btn--ghost"
              onClick={() => router.push("/register")}
            >
              注册
            </button>
            <button
              className="home-nav__btn home-nav__btn--primary"
              onClick={() => router.push("/login")}
            >
              登录
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

/* ── 痛点卡片组件 ── */
function PainCard({ icon, title, desc, index }: { icon: IconName; title: string; desc: string; index: number }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`home-pain-card ${isInView ? "home-pain-card--visible" : ""}`}
      style={isInView ? { animationDelay: `${index * 80}ms` } : undefined}
    >
      <span className="home-pain-card__icon"><Icon name={icon} size="2rem" /></span>
      <h3 className="home-pain-card__title">{title}</h3>
      <p className="home-pain-card__desc">{desc}</p>
    </div>
  );
}

/* ── 流程步骤组件 ── */
function SolutionStep({ icon, title, desc, index }: { icon: IconName; title: string; desc: string; index: number }) {
  const { ref, isInView } = useInView();
  const stepNumber = index + 1;

  return (
    <div
      ref={ref}
      className={`home-solution__step home-solution__step--${stepNumber} ${isInView ? "home-solution__step--visible" : ""}`}
      style={isInView ? { animationDelay: `${index * 100}ms` } : undefined}
    >
      <div className="home-solution__step-number">{stepNumber}</div>
      <span className="home-solution__step-icon"><Icon name={icon} size="1.5em" /></span>
      <h3 className="home-solution__step-title">{title}</h3>
      <p className="home-solution__step-desc">{desc}</p>
    </div>
  );
}

/* ── 功能卡片组件 ── */
function FeatureCard({ icon, title, desc, link, index }: { icon: IconName; title: string; desc: string; link: string; index: number }) {
  const router = useRouter();
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`home-feature-card ${isInView ? "home-feature-card--visible" : ""}`}
      style={isInView ? { animationDelay: `${index * 80}ms` } : undefined}
    >
      <div className="home-feature-card__icon"><Icon name={icon} size="2.5rem" /></div>
      <h3 className="home-feature-card__title">{title}</h3>
      <p className="home-feature-card__desc">{desc}</p>
      <button
        className="home-feature-card__link"
        onClick={() => router.push(link)}
      >
        了解更多 <Icon name="arrow-right" size="1em" />
      </button>
    </div>
  );
}

/* ── 首页主组件 ── */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // 平滑滚动到指定 Section
  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="home">
      {/* 导航栏 */}
      <HomeNav />

      {/* ── Hero 区 (5.1) ── */}
      <section className="home-hero">
        {/* 粒子光效 */}
        <div className="home-hero__particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="home-hero__particle" />
          ))}
        </div>

        {/* 光晕 */}
        <div className="home-hero__glow home-hero__glow--1" />
        <div className="home-hero__glow home-hero__glow--2" />
        <div className="home-hero__glow home-hero__glow--3" />

        <div className="home-hero__art" aria-hidden="true" />
        <div className="home-hero__orbit" aria-hidden="true">
          {HERO_FLOATERS.map((item) => (
            <span key={item.className} className={`home-hero__floater ${item.className}`}>
              <Icon name={item.icon} size="1.35em" />
            </span>
          ))}
        </div>

        {/* Hero 内容 */}
        <div className="home-hero__content">
          <h1 className="home-hero__sr-title">逆袭Offer：AI 求职突围智能体</h1>
          <div className="home-hero__brand-lockup" aria-hidden="true">
            <picture>
              <source srcSet="/logo-wide-dark.webp" type="image/webp" />
              <img src="/logo-wide-dark.png" alt="" className="home-hero__logo" />
            </picture>
          </div>
          <p className="home-hero__subtitle">面向低经验大学生的 AI 求职突围智能体</p>
          <p className="home-hero__tagline">
            不是每个大学生都有耀眼实习，但每段真实经历都可能藏着岗位价值。
          </p>
          <div className="home-hero__buttons">
            {!isAuthenticated ? (
              <>
                <button
                  className="home-hero__btn-primary"
                  onClick={() => router.push("/register")}
                >
                  开始我的求职突围 <Icon name="arrow-right" size="1em" />
                </button>
                <button
                  className="home-hero__btn-demo"
                  onClick={() => router.push("/login")}
                >
                  已有账号？登录
                </button>
              </>
            ) : (
              <button
                className="home-hero__btn-primary"
                onClick={() => router.push("/profile")}
              >
                进入工作台 <Icon name="arrow-right" size="1em" />
              </button>
            )}
          </div>
        </div>

        {/* 向下滚动提示 */}
        <div className="home-hero__scroll" onClick={() => scrollToSection("pains")}>
          <span>向下探索</span>
          <div className="home-hero__scroll-arrow" />
        </div>
      </section>

      {/* ── 痛点区 (5.2) ── */}
      <section id="pains" className="home-section home-pains">
        <div className="home-section__header">
          <span className="home-section__tag">你是否也有这些困扰？</span>
          <h2 className="home-section__title">低经验大学生的求职困境</h2>
          <p className="home-section__desc">
            没有耀眼实习、没有丰富项目，但你的真实经历同样有力量
          </p>
        </div>
        <div className="home-pains__grid">
          {PAINS.map((pain, i) => (
            <PainCard key={pain.title} {...pain} index={i} />
          ))}
        </div>
      </section>

      {/* ── 解决方案区 (5.3) ── */}
      <section className="home-section home-solution">
        <div className="home-section__header">
          <span className="home-section__tag">六步闭环</span>
          <h2 className="home-section__title">AI 驱动的求职突围路径</h2>
          <p className="home-section__desc">
            从经历挖掘到面试准备，AI 全程陪跑
          </p>
        </div>
        <div className="home-solution__steps">
          {STEPS.map((step, i) => (
            <SolutionStep key={step.title} {...step} index={i} />
          ))}
        </div>
      </section>

      {/* ── 功能区 (5.4) ── */}
      <section className="home-section home-features">
        <div className="home-section__header">
          <span className="home-section__tag">核心功能</span>
          <h2 className="home-section__title">每个环节都为你量身打造</h2>
          <p className="home-section__desc">
            不是通用的求职工具，而是专为低经验学生设计的 AI 突围系统
          </p>
        </div>
        <div className="home-features__grid">
          {FEATURES.map((feat, i) => (
            <FeatureCard key={feat.title} {...feat} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA 底部区 (5.5) ── */}
      <section className="home-cta">
        <div className="home-cta__glow home-cta__glow--1" />
        <div className="home-cta__glow home-cta__glow--2" />
        <div className="home-cta__content">
          <h2 className="home-cta__title">让 AI 帮你发现经历中的岗位价值</h2>
          <button
            className="home-cta__btn"
            onClick={() => isAuthenticated ? router.push("/profile") : router.push("/register")}
          >
            立即开始 <Icon name="arrow-right" size="1em" />
          </button>
          <div className="home-cta__badges">
            <span className="home-cta__badge">
              <Icon name="check-badge" size="1.25em" />
              真实经历
            </span>
            <span className="home-cta__badge">
              <Icon name="shield" size="1.25em" />
              可信优化
            </span>
            <span className="home-cta__badge">
              <Icon name="repeat" size="1.25em" />
              完整闭环
            </span>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="home-footer">
        © {new Date().getFullYear()} 逆袭Offer — 让每段经历都有价值
      </footer>
    </div>
  );
}
