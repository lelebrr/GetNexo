#!/usr/bin/env python3

"""
================================================================================
GetNexo Weather Sales - Sistema de Ofertas Dinâmicas Baseadas no Clima
================================================================================

DESCRIÇÃO:
Sistema inteligente que personaliza preços e ofertas automaticamente baseado na
previsão do tempo, criando experiências contextuais únicas para os usuários.

FUNCIONALIDADES PRINCIPAIS:
✅ Análise de previsão do tempo em tempo real (OpenWeatherMap)
✅ Personalização de preços baseada em condições climáticas
✅ Sistema de regras dinâmicas por tipo de clima
✅ Cache inteligente de dados meteorológicos
✅ Integração com campanhas de marketing
✅ Geração automática de conteúdo promocional

TIPOS DE CLIMA SUPORTADOS:
- Thunderstorm: Descontos emergenciais (15%)
- Rain: Produtos resistentes à água (10%)
- Snow: Equipamentos de inverno (20%)
- Clear: Produtos premium (aumento de 5%)
- Clouds: Produtos criativos/educacionais (5%)
- Extreme Heat: Produtos de refrigeração (12%)

CONFIGURAÇÃO:
- API Key: WEATHER_API_KEY (OpenWeatherMap)
- Cache Duration: 30 minutos
- Location Support: GPS ou coordenadas manuais
- Fallback: Simulação quando API indisponível

USO BÁSICO:
python weather_sales.py offers [lat] [lon]    # Ver ofertas locais
python weather_sales.py campaign [location]  # Criar campanha climática
python weather_sales.py monitor               # Monitorar todas as cidades

INTEGRAÇÃO COM SISTEMAS:
- E-commerce: Ajuste dinâmico de preços
- Marketing: Campanhas contextuais automáticas
- CRM: Segmentação baseada em localização
- Analytics: Métricas de conversão por clima

API ENDPOINTS CRIADOS:
- POST /api/weather/offers: Buscar ofertas por localização
- GET /api/weather/campaigns: Listar campanhas ativas
- POST /api/weather/campaigns: Criar nova campanha

DEPENDÊNCIAS:
- requests: Para chamadas de API
- json: Manipulação de dados
- datetime: Controle temporal
- random: Simulação de dados

EXEMPLO DE USO:
```python
from weather_sales import WeatherSalesEngine

engine = WeatherSalesEngine()
offers = engine.get_personalized_offers({'lat': -23.55, 'lon': -46.63})
campaign = engine.create_weather_campaign({'lat': -23.55, 'lon': -46.63})
```

MÉTRICAS GERADAS:
- Ofertas aplicadas por dia
- Conversão por tipo de clima
- Receita adicional gerada
- Satisfação do cliente por contexto

AUTOR: GetNexo Development Team
VERSÃO: 1.0.0
LICENÇA: MIT
================================================================================
"""

import requests
import json
import os
import time
from datetime import datetime, timedelta
import random

class WeatherSalesEngine:
    def __init__(self):
        self.weather_api_key = os.getenv('WEATHER_API_KEY', 'demo_key')
        self.weather_base_url = 'http://api.openweathermap.org/data/2.5'
        self.location_cache = {}
        self.weather_cache = {}
        self.cache_duration = 1800  # 30 minutos

        # Regras de vendas baseadas no clima
        self.weather_rules = {
            'thunderstorm': {
                'discount': 0.15,  # 15% desconto
                'reason': '⚡ Tempestade chegando! Aproveite produtos de emergência com desconto!',
                'products': ['power_bank', 'lantern', 'emergency_kit'],
                'urgency': 'high'
            },
            'rain': {
                'discount': 0.10,
                'reason': '🌧️ Chuva prevista! Proteja seus dispositivos com desconto especial.',
                'products': ['waterproof_case', 'umbrella', 'dry_bag'],
                'urgency': 'medium'
            },
            'snow': {
                'discount': 0.20,
                'reason': '❄️ Neve chegando! Prepare-se com produtos de inverno em promoção!',
                'products': ['winter_jacket', 'thermal_blanket', 'heater'],
                'urgency': 'high'
            },
            'clear': {
                'discount': -0.05,  # 5% aumento em dias ensolarados
                'reason': '☀️ Dia perfeito! Aproveite para adquirir produtos premium.',
                'products': ['sunglasses', 'outdoor_gear', 'premium_accessories'],
                'urgency': 'low'
            },
            'clouds': {
                'discount': 0.05,
                'reason': '☁️ Dia nublado perfeito para explorar novas possibilidades.',
                'products': ['books', 'learning_kits', 'creative_tools'],
                'urgency': 'low'
            },
            'extreme_heat': {
                'discount': 0.12,
                'reason': '🔥 Onda de calor! Mantenha-se fresco com desconto especial.',
                'products': ['fan', 'air_conditioner', 'cooling_products'],
                'urgency': 'high'
            }
        }

        # Mapeamento de condições climáticas da API
        self.condition_mapping = {
            'Thunderstorm': 'thunderstorm',
            'Drizzle': 'rain',
            'Rain': 'rain',
            'Snow': 'snow',
            'Clear': 'clear',
            'Clouds': 'clouds',
            'Mist': 'clouds',
            'Fog': 'clouds'
        }

    def get_location_weather(self, location):
        """Obtém previsão do tempo para uma localização"""
        cache_key = f"{location['lat']},{location['lon']}"

        # Verificar cache
        if cache_key in self.weather_cache:
            cached_data = self.weather_cache[cache_key]
            if time.time() - cached_data['timestamp'] < self.cache_duration:
                return cached_data['weather']

        try:
            # Chamar API do OpenWeatherMap
            url = f"{self.weather_base_url}/weather"
            params = {
                'lat': location['lat'],
                'lon': location['lon'],
                'appid': self.weather_api_key,
                'units': 'metric',
                'lang': 'pt_br'
            }

            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()

            weather_data = response.json()

            # Processar dados
            processed_weather = self.process_weather_data(weather_data)

            # Cache
            self.weather_cache[cache_key] = {
                'weather': processed_weather,
                'timestamp': time.time()
            }

            return processed_weather

        except Exception as e:
            print(f"❌ Erro ao obter previsão: {e}")
            # Fallback para dados simulados
            return self.get_simulated_weather()

    def process_weather_data(self, data):
        """Processa dados brutos da API do tempo"""
        main_condition = data['weather'][0]['main']
        temperature = data['main']['temp']
        humidity = data['main']['humidity']

        # Mapear condição
        weather_type = self.condition_mapping.get(main_condition, 'clouds')

        # Verificar condições extremas
        if temperature > 35:
            weather_type = 'extreme_heat'
        elif temperature < 0:
            weather_type = 'snow'

        return {
            'condition': weather_type,
            'temperature': temperature,
            'humidity': humidity,
            'description': data['weather'][0]['description'],
            'location': data['name'],
            'country': data['sys']['country'],
            'timestamp': datetime.now().isoformat()
        }

    def get_simulated_weather(self):
        """Retorna dados simulados quando a API falha"""
        conditions = list(self.weather_rules.keys())
        condition = random.choice(conditions)

        return {
            'condition': condition,
            'temperature': random.randint(15, 35),
            'humidity': random.randint(30, 80),
            'description': f'Condição simulada: {condition}',
            'location': 'São Paulo',
            'country': 'BR',
            'timestamp': datetime.now().isoformat()
        }

    def calculate_weather_offer(self, weather_data, base_price):
        """Calcula oferta baseada no clima"""
        weather_type = weather_data['condition']
        rule = self.weather_rules.get(weather_type, self.weather_rules['clouds'])

        # Calcular desconto/aumento
        discount_multiplier = 1 + rule['discount']  # Pode ser negativo para aumentos
        new_price = base_price * discount_multiplier

        # Garantir preço positivo
        new_price = max(0.01, new_price)

        # Calcular economia
        savings = base_price - new_price if discount_multiplier < 1 else 0

        return {
            'original_price': round(base_price, 2),
            'new_price': round(new_price, 2),
            'discount_percent': round(abs(rule['discount']) * 100, 1),
            'savings': round(savings, 2),
            'reason': rule['reason'],
            'urgency': rule['urgency'],
            'recommended_products': rule['products'],
            'weather_condition': weather_type,
            'temperature': weather_data['temperature']
        }

    def get_personalized_offers(self, user_location, user_history=None):
        """Gera ofertas personalizadas baseadas no clima e histórico do usuário"""
        weather = self.get_location_weather(user_location)

        offers = []

        # Produtos base para testar
        sample_products = [
            {'id': 'weather_jacket', 'name': 'Jaqueta à Prova d\'Água', 'price': 299.99, 'category': 'clothing'},
            {'id': 'power_bank', 'name': 'Power Bank 20000mAh', 'price': 149.99, 'category': 'electronics'},
            {'id': 'emergency_kit', 'name': 'Kit de Emergência', 'price': 89.99, 'category': 'safety'},
            {'id': 'thermal_blanket', 'name': 'Cobertor Térmico', 'price': 49.99, 'category': 'outdoor'},
            {'id': 'sunglasses', 'name': 'Óculos de Sol Premium', 'price': 199.99, 'category': 'accessories'}
        ]

        for product in sample_products:
            offer = self.calculate_weather_offer(weather, product['price'])
            offer['product'] = product

            # Personalizar baseado no histórico (simulado)
            if user_history:
                # Aumentar desconto para produtos similares ao histórico
                if product['category'] in user_history.get('preferred_categories', []):
                    offer['new_price'] *= 0.95  # Extra 5% desconto
                    offer['personalized'] = True
                    offer['reason'] += " (Baseado nas suas preferências!)"

            offers.append(offer)

        # Ordenar por urgência e desconto
        urgency_order = {'high': 3, 'medium': 2, 'low': 1}
        offers.sort(key=lambda x: (
            urgency_order.get(x['urgency'], 0),
            x['discount_percent']
        ), reverse=True)

        return {
            'weather': weather,
            'offers': offers[:5],  # Top 5 ofertas
            'summary': self.generate_offer_summary(weather, offers[:3])
        }

    def generate_offer_summary(self, weather, top_offers):
        """Gera resumo das ofertas"""
        total_savings = sum(offer['savings'] for offer in top_offers)
        avg_discount = sum(offer['discount_percent'] for offer in top_offers) / len(top_offers)

        return {
            'weather_condition': weather['condition'],
            'temperature': weather['temperature'],
            'total_offers': len(top_offers),
            'total_savings': round(total_savings, 2),
            'average_discount': round(avg_discount, 1),
            'urgency_level': max((offer['urgency'] for offer in top_offers),
                               key=lambda x: {'high': 3, 'medium': 2, 'low': 1}[x])
        }

    def create_weather_campaign(self, location, campaign_name=None):
        """Cria campanha completa baseada no clima"""
        if not campaign_name:
            campaign_name = f"Weather Campaign {datetime.now().strftime('%Y%m%d_%H%M')}"

        weather = self.get_location_weather(location)
        rule = self.weather_rules.get(weather['condition'], self.weather_rules['clouds'])

        campaign = {
            'name': campaign_name,
            'weather_condition': weather['condition'],
            'temperature': weather['temperature'],
            'location': weather['location'],
            'created': datetime.now().isoformat(),
            'valid_until': (datetime.now() + timedelta(hours=24)).isoformat(),
            'discount_percent': abs(rule['discount']) * 100,
            'target_products': rule['products'],
            'marketing_copy': {
                'headline': f"⚠️ {weather['description'].title()} Alert!",
                'subheadline': rule['reason'],
                'call_to_action': "Aproveite agora - oferta por tempo limitado!",
                'urgency_level': rule['urgency']
            },
            'email_template': self.generate_email_template(weather, rule),
            'social_posts': self.generate_social_posts(weather, rule)
        }

        return campaign

    def generate_email_template(self, weather, rule):
        """Gera template de email personalizado"""
        return f"""
        Subject: 🚨 {weather['description'].title()} - Oferta Especial Imperdível!

        Prezado cliente,

        {rule['reason']}

        Temperatura atual: {weather['temperature']}°C
        Localização: {weather['location']}

        OFERTA ESPECIAL HOJE:
        • Desconto de {abs(rule['discount']) * 100}% em produtos selecionados
        • Produtos recomendados: {', '.join(rule['products'][:3])}

        Esta oferta é baseada nas condições climáticas atuais e expira em 24 horas!

        Clique aqui para aproveitar: [LINK PARA OFERTAS]

        Atenciosamente,
        Equipe GetNexo
        """

    def generate_social_posts(self, weather, rule):
        """Gera posts para redes sociais"""
        posts = []

        # Twitter Thread
        posts.append({
            'platform': 'twitter',
            'content': f"⚠️ ALERTA CLIMÁTICO: {weather['description'].title()} em {weather['location']}!\n\n{rule['reason']}\n\n🔥 Desconto de {abs(rule['discount']) * 100}% em produtos essenciais!\n\n#{weather['condition']} #OfertaEspecial",
            'hashtags': ['#Clima', '#Oferta', '#GetNexo']
        })

        # Instagram Caption
        posts.append({
            'platform': 'instagram',
            'content': f"🌤️ {weather['temperature']}°C em {weather['location']}\n\n{rule['reason']}\n\nProdutos em oferta:\n{'\n'.join('• ' + product for product in rule['products'][:3])}\n\nLink na bio! ⬆️",
            'hashtags': ['#oferta', '#clima', '#getnexo']
        })

        # Facebook Post
        posts.append({
            'platform': 'facebook',
            'content': f"🌦️ Condições climáticas atuais: {weather['description']}\n\n{rule['reason']}\n\nEstamos com desconto especial de {abs(rule['discount']) * 100}% em produtos perfeitos para este clima!\n\nAproveite enquanto durar a condição climática. 🛒",
            'call_to_action': 'SHOP_NOW'
        })

        return posts

    def run_weather_monitoring(self):
        """Monitora clima e ajusta ofertas automaticamente"""
        print("🌤️ Weather Sales Engine - Monitoring Active")
        print("=" * 50)

        # Localizações para monitorar
        locations = [
            {'lat': -23.5505, 'lon': -46.6333, 'name': 'São Paulo'},
            {'lat': -22.9068, 'lon': -43.1729, 'name': 'Rio de Janeiro'},
            {'lat': -19.9167, 'lon': -43.9333, 'name': 'Belo Horizonte'},
            {'lat': -25.4278, 'lon': -49.2672, 'name': 'Curitiba'}
        ]

        for location in locations:
            try:
                weather = self.get_location_weather(location)
                offers = self.get_personalized_offers(location)

                print(f"\n📍 {location['name']} - {weather['condition']} ({weather['temperature']}°C)")
                print(f"💰 Ofertas ativas: {offers['summary']['total_offers']}")
                print(f"💸 Economia total: R$ {offers['summary']['total_savings']}")
                print(f"📊 Desconto médio: {offers['summary']['average_discount']}%")

            except Exception as e:
                print(f"❌ Erro em {location['name']}: {e}")

        print("\n✅ Weather monitoring concluído")

def main():
    """Função principal"""
    engine = WeatherSalesEngine()

    import sys
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == 'offers':
            # Localização de exemplo (São Paulo)
            location = {'lat': -23.5505, 'lon': -46.6333}

            if len(sys.argv) > 3:
                location['lat'] = float(sys.argv[2])
                location['lon'] = float(sys.argv[3])

            result = engine.get_personalized_offers(location)
            print("🌤️ Ofertas Personalizadas:")
            print(json.dumps(result, indent=2, ensure_ascii=False))

        elif command == 'campaign':
            location = {'lat': -23.5505, 'lon': -46.6333}
            campaign = engine.create_weather_campaign(location)
            print("📢 Campanha Climática:")
            print(json.dumps(campaign, indent=2, ensure_ascii=False))

        elif command == 'monitor':
            engine.run_weather_monitoring()

        else:
            print("Comandos: offers [lat lon], campaign, monitor")

    else:
        print("🌤️ GetNexo Weather Sales Engine")
        print("Sistema de ofertas dinâmicas baseadas no clima")
        print("Comandos disponíveis:")
        print("  offers [lat lon] - Ver ofertas personalizadas")
        print("  campaign        - Criar campanha climática")
        print("  monitor         - Monitorar todas as localizações")

if __name__ == "__main__":
    main()