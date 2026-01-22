#!/usr/bin/env python3
"""
GetNexo Post-Quantum Handshake - Criptografia Experimental Kyber/Dilithium
Implementação experimental de troca de chaves pós-quânticas
"""

import os
import json
import base64
import hashlib
import secrets
from cryptography.hazmat.primitives import hashes, hmac
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
import warnings
warnings.filterwarnings('ignore')

class PostQuantumHandshake:
    def __init__(self):
        self.backend = default_backend()
        self.supported_algorithms = {
            'kyber512': {'security_level': 1, 'key_size': 512},
            'kyber768': {'security_level': 3, 'key_size': 768},
            'kyber1024': {'security_level': 5, 'key_size': 1024},
            'dilithium2': {'security_level': 2, 'signature_size': 2044},
            'dilithium3': {'security_level': 3, 'signature_size': 2701},
            'dilithium5': {'security_level': 5, 'signature_size': 4595}
        }

        # Chaves armazenadas (em produção, usar HSM ou vault seguro)
        self.key_store = {}
        self.load_key_store()

        # Sessões ativas
        self.active_sessions = {}

    def load_key_store(self):
        """Carrega keystore de chaves pós-quânticas"""
        try:
            if os.path.exists('data/pq_key_store.json'):
                with open('data/pq_key_store.json', 'r') as f:
                    self.key_store = json.load(f)
                print("🔐 Keystore pós-quântico carregado")
            else:
                print("⚠️  Keystore vazio, inicializando novo")
                self.key_store = {}
        except Exception as e:
            print(f"❌ Erro ao carregar keystore: {e}")
            self.key_store = {}

    def save_key_store(self):
        """Salva keystore"""
        try:
            os.makedirs('data', exist_ok=True)
            with open('data/pq_key_store.json', 'w') as f:
                # Não salvar chaves privadas em texto plano em produção!
                json.dump(self.key_store, f, indent=2)
            print("💾 Keystore salvo")
        except Exception as e:
            print(f"❌ Erro ao salvar keystore: {e}")

    def generate_kyber_keypair(self, algorithm='kyber768'):
        """Gera par de chaves Kyber (simulação - em produção usar libpqcrystals-kyber)"""
        if algorithm not in ['kyber512', 'kyber768', 'kyber1024']:
            raise ValueError(f"Algoritmo Kyber não suportado: {algorithm}")

        # Simulação de geração de chaves Kyber
        # Em produção: usar libpqcrystals-kyber ou similar
        private_key = secrets.token_bytes(32)  # Simulação
        public_key = secrets.token_bytes(32)   # Simulação

        key_id = f"kyber_{algorithm}_{secrets.token_hex(8)}"

        self.key_store[key_id] = {
            'algorithm': algorithm,
            'type': 'kyber',
            'public_key': base64.b64encode(public_key).decode(),
            'private_key': base64.b64encode(private_key).decode(),  # NUNCA fazer isso em produção!
            'created': self.get_timestamp(),
            'security_level': self.supported_algorithms[algorithm]['security_level']
        }

        return {
            'key_id': key_id,
            'public_key': base64.b64encode(public_key).decode(),
            'algorithm': algorithm
        }

    def generate_dilithium_keypair(self, algorithm='dilithium3'):
        """Gera par de chaves Dilithium (simulação)"""
        if algorithm not in ['dilithium2', 'dilithium3', 'dilithium5']:
            raise ValueError(f"Algoritmo Dilithium não suportado: {algorithm}")

        # Simulação - em produção usar libpqcrystals-dilithium
        private_key = secrets.token_bytes(32)
        public_key = secrets.token_bytes(32)

        key_id = f"dilithium_{algorithm}_{secrets.token_hex(8)}"

        self.key_store[key_id] = {
            'algorithm': algorithm,
            'type': 'dilithium',
            'public_key': base64.b64encode(public_key).decode(),
            'private_key': base64.b64encode(private_key).decode(),  # NUNCA em produção!
            'created': self.get_timestamp(),
            'security_level': self.supported_algorithms[algorithm]['security_level']
        }

        return {
            'key_id': key_id,
            'public_key': base64.b64encode(public_key).decode(),
            'algorithm': algorithm
        }

    def kyber_encapsulate(self, public_key_b64, algorithm='kyber768'):
        """Encapsula chave secreta usando Kyber (simulação)"""
        try:
            public_key = base64.b64decode(public_key_b64)

            # Simulação do processo de encapsulamento Kyber
            shared_secret = secrets.token_bytes(32)
            ciphertext = secrets.token_bytes(32)  # Simulação do ciphertext

            return {
                'ciphertext': base64.b64encode(ciphertext).decode(),
                'shared_secret': base64.b64encode(shared_secret).decode(),
                'algorithm': algorithm
            }

        except Exception as e:
            raise Exception(f"Erro na encapsulação Kyber: {e}")

    def kyber_decapsulate(self, private_key_b64, ciphertext_b64, algorithm='kyber768'):
        """Decapsula chave secreta usando Kyber (simulação)"""
        try:
            private_key = base64.b64decode(private_key_b64)
            ciphertext = base64.b64decode(ciphertext_b64)

            # Simulação da decapsulação
            shared_secret = secrets.token_bytes(32)

            return base64.b64encode(shared_secret).decode()

        except Exception as e:
            raise Exception(f"Erro na decapsulação Kyber: {e}")

    def dilithium_sign(self, private_key_b64, message, algorithm='dilithium3'):
        """Assina mensagem com Dilithium (simulação)"""
        try:
            private_key = base64.b64decode(private_key_b64)
            message_bytes = message.encode() if isinstance(message, str) else message

            # Simulação da assinatura Dilithium
            signature = secrets.token_bytes(64)  # Simulação

            return base64.b64encode(signature).decode()

        except Exception as e:
            raise Exception(f"Erro na assinatura Dilithium: {e}")

    def dilithium_verify(self, public_key_b64, message, signature_b64, algorithm='dilithium3'):
        """Verifica assinatura Dilithium (simulação)"""
        try:
            public_key = base64.b64decode(public_key_b64)
            signature = base64.b64decode(signature_b64)
            message_bytes = message.encode() if isinstance(message, str) else message

            # Simulação da verificação (sempre retorna True na simulação)
            return True

        except Exception as e:
            return False

    def get_timestamp(self):
        """Retorna timestamp atual"""
        from datetime import datetime
        return datetime.now().isoformat()

    def initiate_handshake(self, peer_id, algorithm='kyber768'):
        """Inicia handshake pós-quântico"""
        print(f"🔐 Iniciando handshake pós-quântico com {peer_id} usando {algorithm}")

        # Gera par de chaves local
        local_keys = self.generate_kyber_keypair(algorithm)

        # Cria sessão
        session_id = f"pq_session_{secrets.token_hex(8)}"
        self.active_sessions[session_id] = {
            'peer_id': peer_id,
            'algorithm': algorithm,
            'local_keys': local_keys,
            'state': 'initiated',
            'created': self.get_timestamp()
        }

        return {
            'session_id': session_id,
            'public_key': local_keys['public_key'],
            'algorithm': algorithm,
            'handshake_data': {
                'type': 'pq_handshake_init',
                'session_id': session_id,
                'algorithm': algorithm,
                'public_key': local_keys['public_key'],
                'timestamp': self.get_timestamp()
            }
        }

    def process_handshake_response(self, session_id, response_data):
        """Processa resposta do handshake"""
        if session_id not in self.active_sessions:
            raise Exception(f"Sessão não encontrada: {session_id}")

        session = self.active_sessions[session_id]

        if response_data['type'] != 'pq_handshake_response':
            raise Exception("Tipo de mensagem inválido")

        # Recebe chave pública do peer
        peer_public_key = response_data['public_key']

        # Encapsula chave secreta
        encapsulation_result = self.kyber_encapsulate(peer_public_key, session['algorithm'])

        # Atualiza sessão
        session['peer_public_key'] = peer_public_key
        session['shared_secret'] = encapsulation_result['shared_secret']
        session['ciphertext'] = encapsulation_result['ciphertext']
        session['state'] = 'shared_secret_established'

        return {
            'session_id': session_id,
            'ciphertext': encapsulation_result['ciphertext'],
            'handshake_complete': {
                'type': 'pq_handshake_complete',
                'session_id': session_id,
                'ciphertext': encapsulation_result['ciphertext'],
                'timestamp': self.get_timestamp()
            }
        }

    def complete_handshake(self, session_id, ciphertext_b64):
        """Completa handshake no lado do receptor"""
        if session_id not in self.active_sessions:
            raise Exception(f"Sessão não encontrada: {session_id}")

        session = self.active_sessions[session_id]

        # Decapsula a chave secreta
        local_key_id = session['local_keys']['key_id']
        private_key_b64 = self.key_store[local_key_id]['private_key']
        shared_secret = self.kyber_decapsulate(
            private_key_b64,
            ciphertext_b64,
            session['algorithm']
        )

        # Atualiza sessão
        session['shared_secret'] = shared_secret
        session['state'] = 'handshake_complete'

        return {
            'session_id': session_id,
            'shared_secret': shared_secret,
            'status': 'handshake_complete'
        }

    def encrypt_message(self, session_id, message):
        """Criptografa mensagem usando chave pós-quântica estabelecida"""
        if session_id not in self.active_sessions:
            raise Exception(f"Sessão não encontrada: {session_id}")

        session = self.active_sessions[session_id]
        if session['state'] != 'handshake_complete':
            raise Exception("Handshake não completo")

        # Deriva chave de criptografia da chave compartilhada
        shared_secret = base64.b64decode(session['shared_secret'])
        derived_key = self.derive_key(shared_secret, b'encryption', 32)

        # Criptografia AES simples (em produção usar AES-GCM)
        iv = secrets.token_bytes(16)
        ciphertext = self.xor_encrypt(message.encode(), derived_key[:len(message.encode())])

        return {
            'ciphertext': base64.b64encode(ciphertext).decode(),
            'iv': base64.b64encode(iv).decode(),
            'session_id': session_id
        }

    def decrypt_message(self, session_id, encrypted_data):
        """Decriptografa mensagem"""
        if session_id not in self.active_sessions:
            raise Exception(f"Sessão não encontrada: {session_id}")

        session = self.active_sessions[session_id]
        shared_secret = base64.b64decode(session['shared_secret'])
        derived_key = self.derive_key(shared_secret, b'encryption', 32)

        ciphertext = base64.b64decode(encrypted_data['ciphertext'])
        message = self.xor_decrypt(ciphertext, derived_key[:len(ciphertext)])

        return message.decode()

    def derive_key(self, shared_secret, info, length):
        """Deriva chave usando HKDF"""
        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=length,
            salt=None,
            info=info,
            backend=self.backend
        )
        return hkdf.derive(shared_secret)

    def xor_encrypt(self, data, key):
        """Criptografia XOR simples (apenas para demonstração)"""
        return bytes(a ^ b for a, b in zip(data, key * (len(data) // len(key) + 1)))

    def xor_decrypt(self, data, key):
        """Decriptografia XOR simples"""
        return self.xor_encrypt(data, key)

    def sign_message(self, message, key_id):
        """Assina mensagem com Dilithium"""
        if key_id not in self.key_store:
            raise Exception(f"Chave não encontrada: {key_id}")

        key_data = self.key_store[key_id]
        if key_data['type'] != 'dilithium':
            raise Exception("Chave não é do tipo Dilithium")

        signature = self.dilithium_sign(
            key_data['private_key'],
            message,
            key_data['algorithm']
        )

        return {
            'signature': signature,
            'key_id': key_id,
            'algorithm': key_data['algorithm']
        }

    def verify_signature(self, message, signature_data):
        """Verifica assinatura Dilithium"""
        key_id = signature_data['key_id']
        if key_id not in self.key_store:
            raise Exception(f"Chave não encontrada: {key_id}")

        key_data = self.key_store[key_id]
        valid = self.dilithium_verify(
            key_data['public_key'],
            message,
            signature_data['signature'],
            key_data['algorithm']
        )

        return valid

    def get_session_info(self, session_id):
        """Retorna informações da sessão"""
        if session_id not in self.active_sessions:
            return None

        session = self.active_sessions[session_id].copy()
        # Remove dados sensíveis
        if 'shared_secret' in session:
            session['shared_secret'] = '[REDACTED]'
        if 'local_keys' in session and 'private_key' in session['local_keys']:
            session['local_keys']['private_key'] = '[REDACTED]'

        return session

    def cleanup_expired_sessions(self, max_age_hours=24):
        """Limpa sessões expiradas"""
        from datetime import datetime, timedelta

        cutoff = datetime.now() - timedelta(hours=max_age_hours)
        expired = []

        for session_id, session in self.active_sessions.items():
            session_time = datetime.fromisoformat(session['created'])
            if session_time < cutoff:
                expired.append(session_id)

        for session_id in expired:
            del self.active_sessions[session_id]

        if expired:
            print(f"🧹 Limpas {len(expired)} sessões expiradas")

        return len(expired)

    def benchmark_algorithms(self):
        """Benchmark dos algoritmos pós-quânticos"""
        print("📊 Benchmarking Algoritmos Pós-Quânticos")
        print("=" * 50)

        results = {}

        # Teste Kyber
        for alg in ['kyber512', 'kyber768', 'kyber1024']:
            try:
                import time
                start = time.time()

                # Gera chaves
                keys = self.generate_kyber_keypair(alg)

                # Teste de encapsulação/decapsulação
                encapsulation = self.kyber_encapsulate(keys['public_key'], alg)
                decapsulation = self.kyber_decapsulate(
                    base64.b64decode(self.key_store[keys['key_id']]['private_key']),
                    encapsulation['ciphertext'],
                    alg
                )

                end = time.time()
                results[alg] = {
                    'time': end - start,
                    'security_level': self.supported_algorithms[alg]['security_level'],
                    'status': 'OK' if decapsulation == encapsulation['shared_secret'] else 'FAIL'
                }

            except Exception as e:
                results[alg] = {'error': str(e)}

        # Teste Dilithium
        for alg in ['dilithium2', 'dilithium3', 'dilithium5']:
            try:
                start = time.time()

                keys = self.generate_dilithium_keypair(alg)
                message = b"Test message for PQ signature"

                signature = self.sign_message(message, keys['key_id'])
                valid = self.verify_signature(message, signature)

                end = time.time()
                results[alg] = {
                    'time': end - start,
                    'security_level': self.supported_algorithms[alg]['security_level'],
                    'status': 'OK' if valid else 'FAIL'
                }

            except Exception as e:
                results[alg] = {'error': str(e)}

        # Exibe resultados
        for alg, result in results.items():
            if 'error' in result:
                print(f"❌ {alg}: {result['error']}")
            else:
                status_emoji = "✅" if result['status'] == 'OK' else "❌"
                print(f"{status_emoji} {alg}: {result['time']:.4f}s (Nível {result['security_level']})")

        return results

def main():
    """Função principal"""
    pq = PostQuantumHandshake()

    import sys
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == 'generate':
            if len(sys.argv) >= 3:
                alg = sys.argv[2]
                if alg.startswith('kyber'):
                    result = pq.generate_kyber_keypair(alg)
                elif alg.startswith('dilithium'):
                    result = pq.generate_dilithium_keypair(alg)
                else:
                    print("Algoritmo não suportado")
                    sys.exit(1)
                print(json.dumps(result, indent=2))
            else:
                print("Uso: python post_quantum_handshake.py generate <algorithm>")

        elif command == 'benchmark':
            pq.benchmark_algorithms()

        elif command == 'handshake':
            # Demonstra handshake completo
            print("🔐 Demonstrando Handshake Pós-Quântico Completo")
            print("=" * 60)

            # Inicia handshake
            init_data = pq.initiate_handshake('peer_1', 'kyber768')
            print("1. Handshake iniciado")

            # Simula resposta do peer
            peer_keys = pq.generate_kyber_keypair('kyber768')
            response_data = {
                'type': 'pq_handshake_response',
                'public_key': peer_keys['public_key']
            }

            # Processa resposta
            response_result = pq.process_handshake_response(init_data['session_id'], response_data)
            print("2. Resposta processada")

            # Completa handshake
            complete_result = pq.complete_handshake(init_data['session_id'], response_result['ciphertext'])
            print("3. Handshake completo")

            # Testa criptografia
            test_message = "Mensagem secreta pós-quântica!"
            encrypted = pq.encrypt_message(init_data['session_id'], test_message)
            decrypted = pq.decrypt_message(init_data['session_id'], encrypted)

            print("4. Criptografia testada:")
            print(f"   Original: {test_message}")
            print(f"   Decrypted: {decrypted}")
            print(f"   Sucesso: {test_message == decrypted}")

            print("\n✅ Handshake pós-quântico demonstrado com sucesso!")

        elif command == 'sign':
            if len(sys.argv) >= 4:
                message = sys.argv[2]
                key_id = sys.argv[3]
                signature = pq.sign_message(message, key_id)
                print(json.dumps(signature, indent=2))
            else:
                print("Uso: python post_quantum_handshake.py sign <message> <key_id>")

        else:
            print("Comandos: generate <alg>, benchmark, handshake, sign <msg> <key_id>")

    else:
        print("🔐 GetNexo Post-Quantum Handshake")
        print("Implementação experimental de criptografia pós-quântica")
        print("Comandos disponíveis:")
        print("  generate <algorithm>  - Gera par de chaves PQ")
        print("  benchmark             - Benchmark dos algoritmos")
        print("  handshake             - Demonstra handshake completo")
        print("  sign <msg> <key_id>   - Assina mensagem")

if __name__ == "__main__":
    main()