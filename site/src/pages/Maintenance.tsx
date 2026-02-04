import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

const maintenanceTasks = [
  { id: '1', sensor: 'Capteur Bureau A', type: 'Calibration', status: 'planifié', date: '28 Jan 2026', priority: 'normale' },
  { id: '2', sensor: 'Capteur Salle B', type: 'Remplacement filtre', status: 'en cours', date: '26 Jan 2026', priority: 'haute' },
  { id: '3', sensor: 'Capteur Hall', type: 'Inspection', status: 'terminé', date: '20 Jan 2026', priority: 'basse' },
  { id: '4', sensor: 'Capteur Cuisine', type: 'Calibration', status: 'planifié', date: '2 Fév 2026', priority: 'normale' },
  { id: '5', sensor: 'Capteur Stockage', type: 'Réparation', status: 'en attente', date: '25 Jan 2026', priority: 'haute' },
];

const upcomingMaintenance = [
  { sensor: 'Capteur Bureau A', daysLeft: 3, type: 'Calibration' },
  { sensor: 'Capteur Cuisine', daysLeft: 8, type: 'Calibration' },
  { sensor: 'Capteur Extérieur', daysLeft: 15, type: 'Inspection' },
];

const stats = [
  { label: 'Maintenances ce mois', value: 12, icon: Calendar, color: 'text-primary' },
  { label: 'En cours', value: 3, icon: Clock, color: 'text-warning' },
  { label: 'Terminées', value: 8, icon: CheckCircle2, color: 'text-success' },
  { label: 'En retard', value: 1, icon: AlertCircle, color: 'text-destructive' },
];

const Maintenance = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'terminé': return 'bg-success/10 text-success border-success/30';
      case 'en cours': return 'bg-warning/10 text-warning border-warning/30';
      case 'planifié': return 'bg-primary/10 text-primary border-primary/30';
      case 'en attente': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'haute': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'normale': return 'bg-muted text-muted-foreground border-border';
      case 'basse': return 'bg-success/10 text-success border-success/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const filteredTasks = maintenanceTasks.filter(task =>
    task.sensor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout title="Maintenance" subtitle="Planifiez et suivez la maintenance de vos capteurs">
      <div className="space-y-6">
        {loading ? (
          <>
            <LoadingSkeleton variant="kpi" count={4} />
            <LoadingSkeleton variant="table" count={5} />
          </>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-muted")}>
                          <stat.icon className={cn("w-5 h-5", stat.color)} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Maintenance Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="bg-card border-border">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                      <CardTitle>Tâches de Maintenance</CardTitle>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Rechercher..."
                            className="pl-9 w-48"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button className="gap-2">
                          <Plus className="w-4 h-4" />
                          Nouvelle Tâche
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 hover:bg-muted/50">
                            <TableHead>Capteur</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Priorité</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTasks.map((task) => (
                            <TableRow key={task.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium text-foreground">{task.sensor}</TableCell>
                              <TableCell className="text-muted-foreground">{task.type}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn("capitalize", getStatusBadge(task.status))}>
                                  {task.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn("capitalize", getPriorityBadge(task.priority))}>
                                  {task.priority}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{task.date}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Voir Détails</DropdownMenuItem>
                                    <DropdownMenuItem>Modifier</DropdownMenuItem>
                                    <DropdownMenuItem>Marquer Terminé</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Maintenance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Prochaines Échéances
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingMaintenance.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          item.daysLeft <= 3 ? "bg-destructive/10" : 
                          item.daysLeft <= 7 ? "bg-warning/10" : "bg-muted"
                        )}>
                          <Wrench className={cn(
                            "w-5 h-5",
                            item.daysLeft <= 3 ? "text-destructive" : 
                            item.daysLeft <= 7 ? "text-warning" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.sensor}</p>
                          <p className="text-sm text-muted-foreground">{item.type}</p>
                        </div>
                        <Badge variant="outline" className={cn(
                          item.daysLeft <= 3 ? "bg-destructive/10 text-destructive" : 
                          item.daysLeft <= 7 ? "bg-warning/10 text-warning" : ""
                        )}>
                          {item.daysLeft}j
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Maintenance;
