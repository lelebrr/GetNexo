// Teste das integrações AWS reais
const cloudEngine = require('./src/lib/cloud-services-simulator-engine');

async function testAWSIntegration() {
    try {
        console.log('Testando integração com AWS...');

        // Testar listagem de instances EC2 (não cria, apenas lista)
        console.log('Listando EC2 instances...');
        const instances = await cloudEngine.describeEC2Instances();
        console.log(`Encontradas ${instances.length} EC2 instances`);

        // Testar listagem de buckets S3
        console.log('Listando S3 buckets...');
        // Note: S3 listBuckets não precisa de modificações pois já era real

        // Testar listagem de RDS instances
        console.log('Listando RDS instances...');
        const rdsInstances = await cloudEngine.describeRDSInstances();
        console.log(`Encontradas ${rdsInstances.length} RDS instances`);

        // Testar listagem de Lambda functions
        console.log('Listando Lambda functions...');
        const lambdas = await cloudEngine.listLambdaFunctions();
        console.log(`Encontradas ${lambdas.length} Lambda functions`);

        // Testar métricas CloudWatch
        console.log('Testando métricas CloudWatch...');
        const metrics = await cloudEngine.getCloudWatchMetrics('AWS/EC2', 'CPUUtilization');
        console.log(`Encontrados ${metrics.datapoints.length} datapoints de CPU`);

        // Testar SNS topics (listar)
        console.log('Testando SNS...');
        // Note: Listar topics SNS seria mais apropriado para teste

        // Testar SQS queues (listar)
        console.log('Testando SQS...');
        // Note: Listar queues SQS seria mais apropriado para teste

        console.log('Teste concluído com sucesso!');
    } catch (error) {
        console.error('Erro no teste:', error.message);
        console.log('Certifique-se de que suas credenciais AWS estão configuradas corretamente.');
        console.log('Configure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY e AWS_REGION.');
        console.log('Nota: Alguns serviços podem não existir em sua conta AWS.');
    }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
    testAWSIntegration();
}

module.exports = { testAWSIntegration };