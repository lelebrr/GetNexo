/**
 * Test Script - AWS Services Integration GetNexo v1.0
 * Testa todos os serviços AWS implementados no AWSConnector
 */

const awsConnector = require('./src/lib/connectors/aws');

async function testAWSServices() {
    console.log('🧪 Iniciando testes dos serviços AWS no GetNexo v1.0\n');

    try {
        // Inicializar conector
        awsConnector.initialize({
            region: 'us-east-1',
            useSimulation: true
        });

        console.log('✅ AWS Connector inicializado\n');

        // ===========================================
        // Testes CI/CD
        // ===========================================
        console.log('🔧 Testando serviços CI/CD...');

        const repo = await awsConnector.createRepository('test-repo', { description: 'Test repository' });
        console.log('✅ CodeCommit repository criado:', repo.name);

        const project = await awsConnector.createBuildProject('test-project', {
            source: { type: 'CODECOMMIT', location: 'test-repo' }
        });
        console.log('✅ CodeBuild project criado:', project.name);

        const pipeline = await awsConnector.createPipeline('test-pipeline', {
            stages: [{ name: 'Source', actions: [] }]
        });
        console.log('✅ CodePipeline criado:', pipeline.pipelineName);

        // ===========================================
        // Testes Compute
        // ===========================================
        console.log('\n⚡ Testando serviços Compute...');

        const api = await awsConnector.createRestApi('test-api', { description: 'Test API' });
        console.log('✅ API Gateway criado:', api.name);

        const graphqlApi = await awsConnector.createGraphqlApi('test-appsync', {
            authenticationType: 'API_KEY'
        });
        console.log('✅ AppSync API criado:', graphqlApi.name);

        const amplifyApp = await awsConnector.createApp('test-amplify', {
            repository: 'https://github.com/test/repo'
        });
        console.log('✅ Amplify app criado:', amplifyApp.name);

        const userPool = await awsConnector.createUserPool('test-pool', {
            policies: { passwordPolicy: { minimumLength: 8 } }
        });
        console.log('✅ Cognito User Pool criado:', userPool.name);

        const cluster = await awsConnector.createCluster('test-cluster', {});
        console.log('✅ ECS cluster criado:', cluster.clusterName);

        const eksCluster = await awsConnector.createCluster('test-eks', {
            roleArn: 'arn:aws:iam::123456789012:role/eks-service-role'
        });
        console.log('✅ EKS cluster criado:', eksCluster.name);

        // ===========================================
        // Testes Storage
        // ===========================================
        console.log('\n💾 Testando serviços Storage...');

        const volume = await awsConnector.createVolume({ size: 10, volumeType: 'gp2' });
        console.log('✅ EBS volume criado:', volume.volumeId);

        const filesystem = await awsConnector.createFileSystem({ performanceMode: 'generalPurpose' });
        console.log('✅ EFS file system criado:', filesystem.fileSystemId);

        // ===========================================
        // Testes Security
        // ===========================================
        console.log('\n🔐 Testando serviços Security...');

        const user = await awsConnector.createUser('test-user', {});
        console.log('✅ IAM user criado:', user.userName);

        const role = await awsConnector.createRole('test-role', {
            assumeRolePolicyDocument: JSON.stringify({
                Version: '2012-10-17',
                Statement: [{
                    Effect: 'Allow',
                    Principal: { Service: 'lambda.amazonaws.com' },
                    Action: 'sts:AssumeRole'
                }]
            })
        });
        console.log('✅ IAM role criado:', role.roleName);

        const policy = await awsConnector.createPolicy('test-policy', {
            policyDocument: JSON.stringify({
                Version: '2012-10-17',
                Statement: [{
                    Effect: 'Allow',
                    Action: 's3:GetObject',
                    Resource: '*'
                }]
            })
        });
        console.log('✅ IAM policy criado:', policy.policyName);

        // ===========================================
        // Testes Management
        // ===========================================
        console.log('\n⚙️ Testando serviços Management...');

        const parameter = await awsConnector.putParameter('test-param', 'test-value', 'String', {});
        console.log('✅ SSM parameter criado:', parameter.name);

        const stack = await awsConnector.createStack('test-stack', JSON.stringify({
            AWSTemplateFormatVersion: '2010-09-09',
            Resources: {}
        }), []);
        console.log('✅ CloudFormation stack criado:', stack.stackName);

        // ===========================================
        // Testes Messaging
        // ===========================================
        console.log('\n📨 Testando serviços Messaging...');

        const topic = await awsConnector.createTopic('test-topic', {});
        console.log('✅ SNS topic criado:', topic.topicName);

        const queue = await awsConnector.createQueue('test-queue', {});
        console.log('✅ SQS queue criado:', queue.queueName);

        const bus = await awsConnector.createEventBus('test-bus', {});
        console.log('✅ EventBridge bus criado:', bus.name);

        // ===========================================
        // Testes Monitoring
        // ===========================================
        console.log('\n📊 Testando serviços Monitoring...');

        const metrics = await awsConnector.putMetricData('AWS/EC2', [{
            metricName: 'CPUUtilization',
            value: 75,
            unit: 'Percent',
            timestamp: new Date()
        }]);
        console.log('✅ CloudWatch metrics enviados');

        const alarm = await awsConnector.putMetricAlarm('test-alarm', {
            comparisonOperator: 'GreaterThanThreshold',
            threshold: 80,
            evaluationPeriods: 2
        });
        console.log('✅ CloudWatch alarm criado:', alarm.alarmName);

        const logGroup = await awsConnector.createLogGroup('test-log-group', {});
        console.log('✅ CloudWatch log group criado:', logGroup.logGroupName);

        const xrayGroup = await awsConnector.createGroup('test-xray-group', '');
        console.log('✅ X-Ray group criado:', xrayGroup.groupName);

        // ===========================================
        // Testes Cost Management
        // ===========================================
        console.log('\n💰 Testando serviços Cost Management...');

        const costData = await awsConnector.getCostAndUsage({
            Start: '2024-01-01',
            End: '2024-01-31'
        }, ['BlendedCost'], 'MONTHLY', []);
        console.log('✅ Cost Explorer data obtido:', costData.resultsByTime.length, 'registros');

        const budget = await awsConnector.createBudget('test-budget', {
            budgetLimit: { amount: '1000', unit: 'USD' }
        });
        console.log('✅ Budget criado:', budget.budgetName);

        // ===========================================
        // Estatísticas finais
        // ===========================================
        console.log('\n📈 Estatísticas finais:');
        const stats = awsConnector.getStats();
        console.log('AWS Resources:', JSON.stringify(stats.resources, null, 2));
        console.log('Total AWS Resources:', stats.resources.ec2Instances + stats.resources.s3Buckets +
            stats.resources.lambdaFunctions + stats.resources.codeCommitRepos + stats.resources.apiGatewayApis);

        console.log('\n🎉 Todos os testes AWS passaram com sucesso!');
        console.log('✅ GetNexo v1.0 - AWS Services Integration Completa');

    } catch (error) {
        console.error('❌ Erro durante os testes:', error);
        process.exit(1);
    }
}

// Executar testes
if (require.main === module) {
    testAWSServices();
}

module.exports = { testAWSServices };