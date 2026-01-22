#!/usr/bin/env python3
"""
GetNexo Chaos Monkey - Teste de Resiliência Automático
Sistema de injeção controlada de falhas para testar e melhorar a resiliência do sistema
"""

import os
import json
import docker
import random
import time
import subprocess
import signal
import psutil
from datetime import datetime, timedelta
from collections import defaultdict
import threading
import requests

class ChaosMonkey:
    def __init__(self):
        self.client = docker.from_env()
        self.chaos_log = 'data/chaos_monkey_log.json'
        self.baseline_metrics = 'data/baseline_metrics.json'

        # Configurações de caos
        self.chaos_config = {
            'enabled': True,
            'dry_run': False,  # Modo seguro (só loga ações)
            'max_concurrent_chaos': 1,  # Máximo de ações simultâneas
            'cooldown_period': 300,     # Cooldown entre ações (segundos)
            'recovery_timeout': 60,     # Timeout para recuperação automática
            'notification_webhook': None,  # Webhook para notificações
            'excluded_containers': ['database', 'monitoring', 'backup'],  # Containers protegidos
            'safe_hours': [2, 6],       # Horário seguro (2h às 6h)
            'max_failure_rate': 0.1     # Máximo 10% de falhas simultâneas
        }

        # Tipos de caos disponíveis
        self.chaos_experiments = {
            'container_kill': {
                'description': 'Mata container aleatório',
                'probability': 0.3,
                'recovery': 'auto_restart',
                'impact': 'high',
                'duration': 'instant'
            },
            'network_delay': {
                'description': 'Adiciona delay na rede',
                'probability': 0.2,
                'recovery': 'auto',
                'impact': 'medium',
                'duration': '30s'
            },
            'cpu_stress': {
                'description': 'Sobrecarrega CPU',
                'probability': 0.15,
                'recovery': 'auto',
                'impact': 'medium',
                'duration': '60s'
            },
            'memory_pressure': {
                'description': 'Pressão na memória',
                'probability': 0.15,
                'recovery': 'auto',
                'impact': 'high',
                'duration': '45s'
            },
            'disk_full': {
                'description': 'Simula disco cheio',
                'probability': 0.1,
                'recovery': 'manual',
                'impact': 'critical',
                'duration': '120s'
            },
            'service_isolation': {
                'description': 'Isola serviço da rede',
                'probability': 0.05,
                'recovery': 'auto',
                'impact': 'high',
                'duration': '30s'
            },
            'random_restart': {
                'description': 'Reinicia serviço aleatório',
                'probability': 0.05,
                'recovery': 'auto',
                'impact': 'low',
                'duration': 'instant'
            }
        }

        # Estado do sistema
        self.chaos_history = []
        self.active_experiments = {}
        self.baseline_data = {}
        self.last_chaos_time = None

        self._load_state()
        self._capture_baseline()

    def _load_state(self):
        """Carrega estado salvo"""
        try:
            if os.path.exists(self.chaos_log):
                with open(self.chaos_log, 'r') as f:
                    data = json.load(f)
                    self.chaos_history = data.get('history', [])
                    self.baseline_data = data.get('baseline', {})
                print("✅ Estado do Chaos Monkey carregado")
        except Exception as e:
            print(f"Aviso ao carregar estado: {e}")

    def _save_state(self):
        """Salva estado atual"""
        try:
            data = {
                'history': self.chaos_history[-100:],  # Manter últimas 100 ações
                'baseline': self.baseline_data,
                'last_update': datetime.now().isoformat()
            }

            os.makedirs(os.path.dirname(self.chaos_log), exist_ok=True)
            with open(self.chaos_log, 'w') as f:
                json.dump(data, f, indent=2)

        except Exception as e:
            print(f"Erro ao salvar estado: {e}")

    def _capture_baseline(self):
        """Captura métricas de baseline do sistema"""
        if os.path.exists(self.baseline_metrics):
            try:
                with open(self.baseline_metrics, 'r') as f:
                    self.baseline_data = json.load(f)
                return
            except:
                pass

        print("📊 Capturando métricas de baseline...")

        try:
            baseline = {
                'timestamp': datetime.now().isoformat(),
                'system': self._get_system_metrics(),
                'containers': self._get_container_metrics(),
                'services': self._get_service_status()
            }

            self.baseline_data = baseline

            with open(self.baseline_metrics, 'w') as f:
                json.dump(baseline, f, indent=2)

            print("✅ Baseline capturado")

        except Exception as e:
            print(f"Erro ao capturar baseline: {e}")

    def _get_system_metrics(self):
        """Captura métricas do sistema"""
        return {
            'cpu_percent': psutil.cpu_percent(interval=1),
            'memory_percent': psutil.virtual_memory().percent,
            'disk_usage': psutil.disk_usage('/').percent,
            'load_average': os.getloadavg() if hasattr(os, 'getloadavg') else None
        }

    def _get_container_metrics(self):
        """Captura métricas dos containers"""
        metrics = {}

        try:
            for container in self.client.containers.list():
                stats = container.stats(stream=False)
                name = container.name

                cpu_percent = 0
                if stats and 'cpu_stats' in stats:
                    cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats['precpu_stats']['cpu_usage']['total_usage']
                    system_delta = stats['cpu_stats']['system_cpu_usage'] - stats['precpu_stats']['system_cpu_usage']
                    if system_delta > 0:
                        cpu_percent = (cpu_delta / system_delta) * 100

                memory_usage = 0
                memory_limit = 1
                if stats and 'memory_stats' in stats:
                    memory_usage = stats['memory_stats']['usage']
                    memory_limit = stats['memory_stats']['limit']

                metrics[name] = {
                    'cpu_percent': round(cpu_percent, 2),
                    'memory_percent': round((memory_usage / memory_limit) * 100, 2),
                    'status': container.status,
                    'restart_count': container.attrs['RestartCount']
                }

        except Exception as e:
            print(f"Erro ao capturar métricas de containers: {e}")

        return metrics

    def _get_service_status(self):
        """Verifica status dos serviços"""
        services = {}

        # Verificar containers Docker
        try:
            for container in self.client.containers.list(all=True):
                services[container.name] = {
                    'type': 'docker',
                    'status': container.status,
                    'healthy': self._check_container_health(container)
                }
        except:
            pass

        # Verificar processos do sistema
        critical_processes = ['nginx', 'redis', 'postgres', 'node']
        for proc_name in critical_processes:
            try:
                running = len([p for p in psutil.process_iter(['name']) if proc_name in p.info['name']]) > 0
                services[f'system_{proc_name}'] = {
                    'type': 'system',
                    'status': 'running' if running else 'stopped',
                    'healthy': running
                }
            except:
                pass

        return services

    def _check_container_health(self, container):
        """Verifica saúde do container"""
        try:
            health = container.attrs['State'].get('Health', {}).get('Status')
            return health == 'healthy'
        except:
            return container.status == 'running'

    def run_chaos_experiment(self, experiment_type=None, target=None):
        """Executa experimento de caos"""
        if not self.chaos_config['enabled']:
            print("❌ Chaos Monkey está desabilitado")
            return False

        # Verificar horário seguro
        current_hour = datetime.now().hour
        if current_hour >= self.chaos_config['safe_hours'][0] and current_hour <= self.chaos_config['safe_hours'][1]:
            print("⏰ Horário seguro - pulando experimento de caos")
            return False

        # Verificar cooldown
        if self.last_chaos_time:
            time_since_last = (datetime.now() - self.last_chaos_time).total_seconds()
            if time_since_last < self.chaos_config['cooldown_period']:
                print(f"⏳ Cooldown ativo - próximo experimento em {self.chaos_config['cooldown_period'] - time_since_last:.0f}s")
                return False

        # Selecionar experimento
        if not experiment_type:
            experiment_type = self._select_random_experiment()

        if experiment_type not in self.chaos_experiments:
            print(f"❌ Experimento '{experiment_type}' não encontrado")
            return False

        experiment = self.chaos_experiments[experiment_type]

        # Selecionar alvo se não especificado
        if not target:
            target = self._select_random_target(experiment_type)

        if not target:
            print("❌ Nenhum alvo disponível para o experimento")
            return False

        # Verificar se alvo está protegido
        if any(excluded in target for excluded in self.chaos_config['excluded_containers']):
            print(f"🛡️ Alvo protegido: {target}")
            return False

        # Executar experimento
        print(f"🐒 Chaos Monkey: Executando {experiment_type} em {target}")

        experiment_record = {
            'id': f"chaos_{int(time.time())}_{random.randint(1000, 9999)}",
            'experiment_type': experiment_type,
            'target': target,
            'start_time': datetime.now().isoformat(),
            'expected_duration': experiment['duration'],
            'impact_level': experiment['impact'],
            'recovery_type': experiment['recovery'],
            'pre_metrics': self._get_system_metrics(),
            'status': 'running'
        }

        try:
            if not self.chaos_config['dry_run']:
                success = self._execute_chaos_action(experiment_type, target, experiment_record)
                experiment_record['action_success'] = success
            else:
                print("🔍 Dry run: ação seria executada")
                experiment_record['action_success'] = True

            # Aguardar duração esperada
            if experiment['duration'] != 'instant':
                duration_sec = self._parse_duration(experiment['duration'])
                time.sleep(min(duration_sec, 10))  # Máximo 10s de espera

            # Verificar recuperação
            recovery_success = self._verify_recovery(target, experiment['recovery'])
            experiment_record['recovery_success'] = recovery_success

            experiment_record['end_time'] = datetime.now().isoformat()
            experiment_record['status'] = 'completed'

            print(f"✅ Experimento concluído - Recuperação: {'✅' if recovery_success else '❌'}")

        except Exception as e:
            experiment_record['status'] = 'failed'
            experiment_record['error'] = str(e)
            experiment_record['end_time'] = datetime.now().isoformat()
            print(f"❌ Experimento falhou: {e}")

        # Registrar no histórico
        self.chaos_history.append(experiment_record)
        self.last_chaos_time = datetime.now()
        self._save_state()

        # Notificar se necessário
        if experiment_record.get('action_success') and not experiment_record.get('recovery_success'):
            self._send_notification(experiment_record)

        return True

    def _select_random_experiment(self):
        """Seleciona experimento baseado em probabilidade"""
        experiments = list(self.chaos_experiments.keys())
        weights = [self.chaos_experiments[exp]['probability'] for exp in experiments]

        return random.choices(experiments, weights=weights, k=1)[0]

    def _select_random_target(self, experiment_type):
        """Seleciona alvo para o experimento"""
        try:
            containers = self.client.containers.list()
            eligible = []

            for container in containers:
                name = container.name
                if name not in self.chaos_config['excluded_containers'] and container.status == 'running':
                    eligible.append(name)

            return random.choice(eligible) if eligible else None

        except Exception as e:
            print(f"Erro ao selecionar alvo: {e}")
            return None

    def _execute_chaos_action(self, experiment_type, target, record):
        """Executa ação de caos específica"""
        if experiment_type == 'container_kill':
            return self._kill_container(target)

        elif experiment_type == 'network_delay':
            return self._add_network_delay(target)

        elif experiment_type == 'cpu_stress':
            return self._cpu_stress(target)

        elif experiment_type == 'memory_pressure':
            return self._memory_pressure(target)

        elif experiment_type == 'disk_full':
            return self._simulate_disk_full(target)

        elif experiment_type == 'service_isolation':
            return self._isolate_service(target)

        elif experiment_type == 'random_restart':
            return self._restart_service(target)

        return False

    def _kill_container(self, container_name):
        """Mata container"""
        try:
            container = self.client.containers.get(container_name)
            container.kill()
            print(f"💀 Container {container_name} morto")
            return True
        except Exception as e:
            print(f"Erro ao matar container: {e}")
            return False

    def _add_network_delay(self, container_name):
        """Adiciona delay na rede do container"""
        try:
            # Usar tc (traffic control) para adicionar delay
            cmd = f"docker exec {container_name} tc qdisc add dev eth0 root netem delay 500ms"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            print(f"🌐 Delay de rede adicionado a {container_name}")
            return result.returncode == 0
        except Exception as e:
            print(f"Erro ao adicionar delay: {e}")
            return False

    def _cpu_stress(self, container_name):
        """Sobrecarrega CPU do container"""
        try:
            # Executar stress-ng dentro do container
            cmd = f"docker exec {container_name} stress-ng --cpu 2 --timeout 60s"
            subprocess.Popen(cmd, shell=True)
            print(f"🔥 CPU stress iniciado em {container_name}")
            return True
        except Exception as e:
            print(f"Erro ao iniciar CPU stress: {e}")
            return False

    def _memory_pressure(self, container_name):
        """Cria pressão na memória"""
        try:
            # Executar stress-ng para memória
            cmd = f"docker exec {container_name} stress-ng --vm 2 --vm-bytes 512M --timeout 45s"
            subprocess.Popen(cmd, shell=True)
            print(f"💧 Pressão de memória iniciada em {container_name}")
            return True
        except Exception as e:
            print(f"Erro ao iniciar pressão de memória: {e}")
            return False

    def _simulate_disk_full(self, container_name):
        """Simula disco cheio"""
        try:
            # Criar arquivo grande no container
            cmd = f"docker exec {container_name} dd if=/dev/zero of=/tmp/fill_disk bs=1M count=100"
            subprocess.Popen(cmd, shell=True)
            print(f"💾 Simulação de disco cheio iniciada em {container_name}")
            return True
        except Exception as e:
            print(f"Erro ao simular disco cheio: {e}")
            return False

    def _isolate_service(self, container_name):
        """Isola serviço da rede"""
        try:
            # Bloquear conexões de saída
            cmd = f"docker exec {container_name} iptables -I OUTPUT -d 172.18.0.0/16 -j DROP"
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            print(f"🔒 Serviço {container_name} isolado da rede")
            return result.returncode == 0
        except Exception as e:
            print(f"Erro ao isolar serviço: {e}")
            return False

    def _restart_service(self, container_name):
        """Reinicia serviço"""
        try:
            container = self.client.containers.get(container_name)
            container.restart()
            print(f"🔄 Serviço {container_name} reiniciado")
            return True
        except Exception as e:
            print(f"Erro ao reiniciar serviço: {e}")
            return False

    def _verify_recovery(self, target, recovery_type):
        """Verifica se o sistema se recuperou"""
        if recovery_type == 'auto':
            # Aguardar recuperação automática
            time.sleep(self.chaos_config['recovery_timeout'])

            # Verificar status do container
            try:
                container = self.client.containers.get(target)
                return container.status == 'running'
            except:
                return False

        elif recovery_type == 'auto_restart':
            # Container deve ter sido reiniciado automaticamente
            time.sleep(5)  # Aguardar restart
            try:
                container = self.client.containers.get(target)
                return container.status == 'running'
            except:
                return False

        return True  # Para recovery manual, assumir que foi resolvido

    def _parse_duration(self, duration_str):
        """Converte string de duração para segundos"""
        if duration_str == 'instant':
            return 0

        # Extrair número e unidade
        import re
        match = re.match(r'(\d+)([smh])', duration_str)
        if match:
            value, unit = match.groups()
            value = int(value)

            if unit == 's':
                return value
            elif unit == 'm':
                return value * 60
            elif unit == 'h':
                return value * 3600

        return 30  # Default 30 segundos

    def _send_notification(self, experiment_record):
        """Envia notificação sobre falha de recuperação"""
        if not self.chaos_config['notification_webhook']:
            return

        message = {
            'text': f"🚨 Chaos Monkey Alert: {experiment_record['experiment_type']} em {experiment_record['target']} falhou na recuperação!",
            'experiment': experiment_record
        }

        try:
            requests.post(self.chaos_config['notification_webhook'], json=message, timeout=5)
        except Exception as e:
            print(f"Erro ao enviar notificação: {e}")

    def get_chaos_stats(self):
        """Retorna estatísticas dos experimentos de caos"""
        total_experiments = len(self.chaos_history)
        successful_experiments = len([e for e in self.chaos_history if e.get('status') == 'completed'])
        failed_experiments = len([e for e in self.chaos_history if e.get('status') == 'failed'])

        recovery_rate = 0
        if successful_experiments > 0:
            recovered = len([e for e in self.chaos_history if e.get('recovery_success')])
            recovery_rate = recovered / successful_experiments

        # Estatísticas por tipo
        experiments_by_type = defaultdict(int)
        for exp in self.chaos_history:
            experiments_by_type[exp['experiment_type']] += 1

        return {
            'total_experiments': total_experiments,
            'successful_experiments': successful_experiments,
            'failed_experiments': failed_experiments,
            'recovery_rate': round(recovery_rate * 100, 1),
            'experiments_by_type': dict(experiments_by_type),
            'last_experiment': self.chaos_history[-1] if self.chaos_history else None,
            'chaos_enabled': self.chaos_config['enabled'],
            'dry_run': self.chaos_config['dry_run']
        }

    def scheduled_chaos_run(self):
        """Executa rodada programada de caos (ideal para cron job)"""
        print("🎭 Executando rodada programada de Chaos Monkey...")

        # Verificar se deve executar
        if not self.chaos_config['enabled']:
            print("Chaos Monkey desabilitado")
            return False

        # Executar experimento
        success = self.run_chaos_experiment()

        if success:
            print("✅ Rodada de caos concluída")
        else:
            print("⏭️ Rodada de caos pulada")

        return success

def main():
    """Função principal"""
    monkey = ChaosMonkey()

    import sys
    if len(sys.argv) < 2:
        print("🐒 Chaos Monkey - Teste de Resiliência Automático")
        print("Comandos disponíveis:")
        print("  run [experiment] [target]  - Executar experimento")
        print("  stats                       - Ver estatísticas")
        print("  baseline                    - Capturar baseline")
        print("  scheduled                   - Rodada programada")
        print("  enable/disable              - Habilitar/desabilitar")
        print("  dry-run on/off              - Modo seguro")
        print("\nExperimentos disponíveis:")
        for exp_name, exp in monkey.chaos_experiments.items():
            print(f"  {exp_name}: {exp['description']} (Impacto: {exp['impact']})")
        return

    command = sys.argv[1]

    try:
        if command == 'run':
            experiment = sys.argv[2] if len(sys.argv) > 2 else None
            target = sys.argv[3] if len(sys.argv) > 3 else None
            monkey.run_chaos_experiment(experiment, target)

        elif command == 'stats':
            stats = monkey.get_chaos_stats()
            print("📊 ESTATÍSTICAS DO CHAOS MONKEY:")
            print(json.dumps(stats, indent=2))

        elif command == 'baseline':
            monkey._capture_baseline()
            print("✅ Baseline recapturado")

        elif command == 'scheduled':
            monkey.scheduled_chaos_run()

        elif command == 'enable':
            monkey.chaos_config['enabled'] = True
            print("✅ Chaos Monkey habilitado")

        elif command == 'disable':
            monkey.chaos_config['enabled'] = False
            print("❌ Chaos Monkey desabilitado")

        elif command == 'dry-run':
            if len(sys.argv) > 2 and sys.argv[2] == 'on':
                monkey.chaos_config['dry_run'] = True
                print("🔍 Modo dry-run ativado (ações serão logadas apenas)")
            elif len(sys.argv) > 2 and sys.argv[2] == 'off':
                monkey.chaos_config['dry_run'] = False
                print("💥 Modo dry-run desativado (ações reais serão executadas)")
            else:
                print(f"Dry-run atual: {'ativado' if monkey.chaos_config['dry_run'] else 'desativado'}")

        else:
            print("Comando não reconhecido. Use sem argumentos para ver ajuda.")

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()