import { useMemo } from 'react';
import { renderLatex } from '../utils/latex';
import { Image as ImageIcon, Brain, Target, BarChart3, List, CheckCircle, BookOpen, Clock } from 'lucide-react';

interface ToolOutputRendererProps {
  content: string;
}

/**
 * Detect and render Coze tool outputs (plot, error notebook, study planner)
 * alongside normal LaTeX-rendered text.
 */
export default function ToolOutputRenderer({ content }: ToolOutputRendererProps) {
  const rendered = useMemo(() => processContent(content), [content]);

  if (rendered.type === 'plain') {
    return (
      <div
        className="text-sm text-math-text leading-relaxed [&_.katex]:text-base prose-custom"
        dangerouslySetInnerHTML={{ __html: rendered.html }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {rendered.blocks.map((block, i) => (
        <div key={i}>{block}</div>
      ))}
    </div>
  );
}

// ─── Content processing ──────────────────────────────────────

interface PlainResult {
  type: 'plain';
  html: string;
}

interface StructuredResult {
  type: 'structured';
  blocks: React.ReactNode[];
}

type ProcessResult = PlainResult | StructuredResult;

function processContent(content: string): ProcessResult {
  const blocks: React.ReactNode[] = [];
  let remaining = content;
  let foundStructure = false;

  while (remaining.length > 0) {
    // 1) Check for markdown image (plot output)
    const imgMatch = remaining.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imgMatch && imgMatch.index! > 0) {
      // text before the image
      const before = remaining.slice(0, imgMatch.index);
      const textHtml = renderLatex(before);
      if (textHtml.trim()) {
        foundStructure = true;
        blocks.push(
          <div
            className="text-sm text-math-text leading-relaxed [&_.katex]:text-base prose-custom"
            dangerouslySetInnerHTML={{ __html: textHtml }}
          />
        );
      }
    }

    if (imgMatch) {
      foundStructure = true;
      blocks.push(
        <PlotImage key={`img-${blocks.length}`} src={imgMatch[2]} alt={imgMatch[1]} />
      );
      remaining = remaining.slice(imgMatch.index! + imgMatch[0].length);
      continue;
    }

    // 2) Check for error notebook: structured sections with emoji headers
    const sectionRegex = /(✅\s*(错题已记录|已标记为掌握)|⚠️\s*错题列表|📊\s*薄弱知识点分析|📋\s*复习进度总览|🎯\s*目标分数)/;
    const sectionMatch = remaining.match(sectionRegex);
    if (sectionMatch && sectionMatch.index! > 0) {
      const before = remaining.slice(0, sectionMatch.index);
      const textHtml = renderLatex(before);
      if (textHtml.trim()) {
        blocks.push(
          <div
            className="text-sm text-math-text leading-relaxed [&_.katex]:text-base prose-custom"
            dangerouslySetInnerHTML={{ __html: textHtml }}
          />
        );
      }
    }

    if (sectionMatch) {
      foundStructure = true;
      const section = sectionMatch[1];
      const start = sectionMatch.index!;
      // look for next section or end
      const nextSection = remaining.slice(start + sectionMatch[0].length).match(/(✅|⚠️|📊|📋|🎯|📅)/);
      const end = nextSection
        ? start + sectionMatch[0].length + nextSection.index!
        : remaining.length;

      const sectionContent = remaining.slice(start, end);

      if (section.includes('错题已记录')) {
        blocks.push(<ErrorAddResult key={`block-${blocks.length}`} content={sectionContent} />);
      } else if (section.includes('已标记为掌握')) {
        blocks.push(<MarkMasteredResult key={`block-${blocks.length}`} content={sectionContent} />);
      } else if (section.includes('错题列表')) {
        blocks.push(<ErrorListResult key={`block-${blocks.length}`} content={sectionContent} />);
      } else if (section.includes('薄弱知识点')) {
        blocks.push(<WeakPointsResult key={`block-${blocks.length}`} content={sectionContent} />);
      } else if (section.includes('目标分数')) {
        blocks.push(<StudyPlanResult key={`block-${blocks.length}`} content={sectionContent} />);
      } else if (section.includes('复习进度')) {
        blocks.push(<StudyPlanResult key={`block-${blocks.length}`} content={sectionContent} />);
      } else {
        blocks.push(
          <div
            className="text-sm text-math-text leading-relaxed [&_.katex]:text-base prose-custom"
            dangerouslySetInnerHTML={{ __html: renderLatex(sectionContent) }}
          />
        );
      }

      remaining = remaining.slice(end);
      continue;
    }

    // 3) No structure detected → plain text with LaTeX
    const html = renderLatex(remaining);
    if (!foundStructure) {
      return { type: 'plain', html };
    }
    if (html.trim()) {
      blocks.push(
        <div
          className="text-sm text-math-text leading-relaxed [&_.katex]:text-base prose-custom"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }
    break;
  }

  return { type: 'structured', blocks };
}

// ─── Sub-components for each tool output ────────────────────

/** Plot image */
function PlotImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="my-2 rounded-lg border border-white/10 bg-math-bg/40 p-2 text-center">
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-80 mx-auto rounded object-contain"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          target.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <p className="text-xs text-math-text-muted/50 mt-1 hidden">
        <ImageIcon size={12} className="inline mr-1" />
        图像加载失败
      </p>
    </div>
  );
}

/** ✅ 错题已记录 */
function ErrorAddResult({ content }: { content: string }) {
  const lines = content.split('\n').filter(Boolean);
  const topic = lines.find(l => l.includes('知识点')) || '';
  const errorType = lines.find(l => l.includes('错误类型')) || '';
  const errorId = lines.find(l => l.includes('错题编号')) || '';
  const total = lines.find(l => l.includes('累计') || l.includes('错题本')) || '';

  return (
    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
      <div className="flex items-center gap-2 text-green-400 font-medium text-sm mb-2">
        <CheckCircle size={16} />
        错题已记录
      </div>
      <div className="space-y-1 text-xs text-math-text ml-6">
        {topic && <div>{topic.replace(/^[\s*-]*/, '')}</div>}
        {errorType && <div>{errorType.replace(/^[\s*-]*/, '')}</div>}
        {errorId && <div className="font-mono text-math-text-muted">{errorId.replace(/^[\s*-]*/, '')}</div>}
        {total && <div className="text-math-gold/80 mt-1">{total.replace(/^[\s*-]*/, '')}</div>}
      </div>
    </div>
  );
}

/** ✅ 已标记为掌握 */
function MarkMasteredResult({ content }: { content: string }) {
  return (
    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
      <div className="flex items-center gap-2 text-blue-400 font-medium text-sm">
        <CheckCircle size={16} />
        已标记为掌握
      </div>
    </div>
  );
}

/** ⚠️ 错题列表 */
function ErrorListResult({ content }: { content: string }) {
  const lines = content.split('\n').filter(Boolean);
  const entries: { question?: string; error?: string; type?: string; topic?: string }[] = [];
  let current: (typeof entries)[0] = {};

  for (const line of lines) {
    if (line.startsWith('###') || line.match(/^\d+[.、]/)) {
      if (current.question) entries.push(current);
      current = {};
    } else if (line.includes('题目') || line.includes('题')) {
      current.question = line.replace(/^[\s*-]*/, '');
    } else if (line.includes('错误') || line.includes('作答')) {
      current.error = line.replace(/^[\s*-]*/, '');
    } else if (line.includes('类型')) {
      current.type = line.replace(/^[\s*-]*/, '');
    } else if (line.includes('知识点') || line.includes('主题')) {
      current.topic = line.replace(/^[\s*-]*/, '');
    }
  }
  if (current.question) entries.push(current);

  if (entries.length === 0) {
    return (
      <div
        className="text-sm text-math-text leading-relaxed prose-custom"
        dangerouslySetInnerHTML={{ __html: renderLatex(content) }}
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-amber-400 font-medium text-sm">
        <List size={16} />
        错题列表
      </div>
      <div className="grid gap-2">
        {entries.map((e, i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
            <div className="text-xs font-medium text-math-text mb-1">
              {i + 1}. {e.question}
            </div>
            <div className="flex flex-wrap gap-2 text-[10px]">
              {e.type && (
                <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  {e.type.replace(/^[\s*-]*错误类型[：:]\s*/, '')}
                </span>
              )}
              {e.topic && (
                <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {e.topic.replace(/^[\s*-]*/, '')}
                </span>
              )}
            </div>
            {e.error && (
              <div className="text-[10px] text-math-text-muted/70 mt-1 ml-1">
                {e.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** 📊 薄弱知识点分析 */
function WeakPointsResult({ content }: { content: string }) {
  const lines = content.split('\n').filter(Boolean);
  const topics: { name: string; percentage: number }[] = [];

  for (const line of lines) {
    const match = line.match(/[-•*]\s*(.+?)[:：]\s*(\d+(\.\d+)?)%/);
    if (match) {
      topics.push({
        name: match[1].trim(),
        percentage: parseFloat(match[2]),
      });
    }
  }

  if (topics.length === 0) {
    return (
      <div
        className="text-sm text-math-text leading-relaxed prose-custom"
        dangerouslySetInnerHTML={{ __html: renderLatex(content) }}
      />
    );
  }

  const maxPct = Math.max(...topics.map(t => t.percentage));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
        <Brain size={16} />
        薄弱知识点分析
      </div>
      <div className="space-y-2">
        {topics.map((t, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-math-text">{t.name}</span>
              <span className="text-math-text-muted">{t.percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500/60 to-amber-400/60 transition-all duration-500"
                style={{ width: `${(t.percentage / maxPct) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 🎯 目标分数 / 复习计划 */
function StudyPlanResult({ content }: { content: string }) {
  const lines = content.split('\n').filter(Boolean);

  // extract key metrics
  const scoreMatch = content.match(/目标分数[：:]\s*(\d+)/);
  const hoursMatch = content.match(/(\d+(\.\d+)?)\s*小时/);
  const weeksMatch = content.match(/(\d+)\s*周/);

  // extract stages
  const stages: { name: string; hours: string }[] = [];
  for (const line of lines) {
    const stageMatch = line.match(/[-•*]\s*(基础阶段|强化阶段|真题阶段|冲刺阶段)[：:]\s*([\d.]+h?)/);
    if (stageMatch) {
      stages.push({ name: stageMatch[1], hours: stageMatch[2] });
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-blue-400 font-medium text-sm">
        <Target size={16} />
        复习计划
      </div>

      {/* metrics */}
      <div className="grid grid-cols-3 gap-2">
        {scoreMatch && (
          <div className="rounded-lg border border-math-gold/20 bg-math-gold/5 p-2 text-center">
            <div className="text-lg font-bold text-math-gold">{scoreMatch[1]}</div>
            <div className="text-[10px] text-math-text-muted/60">目标分数</div>
          </div>
        )}
        {hoursMatch && (
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-2 text-center">
            <div className="text-lg font-bold text-blue-400">{hoursMatch[1]}h</div>
            <div className="text-[10px] text-math-text-muted/60">每日学习</div>
          </div>
        )}
        {weeksMatch && (
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-2 text-center">
            <div className="text-lg font-bold text-purple-400">{weeksMatch[1]}</div>
            <div className="text-[10px] text-math-text-muted/60">总周数</div>
          </div>
        )}
      </div>

      {/* stages */}
      {stages.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-widest text-math-text-muted/30">阶段规划</div>
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full ${stageColor(i)}`} />
              <span className="text-math-text">{s.name}</span>
              <span className="text-math-text-muted/50 ml-auto">{s.hours}</span>
            </div>
          ))}
        </div>
      )}

      {/* raw text below (summary etc.) */}
      <div
        className="text-sm text-math-text leading-relaxed prose-custom"
        dangerouslySetInnerHTML={{
          __html: renderLatex(
            lines
              .filter(l => !l.includes('目标分数') && !l.includes('总复习时长') && !l.includes('每日可学'))
              .join('\n')
          ),
        }}
      />
    </div>
  );
}

function stageColor(i: number): string {
  const colors = ['bg-green-400', 'bg-blue-400', 'bg-amber-400', 'bg-red-400'];
  return colors[i % colors.length];
}
