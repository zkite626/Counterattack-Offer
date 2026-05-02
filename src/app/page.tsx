"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useInView } from "@/hooks/useIntersectionObserver";
import ThemeToggle from "@/components/ui/ThemeToggle";
import "./home.css";

/* ── 痛点数据 ── */
const PAINS = [
  { icon: "🎯", title: "方向不清晰", desc: "不知道能投什么岗位，迷茫焦虑" },
  { icon: "📄", title: "经历空白", desc: "简历空、没有亮点，不知道写什么" },
  { icon: "🔍", title: "盲目海投", desc: "不会匹配岗位，投了很多没有回音" },
  { icon: "✏️", title: "表达薄弱", desc: "简历写成流水账，不会提炼价值" },
  { icon: "😰", title: "害怕面试", desc: "不知道会被问什么，紧张到语无伦次" },
  { icon: "📈", title: "不知如何提升", desc: "能力差距大，不知道从哪里开始" },
];

/* ── 六步流程数据 ── */
const STEPS = [
  { icon: "🧠", title: "AI 求职画像", desc: "基于你的真实经历，构建个性化能力画像" },
  { icon: "🔄", title: "经历能力转译", desc: "将日常经历翻译为岗位核心能力" },
  { icon: "📋", title: "岗位 JD 解析", desc: "AI 解析岗位要求，提取关键能力项" },
  { icon: "📡", title: "人岗匹配雷达", desc: "多维度雷达图展示你的匹配程度" },
  { icon: "✨", title: "可信简历优化", desc: "基于真实经历优化，杜绝注水" },
  { icon: "🎤", title: "面试 + 能力计划", desc: "模拟追问 + 个性化提升路线" },
];

/* ── 功能卡片数据 ── */
const FEATURES = [
  { icon: "🧠", title: "AI 求职画像", desc: "通过 5 个真实经历，AI 为你提炼出专业能力画像，发现你都没意识到的岗位优势。", link: "/profile" },
  { icon: "🔄", title: "经历能力转译", desc: "不是编故事，而是帮你把社团、兼职、课堂项目翻译成企业认可的能力语言。", link: "/translation" },
  { icon: "📡", title: "人岗匹配雷达", desc: "上传目标 JD，多维度雷达图直观展示你的匹配度和差距项。", link: "/match" },
  { icon: "📄", title: "可信简历优化", desc: "AI 基于你的真实经历优化简历表达，保持可信度的同时大幅提升亮点。", link: "/resume" },
  { icon: "🎤", title: "面试模拟追问", desc: "AI 面试官根据你的简历进行深度追问，帮你提前准备真实面试场景。", link: "/interview" },
  { icon: "📈", title: "能力提升计划", desc: "针对匹配差距生成个性化提升路线图，按时间线推进你的求职竞争力。", link: "/plan" },
];

/* ── 导航栏组件 ── */
function HomeNav({ isDemo, onDemoClick }: { isDemo: boolean; onDemoClick: () => void }) {
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
      <span className="home-nav__brand">逆袭Offer</span>
      <div className="home-nav__actions">
        <ThemeToggle />
        {isAuthenticated ? (
          <button
            className="home-hero__btn-primary"
            style={{ padding: "var(--space-2) var(--space-5)", fontSize: "var(--text-sm)" }}
            onClick={() => router.push("/profile")}
          >
            进入工作台
          </button>
        ) : (
          <>
            <button
              className="home-hero__btn-demo"
              style={{ padding: "var(--space-2) var(--space-4)", fontSize: "var(--text-sm)", borderWidth: 1 }}
              onClick={onDemoClick}
              disabled={isDemo}
            >
              {isDemo ? "正在进入..." : "Demo 体验"}
            </button>
            <button
              className="home-hero__btn-primary"
              style={{ padding: "var(--space-2) var(--space-5)", fontSize: "var(--text-sm)" }}
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
function PainCard({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`home-pain-card ${isInView ? "home-pain-card--visible" : ""}`}
      style={isInView ? { animationDelay: `${index * 80}ms` } : undefined}
    >
      <span className="home-pain-card__icon">{icon}</span>
      <h3 className="home-pain-card__title">{title}</h3>
      <p className="home-pain-card__desc">{desc}</p>
    </div>
  );
}

/* ── 流程步骤组件 ── */
function SolutionStep({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`home-solution__step ${isInView ? "home-solution__step--visible" : ""}`}
      style={isInView ? { animationDelay: `${index * 100}ms` } : undefined}
    >
      <div className="home-solution__step-number">{index + 1}</div>
      <span className="home-solution__step-icon">{icon}</span>
      <h3 className="home-solution__step-title">{title}</h3>
      <p className="home-solution__step-desc">{desc}</p>
    </div>
  );
}

/* ── 功能卡片组件 ── */
function FeatureCard({ icon, title, desc, link, index }: { icon: string; title: string; desc: string; link: string; index: number }) {
  const router = useRouter();
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={`home-feature-card ${isInView ? "home-feature-card--visible" : ""}`}
      style={isInView ? { animationDelay: `${index * 80}ms` } : undefined}
    >
      <div className="home-feature-card__icon">{icon}</div>
      <h3 className="home-feature-card__title">{title}</h3>
      <p className="home-feature-card__desc">{desc}</p>
      <span
        className="home-feature-card__link"
        onClick={() => router.push(link)}
        role="button"
        tabIndex={0}
      >
        了解更多 →
      </span>
    </div>
  );
}

/* ── 首页主组件 ── */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Demo 模式 — 自动创建临时账户并登录
  const handleDemo = useCallback(async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch("/api/auth/demo", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        // 存储 Demo 标记
        sessionStorage.setItem("isDemoMode", "true");
        router.push("/profile");
      } else {
        console.error("Demo 创建失败:", data.error?.message);
      }
    } catch (err) {
      console.error("Demo 请求失败:", err);
    } finally {
      setIsDemoLoading(false);
    }
  }, [router]);

  // 平滑滚动到指定 Section
  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="home">
      {/* 导航栏 */}
      <HomeNav isDemo={isDemoLoading} onDemoClick={handleDemo} />

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

        {/* Hero 内容 */}
        <div className="home-hero__content">
          <h1 className="home-hero__title">逆袭Offer</h1>
          <p className="home-hero__subtitle">面向低经验大学生的 AI 求职突围智能体</p>
          <p className="home-hero__tagline">
            不是每个大学生都有耀眼实习，但每段真实经历都可能藏着岗位价值。
          </p>
          <div className="home-hero__buttons">
            {!isAuthenticated ? (
              <>
                <button
                  className="home-hero__btn-primary"
                  onClick={() => router.push("/login")}
                >
                  🚀 开始我的求职突围
                </button>
                <button
                  className="home-hero__btn-demo"
                  onClick={handleDemo}
                  disabled={isDemoLoading}
                >
                  ⚡ {isDemoLoading ? "正在准备..." : "一键体验 Demo"}
                </button>
              </>
            ) : (
              <button
                className="home-hero__btn-primary"
                onClick={() => router.push("/profile")}
              >
                🚀 进入工作台
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
            onClick={() => isAuthenticated ? router.push("/profile") : handleDemo()}
          >
            立即开始 →
          </button>
          <div className="home-cta__badges">
            <span className="home-cta__badge">
              <span className="home-cta__badge-icon">✅</span>
              真实经历
            </span>
            <span className="home-cta__badge">
              <span className="home-cta__badge-icon">🛡️</span>
              可信优化
            </span>
            <span className="home-cta__badge">
              <span className="home-cta__badge-icon">🔁</span>
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
