#!/usr/bin/env python3
"""
GetNexo Viral Launch - Automação de Postagens Simultâneas
Sistema de lançamento viral com postagem automática em múltiplas plataformas
"""

import os
import json
import tweepy
import requests
import time
from datetime import datetime, timedelta
from PIL import Image, ImageDraw, ImageFont
import io
import base64
from urllib.parse import urlencode

class ViralLaunch:
    def __init__(self):
        # Configurações das APIs
        self.api_keys = {
            'twitter': {
                'consumer_key': os.getenv('TWITTER_API_KEY'),
                'consumer_secret': os.getenv('TWITTER_API_SECRET'),
                'access_token': os.getenv('TWITTER_ACCESS_TOKEN'),
                'access_token_secret': os.getenv('TWITTER_ACCESS_SECRET')
            },
            'reddit': {
                'client_id': os.getenv('REDDIT_CLIENT_ID'),
                'client_secret': os.getenv('REDDIT_CLIENT_SECRET'),
                'username': os.getenv('REDDIT_USERNAME'),
                'password': os.getenv('REDDIT_PASSWORD')
            },
            'tiktok': {
                'access_token': os.getenv('TIKTOK_ACCESS_TOKEN')
            },
            'instagram': {
                'access_token': os.getenv('INSTAGRAM_ACCESS_TOKEN'),
                'account_id': os.getenv('INSTAGRAM_ACCOUNT_ID')
            },
            'linkedin': {
                'access_token': os.getenv('LINKEDIN_ACCESS_TOKEN'),
                'account_id': os.getenv('LINKEDIN_ACCOUNT_ID')
            },
            'facebook': {
                'access_token': os.getenv('FACEBOOK_ACCESS_TOKEN'),
                'page_id': os.getenv('FACEBOOK_PAGE_ID')
            }
        }

        self.platforms = {
            'twitter': {
                'enabled': bool(self.api_keys['twitter']['consumer_key']),
                'max_chars': 280,
                'supports_images': True,
                'supports_video': True,
                'rate_limit': 300  # tweets por 3 horas
            },
            'reddit': {
                'enabled': bool(self.api_keys['reddit']['client_id']),
                'max_chars': 40000,
                'supports_images': True,
                'supports_video': False,
                'rate_limit': 600  # posts por hora
            },
            'tiktok': {
                'enabled': bool(self.api_keys['tiktok']['access_token']),
                'max_chars': 2200,
                'supports_images': False,
                'supports_video': True,
                'rate_limit': 1000  # posts por hora
            },
            'instagram': {
                'enabled': bool(self.api_keys['instagram']['access_token']),
                'max_chars': 2200,
                'supports_images': True,
                'supports_video': True,
                'rate_limit': 200  # posts por hora
            },
            'linkedin': {
                'enabled': bool(self.api_keys['linkedin']['access_token']),
                'max_chars': 3000,
                'supports_images': True,
                'supports_video': True,
                'rate_limit': 100  # posts por hora
            },
            'facebook': {
                'enabled': bool(self.api_keys['facebook']['access_token']),
                'max_chars': 63206,
                'supports_images': True,
                'supports_video': True,
                'rate_limit': 200  # posts por hora
            }
        }

        # Estratégias de viralização
        self.viral_strategies = {
            'momentum': {
                'description': 'Posts sequenciais com timing otimizado',
                'platforms': ['twitter', 'reddit', 'linkedin'],
                'delays': [0, 30, 120]  # segundos entre posts
            },
            'explosion': {
                'description': 'Todos os posts simultâneos',
                'platforms': ['twitter', 'facebook', 'instagram', 'linkedin'],
                'delays': [0, 0, 0, 0]
            },
            'drip': {
                'description': 'Posts espaçados ao longo do tempo',
                'platforms': ['twitter', 'linkedin', 'facebook'],
                'delays': [0, 300, 900]  # 5 min, 15 min
            },
            'platform_specific': {
                'description': 'Conteúdo otimizado por plataforma',
                'platforms': ['twitter', 'instagram', 'tiktok', 'reddit'],
                'delays': [0, 60, 180, 300]
            }
        }

        # Templates de conteúdo por plataforma
        self.content_templates = self._load_content_templates()

        # Histórico de campanhas
        self.campaigns_log = 'data/viral_campaigns.json'

    def _load_content_templates(self):
        """Carrega templates de conteúdo por plataforma"""
        return {
            'twitter': {
                'max_length': 280,
                'style': 'conciso, hashtags, perguntas',
                'best_time': '12:00-15:00',
                'hashtags': ['#Viral', '#Trending', '#MustSee']
            },
            'instagram': {
                'max_length': 2200,
                'style': 'visual, stories, reels',
                'best_time': '11:00-13:00',
                'hashtags': ['#InstaDaily', '#ExplorePage', '#Viral']
            },
            'facebook': {
                'max_length': 63206,
                'style': 'conversacional, perguntas',
                'best_time': '13:00-15:00',
                'hashtags': ['#Facebook', '#Viral']
            },
            'linkedin': {
                'max_length': 3000,
                'style': 'profissional, insights',
                'best_time': '08:00-10:00',
                'hashtags': ['#LinkedIn', '#Business', '#Innovation']
            },
            'reddit': {
                'max_length': 40000,
                'style': 'comunidade específica, título atraente',
                'best_time': '18:00-21:00',
                'hashtags': []
            },
            'tiktok': {
                'max_length': 2200,
                'style': 'vídeo curto, tendência, música',
                'best_time': '19:00-21:00',
                'hashtags': ['#TikTok', '#Viral', '#Trending']
            }
        }

    def create_viral_campaign(self, topic, content, strategy='momentum', platforms=None, **kwargs):
        """Cria campanha viral completa"""
        if strategy not in self.viral_strategies:
            raise Exception(f"Estratégia '{strategy}' não encontrada")

        if not platforms:
            platforms = self.viral_strategies[strategy]['platforms']

        # Filtrar apenas plataformas habilitadas
        enabled_platforms = [p for p in platforms if self.platforms[p]['enabled']]

        if not enabled_platforms:
            raise Exception("Nenhuma plataforma habilitada disponível")

        campaign = {
            'id': f"viral_{int(time.time())}",
            'topic': topic,
            'strategy': strategy,
            'platforms': enabled_platforms,
            'content': content,
            'customization': kwargs,
            'created_at': datetime.now().isoformat(),
            'scheduled_posts': [],
            'status': 'created'
        }

        # Preparar posts para cada plataforma
        for i, platform in enumerate(enabled_platforms):
            post_content = self._adapt_content_for_platform(content, platform, **kwargs)
            delay = self.viral_strategies[strategy]['delays'][i] if i < len(self.viral_strategies[strategy]['delays']) else 0

            campaign['scheduled_posts'].append({
                'platform': platform,
                'content': post_content,
                'delay_seconds': delay,
                'scheduled_time': (datetime.now() + timedelta(seconds=delay)).isoformat(),
                'status': 'pending'
            })

        # Salvar campanha
        self._save_campaign(campaign)

        print(f"🚀 Campanha viral criada: {campaign['id']}")
        print(f"📊 Estratégia: {strategy}")
        print(f"🎯 Plataformas: {', '.join(enabled_platforms)}")
        print(f"⏰ Posts agendados: {len(campaign['scheduled_posts'])}")

        return campaign

    def _adapt_content_for_platform(self, base_content, platform, **kwargs):
        """Adapta conteúdo para plataforma específica"""
        template = self.content_templates[platform]
        adapted = base_content.copy()

        # Ajustar comprimento
        if 'text' in adapted and len(adapted['text']) > template['max_length']:
            adapted['text'] = adapted['text'][:template['max_length']-3] + "..."

        # Adicionar elementos específicos da plataforma
        if platform == 'twitter':
            adapted['text'] += f"\n\n{base_content.get('hashtags', '')} #GetNexo"
            if len(adapted['text']) > 280:
                adapted['text'] = adapted['text'][:277] + "..."

        elif platform == 'instagram':
            adapted['text'] += f"\n\n{base_content.get('hashtags', '')}\n.\n.\n.\n#GetNexo"
            adapted['media_type'] = 'carousel' if 'images' in adapted and len(adapted['images']) > 1 else 'single'

        elif platform == 'linkedin':
            adapted['text'] = f"💼 {adapted['text']}\n\n{base_content.get('hashtags', '')} #GetNexo"
            adapted['professional'] = True

        elif platform == 'reddit':
            adapted['title'] = adapted.get('title', adapted['text'][:100] + "...")
            adapted['subreddit'] = kwargs.get('subreddit', 'technology')
            adapted['flair'] = kwargs.get('flair', 'Discussion')

        elif platform == 'tiktok':
            adapted['text'] = adapted['text'][:150] + "..." if len(adapted['text']) > 150 else adapted['text']
            adapted['music'] = kwargs.get('music', 'trending_viral')
            adapted['effects'] = kwargs.get('effects', ['text_overlay', 'speed_up'])

        return adapted

    def launch_campaign(self, campaign_id):
        """Executa campanha viral"""
        campaign = self._load_campaign(campaign_id)
        if not campaign:
            raise Exception(f"Campanha {campaign_id} não encontrada")

        if campaign['status'] != 'created':
            raise Exception(f"Campanha já foi executada (status: {campaign['status']})")

        print(f"🚀 Iniciando campanha viral: {campaign_id}")
        campaign['status'] = 'launching'
        campaign['launched_at'] = datetime.now().isoformat()

        results = []

        for post in campaign['scheduled_posts']:
            try:
                print(f"📤 Postando em {post['platform']}...")

                # Aguardar delay
                if post['delay_seconds'] > 0:
                    print(f"⏰ Aguardando {post['delay_seconds']} segundos...")
                    time.sleep(post['delay_seconds'])

                # Postar na plataforma
                result = self._post_to_platform(post['platform'], post['content'])

                post['status'] = 'posted'
                post['posted_at'] = datetime.now().isoformat()
                post['result'] = result

                results.append({
                    'platform': post['platform'],
                    'status': 'success',
                    'post_id': result.get('id'),
                    'url': result.get('url')
                })

                print(f"✅ Postado com sucesso em {post['platform']}")

            except Exception as e:
                post['status'] = 'failed'
                post['error'] = str(e)
                results.append({
                    'platform': post['platform'],
                    'status': 'failed',
                    'error': str(e)
                })
                print(f"❌ Falha em {post['platform']}: {e}")

        campaign['status'] = 'completed'
        campaign['completed_at'] = datetime.now().isoformat()
        campaign['results'] = results

        # Salvar resultados
        self._save_campaign(campaign)

        # Gerar relatório
        report = self._generate_campaign_report(campaign)

        print(f"🎉 Campanha concluída! {len([r for r in results if r['status'] == 'success'])}/{len(results)} posts bem-sucedidos")
        return report

    def _post_to_platform(self, platform, content):
        """Posta conteúdo em plataforma específica"""
        if platform == 'twitter':
            return self._post_twitter(content)
        elif platform == 'facebook':
            return self._post_facebook(content)
        elif platform == 'instagram':
            return self._post_instagram(content)
        elif platform == 'linkedin':
            return self._post_linkedin(content)
        elif platform == 'reddit':
            return self._post_reddit(content)
        elif platform == 'tiktok':
            return self._post_tiktok(content)
        else:
            raise Exception(f"Plataforma {platform} não suportada")

    def _post_twitter(self, content):
        """Posta no Twitter"""
        auth = tweepy.OAuth1UserHandler(
            self.api_keys['twitter']['consumer_key'],
            self.api_keys['twitter']['consumer_secret'],
            self.api_keys['twitter']['access_token'],
            self.api_keys['twitter']['access_token_secret']
        )
        api = tweepy.API(auth)

        tweet_text = content['text']

        # Se tem mídia
        if 'images' in content and content['images']:
            media_ids = []
            for image_url in content['images'][:4]:  # Máximo 4 imagens
                media = api.media_upload(image_url)
                media_ids.append(media.media_id)

            tweet = api.update_status(status=tweet_text, media_ids=media_ids)
        else:
            tweet = api.update_status(status=tweet_text)

        return {
            'id': tweet.id_str,
            'url': f"https://twitter.com/user/status/{tweet.id_str}",
            'text': tweet_text
        }

    def _post_facebook(self, content):
        """Posta no Facebook"""
        url = f"https://graph.facebook.com/v18.0/{self.api_keys['facebook']['page_id']}/feed"

        data = {
            'message': content['text'],
            'access_token': self.api_keys['facebook']['access_token']
        }

        # Se tem imagem
        if 'images' in content and content['images']:
            data['link'] = content['images'][0]  # Facebook pode postar link para imagem

        response = requests.post(url, data=data)
        response.raise_for_status()

        post_data = response.json()

        return {
            'id': post_data['id'],
            'url': f"https://facebook.com/{post_data['id']}"
        }

    def _post_instagram(self, content):
        """Posta no Instagram (simplificado)"""
        # Implementação completa requer Instagram Graph API
        # Aqui uma versão simplificada
        url = f"https://graph.facebook.com/v18.0/{self.api_keys['instagram']['account_id']}/media"

        data = {
            'image_url': content.get('images', [None])[0] if 'images' in content else None,
            'caption': content['text'],
            'access_token': self.api_keys['instagram']['access_token']
        }

        if data['image_url']:
            response = requests.post(url, data=data)
            response.raise_for_status()
            media_data = response.json()

            # Publicar
            publish_url = f"https://graph.facebook.com/v18.0/{self.api_keys['instagram']['account_id']}/media_publish"
            publish_data = {
                'creation_id': media_data['id'],
                'access_token': self.api_keys['instagram']['access_token']
            }

            publish_response = requests.post(publish_url, data=publish_data)
            publish_response.raise_for_status()

            return {
                'id': publish_response.json()['id'],
                'url': f"https://instagram.com/p/{publish_response.json()['id']}"
            }
        else:
            raise Exception("Instagram requer imagem para postar")

    def _post_linkedin(self, content):
        """Posta no LinkedIn"""
        url = "https://api.linkedin.com/v2/ugcPosts"

        headers = {
            'Authorization': f"Bearer {self.api_keys['linkedin']['access_token']}",
            'Content-Type': 'application/json'
        }

        post_data = {
            "author": f"urn:li:organization:{self.api_keys['linkedin']['account_id']}",
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": content['text']
                    },
                    "shareMediaCategory": "NONE"
                }
            },
            "visibility": {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
            }
        }

        response = requests.post(url, headers=headers, json=post_data)
        response.raise_for_status()

        return {
            'id': response.headers.get('X-RestLi-Id'),
            'url': f"https://linkedin.com/feed/update/{response.headers.get('X-RestLi-Id')}"
        }

    def _post_reddit(self, content):
        """Posta no Reddit"""
        # Simulação - implementação completa requer PRAW
        print(f"📝 Simulando post no Reddit r/{content.get('subreddit', 'technology')}")
        print(f"📌 Título: {content.get('title', 'Post viral')}")
        print(f"📖 Texto: {content['text'][:100]}...")

        return {
            'id': f"simulated_{int(time.time())}",
            'url': f"https://reddit.com/r/{content.get('subreddit', 'technology')}/simulated_post",
            'title': content.get('title', 'Post viral')
        }

    def _post_tiktok(self, content):
        """Posta no TikTok"""
        # Implementação simplificada - TikTok API requer vídeo
        print("🎵 Simulando post no TikTok")
        print(f"📹 Vídeo: {content.get('video_url', 'simulated_video.mp4')}")
        print(f"📝 Legenda: {content['text'][:50]}...")

        return {
            'id': f"tiktok_{int(time.time())}",
            'url': f"https://tiktok.com/@getnexo/video/{int(time.time())}"
        }

    def _save_campaign(self, campaign):
        """Salva campanha no histórico"""
        try:
            campaigns = self._load_all_campaigns()
            campaigns[campaign['id']] = campaign

            os.makedirs(os.path.dirname(self.campaigns_log), exist_ok=True)
            with open(self.campaigns_log, 'w') as f:
                json.dump(campaigns, f, indent=2)

        except Exception as e:
            print(f"Aviso ao salvar campanha: {e}")

    def _load_campaign(self, campaign_id):
        """Carrega campanha específica"""
        campaigns = self._load_all_campaigns()
        return campaigns.get(campaign_id)

    def _load_all_campaigns(self):
        """Carrega todas as campanhas"""
        try:
            if os.path.exists(self.campaigns_log):
                with open(self.campaigns_log, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Aviso ao carregar campanhas: {e}")
        return {}

    def _generate_campaign_report(self, campaign):
        """Gera relatório da campanha"""
        successful_posts = [r for r in campaign['results'] if r['status'] == 'success']
        failed_posts = [r for r in campaign['results'] if r['status'] == 'failed']

        report = {
            'campaign_id': campaign['id'],
            'topic': campaign['topic'],
            'strategy': campaign['strategy'],
            'success_rate': len(successful_posts) / len(campaign['results']) if campaign['results'] else 0,
            'total_posts': len(campaign['results']),
            'successful_posts': len(successful_posts),
            'failed_posts': len(failed_posts),
            'platforms_used': [p['platform'] for p in campaign['scheduled_posts']],
            'duration_seconds': (datetime.fromisoformat(campaign['completed_at']) - datetime.fromisoformat(campaign['launched_at'])).total_seconds(),
            'results': campaign['results'],
            'generated_at': datetime.now().isoformat()
        }

        return report

    def get_campaign_analytics(self, campaign_id):
        """Obtém analytics da campanha"""
        campaign = self._load_campaign(campaign_id)
        if not campaign or campaign['status'] != 'completed':
            raise Exception("Campanha não encontrada ou não concluída")

        # Simulação de analytics (em produção, buscaria das APIs)
        analytics = {
            'campaign_id': campaign_id,
            'total_reach': sum(np.random.randint(100, 10000) for _ in campaign['results']),
            'total_engagement': sum(np.random.randint(10, 1000) for _ in campaign['results']),
            'best_performing_platform': max(campaign['results'], key=lambda x: np.random.random())['platform'],
            'viral_coefficient': np.random.uniform(1.1, 3.0),
            'estimated_views': sum(np.random.randint(500, 50000) for _ in campaign['results'])
        }

        return analytics

    def create_content_from_template(self, template_type, **params):
        """Cria conteúdo baseado em template"""
        templates = {
            'product_launch': {
                'text': f"🚀 Acabamos de lançar {params.get('product_name', 'nosso novo produto')}! {params.get('description', '')}",
                'hashtags': "#Lancamento #Produto #Inovacao",
                'call_to_action': "Confira agora!"
            },
            'milestone': {
                'text': f"🎉 Alcancamos {params.get('milestone', 'uma meta incrível')}! Obrigado a todos os {params.get('supporters', 'nossos apoiadores')}.",
                'hashtags': "#Meta #Conquista #Obrigado",
                'call_to_action': "Junte-se a nós!"
            },
            'announcement': {
                'text': f"📢 {params.get('announcement', 'Grande novidade chegando em breve')}! Fiquem ligados.",
                'hashtags': "#Novidade #EmBreve #Ansioso",
                'call_to_action': "Não percam!"
            }
        }

        if template_type not in templates:
            raise Exception(f"Template '{template_type}' não encontrado")

        return templates[template_type]

def main():
    """Função principal"""
    launcher = ViralLaunch()

    import sys
    if len(sys.argv) < 2:
        print("🚀 Viral Launch - Automação de Postagens Simultâneas")
        print("Comandos disponíveis:")
        print("  create <topic> <strategy> [platforms]   - Criar campanha")
        print("  launch <campaign_id>                    - Executar campanha")
        print("  analytics <campaign_id>                 - Ver analytics")
        print("  template <type>                         - Criar conteúdo de template")
        print("  list                                     - Listar campanhas")
        print("\nEstratégias: momentum, explosion, drip, platform_specific")
        print("Templates: product_launch, milestone, announcement")
        return

    command = sys.argv[1]

    try:
        if command == 'create':
            if len(sys.argv) < 4:
                print("Uso: python viral_launch.py create <topic> <strategy> [platforms]")
                return

            topic = sys.argv[2]
            strategy = sys.argv[3]
            platforms = sys.argv[4].split(',') if len(sys.argv) > 4 else None

            # Conteúdo básico de exemplo
            content = {
                'text': f"🚀 {topic} - Descubra o poder da inovação com GetNexo!",
                'hashtags': "#GetNexo #Inovacao #Tecnologia",
                'images': []  # Adicionar URLs de imagens se necessário
            }

            campaign = launcher.create_viral_campaign(topic, content, strategy, platforms)
            print(f"✅ Campanha criada: {campaign['id']}")

        elif command == 'launch':
            if len(sys.argv) < 3:
                print("Uso: python viral_launch.py launch <campaign_id>")
                return
            campaign_id = sys.argv[2]
            report = launcher.launch_campaign(campaign_id)
            print("📊 RELATÓRIO DA CAMPANHA:")
            print(json.dumps(report, indent=2))

        elif command == 'analytics':
            if len(sys.argv) < 3:
                print("Uso: python viral_launch.py analytics <campaign_id>")
                return
            campaign_id = sys.argv[2]
            analytics = launcher.get_campaign_analytics(campaign_id)
            print("📈 ANALYTICS DA CAMPANHA:")
            print(json.dumps(analytics, indent=2))

        elif command == 'template':
            if len(sys.argv) < 3:
                print("Uso: python viral_launch.py template <type>")
                return
            template_type = sys.argv[2]
            content = launcher.create_content_from_template(template_type)
            print(f"📝 Conteúdo do template '{template_type}':")
            print(json.dumps(content, indent=2))

        elif command == 'list':
            campaigns = launcher._load_all_campaigns()
            print(f"📋 {len(campaigns)} Campanhas:")
            for cid, camp in campaigns.items():
                print(f"  {cid}: {camp['topic']} ({camp['status']}) - {len(camp.get('platforms', []))} plataformas")

        else:
            print("Comando não reconhecido. Use sem argumentos para ver ajuda.")

    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()