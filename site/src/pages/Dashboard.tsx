import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Activity, Heart, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { AirQualityOverviewCard } from '@/components/dashboard/AirQualityOverviewCard';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { QuickInsights } from '@/components/dashboard/QuickInsights';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { useSensors } from '@/hooks/useSensors';
import { apiClient } from '@/lib/apiClient';
import AddSensorDialog from '@/components/sensors/AddSensorDialog';
import { Button } from '@/components/ui/button';
import { 
  getHealthScore,
  Alert,
  Reading
} from '@/lib/sensorData';

const Dashboard = () => {
  const { sensors, isLoading } = useSensors();
  const [trendData, setTrendData] = useState<Reading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sensorReadings, setSensorReadings] = useState<Record<string, number[]>>({});
  const [isTrendLoading, setIsTrendLoading] = useState(true);
  const [isAlertsLoading, setIsAlertsLoading] = useState(true);
  const isFetchingTrend = useRef(false);
  const isFetchingReadings = useRef(false);
  const [aggregateData, setAggregateData] = useState({
    avgCo2: 0,
    avgTemp: 0,
    avgHumidity: 0
  });

  // Fetch aggregate data
  useEffect(() => {
    const fetchAggregate = async () => {
      try {
        const data = await apiClient.getAggregateData();
        setAggregateData({
          avgCo2: Math.round(data.avgCo2),
          avgTemp: data.avgTemperature,
          avgHumidity: Math.round(data.avgHumidity)
        });
      } catch (error) {
        console.error('Error fetching aggregate data:', error);
      }
    };

    if (sensors.length > 0) {
      fetchAggregate();
    }
  }, [sensors]);

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsAlertsLoading(true);
      try {
        const alertsData = await apiClient.getAlerts('nouvelle', 5);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setAlerts([]);
      } finally {
        setIsAlertsLoading(false);
      }
    };

    fetchAlerts();
    // Poll for new alerts every 10 seconds
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch historical readings for mini charts
  useEffect(() => {
    const fetchSensorReadings = async () => {
      if (isFetchingReadings.current || sensors.length === 0) return;
      
      isFetchingReadings.current = true;
      const readings: Record<string, number[]> = {};
      
      try {
        await Promise.all(sensors.map(async (sensor) => {
          try {
            const data = await apiClient.getSensorReadings(sensor.id.toString(), 1, 20);
            readings[sensor.id] = data.map((r: any) => r.co2).reverse();
          } catch (error) {
            console.error(`Error fetching readings for sensor ${sensor.id}:`, error);
            readings[sensor.id] = [];
          }
        }));
        
        setSensorReadings(readings);
      } finally {
        isFetchingReadings.current = false;
      }
    };

    fetchSensorReadings();
  }, [sensors.length]); // Only depend on sensors length, not the array itself

  // Fetch aggregate trend data for overview chart
  useEffect(() => {
    const fetchTrendData = async () => {
      if (isFetchingTrend.current || sensors.length === 0) {
        if (sensors.length === 0) {
          setTrendData([]);
          setIsTrendLoading(false);
        }
        return;
      }

      isFetchingTrend.current = true;
      setIsTrendLoading(true);

      try {
        // Fetch readings for all sensors in parallel
        const allSensorReadings = await Promise.all(
          sensors.map(sensor => 
            apiClient.getSensorReadings(sensor.id.toString(), 24, 48)
              .catch(() => []) // Return empty array if error
          )
        );
        
        // Create a map of timestamp -> CO2 values
        const timeMap = new Map<number, number[]>();
        
        allSensorReadings.forEach(readings => {
          readings.forEach((reading: any) => {
            const timestamp = new Date(reading.recorded_at).getTime();
            // Round to nearest 30 seconds for grouping (30000 ms)
            const roundedTime = Math.floor(timestamp / 30000) * 30000;
            
            if (!timeMap.has(roundedTime)) {
              timeMap.set(roundedTime, []);
            }
            timeMap.get(roundedTime)!.push(reading.co2);
          });
        });
        
        // Convert map to sorted array of averaged readings
        const trendReadings: Reading[] = Array.from(timeMap.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([timestamp, co2Values]) => ({
            timestamp: new Date(timestamp),
            co2: Math.round(co2Values.reduce((sum, val) => sum + val, 0) / co2Values.length),
            temperature: 0,
            humidity: 0
          }));
        
        setTrendData(trendReadings);
      } catch (error) {
        console.error('Error fetching trend data:', error);
        setTrendData([]);
      } finally {
        isFetchingTrend.current = false;
        setIsTrendLoading(false);
      }
    };

    fetchTrendData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchTrendData, 30000);
    return () => clearInterval(interval);
  }, [sensors.length]); // Only depend on sensors length, not the array itself

  // Calculate aggregate metrics from sensors if no backend data
  const avgCo2 = aggregateData.avgCo2 || (sensors.length > 0 ? Math.round(sensors.reduce((acc, s) => acc + s.co2, 0) / sensors.length) : 0);
  const avgTemp = aggregateData.avgTemp || (sensors.length > 0 ? (sensors.reduce((acc, s) => acc + s.temperature, 0) / sensors.length).toFixed(1) : '0');
  const avgHumidity = aggregateData.avgHumidity || (sensors.length > 0 ? Math.round(sensors.reduce((acc, s) => acc + s.humidity, 0) / sensors.length) : 0);
  const healthScore = getHealthScore(avgCo2, parseFloat(String(avgTemp)), avgHumidity);
  const sensorsOnline = sensors.filter(s => s.status === 'en ligne').length;
  const totalSensors = sensors.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* KPI Cards */}
        {isLoading ? (
          <LoadingSkeleton variant="kpi" count={4} />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            label="CO₂ Moyen" 
            value={avgCo2} 
            unit="ppm" 
            icon={Activity}
            trend={-5}
            trendLabel="par rapport à hier"
            status={avgCo2 < 800 ? 'success' : avgCo2 < 1000 ? 'warning' : 'danger'}
          />
          <KPICard 
            label="Température" 
            value={avgTemp} 
            unit="°C" 
            icon={Thermometer}
            status="default"
          />
          <KPICard 
            label="Humidité" 
            value={avgHumidity} 
            unit="%" 
            icon={Droplets}
            status="default"
          />
          <KPICard 
            label="Score de Santé" 
            value={healthScore} 
            unit="/100" 
            icon={Heart}
            trend={5}
            trendLabel="amélioration"
            status={healthScore >= 80 ? 'success' : healthScore >= 60 ? 'warning' : 'danger'}
          />
        </div>
        )}

        {/* Main Content Grid */}
        {isTrendLoading ? (
          <div className="space-y-6">
            <LoadingSkeleton variant="air-quality" />
            <LoadingSkeleton variant="alerts" count={3} />
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AirQualityOverviewCard
            avgCo2={avgCo2}
            trendData={trendData}
            isRefreshing={isRefreshing}
            sensorsOnline={sensorsOnline}
            totalSensors={totalSensors}
          />

          {/* Right Column - Alerts and Insights */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            {isAlertsLoading ? (
              <LoadingSkeleton variant="alerts" count={3} />
            ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-xl bg-card border border-border"
            >
              <h3 className="text-base font-semibold text-foreground mb-4">Alertes Récentes</h3>
              <div className="space-y-3">
                {alerts.slice(0, 3).length > 0 ? (
                  alerts.slice(0, 3).map((alert: Alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Aucune alerte</p>
                  </div>
                )}
              </div>
            </motion.div>
            )}

            {/* Quick Insights */}
            <QuickInsights
              sensorsOnline={sensorsOnline}
              totalSensors={totalSensors}
              readingsToday={156}
              peakCO2={trendData.length > 0 ? Math.max(...trendData.map(d => d.co2)) : 0}
              bestAirTime="6:00 AM"
            />
          </div>
        </div>
        )}

        {/* Active Sensors */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Capteurs Actifs</h2>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Ajouter un Capteur
            </Button>
          </div>
          {isLoading ? (
            <LoadingSkeleton variant="sensor" count={3} />
          ) : sensors.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed border-border bg-muted/20"
            >
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Aucun capteur configuré</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                Commencez à surveiller la qualité de l'air en ajoutant votre premier capteur. 
                Choisissez entre un capteur réel ou une simulation.
              </p>
              <Button 
                className="gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Ajouter votre premier capteur
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sensors.map((sensor) => (
                <SensorCard 
                  key={sensor.id} 
                  sensor={sensor}
                  miniChartData={sensorReadings[sensor.id] || []}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Sensor Dialog */}
        <AddSensorDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
