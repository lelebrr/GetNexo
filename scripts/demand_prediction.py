#!/usr/bin/env python3
"""
GetNexo Demand Prediction - Sistema de Predição de Demanda e Otimização de Estoque
Engine avançado de ML para forecasting de vendas e gestão inteligente de inventário
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import warnings
warnings.filterwarnings('ignore')

class DemandPredictionEngine:
    def __init__(self):
        self.models_dir = 'data/ml_models/'
        self.data_dir = 'data/demand_data/'
        self.predictions_dir = 'data/predictions/'

        # Configurações de ML
        self.model_configs = {
            'random_forest': {
                'model': RandomForestRegressor(
                    n_estimators=100,
                    max_depth=20,
                    random_state=42
                ),
                'features': ['price', 'season', 'trend', 'competitor_price', 'marketing_spend']
            },
            'gradient_boosting': {
                'model': GradientBoostingRegressor(
                    n_estimators=200,
                    learning_rate=0.1,
                    max_depth=10,
                    random_state=42
                ),
                'features': ['price', 'season', 'trend', 'competitor_price', 'marketing_spend', 'weather']
            },
            'linear_regression': {
                'model': LinearRegression(),
                'features': ['price', 'season', 'trend']
            }
        }

        # Fatores externos que influenciam demanda
        self.external_factors = {
            'seasonal': {
                'summer_boost': 1.3,
                'winter_boost': 1.1,
                'spring_boost': 1.05,
                'fall_boost': 1.0
            },
            'weather': {
                'rainy': 0.8,
                'sunny': 1.2,
                'snow': 0.6,
                'cloudy': 0.9
            },
            'economic': {
                'recession': 0.7,
                'growth': 1.4,
                'inflation': 0.9,
                'stability': 1.0
            },
            'events': {
                'black_friday': 2.5,
                'christmas': 2.0,
                'new_year': 1.8,
                'easter': 1.3,
                'valentines': 1.6,
                'halloween': 1.4,
                'mothers_day': 1.5,
                'fathers_day': 1.3
            }
        }

        # Configurações de inventário
        self.inventory_config = {
            'safety_stock_days': 7,
            'lead_time_days': 3,
            'service_level_target': 0.95,
            'max_stock_days': 30,
            'reorder_point_method': 'economic_order_quantity'
        }

        # Modelos treinados
        self.trained_models = {}
        self.scalers = {}

        # Carregar modelos existentes
        self._load_models()

    def _load_models(self):
        """Carrega modelos treinados existentes"""
        try:
            for model_name in self.model_configs.keys():
                model_path = f"{self.models_dir}{model_name}_demand.pkl"
                scaler_path = f"{self.models_dir}{model_name}_scaler.pkl"

                if os.path.exists(model_path):
                    self.trained_models[model_name] = joblib.load(model_path)
                    print(f"✅ Modelo {model_name} carregado")

                if os.path.exists(scaler_path):
                    self.scalers[model_name] = joblib.load(scaler_path)
        except Exception as e:
            print(f"Aviso ao carregar modelos: {e}")

    def _save_model(self, model_name, model, scaler=None):
        """Salva modelo treinado"""
        os.makedirs(self.models_dir, exist_ok=True)

        model_path = f"{self.models_dir}{model_name}_demand.pkl"
        joblib.dump(model, model_path)

        if scaler:
            scaler_path = f"{self.models_dir}{model_name}_scaler.pkl"
            joblib.dump(scaler, scaler_path)

        print(f"💾 Modelo {model_name} salvo")

    def generate_synthetic_data(self, product_id, days=365):
        """Gera dados sintéticos para treinamento"""
        print(f"📊 Gerando dados sintéticos para {product_id}...")

        dates = pd.date_range(start='2023-01-01', periods=days, freq='D')
        data = []

        for i, date in enumerate(dates):
            # Base sales com sazonalidade
            base_sales = 100 + 50 * np.sin(2 * np.pi * i / 365) + random.gauss(0, 20)

            # Fatores sazonais
            month = date.month
            if month in [12, 1, 2]:  # Inverno
                seasonal_factor = self.external_factors['seasonal']['winter_boost']
            elif month in [6, 7, 8]:  # Verão
                seasonal_factor = self.external_factors['seasonal']['summer_boost']
            elif month in [3, 4, 5]:  # Primavera
                seasonal_factor = self.external_factors['seasonal']['spring_boost']
            else:  # Outono
                seasonal_factor = self.external_factors['seasonal']['fall_boost']

            # Eventos especiais
            event_factor = 1.0
            day_events = {
                (12, 25): 'christmas',      # Natal
                (1, 1): 'new_year',         # Ano Novo
                (4, random.randint(1, 7)): 'easter',  # Páscoa (aproximada)
                (2, 14): 'valentines',      # Dia dos Namorados
                (10, 31): 'halloween',      # Halloween
                (5, random.randint(8, 14)): 'mothers_day',  # Dia das Mães
                (8, random.randint(8, 14)): 'fathers_day',  # Dia dos Pais
                (11, random.randint(23, 29)): 'black_friday'  # Black Friday
            }

            for (m, d), event in day_events.items():
                if month == m and (d == date.day or (event == 'easter' and abs(date.day - d) <= 3)):
                    event_factor = self.external_factors['events'].get(event, 1.0)
                    break

            # Clima (simulado)
            weather_options = ['sunny', 'rainy', 'cloudy']
            weather = random.choice(weather_options)
            weather_factor = self.external_factors['weather'].get(weather, 1.0)

            # Preço (com variações)
            base_price = 99.99
            price_variation = random.gauss(0, 10)
            price = max(50, base_price + price_variation)

            # Marketing
            marketing_spend = random.gauss(1000, 200) if random.random() < 0.3 else 0

            # Concorrente
            competitor_price = price * random.uniform(0.9, 1.1)

            # Vendas finais
            sales = int(base_sales * seasonal_factor * event_factor * weather_factor)

            # Adicionar ruído
            sales = max(0, sales + random.gauss(0, 10))

            data.append({
                'date': date,
                'product_id': product_id,
                'sales': sales,
                'price': round(price, 2),
                'season': month,
                'trend': i / days,  # Tendência linear
                'competitor_price': round(competitor_price, 2),
                'marketing_spend': round(max(0, marketing_spend), 2),
                'weather': weather,
                'event_factor': event_factor,
                'seasonal_factor': seasonal_factor
            })

        df = pd.DataFrame(data)
        return df

    def train_demand_model(self, product_id, model_name='random_forest', force_retrain=False):
        """Treina modelo de predição de demanda"""
        if model_name not in self.model_configs:
            raise Exception(f"Modelo '{model_name}' não suportado")

        model_key = f"{product_id}_{model_name}"

        if not force_retrain and model_key in self.trained_models:
            print(f"✅ Modelo {model_key} já treinado")
            return self.trained_models[model_key]

        print(f"🤖 Treinando modelo {model_name} para {product_id}...")

        # Gerar dados de treinamento
        train_data = self.generate_synthetic_data(product_id, days=365)
        features = self.model_configs[model_name]['features']

        # Preparar dados
        X = train_data[features]
        y = train_data['sales']

        # Codificar variáveis categóricas
        X = pd.get_dummies(X, columns=['weather'], drop_first=True)

        # Normalizar
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Treinar modelo
        model = self.model_configs[model_name]['model']
        model.fit(X_scaled, y)

        # Salvar modelo e scaler
        self.trained_models[model_key] = model
        self.scalers[model_key] = scaler
        self._save_model(model_key, model, scaler)

        # Avaliar modelo
        predictions = model.predict(X_scaled)
        mae = mean_absolute_error(y, predictions)
        rmse = np.sqrt(mean_squared_error(y, predictions))
        r2 = r2_score(y, predictions)

        print(f"📈 Modelo {model_name} treinado:")
        print(f"   MAE: {mae:.2f}")
        print(f"   RMSE: {rmse:.2f}")
        print(f"   R²: {r2:.3f}")

        return model

    def predict_demand(self, product_id, forecast_days=30, model_name='random_forest'):
        """Faz predição de demanda"""
        model_key = f"{product_id}_{model_name}"

        if model_key not in self.trained_models:
            self.train_demand_model(product_id, model_name)

        model = self.trained_models[model_key]
        scaler = self.scalers[model_key]

        print(f"🔮 Fazendo predição de {forecast_days} dias para {product_id}...")

        # Gerar dados futuros
        future_dates = pd.date_range(
            start=datetime.now(),
            periods=forecast_days,
            freq='D'
        )

        predictions = []

        for date in future_dates:
            # Simular condições futuras
            features = self._generate_future_features(date, product_id)

            # Preparar para predição
            X = pd.DataFrame([features])
            X = pd.get_dummies(X, columns=['weather'], drop_first=True)

            # Garantir mesmas colunas do treinamento
            # (simplificado - em produção seria mais robusto)

            try:
                X_scaled = scaler.transform(X)
                prediction = model.predict(X_scaled)[0]

                # Adicionar variação e incerteza
                uncertainty = abs(random.gauss(0, prediction * 0.2))
                prediction = max(0, prediction + random.gauss(0, uncertainty))

                predictions.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'predicted_sales': round(prediction, 1),
                    'confidence_interval': {
                        'lower': max(0, prediction - uncertainty),
                        'upper': prediction + uncertainty
                    },
                    'factors': features
                })

            except Exception as e:
                print(f"Aviso na predição para {date}: {e}")
                predictions.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'predicted_sales': 0,
                    'confidence_interval': {'lower': 0, 'upper': 0},
                    'factors': features
                })

        return {
            'product_id': product_id,
            'model': model_name,
            'forecast_period': forecast_days,
            'predictions': predictions,
            'summary': self._summarize_predictions(predictions)
        }

    def _generate_future_features(self, date, product_id):
        """Gera features para data futura"""
        month = date.month

        # Estação do ano
        if month in [12, 1, 2]:
            seasonal_factor = self.external_factors['seasonal']['winter_boost']
        elif month in [6, 7, 8]:
            seasonal_factor = self.external_factors['seasonal']['summer_boost']
        elif month in [3, 4, 5]:
            seasonal_factor = self.external_factors['seasonal']['spring_boost']
        else:
            seasonal_factor = self.external_factors['seasonal']['fall_boost']

        # Clima (simulado)
        weather_options = ['sunny', 'rainy', 'cloudy']
        weather_weights = [0.4, 0.3, 0.3]  # Probabilidades
        weather = random.choices(weather_options, weights=weather_weights)[0]

        # Evento especial?
        event_factor = 1.0
        if date.month == 12 and date.day == 25:
            event_factor = self.external_factors['events']['christmas']
        elif date.month == 11 and date.day >= 23:  # Black Friday aproximado
            event_factor = self.external_factors['events']['black_friday']

        # Preço (com variação)
        base_price = 99.99
        price = base_price * random.uniform(0.9, 1.1)

        return {
            'price': round(price, 2),
            'season': month,
            'trend': 1.0,  # Tendência futura
            'competitor_price': round(price * random.uniform(0.95, 1.05), 2),
            'marketing_spend': random.gauss(800, 150) if random.random() < 0.25 else 0,
            'weather': weather,
            'seasonal_factor': seasonal_factor,
            'event_factor': event_factor
        }

    def _summarize_predictions(self, predictions):
        """Cria resumo das predições"""
        if not predictions:
            return {}

        sales_values = [p['predicted_sales'] for p in predictions]

        return {
            'total_predicted_sales': round(sum(sales_values), 1),
            'average_daily_sales': round(np.mean(sales_values), 1),
            'max_daily_sales': round(max(sales_values), 1),
            'min_daily_sales': round(min(sales_values), 1),
            'sales_volatility': round(np.std(sales_values), 1),
            'peak_days': len([p for p in predictions if p['predicted_sales'] > np.mean(sales_values) * 1.5])
        }

    def optimize_inventory(self, product_id, current_stock=0, lead_time_days=3):
        """Otimiza níveis de inventário baseados nas predições"""
        print(f"📦 Otimizando inventário para {product_id}...")

        # Obter predições
        forecast = self.predict_demand(product_id, forecast_days=30)
        daily_demand = forecast['summary']['average_daily_sales']

        # Calcular métricas de inventário
        safety_stock = daily_demand * self.inventory_config['safety_stock_days']
        reorder_point = daily_demand * lead_time_days + safety_stock
        economic_order_quantity = self._calculate_eoq(daily_demand)

        # Recomendações
        recommendations = {
            'current_stock': current_stock,
            'recommended_safety_stock': round(safety_stock, 1),
            'reorder_point': round(reorder_point, 1),
            'economic_order_quantity': round(economic_order_quantity, 1),
            'max_stock_level': round(daily_demand * self.inventory_config['max_stock_days'], 1),
            'estimated_coverage_days': round(current_stock / daily_demand, 1) if daily_demand > 0 else 0,
            'status': self._assess_stock_status(current_stock, reorder_point, daily_demand),
            'actions': self._generate_inventory_actions(current_stock, reorder_point, economic_order_quantity)
        }

        return {
            'product_id': product_id,
            'forecast': forecast['summary'],
            'inventory_optimization': recommendations,
            'generated_at': datetime.now().isoformat()
        }

    def _calculate_eoq(self, daily_demand, ordering_cost=50, holding_cost_rate=0.2):
        """Calcula Quantidade Econômica de Pedido (EOQ)"""
        annual_demand = daily_demand * 365
        eoq = np.sqrt((2 * annual_demand * ordering_cost) / holding_cost_rate)
        return eoq

    def _assess_stock_status(self, current_stock, reorder_point, daily_demand):
        """Avalia status do estoque"""
        if current_stock <= reorder_point * 0.1:
            return 'critical'
        elif current_stock <= reorder_point:
            return 'low'
        elif current_stock >= reorder_point * 2:
            return 'high'
        else:
            return 'optimal'

    def _generate_inventory_actions(self, current_stock, reorder_point, eoq):
        """Gera ações recomendadas para inventário"""
        actions = []

        if current_stock <= reorder_point:
            order_quantity = min(eoq, reorder_point * 2 - current_stock)
            actions.append({
                'action': 'reorder',
                'quantity': round(order_quantity, 1),
                'priority': 'high',
                'reason': f'Estoque abaixo do ponto de pedido ({reorder_point})'
            })

        if current_stock >= reorder_point * 2.5:
            actions.append({
                'action': 'promotional_sale',
                'quantity': round(current_stock - reorder_point * 1.5, 1),
                'priority': 'medium',
                'reason': 'Estoque excessivo detectado'
            })

        return actions

    def generate_demand_report(self, product_ids, forecast_days=30):
        """Gera relatório completo de demanda"""
        print(f"📊 Gerando relatório de demanda para {len(product_ids)} produtos...")

        report = {
            'generated_at': datetime.now().isoformat(),
            'forecast_period_days': forecast_days,
            'products': {},
            'summary': {},
            'recommendations': []
        }

        total_predicted_sales = 0
        critical_products = []

        for product_id in product_ids:
            try:
                # Predição e otimização
                forecast = self.predict_demand(product_id, forecast_days)
                inventory_opt = self.optimize_inventory(product_id)

                report['products'][product_id] = {
                    'forecast': forecast,
                    'inventory': inventory_opt
                }

                total_predicted_sales += forecast['summary']['total_predicted_sales']

                # Identificar produtos críticos
                if inventory_opt['inventory_optimization']['status'] in ['critical', 'low']:
                    critical_products.append(product_id)

            except Exception as e:
                print(f"Erro processando {product_id}: {e}")
                report['products'][product_id] = {'error': str(e)}

        # Resumo geral
        report['summary'] = {
            'total_products': len(product_ids),
            'total_predicted_sales': round(total_predicted_sales, 1),
            'critical_products_count': len(critical_products),
            'critical_products': critical_products,
            'average_forecast_accuracy': 0.85  # Simulado
        }

        # Recomendações
        report['recommendations'] = [
            f"Produtos críticos que precisam de reabastecimento: {', '.join(critical_products[:5])}",
            f"Vendas previstas totais: {total_predicted_sales:.0f} unidades em {forecast_days} dias",
            "Considere ajustar preços baseado nas predições sazonais",
            "Implemente alertas automáticos para pontos de reorden"
        ]

        # Salvar relatório
        os.makedirs(self.predictions_dir, exist_ok=True)
        report_file = f"{self.predictions_dir}demand_report_{int(datetime.now().timestamp())}.json"

        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"✅ Relatório salvo em: {report_file}")

        return report

def main():
    """Função principal"""
    engine = DemandPredictionEngine()

    import sys
    if len(sys.argv) < 2:
        print("📈 Demand Prediction Engine - Predição de Demanda GetNexo")
        print("Comandos disponíveis:")
        print("  train <product_id> [model]      - Treinar modelo")
        print("  predict <product_id> [days]     - Fazer predição")
        print("  optimize <product_id> [stock]   - Otimizar inventário")
        print("  report <product_ids>            - Gerar relatório")
        print("  synthetic <product_id> [days]   - Gerar dados sintéticos")
        print("\nModelos: random_forest, gradient_boosting, linear_regression")
        return

    command = sys.argv[1]

    try:
        if command == 'train':
            if len(sys.argv) < 3:
                print("Uso: python demand_prediction.py train <product_id> [model]")
                return
            product_id = sys.argv[2]
            model = sys.argv[3] if len(sys.argv) > 3 else 'random_forest'

            model = engine.train_demand_model(product_id, model)
            print(f"✅ Modelo treinado para {product_id}")

        elif command == 'predict':
            if len(sys.argv) < 3:
                print("Uso: python demand_prediction.py predict <product_id> [days]")
                return
            product_id = sys.argv[2]
            days = int(sys.argv[3]) if len(sys.argv) > 3 else 30

            forecast = engine.predict_demand(product_id, days)
            print(f"🔮 Predição de {days} dias para {product_id}:")
            print(f"   Total previsto: {forecast['summary']['total_predicted_sales']}")
            print(f"   Média diária: {forecast['summary']['average_daily_sales']}")

        elif command == 'optimize':
            if len(sys.argv) < 3:
                print("Uso: python demand_prediction.py optimize <product_id> [stock]")
                return
            product_id = sys.argv[2]
            stock = float(sys.argv[3]) if len(sys.argv) > 3 else 0

            optimization = engine.optimize_inventory(product_id, stock)
            opt = optimization['inventory_optimization']
            print(f"📦 Otimização de inventário para {product_id}:")
            print(f"   Status: {opt['status']}")
            print(f"   Ponto de reorden: {opt['reorder_point']}")
            print(f"   EOQ: {opt['economic_order_quantity']}")

        elif command == 'report':
            if len(sys.argv) < 3:
                print("Uso: python demand_prediction.py report <product_ids>")
                return
            product_ids = sys.argv[2].split(',')

            report = engine.generate_demand_report(product_ids)
            print("📊 Relatório gerado:")
            print(f"   Produtos analisados: {report['summary']['total_products']}")
            print(f"   Vendas previstas: {report['summary']['total_predicted_sales']}")
            print(f"   Produtos críticos: {report['summary']['critical_products_count']}")

        elif command == 'synthetic':
            if len(sys.argv) < 3:
                print("Uso: python demand_prediction.py synthetic <product_id> [days]")
                return
            product_id = sys.argv[2]
            days = int(sys.argv[3]) if len(sys.argv) > 3 else 365

            data = engine.generate_synthetic_data(product_id, days)
            print(f"📊 Dados sintéticos gerados para {product_id}:")
            print(f"   Período: {days} dias")
            print(f"   Total de vendas: {data['sales'].sum()}")
            print(f"   Média diária: {data['sales'].mean():.1f}")

        else:
            print("Comando não reconhecido. Use sem argumentos para ver ajuda.")

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()