import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EgressApiProxyConstructProps } from './EgressApiProxyConstructProps';

export class EgressApiProxyConstruct extends Construct {

  constructor(scope: Construct, id: string, props: EgressApiProxyConstructProps) {
    super(scope, id);

    const prdLogGroup = new cdk.aws_logs.LogGroup(this, `${id}-PrdLogs`);

    const api = new cdk.aws_apigateway.RestApi(this, `${id}-RestApi`, {
      endpointTypes: [cdk.aws_apigateway.EndpointType.PRIVATE],

      deployOptions: {
        accessLogDestination: new cdk.aws_apigateway.LogGroupLogDestination(prdLogGroup),
        accessLogFormat: cdk.aws_apigateway.AccessLogFormat.jsonWithStandardFields(),
      },

      policy: new cdk.aws_iam.PolicyDocument({
        statements: [
          new cdk.aws_iam.PolicyStatement({
            principals: [new cdk.aws_iam.AnyPrincipal],
            actions: ['execute-api:Invoke'],
            resources: ['execute-api:/*'],
            effect: cdk.aws_iam.Effect.ALLOW
          })
        ]
      })
    })

    const method="POST";
    let namespace;
    if(props.rootResource){
      namespace = api.root.addResource(props.rootResource);
    }else{
      namespace = api.root;
    }    
    const baseUrl=props.baseUrl??"https://jsonplaceholder.typicode.com";

    const proxyResource = new cdk.aws_apigateway.ProxyResource(this, `${id}-ProxyResource-${method}`, {
      parent: namespace,
      anyMethod: false,
    })

    proxyResource.addMethod(
      method,
      new cdk.aws_apigateway.HttpIntegration(`${baseUrl}/{proxy}`, {
        proxy: true,
        httpMethod: method,
        options: {
          requestParameters: {
            'integration.request.path.proxy': 'method.request.path.proxy',
          },
        },
      }),
      {
        requestParameters: {
          'method.request.path.proxy': true,
        },
      }
    )
    
    // production stage
    new cdk.aws_apigateway.Deployment(this, 'Deployment', {api});
  }
}
