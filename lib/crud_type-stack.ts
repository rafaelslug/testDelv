import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class CrudTypeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'DeliveryVPC', {
      maxAzs: 3,
    });

    const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', { vpc }); // Crea un grupo de seguridad para la instancia de RDS

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3306)); // Agrega una regla de entrada para permitir el tráfico de MySQL


    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_25,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      credentials: rds.Credentials.fromPassword('admin0000', cdk.SecretValue.unsafePlainText('admin0000')),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroups: [securityGroup],
      publiclyAccessible: true,
    });

    new cdk.CfnOutput(this, 'dbEndpoint', {
      value: database.instanceEndpoint.hostname,
    });

    const username = database.secret?.secretValueFromJson('username').toString() || 'admin0000';
    const password = database.secret?.secretValueFromJson('password').toString() || 'admin0000';

    // Crear una capa de Lambda
    const mysqlLayer =  new lambda.LayerVersion(this, 'MyLayer', {
      code: lambda.Code.fromAsset('layers/mysql/nodejs.zip'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      description: 'mysql',
    });
    // Crea una función Lambda
    const myLambda = new lambda.Function(this, 'MyLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'package.handler',
      vpc,
      environment: {
        DB_HOST: database.dbInstanceEndpointAddress,
        DB_USERNAME: username,
        DB_PASSWORD: password,
      },
      layers: [mysqlLayer],
      securityGroups: [securityGroup],
    });
    // Agrega los permisos necesarios para conectarse a la instancia de RDS
    database.grantConnect(myLambda);

    const lambdaGetCp = new lambda.Function(this, 'getCp', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/cp'),
      handler: 'getCp.handler',
      vpc,
      environment: {
        DB_HOST: database.dbInstanceEndpointAddress,
        DB_USERNAME: username,
        DB_PASSWORD: password,
      },
      layers: [mysqlLayer],
      securityGroups: [securityGroup],
    });
    // Agrega los permisos necesarios para conectarse a la instancia de RDS
    database.grantConnect(lambdaGetCp);

    const api = new apigateway.RestApi(this, 'myapi',{
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS // this is also the default
      }
    });

    const resource = api.root.addResource('cp',);
    resource.addMethod('POST', new apigateway.LambdaIntegration(lambdaGetCp));

    const bucket = new s3.Bucket(this, 'MyBucket', { 
      publicReadAccess: true,
      websiteIndexDocument: 'index.html'
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('frontend/delivery/build')],
      destinationBucket: bucket,
    });

    new cdk.CfnOutput(this, 'urlWebSite', {
      value: bucket.bucketWebsiteUrl,
    });
  }
}
