import { motion } from 'framer-motion';
import { Activity, Radio, Sparkles } from 'lucide-react';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { LiveIndicator } from '@/components/dashboard/LiveIndicator';
import { Co2DonutGauge } from '@/components/dashboard/Co2DonutGauge';
import type { Reading } from '@/lib/sensorData';
import { cn } from '@/lib/utils';

interface AirQualityOverviewCardProps {
  avgCo2: number;
  trendData: Reading[];
  isRefreshing: boolean;
  sensorsOnline: number;
  totalSensors: number;
}

export function AirQualityOverviewCard({
  avgCo2,
  trendData,
  isRefreshing,
  sensorsOnline,
  totalSensors,
}: AirQualityOverviewCardProps) {
  const peak = trendData.length > 0 ? Math.max(...trendData.map((d) => d.co2)) : 0;
  const min = trendData.length > 0 ? Math.min(...trendData.map((d) => d.co2)) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative lg:col-span-2 rounded-2xl border border-border p-6 overflow-hidden',
        'bg-card/50 backdrop-blur-sm'
      )}
      aria-labelledby="air-quality-overview"
    >
      {/* Ambient highlights */}
      <div
        className={cn(
          'pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full blur-3xl',
          'bg-primary/10'
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full blur-3xl',
          'bg-accent/10'
        )}
      />

      <header className="relative flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 id="air-quality-overview" className="text-lg font-semibold text-foreground">
              Aperçu de la Qualité de l'Air
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Surveillance en temps réel de tous les capteurs
          </p>
        </div>

        <LiveIndicator isRefreshing={isRefreshing} />
      </header>

      <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Gauge + quick stats */}
        <div className="xl:col-span-4 flex flex-col items-center justify-center">
          <Co2DonutGauge co2={avgCo2} size={210} />

          <div className="mt-6 w-full max-w-sm grid grid-cols-2 gap-3">
            <motion.div 
              className="rounded-xl border border-border bg-background/50 backdrop-blur-sm p-4 hover:border-primary/30 transition-colors"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Activity className="h-4 w-4 text-destructive" />
                <span>Pic (max)</span>
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums">
                {peak} <span className="text-sm font-normal text-muted-foreground">ppm</span>
              </div>
            </motion.div>
            <motion.div 
              className="rounded-xl border border-border bg-background/50 backdrop-blur-sm p-4 hover:border-primary/30 transition-colors"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Radio className="h-4 w-4 text-primary" />
                <span>Capteurs actifs</span>
              </div>
              <div className="text-lg font-bold text-foreground tabular-nums">
                {sensorsOnline}<span className="text-sm font-normal text-muted-foreground">/{totalSensors}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Trend */}
        <div className="xl:col-span-8 rounded-xl border border-border bg-background/30 backdrop-blur-sm p-4">
          <TrendChart title={null} data={trendData} height={260} />
        </div>
      </div>
    </motion.section>
  );
}