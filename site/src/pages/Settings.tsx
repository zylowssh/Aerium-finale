import { AppLayout } from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Building, Bell, Users, Plug, Palette, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { compactMode, setCompactMode, animationsEnabled, setAnimationsEnabled } = useSettings();

  return (
    <AppLayout title="Paramètres" subtitle="Gérer votre organisation et vos préférences">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted/50">
            <TabsTrigger value="general" className="gap-2">
              <Building className="w-4 h-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="w-4 h-4" />
              Alertes
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="w-4 h-4" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Plug className="w-4 h-4" />
              Intégrations
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Organisation</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Nom de l'Organisation</Label>
                      <Input id="orgName" defaultValue="Acme Corporation" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuseau Horaire</Label>
                      <Input id="timezone" defaultValue="Europe/London" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" defaultValue="123 Business Street, London" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Conservation des Données</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Conserver les données historiques</p>
                      <p className="text-sm text-muted-foreground">Combien de temps conserver les lectures des capteurs</p>
                    </div>
                    <select className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground">
                      <option>1 an</option>
                      <option>2 ans</option>
                      <option>Toujours</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Exporter automatiquement les rapports</p>
                      <p className="text-sm text-muted-foreground">Générer automatiquement des rapports hebdomadaires</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Alert Settings */}
          <TabsContent value="alerts">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Paramètres de Seuils</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Niveau d'Avertissement (ppm)</Label>
                      <Input type="number" defaultValue="800" />
                    </div>
                    <div className="space-y-2">
                      <Label>Niveau Critique (ppm)</Label>
                      <Input type="number" defaultValue="1200" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Canaux de Notification</h3>
                
                <div className="space-y-4">
                  {[
                    { name: 'Notifications par Email', description: 'Recevoir les alertes par email' },
                    { name: 'Notifications In-App', description: 'Afficher les alertes dans le tableau de bord' },
                    { name: 'Intégration Slack', description: 'Publier les alertes sur un canal Slack' },
                    { name: 'Webhook', description: 'Envoyer les alertes vers un point de terminaison personnalisé' }
                  ].map((channel, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium text-foreground">{channel.name}</p>
                        <p className="text-sm text-muted-foreground">{channel.description}</p>
                      </div>
                      <Switch defaultChecked={index < 2} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Thème</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      theme === 'dark' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Moon className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">Mode Sombre</span>
                    </div>
                    <div className="h-20 rounded-lg bg-[#0B1220] border border-[#1E2A4A]">
                      <div className="p-2 space-y-1">
                        <div className="h-2 w-12 bg-[#2FE6D6] rounded" />
                        <div className="h-1.5 w-20 bg-[#9FB0D0] rounded opacity-50" />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      theme === 'light' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Sun className="w-5 h-5 text-warning" />
                      <span className="font-medium text-foreground">Mode Clair</span>
                    </div>
                    <div className="h-20 rounded-lg bg-white border border-gray-200">
                      <div className="p-2 space-y-1">
                        <div className="h-2 w-12 bg-[#0D9488] rounded" />
                        <div className="h-1.5 w-20 bg-gray-400 rounded opacity-50" />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Préférences d'Affichage</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Mode Compact</p>
                      <p className="text-sm text-muted-foreground">Réduire l'espacement pour plus de densité de données</p>
                    </div>
                    <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Afficher les Animations</p>
                      <p className="text-sm text-muted-foreground">Activer les transitions et effets fluides</p>
                    </div>
                    <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Users Settings */}
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Membres de l'Équipe</h3>
                <Button size="sm" className="gradient-primary text-primary-foreground">
                  Inviter un Utilisateur
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Alex Johnson', email: 'alex@acme.com', role: 'Admin' },
                  { name: 'Sarah Miller', email: 'sarah@acme.com', role: 'Editor' },
                  { name: 'Mike Chen', email: 'mike@acme.com', role: 'Viewer' }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      user.role === 'Admin' ? 'bg-primary/10 text-primary' :
                      user.role === 'Editor' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Integrations Settings */}
          <TabsContent value="integrations">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {[
                { name: 'Slack', description: 'Envoyer les alertes sur des canaux Slack', connected: true },
                { name: 'Google Home', description: 'Commandes vocales et intégration domotique', connected: false },
                { name: 'Webhooks', description: 'Points de terminaison HTTP personnalisés pour les alertes', connected: true },
                { name: 'IFTTT', description: 'Se connecter à des milliers d\'applications', connected: false }
              ].map((integration, index) => (
                <div key={index} className="flex items-center justify-between p-5 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Plug className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <Button variant={integration.connected ? 'outline' : 'default'} size="sm">
                    {integration.connected ? 'Configurer' : 'Connecter'}
                  </Button>
                </div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
