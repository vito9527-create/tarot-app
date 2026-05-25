'use client'
// ============================================================
// CardSpread.tsx — 牌陣佈局（自動計算座標，確保不重疊）
//
// 核心修正：
// 使用 bounding-box 映射取代固定 -1~1 映射
// 將 pos.x/pos.y 的最小值映射到左/上邊界（含 padding）
// 最大值映射到右/下邊界，確保每張牌都在容器內且不重疊
// ============================================================

import { motion } from 'framer-motion'
import type { DrawnCard, TarotCard, SpreadLayout } from '@/types/tarot'

interface CardSpreadProps {
  spread: SpreadLayout
  drawnCards: DrawnCard[]
  cardCache: Record<string, TarotCard>
}

// ── 每個牌陣的顯示參數（容器尺寸 + 卡片尺寸）─────────────
const LAYOUT_PARAMS: Record<string, {
  containerW: number; containerH: number; cardW: number; cardH: number
}> = {
  'single':          { containerW: 280, containerH: 400, cardW: 200, cardH: 320 },
  'daily-single':    { containerW: 280, containerH: 400, cardW: 200, cardH: 320 },
  'yesno-single':    { containerW: 280, containerH: 400, cardW: 200, cardH: 320 },
  'three-card':      { containerW: 600, containerH: 300, cardW: 130, cardH: 210 },
  'yesno-three':     { containerW: 600, containerH: 300, cardW: 130, cardH: 210 },
  'obstacle-advice': { containerW: 600, containerH: 300, cardW: 130, cardH: 210 },
  'five-cross':      { containerW: 520, containerH: 600, cardW: 104, cardH: 166 },
  'love-five':       { containerW: 520, containerH: 620, cardW: 104, cardH: 166 },
  'two-choices':     { containerW: 480, containerH: 560, cardW: 100, cardH: 160 },
  'seven-horseshoe': { containerW: 700, containerH: 420, cardW: 88,  cardH: 141 },
  'love-seven':      { containerW: 580, containerH: 620, cardW: 88,  cardH: 141 },
  'celtic-cross':    { containerW: 680, containerH: 580, cardW: 76,  cardH: 122 },
  'monthly':         { containerW: 660, containerH: 660, cardW: 72,  cardH: 115 },
}

const DEFAULT_PARAMS = { containerW: 600, containerH: 400, cardW: 100, cardH: 160 }

export function CardSpread({ spread, drawnCards, cardCache }: CardSpreadProps) {
  const params = LAYOUT_PARAMS[spread.id] ?? DEFAULT_PARAMS
  const { containerW, containerH, cardW, cardH } = params
  const padding = 24

  // ── Bounding-box 座標映射 ──────────────────────────────
  // 將 positions 的 x/y 最小～最大範圍映射到容器的 padding～containerSize-padding
  const xs = drawnCards.map(d => d.position.x)
  const ys = drawnCards.map(d => d.position.y)
  const xMin = Math.min(...xs), xMax = Math.max(...xs)
  const yMin = Math.min(...ys), yMax = Math.max(...ys)
  const xRange = xMax - xMin || 1   // 防止除以零（單卡）
  const yRange = yMax - yMin || 1

  // 可用的繪製範圍
  const drawW = containerW - 2 * padding - cardW
  const drawH = containerH - 2 * padding - cardH

  const toPixelX = (x: number) =>
    xMax === xMin
      ? containerW / 2                                     // 所有牌同 x → 水平居中
      : padding + cardW / 2 + ((x - xMin) / xRange) * drawW

  const toPixelY = (y: number) =>
    yMax === yMin
      ? containerH / 2                                     // 所有牌同 y → 垂直居中
      : padding + cardH / 2 + ((y - yMin) / yRange) * drawH

  return (
    <div
      className="relative mx-auto"
      style={{ width: containerW, height: containerH, maxWidth: '100%' }}
    >
      {drawnCards.map((drawn, i) => {
        const pos   = drawn.position
        const card  = cardCache[drawn.card_id]
        const cx    = toPixelX(pos.x)
        const cy    = toPixelY(pos.y)

        // 凱爾特十字陣的「挑戰」牌橫放
        const extraRot = pos.key === 'challenge' ? 90 : 0
        const totalRot = (pos.rotation ?? 0) + extraRot

        return (
          <motion.div
            key={pos.key}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 160, damping: 18 }}
            style={{
              position: 'absolute',
              left: cx - cardW / 2,
              top:  cy - cardH / 2,
              width: cardW,
              height: cardH,
              zIndex: i + 1,
              transform: `rotate(${totalRot}deg)`,
            }}
          >
            {/* 卡片本體 */}
            <div
              className="relative w-full h-full rounded-xl overflow-hidden"
              style={{
                transform: drawn.is_reversed ? 'rotate(180deg)' : undefined,
                border: '1.5px solid rgba(139,92,246,0.55)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
              }}
            >
              {card ? (
                <img
                  src={card.image}
                  alt={card.name_zh}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-violet-900/40 flex items-center justify-center">
                  <span className="text-white/30 text-xs">…</span>
                </div>
              )}

              {/* 逆位角標 */}
              {drawn.is_reversed && (
                <div className="absolute top-1 right-1 bg-rose-500/85 rounded px-1 text-[9px] text-white font-bold leading-4">
                  逆
                </div>
              )}
            </div>

            {/* 位置標籤（卡片外下方，隨卡片旋轉反向修正）*/}
            <div
              className="absolute whitespace-nowrap"
              style={{
                bottom: -(cardH * 0.18),
                left: '50%',
                transform: `translateX(-50%) rotate(${-totalRot}deg)`,
              }}
            >
              <span className="text-[11px] text-white/65 bg-black/55 px-2 py-0.5 rounded-full">
                {pos.label_zh}
              </span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
